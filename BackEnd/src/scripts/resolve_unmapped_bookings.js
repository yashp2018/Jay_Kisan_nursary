// resolve_unmapped_bookings.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import Booking from '../models/Booking.js';
import Farmer from '../models/Farmer.js';

async function run() {
  await connectDB();
  console.log('Connected');

  // find bookings where farmerRegistrationNo missing OR null
  const bookings = await Booking.find({ $or: [{ farmerRegistrationNo: { $exists: false } }, { farmerRegistrationNo: null }] }).lean();
  console.log('Total bookings missing farmerRegistrationNo:', bookings.length);

  const report = { updated: [], skipped: [] };

  for (const b of bookings) {
    // try to find candidate keys on the booking
    // adjust field names below if your booking schema uses different names
    const phoneCandidates = new Set();
    if (b.farmerPhone) phoneCandidates.add(String(b.farmerPhone));
    if (b.phone) phoneCandidates.add(String(b.phone));
    if (b.varieties && Array.isArray(b.varieties)) {
      // sometimes booking.varieties[].farmerPhone exists - unlikely, but add more heuristics here
    }
    const aadhaarCandidate = b.aadhaarNumber || b.farmerAadhaar || null;
    const farmerNameCandidate = b.farmerName || b.customerName || null;

    let found = null;

    // 1) match by phone
    if (!found && phoneCandidates.size) {
      const phones = Array.from(phoneCandidates);
      found = await Farmer.findOne({ phone: { $in: phones } }).lean();
    }

    // 2) match by aadhaar
    if (!found && aadhaarCandidate) {
      found = await Farmer.findOne({ aadhaarNumber: String(aadhaarCandidate) }).lean();
    }

    // 3) match by name (last resort — may produce false positives)
    if (!found && farmerNameCandidate) {
      found = await Farmer.findOne({ fullName: farmerNameCandidate }).lean();
    }

    if (found) {
      // update booking with registration number
      await Booking.updateOne({ _id: b._id }, { $set: { farmerRegistrationNo: found.registrationNo } });
      report.updated.push({ bookingId: String(b._id), reg: found.registrationNo, farmerId: String(found._id) });
      console.log(`Mapped booking ${b._id} -> ${found.registrationNo}`);
    } else {
      report.skipped.push({ bookingId: String(b._id), farmerRef: String(b.farmer) });
      console.log(`Skipped booking ${b._id} (no match)`);
    }
  }

  console.log('Done. Updated:', report.updated.length, 'Skipped:', report.skipped.length);
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
