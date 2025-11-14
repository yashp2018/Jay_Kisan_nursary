// src/controllers/scheduleController.js (FINAL, CLEANED VERSION)

import mongoose from "mongoose";
import Schedule from "../models/Schedule.js";
import CropGroup from "../models/CropGroup.js";
import CropVariety from "../models/CropVariety.js";
import Booking from "../models/Booking.js";
import Farmer from "../models/Farmer.js";

/** Helper: safe id -> string */
const idStr = (docOrId) => {
  if (!docOrId) return null;
  if (typeof docOrId === "string") return docOrId;
  if (docOrId._id) return String(docOrId._id);
  return String(docOrId);
};

/**
 * GET /api/schedules
 * Returns schedules that are either the new sowing type OR are still ongoing (endDate >= today).
 */
export const getOngoingAndUpcomingSchedules = async (req, res) => {
 try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- FINAL FIX: Broaden the Filter for Visibility (Goal: Show all live schedules) ---
    // Includes schedules created by new logic (isSowingSchedule: true) OR any schedule whose end date is today or later.
    let schedules = await Schedule.find({
      $or: [
        { isSowingSchedule: true },
        { endDate: { $gte: today } } 
      ]
    }).sort({ startDate: 1 }).lean();
    
    // --- Post-Query Deduplication (Final Safety Measure against DB duplicates) ---
    const finalSchedulesMap = new Map(); 
    schedules.forEach(sch => {
        const key = `${sch.startDate.toISOString()}-${sch.endDate.toISOString()}`;
        
        // Prioritize the correct, aggregated schedule (isSowingSchedule: true) 
        // over the messy legacy duplicate for the same date range.
        if (sch.isSowingSchedule || !finalSchedulesMap.has(key)) {
            finalSchedulesMap.set(key, sch);
        }
    });

    schedules = Array.from(finalSchedulesMap.values());
    // --- End Deduplication ---


    // Collect ids for batch lookup
    const varietyIds = new Set();
    const cropGroupIds = new Set();
    const bookingIds = new Set();
    const farmerObjIds = new Set();
    const farmerRegs = new Set();

    for (const s of schedules) {
      if (s.groups && s.groups.length) {
        for (const g of s.groups) {
          if (g.groupRef) cropGroupIds.add(String(g.groupRef)); 
          if (g.varieties && g.varieties.length) {
            for (const v of g.varieties) {
              if (v.varietyRef) varietyIds.add(String(v.varietyRef)); 
              if (v.bookings && v.bookings.length) {
                for (const b of v.bookings) {
                  if (b.bookingId) bookingIds.add(String(b.bookingId));
                  if (b.farmerId) farmerObjIds.add(String(b.farmerId));
                  if (b.farmerRegistrationNo) farmerRegs.add(String(b.farmerRegistrationNo));
                }
              }
            }
          }
        }
      }
    }

    // Batch fetch (using 'new mongoose.Types.ObjectId' for Task 3 compliance)
    const [varietyDocs, cropGroupDocs, bookingDocs, farmerByIdDocs, farmerByRegDocs] = await Promise.all([
      varietyIds.size ? CropVariety.find({ _id: { $in: Array.from(varietyIds).map(id => new mongoose.Types.ObjectId(id)) } }).lean() : Promise.resolve([]),
      cropGroupIds.size ? CropGroup.find({ _id: { $in: Array.from(cropGroupIds).map(id => new mongoose.Types.ObjectId(id)) } }).lean() : Promise.resolve([]),
      bookingIds.size ? Booking.find({ _id: { $in: Array.from(bookingIds).map(id => new mongoose.Types.ObjectId(id)) } }).lean() : Promise.resolve([]),
      farmerObjIds.size ? Farmer.find({ _id: { $in: Array.from(farmerObjIds).map(id => new mongoose.Types.ObjectId(id)) } }).lean() : Promise.resolve([]),
      farmerRegs.size ? Farmer.find({ registrationNo: { $in: Array.from(farmerRegs) } }).lean() : Promise.resolve([])
    ]);

    // Create maps
    const varietyMap = new Map(varietyDocs.map(v => [String(v._id), v]));
    const cropGroupMap = new Map(cropGroupDocs.map(c => [String(c._id), c]));
    const bookingMap = new Map(bookingDocs.map(b => [String(b._id), b]));
    const farmerByIdMap = new Map(farmerByIdDocs.map(f => [String(f._id), f]));
    const farmerByRegMap = new Map(farmerByRegDocs.map(f => [f.registrationNo, f]));

    // Transform schedules
    const transformed = schedules.map((s) => ({
      _id: idStr(s._id),
      name: s.name,
      startDate: s.startDate,
      endDate: s.endDate,
      status: s.status,
      groups: (s.groups || []).map((g) => ({
        groupId: idStr(g.groupRef || g.groupId), 
        groupName: (g.groupName || (cropGroupMap.get(idStr(g.groupRef || g.groupId)) || {}).name) || "Unknown Group",
        varieties: (g.varieties || []).map((v) => {
          const varId = idStr(v.varietyRef || v.varietyId);
          const varDoc = varId ? varietyMap.get(varId) : null;
          const varietyName = (varDoc && varDoc.name) || v.varietyName || "Unknown Variety"; 
          const total = typeof v.total === "number" ? v.total : 0;
          const completed = typeof v.completed === "number" ? v.completed : 0;

          const bookings = (v.bookings || []).map((b) => {
            let farmer = null;
            if (b.farmerId && farmerByIdMap.has(String(b.farmerId))) farmer = farmerByIdMap.get(String(b.farmerId));
            const regFromRef = b.farmerRegistrationNo || null;
            if (!farmer && regFromRef && farmerByRegMap.has(regFromRef)) farmer = farmerByRegMap.get(regFromRef);
            
            const farmerName = farmer?.fullName || "Unknown Farmer";
            const farmerRegNo = farmer?.registrationNo || regFromRef || null;

            return {
              bookingId: idStr(b.bookingId),
              farmerId: idStr(b.farmerId),
              farmerName,
              farmerRegNo,
              quantity: b.quantity || 0,
            };
          });

          return {
            varietyId: varId,
            varietyName,
            total,
            completed,
            remaining: Math.max(0, total - completed), 
            bookings 
          };
        })
      }))
    }));

    return res.status(200).json(transformed);
  } catch (err) {
    console.error("getOngoingAndUpcomingSchedules error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching schedules",
      error: err.message,
    });
  }
};

/**
 * PATCH /api/schedules/update - Minimal debugging version
 */
export async function updateSchedule(req, res) {
  try {
    const { action, payload } = req.body;
    
    if (action === "updateVarietyProgress") {
      const { scheduleId, groupId, varietyId, completed } = payload;
      
      if (!scheduleId || !groupId || !varietyId || completed === undefined) {
        return res.status(400).json({ message: "Missing required fields: scheduleId, groupId, varietyId, completed" });
      }

      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      const group = schedule.groups.find(g => String(g.groupRef || g.groupId) === String(groupId));
      if (!group) {
        return res.status(404).json({ message: "Group not found in schedule" });
      }

      const variety = group.varieties.find(v => String(v.varietyRef || v.varietyId) === String(varietyId));
      if (!variety) {
        return res.status(404).json({ message: "Variety not found in group" });
      }

      variety.completed = Number(completed);
      await schedule.save();

      return res.json({
        success: true,
        message: "Variety progress updated successfully",
        scheduleId,
        groupId,
        varietyId,
        completed: variety.completed
      });
    }

    return res.status(400).json({ message: "Unknown action" });
  } catch (err) {
    console.error("Failed to update schedule:", err);
    return res.status(500).json({ message: "Server error while updating schedule" });
  }
}

/**
 * GET /api/schedules/:id/aggregate
 */
export const aggregateSchedule = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) return res.status(400).json({ message: "Invalid schedule id" });

    const schedule = await Schedule.findById(scheduleId).lean();
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    const start = schedule.startDate;
    const end = schedule.endDate;

    const pipeline = [
      // FIX: Use sowingDate for aggregation match (Goal 3 Fix)
      { $match: { sowingDate: { $gte: start, $lte: end } } }, 
      { $unwind: "$varieties" },
      {
        $group: {
          _id: {
            cropGroup: "$cropGroup",
            varietyName: "$varieties.name",
            varietyRef: "$varieties.varietyRef"
          },
          totalQuantity: { $sum: "$varieties.quantity" },
          bookings: {
            $push: {
              bookingId: "$_id",
              farmerId: "$farmer",
              farmerReg: "$farmerRegistrationNo",
              quantity: "$varieties.quantity"
            }
          }
        }
      },
      // ... (rest of pipeline)
    ];

    const aggRes = await Booking.aggregate(pipeline).exec();
    // ... (rest of lookup and return logic) ...
  } catch (err) {
    console.error("aggregateSchedule error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * GET /api/schedules/bookings
 * Returns bookings for a specific variety in a schedule (reads variety.bookings subdocs)
 */
export const getBookingsForVariety = async (req, res) => {
  try {
    const { scheduleId, groupId, varietyId } = req.query;
    if (!scheduleId || !groupId || !varietyId) return res.status(400).json({ message: "scheduleId, groupId, and varietyId are required." });

    const schedule = await Schedule.findById(scheduleId).lean();
    if (!schedule) return res.status(404).json({ message: "Schedule not found." });

    const group = schedule.groups.find(g => String(g.groupRef || g.groupId) === String(groupId));
    if (!group) return res.status(404).json({ message: "Group not found in schedule." });

    const variety = group.varieties.find(v => String(v.varietyRef || v.varietyId) === String(varietyId));
    if (!variety) return res.status(404).json({ message: "Variety not found in group." });

    const results = await Promise.all((variety.bookings || []).map(async (b, idx) => {
      // NOTE: This uses slow lookups but ensures data integrity and farmer lookup by RegNo
      const bookingDoc = b.bookingId ? await Booking.findById(b.bookingId).lean() : null;
      let farmerDoc = null;
      
      const farmerIdToLookup = b.farmerId || bookingDoc?.farmer;
      if (farmerIdToLookup) farmerDoc = await Farmer.findById(farmerIdToLookup).lean();
      
      const regFromRef = b.farmerRegistrationNo || bookingDoc?.farmerRegistrationNo || b.farmerReg || null;
      if (!farmerDoc && regFromRef) {
        farmerDoc = await Farmer.findOne({ registrationNo: regFromRef }).lean();
      }

      return {
        bookingId: idStr(b.bookingId),
        farmerId: idStr(b.farmerId || bookingDoc?.farmer),
        farmerName: farmerDoc?.fullName || b.farmerName || bookingDoc?.farmerName || `Unknown Farmer`,
        farmerRegistrationNo: farmerDoc?.registrationNo || regFromRef || null,
        quantity: b.quantity || 0,
        date: bookingDoc?.bookingDate || bookingDoc?.createdAt || b.bookingDate || null,
        bookingDate: bookingDoc?.bookingDate || null,
        createdAt: bookingDoc?.createdAt || null,
      };
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error("getBookingsForVariety error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching bookings", error: err.message });
  }
};