// src/pages/SowingSchedulePage.jsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "../../lib/axios";

const formatRange = (start, end) => {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const opts = { day: "numeric", month: "short" };
    return `${s.toLocaleDateString("en-GB", opts)} — ${e.toLocaleDateString("en-GB", opts)}`;
  } catch {
    return `${start} - ${end}`;
  }
};

const formatDate = (dateVal) => {
  if (!dateVal) return "—";
  try {
    const d = new Date(dateVal);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return String(dateVal);
  }
};

const SowingSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedVarietyId, setSelectedVarietyId] = useState(null);
  const [completedQtyInput, setCompletedQtyInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({
    scheduleLabel: "",
    groupLabel: "",
    varietyLabel: "",
    bookings: [],
    totalQuantity: 0,
  });

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get("/schedules");
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        
        // --- FIX: Frontend Deduplication ---
        const uniqueSchedulesMap = new Map();
        data.forEach(sch => {
            if (sch._id) {
                 uniqueSchedulesMap.set(sch._id, sch); 
            }
        });
        const uniqueSchedules = Array.from(uniqueSchedulesMap.values());
        // --- END FIX ---

        // Filter to only live schedules
        const liveSchedules = uniqueSchedules.filter(sch => {
          const end = new Date(sch.endDate);
          return (!sch.status || sch.status !== "completed") && end >= new Date();
        });

        if (liveSchedules.length === 0) {
          setSchedules([]);
          setMessage("No live schedules available.");
        } else {
          setSchedules(liveSchedules);
          setSelectedScheduleId(null);
          setSelectedGroupId(null);
          setSelectedVarietyId(null);
        }
      } else {
        setSchedules([]);
        setMessage("No schedules data received.");
      }
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setSchedules([]);
      setMessage("Error loading schedules.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // FIX: Use robust ID access
  const currentSchedule = schedules.find(s => s._id === selectedScheduleId);
  const currentGroup = currentSchedule?.groups?.find(g => String(g.groupId || g.groupRef) === selectedGroupId) || null;
  const currentVariety = currentGroup?.varieties?.find(v => String(v.varietyId || v.varietyRef) === selectedVarietyId) || null;

  const currentTotal = currentVariety?.total || 0;
  const currentCompleted = currentVariety?.completed || 0;
  const remaining = Math.max(0, currentTotal - currentCompleted);
  const percent = currentTotal ? (currentCompleted / currentTotal) * 100 : 0;

  const handleScheduleChange = (e) => {
    const sid = e.target.value || null;
    setSelectedScheduleId(sid ? String(sid) : null);
    setSelectedGroupId(null);
    setSelectedVarietyId(null);
    setMessage("");
  };

  const handleGroupChange = (e) => {
    const gid = e.target.value || null;
    setSelectedGroupId(gid ? String(gid) : null);
    setSelectedVarietyId(null);
    setMessage("");
  };

  const handleVarietyChange = (e) => {
    setSelectedVarietyId(e.target.value);
    setMessage("");
  };


  const handleAddCompleted = async () => {
    const added = parseInt(completedQtyInput, 10);
    if (isNaN(added) || added <= 0) {
      setMessage("Please enter a valid positive quantity.");
      return;
    }
    if (!currentVariety) {
      setMessage("No variety selected.");
      return;
    }
    if (currentCompleted + added > currentTotal) {
      setMessage("Entered quantity exceeds total planned quantity.");
      return;
    }

    try {
      await axios.patch("/schedules/update", {
        action: "updateVarietyProgress",
        payload: {
          scheduleId: selectedScheduleId,
          groupId: selectedGroupId,
          varietyId: selectedVarietyId, 
          completed: currentCompleted + added,
        }
      });
      setCompletedQtyInput("");
      await fetchSchedules();
      setMessage(`Successfully updated +${added} quantities.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Failed to update schedule.");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  
  // RENDER LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center font-inter">
        <p className="text-xl font-semibold">Loading schedules...</p>
      </div>
    );
  }


  // RENDER MAIN COMPONENT
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-5 font-inter">
      <div className="flex justify-between items-center mb-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-700">
          Farmer Order Management
        </h1>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div id="taskCompletionPanel" className="bg-white p-5 rounded-xl shadow border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
            Task Completion Update
          </h2>

          {schedules.length === 0 ? (
            <p className="text-gray-600">No live schedules to display.</p>
          ) : (
            <div className="flex flex-wrap items-end gap-x-4 gap-y-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-gray-700 font-semibold mb-2">Select Schedule</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg text-base"
                  value={selectedScheduleId || ""}
                  onChange={handleScheduleChange}
                >
                  <option value="" disabled>
                    Select a schedule
                  </option>
                  {schedules.map(s => (
                    <option key={s._id} value={String(s._id)}>
                      {s.name ? s.name : formatRange(s.startDate, s.endDate)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-gray-700 font-semibold mb-2">Select Group</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg text-base"
                  value={selectedGroupId || ""}
                  onChange={handleGroupChange}
                  disabled={!currentSchedule}
                >
                  <option value="" disabled>
                    Select a group
                  </option>
                  {currentSchedule?.groups?.map(g => (
                    <option key={String(g.groupId || g.groupRef)} value={String(g.groupId || g.groupRef)}>
                      {g.groupName || g.groupId || g.groupRef}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-gray-700 font-semibold mb-2">Select Variety</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg text-base"
                  value={selectedVarietyId || ""}
                  onChange={handleVarietyChange}
                  disabled={!currentGroup}
                >
                  <option value="" disabled>
                    Select a variety
                  </option>
                  {currentGroup?.varieties?.map(v => (
                    <option key={String(v.varietyId || v.varietyRef)} value={String(v.varietyId || v.varietyRef)}>
                      {v.varietyName || v.varietyId || v.varietyRef}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentVariety && schedules.length > 0 && (
            <div className="task-progress mt-4 pt-4 border-t">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-grow min-w-[300px]">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Progress Details</h3>
                  <div className="w-full bg-gray-200 rounded-full h-5 mb-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full text-white text-xs font-bold flex items-center justify-end pr-2"
                      style={{ width: `${percent}%` }}
                    >
                      {percent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 font-bold">
                      Completed: {currentCompleted.toLocaleString("en-IN")} quantities
                    </span>
                    <span className="text-red-500 font-bold">
                      Remaining: {remaining.toLocaleString("en-IN")} quantities
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="p-3 border border-gray-300 rounded-lg text-base"
                    placeholder="Add completed quantity"
                    value={String(completedQtyInput)}
                    onChange={e => setCompletedQtyInput(e.target.value)}
                  />
                  <button
                    className="bg-green-500 text-white px-5 py-3 rounded-lg font-bold text-base"
                    onClick={handleAddCompleted}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-4 p-3 rounded-lg font-semibold ${
              message.toLowerCase().includes("error") ? "bg-red-500 text-white" : "bg-blue-500 text-white"
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Order Details Area */}
        {selectedScheduleId && (
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2 pb-2 border-b-2 border-gray-200">
              Order Details (by Schedule)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {schedules.map(schedule => {
                const periodHeader = schedule.name
                  ? `${schedule.name} (${formatRange(schedule.startDate, schedule.endDate)})`
                  : formatRange(schedule.startDate, schedule.endDate);

                const varietiesFlat = (schedule.groups || []).flatMap(g => g.varieties || []);

                const allCompleted = varietiesFlat.length > 0 && varietiesFlat.every(v => (v.completed || 0) >= (v.total || 0));
                const anyProgress = varietiesFlat.some(v => (v.completed || 0) > 0);

                let badgeClass = "bg-orange-400";
                let badgeText = "Pending";
                if (varietiesFlat.length === 0) {
                  badgeClass = "bg-gray-400";
                  badgeText = "No Tasks";
                } else if (allCompleted) {
                  badgeClass = "bg-green-500";
                  badgeText = "Completed";
                } else if (!anyProgress) {
                  badgeClass = "bg-red-500";
                  badgeText = "Not Started";
                }

                return (
                  <div
                    key={schedule._id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-200 ${
                      selectedScheduleId === schedule._id 
                        ? 'ring-2 ring-blue-500 flex flex-col' 
                        : 'hover:shadow-lg cursor-pointer'
                    }`}
                    style={{
                      height: selectedScheduleId === schedule._id ? '500px' : 'auto',
                      minHeight: selectedScheduleId === schedule._id ? '500px' : 'auto'
                    }}
                    onClick={() => setSelectedScheduleId(prev => prev === schedule._id ? null : schedule._id)}
                  >
                    <div className="bg-gray-100 text-gray-800 p-4 text-center font-bold flex justify-between items-center border-b cursor-pointer">
                      <span>{periodHeader}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${badgeClass}`}>
                        {badgeText}
                      </span>
                    </div>
                    <div className={`space-y-4 p-4 transition-all duration-200 ${
                      selectedScheduleId === schedule._id 
                        ? 'block flex-1 overflow-y-auto' 
                        : 'hidden'
                    }`} style={{ 
                      maxHeight: selectedScheduleId === schedule._id ? 'calc(100% - 60px)' : 'none'
                    }}>
                      {schedule.groups?.length === 0 && (
                        <div className="text-sm text-gray-600">No groups for this schedule.</div>
                      )}
                      {schedule.groups?.map(group => (
                        <div key={group.groupId || group.groupRef} className="mb-3">
                          <div className="text-sm font-semibold text-gray-700 mb-2">
                            Group: {group.groupName || group.groupId || group.groupRef}
                            {group.varieties && group.varieties.length > 0 && (
                              <span className="text-gray-500 font-normal">
                                {" ("}
                                {group.varieties.map(v => v.varietyName || v.varietyId || v.varietyRef).join(", ")}
                                {")"}
                              </span>
                            )}
                          </div>
                          {group.varieties?.map(variety => {
                            const percentLocal = variety.total
                              ? (variety.completed / variety.total) * 100
                              : 0;
                            return (
                              <div
                                key={variety.varietyId || variety.varietyRef}
                                className="mb-4 border rounded-lg p-3 bg-gray-50"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold">
                                    {variety.varietyName || String(variety.varietyId || variety.varietyRef)}
                                  </span>
                                  <span className="text-gray-600 font-bold">
                                    {(variety.total || 0).toLocaleString("en-IN")} Quantities
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-1 overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${percentLocal}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs mb-3">
                                  <span className="text-green-600">
                                    Completed: {(variety.completed || 0).toLocaleString("en-IN")}
                                  </span>
                                  <span className="text-red-500">
                                    Remaining: {((variety.total || 0) - (variety.completed || 0)).toLocaleString("en-IN")}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm flex-1"
                                    onClick={() => {
                                      setSelectedScheduleId(schedule._id);
                                      setSelectedGroupId(String(group.groupId || group.groupRef));
                                      setSelectedVarietyId(String(variety.varietyId || variety.varietyRef));
                                      const panel = document.getElementById("taskCompletionPanel");
                                      if (panel) {
                                        panel.scrollIntoView({ behavior: "smooth", block: "start" });
                                      }
                                    }}
                                  >
                                    Select
                                  </button>
                                  <button
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex-1"
                                    onClick={async () => {
                                      // Build labels
                                      const scheduleLabel = schedule.name
                                        ? `${schedule.name} (${formatRange(schedule.startDate, schedule.endDate)})`
                                        : formatRange(schedule.startDate, schedule.endDate);
                                      const groupLabel = group.groupName || group.groupId || group.groupRef;
                                      const varietyLabel = variety.varietyName || String(variety.varietyId || variety.varietyRef);

                                      // Attempt to use embedded bookings if present; otherwise fetch from API
                                      let bookings = Array.isArray(variety.bookings) ? variety.bookings : [];
                                      if (!bookings || bookings.length === 0) {
                                        try {
                                          const res = await axios.get("/schedules/bookings", {
                                            params: {
                                              scheduleId: schedule._id,
                                              groupId: String(group.groupId || group.groupRef), 
                                              varietyId: String(variety.varietyId || variety.varietyRef),
                                            },
                                          });
                                          if (Array.isArray(res.data)) bookings = res.data;
                                        } catch (err) {
                                          console.error("Failed to fetch bookings:", err);
                                        }
                                      }

                                      const totalQuantity = bookings.reduce((sum, b) => sum + (b.quantity || 0), 0);

                                      setModalDetails({
                                        scheduleLabel,
                                        groupLabel,
                                        varietyLabel,
                                        bookings,
                                        totalQuantity,
                                      });
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    See Farmers
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* MODAL JSX */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                Farmer Details
              </h2>
              <p className="mb-4 font-bold text-gray-700">
                {modalDetails.scheduleLabel} — {modalDetails.groupLabel} — {modalDetails.varietyLabel}
              </p>
              <div className="space-y-3">
                {modalDetails.bookings.length === 0 ? (
                  <div className="text-sm text-gray-600">No bookings found for this variety.</div>
                ) : (
                  modalDetails.bookings.map((b, i) => (
                    <div
                      key={b.bookingId || b._id || i}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold">
                          {b.farmerName || b.farmerId || `Farmer ${i + 1}`}
                        </div>
                        <div className="text-xs text-gray-600">
                          Booking: {b.bookingId || "—"} • Date: {formatDate(b.date || b.bookingDate || b.createdAt)}
                        </div>
                        <div className="text-xs text-gray-600">
                          Reg No: {b.farmerRegistrationNo || 'N/A'}
                        </div>
                      </div>
                      <div className="text-green-700 font-bold">
                        {(b.quantity || 0).toLocaleString("en-IN")} quantity
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="bg-gray-100 border-t-2 text-gray-800 p-4 rounded-b-lg mt-6 flex justify-between font-bold text-lg">
                <span>Total Quantity</span>
                <span>{(modalDetails.totalQuantity || 0).toLocaleString("en-IN")} quantity</span>
              </div>
            </div>
          </div>

        )}
        </div>
    </div> // Closing the main div (Level 0)
  ); // Closing the return statement
}; // Closing the component function

export default SowingSchedulePage;