/*
File: src/pages/LaborPage.jsx
Description: Labour management page with tabs, search, pagination,
attendance summary, driver KM payment, and mini calendar per labour.
*/

import React, { useState, useEffect, useMemo } from "react";
import axios from "../../lib/axios";
import LaborModal from "./LaborModel";
import LaborForm from "./LaborForm";
import AttendanceSection from "./AttendanceSection";

const defaultData = [
  {
    _id: "L001",
    fullName: "John Doe",
    type: "regular",
    contactNumber: "9876543210",
    address: "Pune",
    salary: 20000,
    status: "active",
    joiningDate: "2024-07-01",
  },
  {
    _id: "L002",
    fullName: "Jane Smith",
    type: "wages",
    contactNumber: "9123456789",
    address: "Mumbai",
    dailyWages: 500,
    status: "inactive",
    joiningDate: "2024-06-15",
  },
];

const defaultForm = {
  fullName: "",
  contactNumber: "",
  address: "",
  salary: "",
  dailyWages: "",
  startKm: "",
  endKm: "",
  status: "active",
  joiningDate: "",
};

// helper: last 12 months options
const getMonthOptions = (count = 12) => {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const label = d.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    opts.push({ value, label });
  }
  return opts;
};

export default function LaborPage() {
  const [labors, setLabors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formType, setFormType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Attendance section (summary)
  const months = getMonthOptions(12);
  const [selectedMonth, setSelectedMonth] = useState(months[0].value);
  const [attendance, setAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [payingId, setPayingId] = useState(null);

  // Attendance tabs (All / Regular / Wages / Driver)
  const [attendanceTab, setAttendanceTab] = useState("All");

  // Per-row attendance dropdown state for main table
  // value: "" | "present" | "absent" | "half-day" | "other"
  const [rowAttendance, setRowAttendance] = useState({});

  // --- calendar helpers for current month ---
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();
  const currentMonthKey = `${todayYear}-${String(todayMonth).padStart(2, "0")}`;

  const isSelectedCurrentMonth = selectedMonth === currentMonthKey;

  // array: [1..daysInSelectedMonth]
  const daysInMonthArray = useMemo(() => {
    const [yearStr, monthStr] = String(selectedMonth).split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (!year || !month) return [];
    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [selectedMonth]);

  useEffect(() => {
    fetchLabors();
  }, [activeTab]);

  useEffect(() => {
    if (attendanceTab !== "All" && labors.length === 0) return;
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, attendanceTab, labors]);

  const fetchLabors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/labors");
      let data = Array.isArray(res.data.data) ? res.data.data : [];

      if (activeTab !== "All") {
        data = data.filter((l) => l.type === activeTab.toLowerCase());
      }

      setLabors(data);
    } catch (err) {
      console.error("fetchLabors error:", err?.response || err);
      const fallback =
        activeTab === "All"
          ? defaultData
          : defaultData.filter((l) => l.type === activeTab.toLowerCase());
      setLabors(fallback);
    }
    setLoading(false);
    setCurrentPage(1);
  };

  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const typeParam =
        attendanceTab !== "All" ? `&type=${attendanceTab.toLowerCase()}` : "";
      const res = await axios.get(
        `/attendance/attendance?month=${selectedMonth}${typeParam}`
      );

      let data = Array.isArray(res.data.data) ? res.data.data : [];

      // normalize id field
      data = data.map((d) => {
        const id =
          d.labourId ||
          d.laborId ||
          d.labour ||
          d.labor ||
          (d.labor && String(d.labor));
        return { ...d, labourId: id ? String(id) : undefined };
      });

      if (attendanceTab !== "All") {
        const refLabors = labors && labors.length ? labors : defaultData;

        if (
          data.length > 0 &&
          data.every((d) => typeof d.type !== "undefined")
        ) {
          data = data.filter(
            (d) => (d.type || "").toLowerCase() === attendanceTab.toLowerCase()
          );
        } else {
          const idToType = {};
          refLabors.forEach((l) => {
            const key = String(l._id || l.labourId || l.id);
            idToType[key] = (l.type || "").toLowerCase();
          });

          data = data.filter(
            (d) => idToType[String(d.labourId)] === attendanceTab.toLowerCase()
          );
        }
      }

      const normalized = data.map((r) => ({
        ...r,
        status: String(r.status || "pending"),
      }));

      setAttendance(normalized);
    } catch (err) {
      console.error("fetchAttendance error:", err?.response || err);

      const fallback = [
        {
          labourId: "L001",
          name: "John Doe",
          present: 18,
          absent: 0,
          totalDays: 20,
          paymentDue: 7000,
          status: "pending",
        },
        {
          labourId: "L002",
          name: "Jane Smith",
          present: 15,
          absent: 2,
          totalDays: 20,
          paymentDue: 6500,
          status: "paid",
        },
      ];

      if (attendanceTab !== "All") {
        const refLabors = labors && labors.length ? labors : defaultData;
        const idsOfType = new Set(
          refLabors
            .filter((l) => l.type === attendanceTab.toLowerCase())
            .map((l) => String(l._id))
        );
        setAttendance(
          fallback.filter((f) => idsOfType.has(String(f.labourId)))
        );
      } else {
        setAttendance(fallback);
      }
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/labors/${id}`);
        fetchLabors();
      } catch (err) {
        console.error("delete labour error:", err?.response || err);
        alert("Failed to delete. Check console for details.");
      }
    }
  };

  const handleEdit = (labor) => {
    setFormData({
      fullName: labor.fullName,
      contactNumber: labor.contactNumber,
      address: labor.address,
      salary: labor.salary || "",
      dailyWages: labor.dailyWages || "",
      startKm: labor.startKm || "",
      endKm: labor.endKm || "",
      status: labor.status || "active",
      joiningDate: labor.joiningDate?.slice(0, 10),
    });

    setFormType(labor.type);
    setIsEditing(true);
    setEditingId(labor._id);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, type: formType };
    try {
      if (isEditing) {
        await axios.put(`/labors/${editingId}`, payload);
      } else {
        await axios.post("/labors", payload);
      }
      fetchLabors();
      onCloseModal();
    } catch (err) {
      console.error("save labour error:", err?.response || err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save labour. Check console for details.";
      alert(msg);
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
    setFormData(defaultForm);
    setFormType(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "active") return "bg-green-500";
    if (s === "inactive") return "bg-red-500";
    return "bg-gray-400";
  };

  // Search filtering
  const filteredLabors = labors.filter((l) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      l.fullName.toLowerCase().includes(q) ||
      l.contactNumber.toLowerCase().includes(q) ||
      (l.address || "").toLowerCase().includes(q)
    );
  });

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLabors = filteredLabors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLabors.length / rowsPerPage);

  const handlePayNow = async (labourId) => {
    if (!window.confirm("Mark this payment as PAID?")) return;
    setPayingId(labourId);
    const prev = [...attendance];

    setAttendance((a) =>
      a.map((r) => (r.labourId === labourId ? { ...r, status: "paid" } : r))
    );

    try {
      await axios.post(`/attendance/pay-salary`, {
        laborId: labourId,
        month: selectedMonth,
      });
      await fetchAttendance();
    } catch (err) {
      console.error("pay error:", err?.response || err);
      setAttendance(prev);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Could not mark as paid. Try again.";
      alert(msg);
    } finally {
      setPayingId(null);
    }
  };

  const formatStatusForDisplay = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "paid" || s === "completed") return "Paid";
    return "Pending";
  };

  const isPaid = (status) => {
    const s = (status || "").toLowerCase();
    return s === "paid" || s === "completed";
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Labour Management</h1>

        <button
          onClick={() => {
            setShowModal(true);
            setFormType(null);
            setIsEditing(false);
            setFormData(defaultForm);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Labour
        </button>
      </div>

      <AttendanceSection />

      <div className="bg-white shadow rounded-lg p-6">
        {/* Top labour tabs: All / Regular / Wages / Driver */}
        <div className="mb-4 flex gap-3 ">
          {["All", "Regular", "Wages", "Driver"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearch("");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            Show
            <select
              className="border mx-2 p-1 rounded"
              value={String(rowsPerPage)}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={String(num)}>
                  {num}
                </option>
              ))}
            </select>
            entries
          </div>

          <input
            type="text"
            placeholder="Search labors..."
            value={String(search)}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">SR</th>
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Mobile</th>
                <th className="p-2">Amount</th>
                <th className="p-2">
                  Attendance
                  <span className="block text-[11px] text-gray-500">
                    (Today &amp; month)
                  </span>
                </th>
                <th className="p-2">Paid Now</th>
                <th className="p-2">Driver</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLabors.length > 0 ? (
                currentLabors.map((l, idx) => {
                  const sr = indexOfFirst + idx + 1;

                  // default "" -> "Select Option"
                  const dropdownValue =
                    rowAttendance[l._id] ?? "";

                  return (
                    <tr key={l._id}>
                      <td className="p-2">{sr}</td>
                      <td className="p-2">{l.fullName}</td>
                      <td className="p-2 capitalize">{l.type}</td>
                      <td className="p-2">{l.contactNumber}</td>

                      {/* Amount column */}
                      <td className="p-2">
                        {l.type === "regular"
                          ? `₹${l.salary || "—"}`
                          : `₹${l.dailyWages || "—"}/day`}
                      </td>

                      {/* Attendance: dropdown + mini calendar for month */}
                      <td className="p-2 align-top">
                        {(() => {
                          const isCalendarType =
                            l.type === "regular" || l.type === "wages";

                          const status = dropdownValue;

                          let highlightClass =
                            "bg-gray-200 text-gray-800 border-gray-300";
                          if (status === "present")
                            highlightClass =
                              "bg-green-500 text-white border-green-500";
                          else if (status === "absent")
                            highlightClass =
                              "bg-red-500 text-white border-red-500";
                          else if (status === "half-day")
                            highlightClass =
                              "bg-orange-400 text-white border-orange-400";

                          return (
                            <div className="flex flex-col gap-2">
                              {/* Dropdown */}
                              <select
                                value={status}
                                onChange={async (e) => {
                                  const val = e.target.value;

                                  // if user clicks placeholder, do nothing
                                  if (!val) return;

                                  const previousValue =
                                    rowAttendance[l._id] ?? "";

                                  // 1) Update UI immediately
                                  setRowAttendance((prev) => ({
                                    ...prev,
                                    [l._id]: val,
                                  }));

                                  // 2) Build payload for backend
                                  const todayStr = new Date()
                                    .toISOString()
                                    .slice(0, 10); // YYYY-MM-DD

                                  try {
                                    await axios.post("/attendance/mark", {
                                      labourId: l._id,
                                      status: val, // "present" | "absent" | "half-day" | "other"
                                      date: todayStr, // exact date
                                      month: selectedMonth, // "YYYY-MM" for Monthly Attendance
                                      type: l.type,
                                      salary: l.salary || 0,
                                      dailyWages: l.dailyWages || 0,
                                    });

                                    // 3) Refresh bottom Monthly Attendance Summary table
                                    await fetchAttendance();
                                  } catch (err) {
                                    console.error(
                                      "attendance mark error:",
                                      err?.response || err
                                    );
                                    alert(
                                      "Failed to update attendance. Please try again."
                                    );
                                    // revert dropdown if API failed
                                    setRowAttendance((prev) => ({
                                      ...prev,
                                      [l._id]: previousValue,
                                    }));
                                  }
                                }}
                                className="border px-2 py-1 rounded text-sm"
                              >
                                {/* Placeholder first */}
                                <option value="" disabled>
                                  Select Option
                                </option>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="half-day">Half Day</option>
                                <option value="other">Other Reason</option>
                              </select>

                              {/* Mini month calendar strip (only for Regular & Wages) */}
                              {isCalendarType && (
                                <div className="mt-1">
                                  <div className="flex flex-wrap gap-[2px] max-w-[220px]">
                                    {daysInMonthArray.map((day) => {
                                      const isTodayHighlight =
                                        isSelectedCurrentMonth &&
                                        day === todayDate;

                                      const base =
                                        "w-6 h-6 flex items-center justify-center text-[10px] rounded-sm border";

                                      const className = isTodayHighlight
                                        ? `${base} ${highlightClass}`
                                        : `${base} bg-gray-50 text-gray-600 border-gray-300`;

                                      return (
                                        <div key={day} className={className}>
                                          {day}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="mt-1 text-[10px] text-gray-500">
                                    Today:{" "}
                                    {isSelectedCurrentMonth
                                      ? todayDate
                                      : "Not in selected month"}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Paid Now column (salary/wages payment) */}
                      <td className="p-2">
                        <button
                          onClick={() => handlePayNow(l._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          disabled={payingId === l._id}
                        >
                          {payingId === l._id ? "Processing..." : "Pay Now"}
                        </button>
                      </td>

                      {/* Driver-only column: opens popup for km-based pay */}
                      <td className="p-2">
                        {l.type === "driver" ? (
                          <DriverKmButton
                            labour={l}
                            selectedMonth={selectedMonth}
                            fetchAttendance={fetchAttendance}
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>

                      {/* Edit / Delete */}
                      <td className="p-2 flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(l)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(l._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    No labors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-3">
          <p>
            Showing {filteredLabors.length === 0 ? 0 : indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredLabors.length)} of{" "}
            {filteredLabors.length} entries
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <LaborModal
            title={
              isEditing
                ? "Edit Labour"
                : formType
                ? "Add Labour"
                : "Select Labour Type"
            }
            onClose={onCloseModal}
          >
            {!formType ? (
              <div className="space-y-4">
                <button
                  onClick={() => setFormType("regular")}
                  className="w-full bg-green-600 text-white py-2 rounded"
                >
                  Regular Employee
                </button>
                <button
                  onClick={() => setFormType("wages")}
                  className="w-full bg-yellow-500 text-white py-2 rounded"
                >
                  Wages-Based Employee
                </button>
                <button
                  onClick={() => setFormType("driver")}
                  className="w-full bg-purple-600 text-white py-2 rounded"
                >
                  Driver
                </button>
              </div>
            ) : (
              <LaborForm
                formData={formData}
                formType={formType}
                onChange={handleInputChange}
                onSubmit={handleFormSubmit}
                onCancel={onCloseModal}
                isEditing={isEditing}
              />
            )}
          </LaborModal>
        )}
      </div>

      {/* --- Monthly Attendance Summary --- */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Monthly Attendance Summary</h2>

          <div className="flex gap-3 items-center">
            {/* Attendance tabs: All / Regular / Wages / Driver */}
            <div className="flex gap-2">
              {["All", "Regular", "Wages", "Driver"].map((t) => (
                <button
                  key={t}
                  onClick={() => setAttendanceTab(t)}
                  className={`px-3 py-1 rounded text-sm ${
                    attendanceTab === t
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <select
              value={String(selectedMonth)}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Present</th>
                <th className="p-2">Absent</th>
                <th className="p-2">Total Days</th>
                <th className="p-2">Payment Due</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingAttendance ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : attendance.length > 0 ? (
                attendance.map((a) => (
                  <tr key={a.labourId}>
                    <td className="p-2 ">{a.name}</td>
                    <td className="p-2">{a.present}</td>
                    <td className="p-2">{a.absent}</td>
                    <td className="p-2">{a.totalDays}</td>
                    <td className="p-2">
                      ₹{Number(a.paymentDue).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded text-white ${
                          isPaid(a.status) ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      >
                        {formatStatusForDisplay(a.status)}
                      </span>
                    </td>
                    <td className="p-2">
                      {!isPaid(a.status) ? (
                        <button
                          onClick={() => handlePayNow(a.labourId)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          disabled={payingId === a.labourId}
                        >
                          {payingId === a.labourId
                            ? "Processing..."
                            : "Pay Now"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 px-3 py-1 rounded"
                        >
                          Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    No attendance data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Driver payment popup component (only for drivers) ---------------- */

function DriverKmButton({ labour, selectedMonth, fetchAttendance }) {
  const [open, setOpen] = useState(false);
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [ratePerKm, setRatePerKm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const distance = (() => {
    const s = Number(startKm);
    const e = Number(endKm);
    if (isNaN(s) || isNaN(e)) return 0;
    return Math.max(0, e - s);
  })();

  const totalAmount = distance * Number(ratePerKm || 0);

  const handleSubmit = async () => {
    if (!window.confirm("Confirm driver payment?")) return;

    if (distance <= 0) {
      alert("End KM must be greater than Start KM.");
      return;
    }
    if (!(Number(ratePerKm) > 0)) {
      alert("Enter valid rate per KM.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/attendance/pay-salary", {
        laborId: labour._id,
        month: selectedMonth,
        type: "driver",
        startKm: Number(startKm),
        endKm: Number(endKm),
        ratePerKm: Number(ratePerKm),
        totalAmount,
      });

      await fetchAttendance();
      setOpen(false);
      setStartKm("");
      setEndKm("");
      setRatePerKm("");
      alert("Driver payment recorded successfully.");
    } catch (err) {
      console.error("driver payment error:", err?.response || err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to record driver payment. Try again.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
      >
        Pay (Driver)
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !submitting && setOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            <h3 className="text-lg font-semibold mb-3">Driver Payment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Driver: <strong>{labour.fullName}</strong>
            </p>

            <label className="block text-sm mb-1">Start KM</label>
            <input
              type="number"
              value={startKm}
              onChange={(e) => setStartKm(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              min="0"
            />

            <label className="block text-sm mb-1">End KM</label>
            <input
              type="number"
              value={endKm}
              onChange={(e) => setEndKm(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              min="0"
            />

            <label className="block text-sm mb-1">Rate per KM (₹)</label>
            <input
              type="number"
              value={ratePerKm}
              onChange={(e) => setRatePerKm(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              min="0"
            />

            <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
              <div>
                Distance: <strong>{distance} km</strong>
              </div>
              <div>
                Total Amount:{" "}
                <strong>₹{Number(totalAmount).toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => !submitting && setOpen(false)}
                className="px-4 py-2 rounded border"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                disabled={submitting}
              >
                {submitting
                  ? "Processing..."
                  : `Pay ₹${Number(totalAmount).toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
