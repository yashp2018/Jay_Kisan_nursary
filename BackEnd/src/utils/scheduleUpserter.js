// BackEnd/src/utils/scheduleUpserter.js (FINAL, ROBUST VERSION)

import mongoose from 'mongoose';
import Schedule from '../models/Schedule.js';
import Booking from '../models/Booking.js';
import { addDays, startOfDay, endOfDay } from 'date-fns';

const WINDOW_DAYS = 5;

// Helper for safety and Task 3 compliance
const safeObjectId = (id) => (id && mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null);

/**
 * Ensures schedules exist for all sowingDate ranges and updates booking aggregates across the entire range.
 */
export async function backfillAndAggregateSchedules() {
    console.log("[Schedule Upsert] Starting backfill and aggregation based on sowingDate...");

    // 1. Determine min/max sowing dates from all valid bookings
    const [minMaxDates] = await Booking.aggregate([
        { $match: { sowingDate: { $exists: true, $ne: null } } },
        {
            $group: {
                _id: null,
                minDate: { $min: '$sowingDate' },
                maxDate: { $max: '$sowingDate' },
            },
        },
    ]);

    if (!minMaxDates || !minMaxDates.minDate) {
        console.log("[Schedule Upsert] No bookings with sowing dates found. Exiting.");
        return [];
    }

    let currentDate = startOfDay(minMaxDates.minDate);
    const maxDate = endOfDay(minMaxDates.maxDate);
    const createdOrUpdatedSchedules = [];

    // 2. Iterate and create/update 5-day schedule windows
    while (currentDate <= maxDate) {
        const startDate = startOfDay(currentDate);
        const endDate = endOfDay(addDays(startDate, WINDOW_DAYS - 1));

        // Find or Create Schedule for the window
        let schedule = await Schedule.findOneAndUpdate(
            {
                startDate: startDate,
                endDate: endDate,
            },
            {
                $setOnInsert: {
                    // --- FIX APPLIED: Changed name to remove "Sowing Window" ---
                    name: `Schedule Sowing: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 
                    
                    startDate: startDate,
                    endDate: endDate,
                    isSowingSchedule: true, // Keep this flag
                },
            },
            { upsert: true, new: true, runValidators: false }
        );

        // 3. Batch Query Bookings for the window (using sowingDate)
        const bookingsInWindow = await Booking.find({
            sowingDate: { $gte: startDate, $lte: endDate },
            varieties: { $exists: true, $ne: [] }
        }).select('_id varieties farmer farmerRegistrationNo'); 

        // 4. Aggregate quantities and booking references
        const aggregatedGroups = {};

        bookingsInWindow.forEach(booking => {
            (booking.varieties || []).forEach(v => {
                const varietyKey = v.varietyRef ? String(v.varietyRef) : v.varietyName;
                if (!varietyKey || !v.cropGroup) return;

                const groupId = String(v.cropGroup);
                if (!aggregatedGroups[groupId]) {
                    aggregatedGroups[groupId] = {
                        groupRef: v.cropGroup,
                        groupName: v.cropGroupName,
                        varieties: {},
                    };
                }

                if (!aggregatedGroups[groupId].varieties[varietyKey]) {
                    aggregatedGroups[groupId].varieties[varietyKey] = {
                        varietyRef: v.varietyRef,
                        varietyName: v.varietyName,
                        total: 0,
                        completed: 0,
                        bookings: [],
                    };
                }

                const varietyAgg = aggregatedGroups[groupId].varieties[varietyKey];
                varietyAgg.total += v.quantity;
                
                varietyAgg.bookings.push({
                    bookingId: booking._id,
                    farmerId: booking.farmer,
                    farmerRegistrationNo: booking.farmerRegistrationNo,
                    quantity: v.quantity,
                });
            });
        });

        // 5. Update Schedule in DB
        const newGroups = Object.values(aggregatedGroups).map(g => ({
            groupRef: safeObjectId(g.groupRef),
            groupName: g.groupName,
            varieties: Object.values(g.varieties).map(v => ({
                varietyRef: safeObjectId(v.varietyRef),
                varietyName: v.varietyName,
                total: v.total,
                // --- FIX: Strengthened Group and Variety Matching for `completed` ---
                completed: schedule.groups.find(sg => 
                             // Check sg.groupRef OR sg.groupId against the current groupRef (g.groupRef)
                             String(sg.groupRef || sg.groupId) === String(g.groupRef)
                         )
                         ?.varieties.find(sv => 
                             // Check sv.varietyRef OR sv.varietyId against the current varietyRef (v.varietyRef)
                             (sv.varietyRef && String(sv.varietyRef) === String(v.varietyRef)) || 
                             (sv.varietyId && String(sv.varietyId) === String(v.varietyRef)) || 
                             sv.varietyName === v.varietyName
                         )
                         ?.completed || v.completed,
                // --- END FIX ---
                bookings: v.bookings,
            }))
        }));

        if (newGroups.length > 0 || schedule.groups.length > 0) {
             schedule.groups = newGroups.filter(g => g.varieties.length > 0);
             await schedule.save();
        }

        createdOrUpdatedSchedules.push(schedule);
        currentDate = startOfDay(addDays(endDate, 1));
    }

    console.log(`[Schedule Upsert] Backfill complete. Total schedules processed: ${createdOrUpdatedSchedules.length}`);
    return createdOrUpdatedSchedules;
}

/**
 * Task 7 implementation: Called from bookingController.
 * Triggers the full schedule aggregation to ensure data consistency.
 */
export async function upsertScheduleFromBooking(booking) {
    if (!booking.sowingDate) {
        console.warn(`[Schedule Upsert] Booking ${booking._id} has no sowingDate. Skipping schedule update.`);
        return;
    }
    
    // Rerun global aggregation to ensure the schedule window exists and totals are accurate.
    await backfillAndAggregateSchedules();
}