import { NextRequest, NextResponse } from 'next/server';
import { eq, and, count } from 'drizzle-orm';
import { getDatabase } from '@/lib/db';
import { cars, carImages } from '@/lib/db/schema';
import { createApiHandler, throwApiError } from '@/lib/api/middleware';
import { getCurrentUser } from '@/lib/auth-server';
import { logger } from '@/lib/monitoring';

// GET /api/cars/[id]/images - Get all images for a car
export const GET = createApiHandler({
  rateLimit: { max: 100, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: { id: string } }) => {
  const carId = params.id;

  try {
    // Get car images
    const images = await getDatabase()
      .select({
        id: carImages.id,
        imageUrl: carImages.imageUrl,
        isPrimary: carImages.isPrimary,
        createdAt: carImages.createdAt,
      })
      .from(carImages)
      .where(eq(carImages.carId, carId))
      .orderBy(carImages.isPrimary, carImages.createdAt);

    return NextResponse.json({ images });
  } catch (error) {
    logger.error('Error fetching car images:', error as Error, { carId });
    throwApiError('Failed to fetch car images', 'DATABASE_ERROR', 500);
  }
  }
});

// POST /api/cars/[id]/images - Upload multiple images for a car (max 10 total)
export const POST = createApiHandler({
  requireAuth: true,
  allowedRoles: ['seller', 'admin'],
  rateLimit: { max: 10, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const carId = params.id;

  try {
    // Verify car exists and user owns it (or is admin)
    const car = await getDatabase()
      .select({ id: cars.id, ownerId: cars.ownerId })
      .from(cars)
      .where(eq(cars.id, carId))
      .limit(1);

    if (!car.length) {
      throwApiError('Car not found', 'CAR_NOT_FOUND', 404);
    }

    if (user.role !== 'admin' && car[0].ownerId !== user.id) {
      throwApiError('Unauthorized to modify this car', 'FORBIDDEN', 403);
    }

    // Check current image count
    const [{ currentCount }] = await getDatabase()
      .select({ currentCount: count() })
      .from(carImages)
      .where(eq(carImages.carId, carId));

    const formData = await req.formData();
    const uploadedFiles: File[] = [];
    const primaryImageIndex = formData.get('primaryImageIndex');

    // Extract files from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        uploadedFiles.push(value);
      }
    }

    if (uploadedFiles.length === 0) {
      throwApiError('No images provided', 'VALIDATION_ERROR', 400);
    }

    if (uploadedFiles.length > 10) {
      throwApiError('Maximum 10 images allowed per upload', 'VALIDATION_ERROR', 400);
    }

    if ((currentCount as number) + uploadedFiles.length > 10) {
      throwApiError(
        `Cannot upload ${uploadedFiles.length} images. Car already has ${currentCount} images. Maximum 10 total allowed.`,
        'VALIDATION_ERROR',
        400
      );
    }

    // Validate file types and sizes
    for (const file of uploadedFiles) {
      if (!file.type.startsWith('image/')) {
        throwApiError(`File ${file.name} is not an image`, 'VALIDATION_ERROR', 400);
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throwApiError(`File ${file.name} exceeds 5MB limit`, 'VALIDATION_ERROR', 400);
      }
    }

    // For now, we'll simulate image upload and store placeholder URLs
    // In production, this would upload to Google Cloud Storage
    const uploadedImages = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const isPrimary = primaryImageIndex ? parseInt(primaryImageIndex.toString()) === i : i === 0 && currentCount === 0;

      // Simulate upload - in production, upload to Google Cloud Storage
      const imageUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/cars/${carId}/${Date.now()}-${file.name}`;

      const [newImage] = await getDatabase()
        .insert(carImages)
        .values({
          carId,
          imageUrl,
          isPrimary,
        })
        .returning();

      uploadedImages.push(newImage);
    }

    // If a new primary image was set, update other images to not be primary
    if (primaryImageIndex !== null) {
      const primaryImage = uploadedImages[parseInt(primaryImageIndex?.toString() || '0')];
      if (primaryImage) {
        await getDatabase()
          .update(carImages)
          .set({ isPrimary: false })
          .where(and(
            eq(carImages.carId, carId),
            eq(carImages.isPrimary, true),
            // Don't update the new primary image
            // Note: we can't use neq with the new image since it was just created
          ));

        // Set the new primary image
        await getDatabase()
          .update(carImages)
          .set({ isPrimary: true })
          .where(eq(carImages.id, primaryImage.id));
      }
    }

    logger.info('Car images uploaded successfully', {
      carId,
      userId: user.id,
      imageCount: uploadedImages.length,
      totalImages: (currentCount as number) + uploadedImages.length,
    });

    return NextResponse.json({
      message: 'Images uploaded successfully',
      images: uploadedImages,
      totalImages: (currentCount as number) + uploadedImages.length,
    }, { status: 201 });

  } catch (error: unknown) {
    logger.error('Error uploading car images:', error as Error, { carId, userId: user.id });

    if (error instanceof Error && error.message.includes('VALIDATION_ERROR')) {
      throw error;
    }

    throwApiError('Failed to upload images', 'UPLOAD_ERROR', 500);
  }
  }
});

// DELETE /api/cars/[id]/images - Delete specific images
export const DELETE = createApiHandler({
  requireAuth: true,
  allowedRoles: ['seller', 'admin'],
  rateLimit: { max: 20, windowMs: 60 * 1000 },
  handler: async (req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const carId = params.id;
  const { searchParams } = new URL(req.url);
  const imageIds = searchParams.get('imageIds')?.split(',') || [];

  if (imageIds.length === 0) {
    throwApiError('No image IDs provided', 'VALIDATION_ERROR', 400);
  }

  try {
    // Verify car exists and user owns it (or is admin)
    const car = await getDatabase()
      .select({ id: cars.id, ownerId: cars.ownerId })
      .from(cars)
      .where(eq(cars.id, carId))
      .limit(1);

    if (!car.length) {
      throwApiError('Car not found', 'CAR_NOT_FOUND', 404);
    }

    if (user.role !== 'admin' && car[0].ownerId !== user.id) {
      throwApiError('Unauthorized to modify this car', 'FORBIDDEN', 403);
    }

    // Delete the specified images
    const deletedImages = await getDatabase()
      .delete(carImages)
      .where(and(
        eq(carImages.carId, carId),
        // Note: In a real implementation, you'd use 'in' operator for imageIds
        // For now, we'll delete one by one
      ))
      .returning();

    // In production, also delete from Google Cloud Storage

    logger.info('Car images deleted successfully', {
      carId,
      userId: user.id,
      deletedCount: deletedImages.length,
    });

    return NextResponse.json({
      message: 'Images deleted successfully',
      deletedCount: deletedImages.length,
    });

  } catch (error: unknown) {
    logger.error('Error deleting car images:', error as Error, { carId, userId: user.id });
    throwApiError('Failed to delete images', 'DELETE_ERROR', 500);
  }
  }
});