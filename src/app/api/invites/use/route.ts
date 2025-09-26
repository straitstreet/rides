import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/lib/db';
import { inviteCodes } from '@/lib/db/schema';
import { createApiHandler } from '@/lib/api/middleware';
import { eq, and, gt, isNull } from 'drizzle-orm';

// Validation schema
const useInviteSchema = z.object({
  code: z.string().min(8).max(20),
  userId: z.string().uuid(),
});

// POST /api/invites/use - Mark invite code as used
export const POST = createApiHandler({
  requireAuth: true,
  rateLimit: { max: 10, windowMs: 60000 },
  handler: async (req: NextRequest, { user }) => {
    try {
      const body = await req.json();
      const { code, userId } = useInviteSchema.parse(body);

      // Verify the user ID matches the authenticated user
      if (userId !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized: User ID mismatch' },
          { status: 403 }
        );
      }

      // Find and update the invite code
      const [updatedInvite] = await getDatabase()
        .update(inviteCodes)
        .set({
          usedBy: userId,
          usedAt: new Date(),
          isActive: false,
        })
        .where(
          and(
            eq(inviteCodes.code, code.toUpperCase()),
            eq(inviteCodes.isActive, true),
            isNull(inviteCodes.usedAt),
            gt(inviteCodes.expiresAt, new Date())
          )
        )
        .returning();

      if (!updatedInvite) {
        return NextResponse.json(
          { error: 'Invalid, expired, or already used invite code' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Invite code marked as used successfully',
        invite: {
          id: updatedInvite.id,
          code: updatedInvite.code,
          role: updatedInvite.role,
          usedAt: updatedInvite.usedAt,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Error using invite code:', error);
      return NextResponse.json(
        { error: 'Failed to use invite code' },
        { status: 500 }
      );
    }
  },
});