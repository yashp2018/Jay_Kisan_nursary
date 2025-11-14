// BackEnd/src/models/Farmer.js
import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  registrationNo: {
    type: String,
    required: true,
    unique: true
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String },
  vehicleNumber: { type: String },
  driverName: { type: String },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.model('Farmer', farmerSchema);
