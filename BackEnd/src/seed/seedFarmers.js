import Farmer from '../models/Farmer.js';
import connectDB from '../config/db.js';

/** Helper function moved outside and modified to check for existing ID before calculating next. */
let _regCounter = null;
async function nextRegNo() {
  if (_regCounter == null) {
    const doc = await Farmer.findOne({ registrationNo: { $regex: '^REG-\\\\d{6}$' } })
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
    // IDEMPOTENCY CHECK: Do not seed if farmers already exist
    const existingFarmerCount = await Farmer.countDocuments();
    if (existingFarmerCount > 0) {
      console.log('✅ Farmer data already exists. Skipping farmer seeding.');
      return; 
    }
    
    // WARNING: Original code ran deleteMany. Removed for safety.

    const farmers = [
      { fullName: 'Ramesh Patil', phone: '9876543210', address: 'Village A, Nashik', aadhaarNumber: '123412341234', vehicleNumber: 'MH15AB1234', driverName: 'Shivraj', pincode: '422001', status: 'new' },
      { fullName: 'Shubham More', phone: '9876543211', address: 'Village B, Pune', aadhaarNumber: '234523452345', vehicleNumber: 'MH12CD2345', driverName: 'Sanjay', pincode: '411001', status: 'new' },
      { fullName: 'Dinesh Yadav', phone: '9876543221', address: 'Village L, Nanded', aadhaarNumber: '345734573457', vehicleNumber: 'MH26WX3457', driverName: 'Amit', pincode: '431601', status: 'new' },
      { fullName: 'Yogesh Chavan', phone: '9876543222', address: 'Village M, Amravati', aadhaarNumber: '456845684568', vehicleNumber: 'MH27YZ4568', driverName: 'Rajesh', pincode: '444601', status: 'new' },
      { fullName: 'Nitin Thakur', phone: '9876543223', address: 'Village N, Beed', aadhaarNumber: '567956795679', vehicleNumber: 'MH23AB5679', driverName: 'Girish', pincode: '431122', status: 'new' },
      { fullName: 'Sandeep Naik', phone: '9876543224', address: 'Village O, Osmanabad', aadhaarNumber: '678067806780', vehicleNumber: 'MH25CD6780', driverName: 'Harish', pincode: '413501', status: 'new' },
    ];

    const createdList = [];
    for (const f of farmers) {
      if (!f.registrationNo) f.registrationNo = await nextRegNo();
      createdList.push(f);
    }
    
    await Farmer.insertMany(createdList);
    
    console.log('🌱 Farmer data seeded!');
  } catch (error) {
    console.error('❌ Farmer seeding failed:', error.message);
    throw error; 
  }
};

export default seedFarmers;
