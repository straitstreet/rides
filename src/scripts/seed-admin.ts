/**
 * Seed script to create admin user and initial invite codes
 * Run this script to initialize the platform with an admin user
 */

import { getDatabase } from '@/lib/db';
import { users, inviteCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user and initial data...');

    // Check if admin user already exists
    const existingAdmin = await getDatabase()
      .select()
      .from(users)
      .where(eq(users.email, 'straitstreetco@gmail.com'))
      .limit(1);

    let adminUser;

    if (existingAdmin.length === 0) {
      // Create admin user
      [adminUser] = await getDatabase()
        .insert(users)
        .values({
          email: 'straitstreetco@gmail.com',
          firstName: 'Admin',
          lastName: 'User',
          phone: '+2348000000000',
          isVerified: true,
        })
        .returning();

      console.log('✅ Admin user created:', adminUser.email);
    } else {
      adminUser = existingAdmin[0];
      console.log('ℹ️  Admin user already exists:', adminUser.email);
    }

    // Create some initial invite codes for testing
    const initialInvites = [
      {
        code: `NAIJA-${nanoid(8).toUpperCase()}`,
        role: 'admin' as const,
        createdBy: adminUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: `NAIJA-${nanoid(8).toUpperCase()}`,
        role: 'seller' as const,
        createdBy: adminUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: `NAIJA-${nanoid(8).toUpperCase()}`,
        role: 'buyer' as const,
        createdBy: adminUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    ];

    const createdInvites = await getDatabase()
      .insert(inviteCodes)
      .values(initialInvites)
      .returning();

    console.log('✅ Initial invite codes created:');
    createdInvites.forEach((invite) => {
      console.log(`  - ${invite.code} (${invite.role})`);
    });

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Use one of the invite codes above to create accounts');
    console.log('2. Set up Clerk authentication with the admin user email');
    console.log('3. Configure user roles in Clerk metadata');

    return {
      adminUser,
      inviteCodes: createdInvites,
    };
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedAdmin };