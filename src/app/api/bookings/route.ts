import { NextRequest, NextResponse } from 'next/server';
import { eq, and, gte, lte, or, desc, ne, SQL, inArray } from 'drizzle-orm';
import { getDatabase } from '@/lib/db';
import { bookings, cars, users } from '@/lib/db/schema';
import { createApiHandler, validateBody, validateQuery, throwApiError } from '@/lib/api/middleware';
import { createBookingSchema, bookingQuerySchema } from '@/lib/api/validation';
import { getCurrentUser } from '@/lib/auth-server';

// Helper function to calculate total amount
function calculateBookingAmount(startDate: Date, endDate: Date, dailyRate: number): number {
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff * dailyRate;
}

// Helper function to check car availability
async function checkCarAvailability(carId: string, startDate: Date, endDate: Date, excludeBookingId?: string) {
  const whereConditions = [
    eq(bookings.carId, carId),
    or(
      eq(bookings.status, 'confirmed'),
      eq(bookings.status, 'active')
    ),
    or(
      // New booking starts during existing booking
      and(
        gte(bookings.startDate, startDate),
        lte(bookings.startDate, endDate)
      ),
      // New booking ends during existing booking
      and(
        gte(bookings.endDate, startDate),
        lte(bookings.endDate, endDate)
      ),
      // New booking encompasses existing booking
      and(
        lte(bookings.startDate, startDate),
        gte(bookings.endDate, endDate)
      )
    )
  ];

  if (excludeBookingId) {
    whereConditions.push(ne(bookings.id, excludeBookingId));
  }

  const conflictingBookings = await getDatabase()
    .select()
    .from(bookings)
    .where(and(...whereConditions));

  return conflictingBookings.length === 0;
}

// GET /api/bookings - List user's bookings
export const GET = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 60, windowMs: 60 * 1000 },
  handler: async (req: NextRequest) => {
    const user = await getCurrentUser();
    if (!user) {
      throwApiError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const { searchParams } = new URL(req.url);
    const query = validateQuery(bookingQuerySchema, searchParams);

    try {
      const whereConditions: (SQL<unknown> | undefined)[] = [];

      // Filter by user role
      if (user.role === 'admin') {
        // Admin can see all bookings, optionally filtered
        if (query.renterId) {
          whereConditions.push(eq(bookings.renterId, query.renterId));
        }
        if (query.carId) {
          whereConditions.push(eq(bookings.carId, query.carId));
        }
      } else {
        // Regular users can only see their own bookings (as renter or car owner)
        const userCars = await getDatabase()
          .select({ id: cars.id })
          .from(cars)
          .where(eq(cars.ownerId, user.id));

        const userCarIds = userCars.map(car => car.id);

        if (userCarIds.length > 0) {
          whereConditions.push(
            or(
              inArray(bookings.carId, userCarIds),
              eq(bookings.renterId, user.id)
            )
          );
        } else {
          whereConditions.push(eq(bookings.renterId, user.id));
        }
      }

      if (query.status) {
        whereConditions.push(eq(bookings.status, query.status));
      }

      const offset = (query.page - 1) * query.limit;

      const result = await getDatabase()
        .select({
          booking: bookings,
          car: {
            id: cars.id,
            make: cars.make,
            model: cars.model,
            year: cars.year,
            plateNumber: cars.plateNumber,
            dailyRate: cars.dailyRate,
            location: cars.location,
          },
          renter: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImage: users.profileImage,
          }
        })
        .from(bookings)
        .leftJoin(cars, eq(bookings.carId, cars.id))
        .leftJoin(users, eq(bookings.renterId, users.id))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(desc(bookings.createdAt))
        .limit(query.limit)
        .offset(offset);

      // Get total count
      const [{ count }] = await getDatabase()
        .select({ count: bookings.id })
        .from(bookings)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const totalPages = Math.ceil(Number(count) / query.limit);
      return NextResponse.json({
        bookings: result.map(({ booking, car, renter }) => ({
          ...booking,
          totalAmount: parseFloat(booking.totalAmount),
          car: car ? {
            ...car,
            dailyRate: parseFloat(car.dailyRate),
          } : null,
          renter,
        })),
        pagination: {
          page: query.page,
          limit: query.limit,
          total: count,
          totalPages,
        },
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throwApiError('Failed to fetch bookings', 'DATABASE_ERROR', 500);
    }
  }
});

// POST /api/bookings - Create new booking
export const POST = createApiHandler({
  requireAuth: true,
  allowedRoles: ['buyer', 'seller', 'admin'],
  rateLimit: { max: 20, windowMs: 60 * 1000 },
  handler: async (req: NextRequest) => {
    const user = await getCurrentUser();
    if (!user) {
      throwApiError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const body = await validateBody(createBookingSchema)(req);

    try {
      // Validate dates
      const startDate = new Date(body.startDate);
      const endDate = new Date(body.endDate);
      const now = new Date();

      if (startDate < now) {
        throwApiError('Start date cannot be in the past', 'INVALID_START_DATE', 400);
      }

      if (endDate <= startDate) {
        throwApiError('End date must be after start date', 'INVALID_DATE_RANGE', 400);
      }

      // Check if car exists and is available
      const [car] = await getDatabase()
        .select()
        .from(cars)
        .where(eq(cars.id, body.carId))
        .limit(1);

      if (!car) {
        throwApiError('Car not found', 'CAR_NOT_FOUND', 404);
      }

      if (!car.isAvailable) {
        throwApiError('Car is not available for booking', 'CAR_NOT_AVAILABLE', 400);
      }

      if (!car.isVerified) {
        throwApiError('Car is not verified and cannot be booked', 'CAR_NOT_VERIFIED', 400);
      }

      // Check if user is trying to book their own car
      if (car.ownerId === user.id) {
        throwApiError('You cannot book your own car', 'CANNOT_BOOK_OWN_CAR', 400);
      }

      // Check availability for the requested dates
      const isAvailable = await checkCarAvailability(body.carId, startDate, endDate);
      if (!isAvailable) {
        throwApiError('Car is not available for the selected dates', 'DATES_NOT_AVAILABLE', 409);
      }

      // Calculate total amount
      const dailyRate = parseFloat(car.dailyRate);
      const totalAmount = calculateBookingAmount(startDate, endDate, dailyRate);

      // Create booking
      const [newBooking] = await getDatabase()
        .insert(bookings)
        .values({
          carId: body.carId,
          renterId: user.id,
          startDate,
          endDate,
          totalAmount: totalAmount.toString(),
          status: 'pending',
          pickupLocation: body.pickupLocation,
          dropoffLocation: body.dropoffLocation,
          specialRequests: body.specialRequests,
        })
        .returning();

      // Fetch the complete booking with related data
      const [completeBooking] = await getDatabase()
        .select({
          booking: bookings,
          car: {
            id: cars.id,
            make: cars.make,
            model: cars.model,
            year: cars.year,
            plateNumber: cars.plateNumber,
            dailyRate: cars.dailyRate,
            location: cars.location,
          },
          renter: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImage: users.profileImage,
          }
        })
        .from(bookings)
        .leftJoin(cars, eq(bookings.carId, cars.id))
        .leftJoin(users, eq(bookings.renterId, users.id))
        .where(eq(bookings.id, newBooking.id))
        .limit(1);

      return NextResponse.json({
        booking: {
          ...completeBooking.booking,
          totalAmount: parseFloat(completeBooking.booking.totalAmount),
          car: completeBooking.car ? {
            ...completeBooking.car,
            dailyRate: parseFloat(completeBooking.car.dailyRate),
          } : null,
          renter: completeBooking.renter,
        }
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating booking:', error);
      throwApiError('Failed to create booking', 'DATABASE_ERROR', 500);
    }
  }
});