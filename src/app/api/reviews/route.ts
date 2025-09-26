import { NextRequest, NextResponse } from 'next/server';
import { eq, and, desc, count } from 'drizzle-orm';
import { getDatabase } from '@/lib/db';
import { reviews, users, bookings } from '@/lib/db/schema';
import { createApiHandler, validateBody, validateQuery, throwApiError } from '@/lib/api/middleware';
import { createReviewSchema, reviewQuerySchema } from '@/lib/api/validation';
import { getCurrentUser } from '@/lib/auth-server';

// GET /api/reviews - List reviews with filtering
export const GET = createApiHandler({
  rateLimit: { max: 100, windowMs: 60 * 1000 },
  handler: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const query = validateQuery(reviewQuerySchema, searchParams);

    try {
      const whereConditions = [];

      if (query.reviewedId) {
        whereConditions.push(eq(reviews.reviewedId, query.reviewedId));
      }

      if (query.reviewType) {
        whereConditions.push(eq(reviews.reviewType, query.reviewType));
      }

      const offset = (query.page - 1) * query.limit;

      const result = await getDatabase()
        .select({
          review: reviews,
          reviewer: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImage: users.profileImage,
          },
          reviewed: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImage: users.profileImage,
          }
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.reviewerId, users.id))
        .leftJoin(users, eq(reviews.reviewedId, users.id)) // This will overwrite the first join - needs fix
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(desc(reviews.createdAt))
        .limit(query.limit)
        .offset(offset);

      // Fix: Need separate queries for reviewer and reviewed users
      const reviewsWithUsers = await Promise.all(
        result.map(async ({ review }) => {
          const [reviewer] = await getDatabase()
            .select({
              id: users.id,
              firstName: users.firstName,
              lastName: users.lastName,
              profileImage: users.profileImage,
            })
            .from(users)
            .where(eq(users.id, review.reviewerId))
            .limit(1);

          const [reviewed] = await getDatabase()
            .select({
              id: users.id,
              firstName: users.firstName,
              lastName: users.lastName,
              profileImage: users.profileImage,
            })
            .from(users)
            .where(eq(users.id, review.reviewedId))
            .limit(1);

          return {
            ...review,
            reviewer,
            reviewed,
          };
        })
      );

      // Get total count
      const [{ totalCount }] = await getDatabase()
        .select({ totalCount: count() })
        .from(reviews)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const totalPages = Math.ceil((totalCount as number) / query.limit);

      return NextResponse.json({
        reviews: reviewsWithUsers,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: totalCount,
          totalPages,
        },
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throwApiError('Failed to fetch reviews', 'DATABASE_ERROR', 500);
    }
  }
});

// POST /api/reviews - Create new review
export const POST = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 10, windowMs: 60 * 1000 },
  handler: async (req: NextRequest) => {
    const user = await getCurrentUser();
    if (!user) {
      throwApiError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const body = await validateBody(createReviewSchema)(req);

    try {
      // Validate the booking exists and is completed
      const [booking] = await getDatabase()
        .select()
        .from(bookings)
        .where(eq(bookings.id, body.bookingId))
        .limit(1);

      if (!booking) {
        throwApiError('Booking not found', 'BOOKING_NOT_FOUND', 404);
      }

      if (booking.status !== 'completed') {
        throwApiError('Can only review completed bookings', 'BOOKING_NOT_COMPLETED', 400);
      }

      // Check if user is involved in this booking
      const isRenter = booking.renterId === user.id;
      if (!isRenter) {
        // TODO: Implement car owner check by joining with cars table
        throwApiError('You can only review bookings you are involved in', 'FORBIDDEN', 403);
      }

      // Validate review type and reviewed user
      if (body.reviewType === 'renter_review') {
        // Car owner reviewing the renter
        if (booking.renterId !== body.reviewedId) {
          throwApiError('Invalid reviewed user for renter review', 'INVALID_REVIEWED_USER', 400);
        }
      } else if (body.reviewType === 'owner_review') {
        // Renter reviewing the car owner
        // Need to get car owner ID from booking
        throwApiError('Owner review validation not implemented yet', 'NOT_IMPLEMENTED', 500);
      }

      // Check if review already exists
      const [existingReview] = await getDatabase()
        .select()
        .from(reviews)
        .where(
          and(
            eq(reviews.bookingId, body.bookingId),
            eq(reviews.reviewerId, user.id),
            eq(reviews.reviewType, body.reviewType)
          )
        )
        .limit(1);

      if (existingReview) {
        throwApiError('You have already reviewed this booking', 'REVIEW_ALREADY_EXISTS', 409);
      }

      // Create the review
      const [newReview] = await getDatabase()
        .insert(reviews)
        .values({
          bookingId: body.bookingId,
          reviewerId: user.id,
          reviewedId: body.reviewedId,
          rating: body.rating,
          comment: body.comment,
          reviewType: body.reviewType,
        })
        .returning();

      // Fetch the complete review with user data
      const [reviewer] = await getDatabase()
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImage: users.profileImage,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      const [reviewed] = await getDatabase()
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImage: users.profileImage,
        })
        .from(users)
        .where(eq(users.id, body.reviewedId))
        .limit(1);

      return NextResponse.json({
        review: {
          ...newReview,
          reviewer,
          reviewed,
        }
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating review:', error);
      throwApiError('Failed to create review', 'DATABASE_ERROR', 500);
    }
  }
});