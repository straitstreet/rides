import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createApiHandler, validateBody, throwApiError } from '@/lib/api/middleware';
import { updateUserSchema } from '@/lib/api/validation';
import { getCurrentUser } from '@/lib/auth-server';

// GET /api/users/me - Get current user profile
export const GET = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 60, windowMs: 60 * 1000 },
})(async (req: NextRequest) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  try {
    // Get user from database with additional details
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser) {
      // User exists in Clerk but not in our database - create them
      const [newUser] = await db
        .insert(users)
        .values({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
        })
        .returning();

      return NextResponse.json({ user: newUser });
    }

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throwApiError('Failed to fetch user profile', 'DATABASE_ERROR', 500);
  }
});

// PUT /api/users/me - Update current user profile
export const PUT = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 20, windowMs: 60 * 1000 },
})(async (req: NextRequest) => {
  const user = await getCurrentUser();
  if (!user) {
    throwApiError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const body = await validateBody(updateUserSchema)(req);

  try {
    // Prepare update data
    const updateData: any = {};

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    updateData.updatedAt = new Date();

    // Check if user exists in database
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    let updatedUser;

    if (!existingUser) {
      // Create user if doesn't exist
      [updatedUser] = await db
        .insert(users)
        .values({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          ...updateData,
        })
        .returning();
    } else {
      // Update existing user
      [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, user.id))
        .returning();
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user profile:', error);

    // Handle unique constraint violations
    if (error.code === '23505') {
      if (error.detail?.includes('phone')) {
        throwApiError('Phone number already in use', 'DUPLICATE_PHONE', 409);
      }
      if (error.detail?.includes('email')) {
        throwApiError('Email already in use', 'DUPLICATE_EMAIL', 409);
      }
    }

    throwApiError('Failed to update user profile', 'DATABASE_ERROR', 500);
  }
});