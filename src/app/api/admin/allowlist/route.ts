import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isEmailAllowed, getAllowedEmails, addEmailToAllowlist, removeEmailFromAllowlist } from '@/lib/allowlist';

// Admin emails that can manage the allowlist
const ADMIN_EMAILS = [
  'straitstreetco@gmail.com',
  'oluwasanya.awe@gmail.com',
];

function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, you'd get the user's email from the database
    // For now, we'll assume the admin check is done elsewhere

    const allowedEmails = getAllowedEmails();

    return NextResponse.json({
      allowedEmails,
      total: allowedEmails.length
    });
  } catch (error) {
    console.error('Error fetching allowlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, action } = await request.json();

    if (!email || !action) {
      return NextResponse.json({ error: 'Email and action are required' }, { status: 400 });
    }

    let success = false;
    let message = '';

    switch (action) {
      case 'add':
        success = addEmailToAllowlist(email);
        message = success ? 'Email added to allowlist' : 'Email already exists in allowlist';
        break;

      case 'remove':
        success = removeEmailFromAllowlist(email);
        message = success ? 'Email removed from allowlist' : 'Email not found in allowlist';
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success,
      message,
      email,
      action
    });
  } catch (error) {
    console.error('Error managing allowlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const allowed = isEmailAllowed(email);

    return NextResponse.json({
      email,
      allowed,
      message: allowed ? 'Email is allowed' : 'Email is not allowed'
    });
  } catch (error) {
    console.error('Error checking email allowlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}