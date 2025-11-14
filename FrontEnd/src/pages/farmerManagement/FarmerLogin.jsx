// src/pages/farmerManagement/FarmerLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios"; // make sure this points to your configured axios instance

export default function FarmerLogin() {
  const [registrationNo, setRegistrationNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!registrationNo || registrationNo.trim().length === 0) {
      setMessage("Please enter registration number.");
      return;
    }

    setLoading(true);
    try {
      // call backend endpoint to find farmer by registration no
      const res = await axios.get(`/farmers/registration/${encodeURIComponent(registrationNo.trim())}`, {
        withCredentials: true,
      });

      // server returns found farmer
      const farmer = res.data?.farmer || res.data;
      if (farmer && (farmer._id || farmer.registrationNo)) {
        // navigate to booking page or farmer details — pick whichever route your app expects
        // Example: open booking form with farmerId as query param
        navigate(`/staff/booking-management?farmerId=${farmer._id || farmer.registrationNo}`);
      } else {
        // unexpected response: redirect to add farmer
        setMessage("Farmer not found — redirecting to add farmer page...");
        setTimeout(() => {
          navigate("/staff/farmers"); // you can append a query param to auto-open Add Farmer modal if you implement it
        }, 800);
      }
    } catch (err) {
      // 404 -> redirect to add farmer
      if (err?.response?.status === 404) {
        setMessage("Farmer not found. Redirecting to Add Farmer...");
        setTimeout(() => {
          navigate("/staff/farmers"); // open farmer list / add form
        }, 800);
      } else {
        console.error("Error fetching farmer by registration:", err);
        setMessage("Network/server error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Farmer Login (by Registration No.)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration No</label>
            <input
              type="text"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              placeholder="Enter farmer registration number"
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Login / Find Farmer"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/staff/farmers")}
              className="text-sm text-gray-600 underline"
            >
              Add Farmer
            </button>
          </div>

          {message && <div className="text-sm text-red-600">{message}</div>}
        </form>
      </div>
    </div>
  );
}
