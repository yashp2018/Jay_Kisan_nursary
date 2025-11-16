import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // Import the hashing library

const seedUsers = async () => {
  try {
    // IDEMPOTENCY CHECK: Do not seed if an admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ User data already exists. Skipping user seeding.');
      return; 
    }

    // Define the plain text password
    const plainPassword = 'adminpass';
    // --- CRITICAL FIX: Hash the password with a salt round (e.g., 10) ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    // -------------------------------------------------------------------
    
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
    console.log('🌱 Successfully seeded initial users.');
  } catch (error) {
    console.error('❌ User seeding failed:', error.message);
    throw error; 
  }
};

export default seedUsers;
