import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDatabase } from '@/lib/db';
import { bookings, cars, users } from '@/lib/db/schema';
import { createApiHandler, validateBody, throwApiError } from '@/lib/api/middleware';
import { updateBookingSchema } from '@/lib/api/validation';
import { getCurrentUser } from '@/lib/auth-server';

// GET /api/bookings/[id] - Get single booking
export const GET = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 60, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const { id: bookingId } = await params;
  if (!bookingId) {
    throwApiError('Booking ID is required', 'MISSING_BOOKING_ID', 400);
  }

  try {
    const [result] = await getDatabase()
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
          ownerId: cars.ownerId,
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
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!result) {
      throwApiError('Booking not found', 'BOOKING_NOT_FOUND', 404);
    }

    const { booking, car, renter } = result;

    // Check if user has permission to view this booking
    const canView = user.role === 'admin' ||
                   booking.renterId === user.id ||
                   (car && car.ownerId === user.id);

    if (!canView) {
      throwApiError('You do not have permission to view this booking', 'FORBIDDEN', 403);
    }

    return NextResponse.json({
      booking: {
        ...booking,
        totalAmount: parseFloat(booking.totalAmount),
        car: car ? {
          ...car,
          dailyRate: parseFloat(car.dailyRate),
        } : null,
        renter,
      }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    throwApiError('Failed to fetch booking', 'DATABASE_ERROR', 500);
  }
}});

// PUT /api/bookings/[id] - Update booking
export const PUT = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 20, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const { id: bookingId } = await params;
  if (!bookingId) {
    throwApiError('Booking ID is required', 'MISSING_BOOKING_ID', 400);
  }

  const body = await validateBody(updateBookingSchema)(req);

  try {
    // Get existing booking with car info
    const [existing] = await getDatabase()
      .select({
        booking: bookings,
        car: cars,
      })
      .from(bookings)
      .leftJoin(cars, eq(bookings.carId, cars.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!existing) {
      throwApiError('Booking not found', 'BOOKING_NOT_FOUND', 404);
    }

    const { booking, car } = existing;

    // Check permissions
    const canUpdate = user.role === 'admin' ||
                     booking.renterId === user.id ||
                     (car && car.ownerId === user.id);

    if (!canUpdate) {
      throwApiError('You do not have permission to update this booking', 'FORBIDDEN', 403);
    }

    // Validate status transitions
    if (body.status) {
      const currentStatus = booking.status;
      const newStatus = body.status;

      // Define allowed status transitions
      const allowedTransitions: Record<string, string[]> = {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['active', 'cancelled'],
        'active': ['completed', 'cancelled'],
        'completed': [], // Cannot change from completed
        'cancelled': [], // Cannot change from cancelled
      };

      if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
        throwApiError(
          `Cannot change booking status from ${currentStatus} to ${newStatus}`,
          'INVALID_STATUS_TRANSITION',
          400
        );
      }

      // Only car owners (and admins) can confirm bookings
      if (newStatus === 'confirmed' && user.role !== 'admin' && car?.ownerId !== user.id) {
        throwApiError('Only car owners can confirm bookings', 'FORBIDDEN', 403);
      }

      // Only renters (and admins) can cancel pending bookings
      if (newStatus === 'cancelled' && currentStatus === 'pending' &&
          user.role !== 'admin' && booking.renterId !== user.id) {
        throwApiError('Only renters can cancel pending bookings', 'FORBIDDEN', 403);
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    updateData.updatedAt = new Date();

    await getDatabase()
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, bookingId))
      .returning();

    // Fetch complete updated booking
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
      .where(eq(bookings.id, bookingId))
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
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throwApiError('Failed to update booking', 'DATABASE_ERROR', 500);
  }
}});

// DELETE /api/bookings/[id] - Cancel/Delete booking
export const DELETE = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 10, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const { id: bookingId } = await params;
  if (!bookingId) {
    throwApiError('Booking ID is required', 'MISSING_BOOKING_ID', 400);
  }

  try {
    // Get existing booking
    const [existing] = await getDatabase()
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!existing) {
      throwApiError('Booking not found', 'BOOKING_NOT_FOUND', 404);
    }

    // Check permissions - only the renter or admin can delete
    if (user.role !== 'admin' && existing.renterId !== user.id) {
      throwApiError('You can only delete your own bookings', 'FORBIDDEN', 403);
    }

    // Only allow deletion of pending or cancelled bookings
    if (!['pending', 'cancelled'].includes(existing.status)) {
      throwApiError(
        'Only pending or cancelled bookings can be deleted',
        'CANNOT_DELETE_BOOKING',
        400
      );
    }

    await getDatabase().delete(bookings).where(eq(bookings.id, bookingId));

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    throwApiError('Failed to delete booking', 'DATABASE_ERROR', 500);
  }
}});