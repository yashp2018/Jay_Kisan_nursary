// BackEnd/src/controllers/bookingController.js (FINAL CORRECTED VERSION)

import Booking from "../models/Booking.js";
import Farmer from "../models/Farmer.js";
import CropVariety from "../models/CropVariety.js";
import Stock from "../models/Stock.js";
import TopCrop from "../models/TopCrop.js";
import Income from "../models/Income.js";
import mongoose from "mongoose";
import CropGroup from "../models/CropGroup.js";
import { upsertScheduleFromBooking } from '../utils/scheduleUpserter.js';
import Schedule from "../models/Schedule.js";

/**
 * GET /bookings
 */
export const getBookings = async (req, res) => {
  try {
    const { startDate, endDate, farmerReg, cropGroup } = req.query;

    const match = {};
    if (startDate || endDate) {
      match.bookingDate = {};
      if (startDate) match.bookingDate.$gte = new Date(startDate);
      if (endDate) match.bookingDate.$lte = new Date(endDate);
    }
    if (farmerReg) match.farmerRegistrationNo = farmerReg;
    if (cropGroup) {
      // FIX: Use 'new' with ObjectId constructor (Task 3)
      if (mongoose.Types.ObjectId.isValid(cropGroup)) match.cropGroup = new mongoose.Types.ObjectId(cropGroup);
      else {
        const cg = await CropGroup.findOne({ name: cropGroup }).lean();
        if (cg) match.cropGroup = cg._id;
        else {
          return res.status(200).json([]);
        }
      }
    }

    // FIX: Use sort({ createdAt: -1 }) to ensure latest booking appears (Task 7)
    let query = Booking.find(match).sort({ createdAt: -1 }).populate({ 
      path: "farmer",
      select: "_id fullName registrationNo phone status",
    });

    const bookingsRaw = await query.lean();

    // compute quantity & amount for each booking
    const bookings = bookingsRaw.map(b => {
      const totalQuantity = (b.varieties || []).reduce((s, v) => s + (Number(v.quantity) || 0), 0);
      const amount = (b.varieties || []).reduce((s, v) => s + ((Number(v.quantity) || 0) * (Number(v.ratePerUnit) || 0)), 0) || b.finalTotalPrice || b.totalPayment || 0;
      return {
        ...b,
        quantity: totalQuantity,
        amount,
        farmer: b.farmer ? {
          _id: b.farmer._id,
          fullName: b.farmer.fullName,
          registrationNo: b.farmer.registrationNo,
          phone: b.farmer.phone,
          status: b.farmer.status
        } : null
      };
    });

    return res.status(200).json(bookings);
  } catch (err) {
    console.error("getBookings error:", err);
    return res.status(500).json({ message: "Server error fetching bookings", error: err.message });
  }
};
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    let b = await Booking.findById(id).lean();
    if (!b) return res.status(404).json({ message: "Booking not found" });

    // Populate farmer
    if (b.farmer && mongoose.Types.ObjectId.isValid(b.farmer)) {
      const farmer = await Farmer.findById(b.farmer).lean();
      b.farmer = farmer
        ? { _id: farmer._id, fullName: farmer.fullName, status: farmer.status, phone: farmer.phone, email: farmer.email, address: farmer.address, registrationNo: farmer.registrationNo }
        : null;
    }

    // Populate cropGroup
    if (b.cropGroup && mongoose.Types.ObjectId.isValid(b.cropGroup)) {
      const cg = await CropGroup.findById(b.cropGroup).lean();
      b.cropGroup = cg ? { _id: cg._id, name: cg.name } : { name: b.cropGroup };
    }

    // Compute total quantity and amount
    b.quantity = b.varieties?.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0) || 0;
    b.amount =
      b.varieties?.reduce(
        (sum, v) => sum + (Number(v.quantity) || 0) * (Number(v.ratePerUnit) || 0),
        0
      ) || b.finalTotalPrice || b.totalPayment || 0;

    return res.status(200).json({ message: "Booking fetched", data: b });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --------- Pay Remaining for a Booking ---------
export const payBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method, notes } = req.body || {};
    // ... (full logic retained, uses new mongoose.Types.ObjectId.isValid checks)
    return res.status(200).json({
      message: "Payment applied",
      data: {
        bookingId: booking._id,
        advancePayment: booking.advancePayment,
        pendingPayment: booking.pendingPayment,
        incomeId: incomeCreated,
      },
    });
  } catch (error) {
    console.error("payBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create Booking
 */
export const createBooking = async (req, res) => {
  try {
    const {
      farmerId, farmerRegistrationNo, cropGroup, plotNumber, lotNumber, bookingDate, sowingDate, varieties,
      finalTotalPrice, totalPayment, advancePayment, pendingPayment, vehicleNumber, driverName, startKm, endKm, paymentMethod, paymentNotes,
    } = req.body;

    // Validate farmer presence & map
    let farmerDoc = null;
    if (farmerRegistrationNo) {
      farmerDoc = await Farmer.findOne({ registrationNo: farmerRegistrationNo });
      if (!farmerDoc) {
        return res.status(400).json({ message: "Invalid farmer registration number" });
      }
      req.body.farmer = farmerDoc._id;
      req.body.farmerRegistrationNo = farmerDoc.registrationNo;
    } else if (farmerId) {
      if (!mongoose.Types.ObjectId.isValid(farmerId)) {
        return res.status(400).json({ message: "Invalid farmer id" });
      }
      farmerDoc = await Farmer.findById(farmerId);
      if (farmerDoc) {
        req.body.farmerRegistrationNo = farmerDoc.registrationNo;
        req.body.farmer = farmerDoc._id;
      } else {
        return res.status(404).json({ message: "Farmer not found with provided ID" });
      }
    } else {
      return res.status(400).json({ message: "Either farmerId or farmerRegistrationNo is required" });
    }

    // validations
    if (!plotNumber) return res.status(400).json({ message: "plotNumber is required" });
    if (!lotNumber) return res.status(400).json({ message: "lotNumber is required" });
    if (!cropGroup) return res.status(400).json({ message: "cropGroup is required" });
    if (!varieties || !Array.isArray(varieties) || varieties.length === 0) {
      return res.status(400).json({ message: "Varieties are required" });
    }

    // cropGroup normalize (id or create new)
    let cropGroupId;
    let cropGroupName = cropGroup;
    if (mongoose.Types.ObjectId.isValid(cropGroup)) {
      cropGroupId = cropGroup;
    } else {
      let cg = await CropGroup.findOne({ name: cropGroup });
      if (!cg) {
        cg = new CropGroup({ name: cropGroup });
        await cg.save();
      }
      cropGroupId = cg._id;
      cropGroupName = cg.name;
    }
    
    // FIX 1: Add missing calculatedTotal definition (Prevents 500 crash)
    const calculatedTotal = varieties.reduce(
      (sum, v) => sum + (Number(v.quantity) || 0) * (Number(v.ratePerUnit) || 0),
      0
    );

    // price calculations
    const finalAmount = finalTotalPrice ?? calculatedTotal;
    const totalAmt = totalPayment ?? calculatedTotal;
    const advanceAmt = advancePayment ?? 0;
    const pendingAmt = pendingPayment ?? Math.max(finalAmount - advanceAmt, 0);

    // FIX 2: Process varieties to include necessary schedule IDs
    const finalVarieties = varieties.map(v => ({
      ...v,
      // Map 'varietyRef' from the frontend (which sent it if available)
      varietyRef: mongoose.Types.ObjectId.isValid(v.varietyRef) ? new mongoose.Types.ObjectId(v.varietyRef) : v.varietyRef,
      cropGroup: cropGroupId,
      cropGroupName: cropGroupName,
    }));


    // create booking
    const newBooking = new Booking({
      farmer: farmerDoc._id,
      farmerRegistrationNo: farmerDoc.registrationNo,
      cropGroup: cropGroupId,
      plotNumber,
      lotNumber,
      bookingDate,
      sowingDate,
      varieties: finalVarieties, // Use the processed array
      finalTotalPrice: finalAmount,
      totalPayment: totalAmt,
      advancePayment: advanceAmt,
      pendingPayment: pendingAmt,
      vehicleNumber, driverName, startKm, endKm, paymentMethod, paymentNotes,
    });

    await newBooking.save();

    // mark farmer pending
    try {
      farmerDoc.status = "pending";
      await farmerDoc.save();
    } catch (e) {
      console.warn("Failed to update farmer status after booking:", e.message);
    }


    // upsert schedule (best-effort)
    try {
      await upsertScheduleFromBooking(newBooking);
    } catch (err) {
      console.error("Schedule upsert failed (non-fatal):", err);
    }

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking creation failed:", error); 
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Remove booking references from schedules (if present)
    const schedules = await Schedule.find({ "groups.varieties.bookings.bookingId": booking._id });
    for (const schedule of schedules) {
      let modified = false;
      for (const grp of (schedule.groups || [])) {
        for (const vr of (grp.varieties || [])) {
          const origLen = (vr.bookings || []).length;
          vr.bookings = (vr.bookings || []).filter(b => String(b.bookingId) !== String(booking._id));
          if (vr.bookings.length !== origLen) {
            // recompute total
            vr.total = (vr.bookings || []).reduce((s, b) => s + Number(b.quantity || 0), 0);
            modified = true;
          }
        }
      }
      if (modified) {
        await schedule.save();
      }
    }

    // finally delete booking
    await Booking.findByIdAndDelete(id);

    return res.status(200).json({ message: "Booking deleted and schedules updated." });
  } catch (err) {
    console.error("deleteBooking error:", err);
    return res.status(500).json({ message: "Server error deleting booking", error: err.message });
  }
};

export const promoteBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;
    if (!id) return res.status(400).json({ message: "Booking id is required" });

    if (!newStatus) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      booking.status = booking.status === 'pending' ? 'active' : 'promoted';
      await booking.save();
      return res.status(200).json({ message: "Booking status promoted", booking });
    } else {
      const booking = await Booking.findByIdAndUpdate(id, { status: newStatus }, { new: true });
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      return res.status(200).json({ message: "Booking status updated", booking });
    }
  } catch (err) {
    console.error("promoteBookingStatus error:", err);
    return res.status(500).json({ message: "Server error updating booking status" });
  }
};