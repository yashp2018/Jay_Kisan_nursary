import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // CRITICAL: Import bcryptjs

const seedUsers = async () => {
  try {
    // IDEMPOTENCY CHECK (Safeguard against duplicate seeding)
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ User data already exists. Skipping user seeding.');
      return; 
    }

    // --- CRITICAL FIX: Hash the password before storage ---
    const plainPassword = 'adminpass';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    // ---------------------------------------------------
    
    const users = [
      {
        staffId: 'admin001',
        password: hashedPassword, // Store the HASHED password
        role: 'admin',
      },
      {
        staffId: 'staff001',
        password: hashedPassword, // Store the HASHED password
        role: 'staff',
      },
    ];

    await User.insertMany(users);
    console.log('🌱 Successfully seeded initial users with HASHED passwords.');
  } catch (error) {
    console.error('❌ User seeding failed:', error.message);
    throw error; 
  }
};

export default seedUsers;
