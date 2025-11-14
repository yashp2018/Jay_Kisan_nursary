// BackEnd/src/seed/seedFarmers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Farmer from '../models/Farmer.js';
import connectDB from '../config/db.js';

dotenv.config();

/** Helper to generate registration numbers REG-000001 ... */
let _regCounter = null;
async function nextRegNo() {
  if (_regCounter == null) {
    // find highest existing REG- pattern
    const doc = await Farmer.findOne({ registrationNo: { $regex: '^REG-\\d{6}$' } })
      .sort({ registrationNo: -1 })
      .select('registrationNo')
      .lean();
    if (doc && doc.registrationNo) {
      const m = String(doc.registrationNo).match(/(\d+)$/);
      _regCounter = m ? parseInt(m[1], 10) : 0;
    } else {
      _regCounter = 0;
    }
  }
  _regCounter++;
  return 'REG-' + String(_regCounter).padStart(6, '0');
}

const seedFarmers = async () => {
  try {
    await connectDB();

    // Optional: wipe existing farmers in dev
    await Farmer.deleteMany();

    const farmers = [
      { fullName: 'Ramesh Patil', phone: '9876543210', address: 'Village A, Nashik', aadhaarNumber: '123412341234', vehicleNumber: 'MH15AB1234', driverName: 'Shivraj', pincode: '422001', status: 'new' },
      { fullName: 'Suresh Jadhav', phone: '9876543211', address: 'Village B, Pune', aadhaarNumber: '234523452345', vehicleNumber: 'MH12CD2345', driverName: 'Ramu', pincode: '411001', status: 'new' },
      { fullName: 'Ganesh Pawar', phone: '9876543212', address: 'Village C, Satara', aadhaarNumber: '345634563456', vehicleNumber: 'MH11EF3456', driverName: 'Keshav', pincode: '415001', status: 'new' },
      { fullName: 'Vijay Kale', phone: '9876543213', address: 'Village D, Sangli', aadhaarNumber: '456745674567', vehicleNumber: 'MH10GH4567', driverName: 'Naresh', pincode: '416416', status: 'new' },
      { fullName: 'Arun Deshmukh', phone: '9876543214', address: 'Village E, Kolhapur', aadhaarNumber: '567856785678', vehicleNumber: 'MH09IJ5678', driverName: 'Prakash', pincode: '416001', status: 'new' },
      { fullName: 'Sunil Sharma', phone: '9876543215', address: 'Village F, Aurangabad', aadhaarNumber: '678967896789', vehicleNumber: 'MH20KL6789', driverName: 'Anil', pincode: '431001', status: 'new' },
      { fullName: 'Mahesh More', phone: '9876543216', address: 'Village G, Solapur', aadhaarNumber: '789078907890', vehicleNumber: 'MH13MN7890', driverName: 'Deepak', pincode: '413001', status: 'new' },
      { fullName: 'Anand Kulkarni', phone: '9876543217', address: 'Village H, Nagpur', aadhaarNumber: '890189018901', vehicleNumber: 'MH31OP8901', driverName: 'Sanjay', pincode: '440001', status: 'new' },
      { fullName: 'Kishor Yadav', phone: '9876543218', address: 'Village I, Ahmednagar', aadhaarNumber: '901290129012', vehicleNumber: 'MH16QR9012', driverName: 'Vikas', pincode: '414001', status: 'new' },
      { fullName: 'Pravin Gaikwad', phone: '9876543219', address: 'Village J, Jalgaon', aadhaarNumber: '123512351235', vehicleNumber: 'MH19ST1235', driverName: 'Manoj', pincode: '425001', status: 'new' },
      { fullName: 'Sachin Bhosale', phone: '9876543220', address: 'Village K, Latur', aadhaarNumber: '234623462346', vehicleNumber: 'MH24UV2346', driverName: 'Rohit', pincode: '413512', status: 'new' },
      { fullName: 'Rahul Shinde', phone: '9876543221', address: 'Village L, Nanded', aadhaarNumber: '345734573457', vehicleNumber: 'MH26WX3457', driverName: 'Amit', pincode: '431601', status: 'new' },
      { fullName: 'Yogesh Chavan', phone: '9876543222', address: 'Village M, Amravati', aadhaarNumber: '456845684568', vehicleNumber: 'MH27YZ4568', driverName: 'Rajesh', pincode: '444601', status: 'new' },
      { fullName: 'Nitin Thakur', phone: '9876543223', address: 'Village N, Beed', aadhaarNumber: '567956795679', vehicleNumber: 'MH23AB5679', driverName: 'Girish', pincode: '431122', status: 'new' },
      { fullName: 'Sandeep Naik', phone: '9876543224', address: 'Village O, Osmanabad', aadhaarNumber: '678067806780', vehicleNumber: 'MH25CD6780', driverName: 'Harish', pincode: '413501', status: 'new' },
    ];

    // assign registration numbers, collect created info
    const createdList = [];
    for (const f of farmers) {
      if (!f.registrationNo) f.registrationNo = await nextRegNo();
      createdList.push({ registrationNo: f.registrationNo, fullName: f.fullName, phone: f.phone });
    }

    // bulk insert
    const inserted = await Farmer.insertMany(farmers, { ordered: true });

    console.log('✅ Farmer records seeded successfully! Created list:');
    createdList.forEach((c, i) => {
      console.log(`${i + 1}. ${c.registrationNo} — ${c.fullName} (${c.phone})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding farmer data:', error);
    process.exit(1);
  }
};

seedFarmers();
