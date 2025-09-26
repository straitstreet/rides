import { NextRequest, NextResponse } from 'next/server';
import { eq, and, gte, lte, ilike, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { cars, users } from '@/lib/db/schema';
import { createApiHandler, validateBody, validateQuery, throwApiError } from '@/lib/api/middleware';
import { createCarSchema, carQuerySchema } from '@/lib/api/validation';
import { getCurrentUser } from '@/lib/auth-server';

// GET /api/cars - List cars with filtering and pagination
export const GET = createApiHandler({
  rateLimit: { max: 100, windowMs: 60 * 1000 }, // 100 requests per minute
})(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = validateQuery(carQuerySchema, searchParams);

  let whereConditions = [];

  // Add filters
  if (query.location) {
    whereConditions.push(ilike(cars.location, `%${query.location}%`));
  }

  if (query.category) {
    whereConditions.push(eq(cars.category, query.category));
  }

  if (query.minPrice !== undefined) {
    whereConditions.push(gte(cars.dailyRate, query.minPrice.toString()));
  }

  if (query.maxPrice !== undefined) {
    whereConditions.push(lte(cars.dailyRate, query.maxPrice.toString()));
  }

  if (query.available !== undefined) {
    whereConditions.push(eq(cars.isAvailable, query.available));
  }

  // Default to only available and verified cars for public listings
  if (query.available === undefined) {
    whereConditions.push(eq(cars.isAvailable, true));
  }
  whereConditions.push(eq(cars.isVerified, true));

  try {
    const offset = (query.page - 1) * query.limit;

    // Get cars with owner information
    const result = await db
      .select({
        id: cars.id,
        make: cars.make,
        model: cars.model,
        year: cars.year,
        color: cars.color,
        plateNumber: cars.plateNumber,
        fuelType: cars.fuelType,
        transmission: cars.transmission,
        seats: cars.seats,
        category: cars.category,
        dailyRate: cars.dailyRate,
        description: cars.description,
        features: cars.features,
        location: cars.location,
        latitude: cars.latitude,
        longitude: cars.longitude,
        isAvailable: cars.isAvailable,
        isVerified: cars.isVerified,
        createdAt: cars.createdAt,
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
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(cars.createdAt))
      .limit(query.limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: cars.id })
      .from(cars)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalPages = Math.ceil((count as number) / query.limit);

    return NextResponse.json({
      cars: result.map(car => ({
        ...car,
        features: car.features ? JSON.parse(car.features) : [],
        dailyRate: parseFloat(car.dailyRate),
        latitude: car.latitude ? parseFloat(car.latitude) : null,
        longitude: car.longitude ? parseFloat(car.longitude) : null,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    throwApiError('Failed to fetch cars', 'DATABASE_ERROR', 500);
  }
});

// POST /api/cars - Create new car listing
export const POST = createApiHandler({
  requireAuth: true,
  allowedRoles: ['seller', 'admin'],
  rateLimit: { max: 10, windowMs: 60 * 1000 }, // 10 requests per minute
})(async (req: NextRequest) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const body = await validateBody(createCarSchema)(req);

  try {
    const [newCar] = await db
      .insert(cars)
      .values({
        ...body,
        ownerId: user.id,
        features: body.features ? JSON.stringify(body.features) : null,
        dailyRate: body.dailyRate.toString(),
        latitude: body.latitude?.toString(),
        longitude: body.longitude?.toString(),
        isVerified: false, // Require admin approval
      })
      .returning();

    return NextResponse.json({
      car: {
        ...newCar,
        features: newCar.features ? JSON.parse(newCar.features) : [],
        dailyRate: parseFloat(newCar.dailyRate),
        latitude: newCar.latitude ? parseFloat(newCar.latitude) : null,
        longitude: newCar.longitude ? parseFloat(newCar.longitude) : null,
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating car:', error);

    // Handle unique constraint violations
    if (error.code === '23505') {
      if (error.detail?.includes('plate_number')) {
        throwApiError('Plate number already exists', 'DUPLICATE_PLATE_NUMBER', 409);
      }
      if (error.detail?.includes('vin')) {
        throwApiError('VIN already exists', 'DUPLICATE_VIN', 409);
      }
    }

    throwApiError('Failed to create car listing', 'DATABASE_ERROR', 500);
  }
});