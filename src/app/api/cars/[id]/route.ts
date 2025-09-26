import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDatabase } from '@/lib/db';
import { cars, users, carImages } from '@/lib/db/schema';
import { createApiHandler, validateBody, throwApiError } from '@/lib/api/middleware';
import { updateCarSchema } from '@/lib/api/validation';
import { getCurrentUser } from '@/lib/auth-server';

// GET /api/cars/[id] - Get single car with details
export const GET = createApiHandler({
  rateLimit: { max: 100, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: carId } = await params;

  if (!carId) {
    throwApiError('Car ID is required', 'MISSING_CAR_ID', 400);
  }

  try {
    // Get car with owner and images
    const result = await getDatabase()
      .select({
        car: cars,
        owner: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImage: users.profileImage,
          isVerified: users.isVerified,
        }
      })
      .from(cars)
      .leftJoin(users, eq(cars.ownerId, users.id))
      .where(eq(cars.id, carId))
      .limit(1);

    if (result.length === 0) {
      throwApiError('Car not found', 'CAR_NOT_FOUND', 404);
    }

    const { car, owner } = result[0];

    // Get car images
    const images = await getDatabase()
      .select()
      .from(carImages)
      .where(eq(carImages.carId, carId));

    return NextResponse.json({
      car: {
        ...car,
        features: car.features ? JSON.parse(car.features) : [],
        dailyRate: parseFloat(car.dailyRate),
        latitude: car.latitude ? parseFloat(car.latitude) : null,
        longitude: car.longitude ? parseFloat(car.longitude) : null,
        images: images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
        })),
        owner,
      }
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    throwApiError('Failed to fetch car', 'DATABASE_ERROR', 500);
  }
}});

// PUT /api/cars/[id] - Update car listing
export const PUT = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 20, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const { id: carId } = await params;
  if (!carId) {
    throwApiError('Car ID is required', 'MISSING_CAR_ID', 400);
  }

  const body = await validateBody(updateCarSchema)(req);

  try {
    // Check if car exists and user owns it (or is admin)
    const [existingCar] = await getDatabase()
      .select()
      .from(cars)
      .where(eq(cars.id, carId))
      .limit(1);

    if (!existingCar) {
      throwApiError('Car not found', 'CAR_NOT_FOUND', 404);
    }

    // Check ownership (admins can edit any car)
    if (user.role !== 'admin' && existingCar.ownerId !== user.id) {
      throwApiError('You can only edit your own cars', 'FORBIDDEN', 403);
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'features') {
          updateData[key] = JSON.stringify(value);
        } else if (key === 'dailyRate' || key === 'latitude' || key === 'longitude') {
          updateData[key] = value?.toString();
        } else {
          updateData[key] = value;
        }
      }
    });

    // If updating as non-admin, require re-verification
    if (user.role !== 'admin' && Object.keys(updateData).length > 0) {
      updateData.isVerified = false;
    }

    updateData.updatedAt = new Date();

    const [updatedCar] = await getDatabase()
      .update(cars)
      .set(updateData)
      .where(eq(cars.id, carId))
      .returning();

    return NextResponse.json({
      car: {
        ...updatedCar,
        features: updatedCar.features ? JSON.parse(updatedCar.features) : [],
        dailyRate: parseFloat(updatedCar.dailyRate),
        latitude: updatedCar.latitude ? parseFloat(updatedCar.latitude) : null,
        longitude: updatedCar.longitude ? parseFloat(updatedCar.longitude) : null,
      }
    });
  } catch (error: unknown) {
    const dbError = error as { code?: string; detail?: string; };
    console.error('Error updating car:', error);

    // Handle unique constraint violations
    if (dbError.code === '23505') {
      if (dbError.detail?.includes('plate_number')) {
        throwApiError('Plate number already exists', 'DUPLICATE_PLATE_NUMBER', 409);
      }
      if (dbError.detail?.includes('vin')) {
        throwApiError('VIN already exists', 'DUPLICATE_VIN', 409);
      }
    }

    throwApiError('Failed to update car', 'DATABASE_ERROR', 500);
  }
}});

// DELETE /api/cars/[id] - Delete car listing
export const DELETE = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 10, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const { id: carId } = await params;
  if (!carId) {
    throwApiError('Car ID is required', 'MISSING_CAR_ID', 400);
  }

  try {
    // Check if car exists and user owns it (or is admin)
    const [existingCar] = await getDatabase()
      .select()
      .from(cars)
      .where(eq(cars.id, carId))
      .limit(1);

    if (!existingCar) {
      throwApiError('Car not found', 'CAR_NOT_FOUND', 404);
    }

    // Check ownership (admins can delete any car)
    if (user.role !== 'admin' && existingCar.ownerId !== user.id) {
      throwApiError('You can only delete your own cars', 'FORBIDDEN', 403);
    }

    // TODO: Check for active bookings before deletion
    // For now, we'll just delete the car

    await getDatabase().delete(cars).where(eq(cars.id, carId));

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    throwApiError('Failed to delete car', 'DATABASE_ERROR', 500);
  }
}});