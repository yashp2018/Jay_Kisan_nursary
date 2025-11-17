// file: seed/seedUsers.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedUsers = async () => {
  try {
    // Prevent duplicate seeding by checking by staffId
    const adminExists = await User.findOne({ staffId: 'admin001' });
    const staffExists = await User.findOne({ staffId: 'staff001' });

    if (adminExists && staffExists) {
      console.log('✅ User data already exists. Skipping user seeding.');
      return;
    }

    // Use env vars for default passwords if present, otherwise fallback (safe for dev only)
    const adminPlain = process.env.SEED_ADMIN_PASS || 'adminpass';
    const staffPlain = process.env.SEED_STAFF_PASS || 'staffpass';

    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const adminHashed = await bcrypt.hash(adminPlain, saltRounds);
    const staffHashed = await bcrypt.hash(staffPlain, saltRounds);

    const usersToInsert = [];
    if (!adminExists) {
      usersToInsert.push({
        staffId: 'admin001',
        password: adminHashed,
        role: 'admin',
      });
    }
    if (!staffExists) {
      usersToInsert.push({
        staffId: 'staff001',
        password: staffHashed,
        role: 'staff',
      });
    }

    if (usersToInsert.length > 0) {
      await User.insertMany(usersToInsert);
      console.log('🌱 Successfully seeded initial users with hashed passwords.');
    } else {
      console.log('No users to insert.');
    }
  } catch (error) {
    console.error('❌ User seeding failed:', error);
    throw error;
  }
};

export default seedUsers;
