import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/lib/db';
import { inviteCodes, users } from '@/lib/db/schema';
import { createApiHandler } from '@/lib/api/middleware';
import { eq, and, desc, count, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Validation schemas
const createInviteSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['buyer', 'seller', 'admin']),
  expiresIn: z.number().min(1).max(365).default(30), // days
});


// GET /api/invites - Get all invite codes (admin only)
export const GET = createApiHandler({
  requireAuth: true,
  allowedRoles: ['admin'],
  rateLimit: { max: 100, windowMs: 60000 },
  handler: async (req: NextRequest) => {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const status = url.searchParams.get('status'); // active, used, expired
      const role = url.searchParams.get('role');

      const offset = (page - 1) * limit;

      // Build query conditions
      const conditions = [];

      if (status === 'active') {
        conditions.push(eq(inviteCodes.isActive, true));
        conditions.push(isNull(inviteCodes.usedAt));
      } else if (status === 'used') {
        conditions.push(eq(inviteCodes.isActive, false));
      }

      if (role) {
        conditions.push(eq(inviteCodes.role, role as 'buyer' | 'seller' | 'admin'));
      }

      // Get invite codes with creator and user info
      const invites = await getDatabase()
        .select({
          id: inviteCodes.id,
          code: inviteCodes.code,
          email: inviteCodes.email,
          role: inviteCodes.role,
          isActive: inviteCodes.isActive,
          expiresAt: inviteCodes.expiresAt,
          usedAt: inviteCodes.usedAt,
          createdAt: inviteCodes.createdAt,
          createdBy: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(inviteCodes)
        .leftJoin(users, eq(inviteCodes.createdBy, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(inviteCodes.createdAt))
        .limit(limit)
        .offset(offset);

      // Get total count
      const [totalResult] = await getDatabase()
        .select({ count: count() })
        .from(inviteCodes)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = totalResult.count;
      const totalPages = Math.ceil(total / limit);

      // Get analytics
      const [activeCount] = await getDatabase()
        .select({ count: count() })
        .from(inviteCodes)
        .where(and(eq(inviteCodes.isActive, true), isNull(inviteCodes.usedAt)));

      const [usedCount] = await getDatabase()
        .select({ count: count() })
        .from(inviteCodes)
        .where(eq(inviteCodes.isActive, false));

      return NextResponse.json({
        invites,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        analytics: {
          active: activeCount.count,
          used: usedCount.count,
          total: total,
        },
      });
    } catch (error) {
      console.error('Error fetching invite codes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invite codes' },
        { status: 500 }
      );
    }
  },
});

// POST /api/invites - Create new invite code (admin only)
export const POST = createApiHandler({
  requireAuth: true,
  allowedRoles: ['admin'],
  rateLimit: { max: 10, windowMs: 60000 },
  handler: async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { email, role, expiresIn } = createInviteSchema.parse(body);

      // Generate unique invite code
      const code = `NAIJA-${nanoid(8).toUpperCase()}`;

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresIn);

      // Create invite code
      const [invite] = await getDatabase()
        .insert(inviteCodes)
        .values({
          code,
          email,
          role,
          createdBy: 'admin-user-id', // TODO: Get from authenticated user
          expiresAt,
        })
        .returning();

      return NextResponse.json({
        invite: {
          ...invite,
          createdBy: {
            id: 'admin-user-id',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@naija-rides.com',
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Error creating invite code:', error);
      return NextResponse.json(
        { error: 'Failed to create invite code' },
        { status: 500 }
      );
    }
  },
});