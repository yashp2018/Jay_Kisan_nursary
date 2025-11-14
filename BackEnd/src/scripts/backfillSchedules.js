
// src/scripts/backfillSchedules.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import Booking from "../models/Booking.js";
import Schedule from "../models/Schedule.js";
import CropGroup from "../models/CropGroup.js";
import CropVariety from "../models/CropVariety.js";
import Farmer from "../models/Farmer.js";

dotenv.config();

async function generateSowingSchedules() {
  try {
    await connectDB();
    console.log("Connected to DB");

    const bookings = await Booking.find({}).lean();
    console.log(`Found ${bookings.length} bookings`);

    let schedulesCreated = 0;
    let schedulesUpdated = 0;

    for (const bk of bookings) {
      // pick primary date: use sowingDate for schedule creation
      const baseDate = bk.sowingDate || bk.bookingDate || bk.createdAt;
      if (!baseDate) continue;
      const d = new Date(baseDate);
      if (isNaN(d.getTime())) continue;

      // compute slot start (5-day windows aligned to each month)
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();
      const slotStartDay = Math.floor((day - 1) / 5) * 5 + 1;
      const startDate = new Date(year, month, slotStartDay, 0, 0, 0, 0);
      const endDate = new Date(year, month, slotStartDay + 4, 23, 59, 59, 999);

      // find or create schedule for that slot
      let schedule = await Schedule.findOne({ startDate, endDate });
      let isNew = false;
      
      if (!schedule) {
        schedule = new Schedule({
          name: `Schedule Sowing: ${startDate.toLocaleDateString("en-GB")} - ${endDate.toLocaleDateString("en-GB")}`,
          startDate,
          endDate,
          status: "pending",
          isSowingSchedule: true,
          groups: []
        });
        isNew = true;
        schedulesCreated++;
      } else {
        schedulesUpdated++;
      }

      // normalize cropGroup id: if string name, ensure CropGroup exists and get its _id
      let cropGroupId = bk.cropGroup || null;
      if (cropGroupId && typeof cropGroupId === "string" && !mongoose.Types.ObjectId.isValid(cropGroupId)) {
        let cg = await CropGroup.findOne({ name: cropGroupId }).lean();
        if (!cg) {
          cg = await new CropGroup({ name: cropGroupId }).save();
        }
        cropGroupId = String(cg._id);
      } else if (cropGroupId) {
        cropGroupId = String(cropGroupId);
      }

      // find or create group inside schedule
      if (!Array.isArray(schedule.groups)) schedule.groups = [];
      let group = schedule.groups.find(g => String(g.groupId) === String(cropGroupId));
      if (!group) {
        const cgDoc = cropGroupId ? await CropGroup.findById(cropGroupId).lean() : null;
        group = {
          groupId: cropGroupId || null,
          groupName: cgDoc?.name || "Unknown Group",
          groupRef: cropGroupId || null,
          varieties: []
        };
        schedule.groups.push(group);
      }

      // find farmer registration no (prefer booking field, else lookup)
      let farmerReg = bk.farmerRegistrationNo || null;
      if (!farmerReg && bk.farmer) {
        const fd = await Farmer.findById(bk.farmer).lean();
        farmerReg = fd?.registrationNo || null;
      }

      // iterate booking varieties
      for (const vb of bk.varieties || []) {
        const vName = vb.name || vb.varietyName || vb.variety || "Unknown Variety";
        let varietyRef = vb.varietyRef || vb.varietyId || null;

        // ensure CropVariety exists if matching by name
        if (!varietyRef) {
          let cv = await CropVariety.findOne({ name: vName, group: cropGroupId }).lean();
          if (!cv) {
            cv = await new CropVariety({ name: vName, group: cropGroupId }).save();
          }
          varietyRef = String(cv._id);
        } else if (mongoose.Types.ObjectId.isValid(String(varietyRef))) {
          varietyRef = String(varietyRef);
        }

        // find or create variety entry in schedule group
        if (!Array.isArray(group.varieties)) group.varieties = [];
        let variety = group.varieties.find(vv => String(vv.varietyId) === String(varietyRef));
        if (!variety) {
          variety = {
            varietyId: varietyRef,
            varietyName: vName,
            varietyRef: varietyRef,
            bookings: [],
            total: 0,
            completed: 0
          };
          group.varieties.push(variety);
        }

        // avoid duplicate booking entry
        const exists = variety.bookings.find(bkref => String(bkref.bookingId) === String(bk._id));
        if (!exists) {
          variety.bookings.push({
            bookingId: bk._id,
            farmerId: bk.farmer ? String(bk.farmer) : null,
            farmerRegistrationNo: bk.farmerRegistrationNo || farmerReg || null,
            quantity: Number(vb.quantity || 0),
            createdAt: bk.createdAt || new Date()
          });
        } else {
          // update qty/reg if changed
          let changed = false;
          if ((exists.quantity || 0) !== (Number(vb.quantity || 0))) {
            exists.quantity = Number(vb.quantity || 0);
            changed = true;
          }
          if (!exists.farmerRegistrationNo && (bk.farmerRegistrationNo || farmerReg)) {
            exists.farmerRegistrationNo = bk.farmerRegistrationNo || farmerReg;
            changed = true;
          }
          if (changed) {
            // nothing extra
          }
        }

        // recompute total
        variety.total = (variety.bookings || []).reduce((s, r) => s + (Number(r.quantity) || 0), 0);
      }

      await schedule.save();
    }

    console.log(`Backfill completed: ${schedulesCreated} schedules created, ${schedulesUpdated} schedules updated`);
    return { 
      success: true, 
      message: `Sowing schedules generated successfully: ${schedulesCreated} created, ${schedulesUpdated} updated`,
      schedulesCreated,
      schedulesUpdated,
      totalBookings: bookings.length
    };
  } catch (error) {
    console.error("Backfill error:", error);
    throw error;
  }
}

// Export the function
export default generateSowingSchedules;

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSowingSchedules()
    .then(result => {
      console.log(result.message);
      process.exit(0);
    })
    .catch(err => {
      console.error("Error:", err);
      process.exit(1);
    });
}
