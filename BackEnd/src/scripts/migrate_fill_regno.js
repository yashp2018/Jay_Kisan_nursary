// Plant-Nursing-main/BackEnd/src/scripts/migrate_fill_regno.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/plant-nursery';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection.db;
  console.log('Connected to', MONGO_URI);

  const farmers = await db.collection('farmers').find({}).toArray();
  console.log('Found farmers:', farmers.length);

  // Build mapping oid -> registrationNo
  const oidToReg = {};
  let counter = 1;

  // Use any existing registrationNo to start counter
  const existingRegs = farmers.map(f => f.registrationNo).filter(Boolean);
  if (existingRegs.length) {
    const nums = existingRegs.map(r => {
      const m = String(r).match(/(\d+)$/);
      return m ? parseInt(m[1], 10) : null;
    }).filter(Boolean);
    if (nums.length) counter = Math.max(...nums) + 1;
  }

  for (const f of farmers) {
    const oid = String(f._id);
    if (f.registrationNo) {
      oidToReg[oid] = f.registrationNo;
      continue;
    }
    const reg = 'REG-' + String(counter).padStart(6, '0');
    counter++;
    oidToReg[oid] = reg;
    await db.collection('farmers').updateOne({ _id: f._id }, { $set: { registrationNo: reg, updatedAt: new Date() } });
    console.log('Set registrationNo', reg, 'for farmer', oid);
  }

  // ensure unique index
  try {
    await db.collection('farmers').createIndex({ registrationNo: 1 }, { unique: true });
    console.log('Created unique index on farmers.registrationNo');
  } catch (e) {
    console.warn('Index creation skipped/error:', e.message);
  }

  // Update bookings to add farmerRegistrationNo
  const bookings = await db.collection('bookings').find({}).toArray();
  console.log('Found bookings:', bookings.length);
  for (const b of bookings) {
    let farmerOid = null;
    if (b.farmer && typeof b.farmer === 'object' && b.farmer.$oid) farmerOid = b.farmer.$oid;
    else if (b.farmer) farmerOid = String(b.farmer);

    const reg = farmerOid ? oidToReg[farmerOid] : null;
    if (reg) {
      await db.collection('bookings').updateOne({ _id: b._id }, { $set: { farmerRegistrationNo: reg, updatedAt: new Date() } });
      console.log('Updated booking', String(b._id), '->', reg);
    } else {
      console.warn('Could not map booking', String(b._id), 'farmer:', b.farmer);
    }
  }

  console.log('Migration complete.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
