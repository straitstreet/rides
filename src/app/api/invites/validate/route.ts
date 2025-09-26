import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/lib/db';
import { inviteCodes } from '@/lib/db/schema';
import { createApiHandler } from '@/lib/api/middleware';
import { eq, and, gt, isNull } from 'drizzle-orm';

// Validation schema
const validateInviteSchema = z.object({
  code: z.string().min(8).max(20),
});

// POST /api/invites/validate - Validate an invite code
export const POST = createApiHandler({
  requireAuth: false,
  rateLimit: { max: 20, windowMs: 60000 },
  handler: async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { code } = validateInviteSchema.parse(body);

      // Find the invite code
      const [invite] = await getDatabase()
        .select()
        .from(inviteCodes)
        .where(
          and(
            eq(inviteCodes.code, code.toUpperCase()),
            eq(inviteCodes.isActive, true),
            isNull(inviteCodes.usedAt),
            gt(inviteCodes.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!invite) {
        return NextResponse.json(
          {
            valid: false,
            error: 'Invalid, expired, or already used invite code'
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        valid: true,
        invite: {
          id: invite.id,
          code: invite.code,
          role: invite.role,
          email: invite.email,
          expiresAt: invite.expiresAt,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            valid: false,
            error: 'Invalid request data',
            details: error.errors
          },
          { status: 400 }
        );
      }

      console.error('Error validating invite code:', error);
      return NextResponse.json(
        {
          valid: false,
          error: 'Failed to validate invite code'
        },
        { status: 500 }
      );
    }
  },
});