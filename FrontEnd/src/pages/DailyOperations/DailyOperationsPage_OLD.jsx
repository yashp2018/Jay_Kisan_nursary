import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Utility component to simulate the layout structure used in AdminDashboard.jsx
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md my-5">
      <h2 className="text-xl font-semibold border-b pb-2 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// --- 1. Add Extra Plant (Sowing) Component ---
const SowingBatchManagement = ({ batches, loading }) => (
  <Section title="1. Add Extra Plant / Sowing Batch">
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="mb-4">
        **Form Fields:** Crop Name, Variety Name, Quantity, Sowing Date, Dispatch Date, Lot No, Plot No.
        (You will implement the form fields here)
      </p>
      
      <button 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        + Add New Plant Batch (Posts to /api/sowing-batches)
      </button>

      <h5 className="font-semibold mt-6 mb-3 border-t pt-3">Current Sowing Batches</h5>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 border">Crop</th>
              <th className="p-3 border">Variety</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Sowing Date</th>
              <th className="p-3 border">Lot/Plot</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500 border">Loading...</td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500 border">No sowing batches found</td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{batch.cropName}</td>
                  <td className="p-3 border">{batch.varietyName}</td>
                  <td className="p-3 border">{batch.quantity}</td>
                  <td className="p-3 border">{new Date(batch.sowingDate).toLocaleDateString()}</td>
                  <td className="p-3 border">{batch.lotNo} / {batch.plotNo}</td>
                  <td className="p-3 border">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </Section>
);

// --- 2. Available Stock Component ---
const StockManagement = ({ stocks, loading }) => (
  <Section title="2. Available Stock">
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="mb-4">
        This section lists available crop/variety stock from the **`/api/stock`** endpoint.
      </p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 border">Variety (Crop Group)</th>
              <th className="p-3 border">Current Qty</th>
              <th className="p-3 border">Unit</th>
              <th className="p-3 border">Lower Limit</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500 border">Loading...</td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500 border">No stock data found</td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{stock.variety?.name || 'N/A'}</td>
                  <td className="p-3 border">{stock.quantity}</td>
                  <td className="p-3 border">{stock.unit}</td>
                  <td className="p-3 border">{stock.lowerLimit}</td>
                  <td className="p-3 border">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Update</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        *Updates/Deletes on the rows above call PUT/DELETE on **/api/stock/:id***
      </p>
    </div>
  </Section>
);

// --- 3. Daily Booking Component ---
const DailyBookingManagement = ({ bookings, loading }) => (
  <Section title="3. Daily Booking Entry">
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="mb-4">
        **Form Fields:** Customer Name, Number, Address, Crop, Variety, Quantity, Rate, Total, **Advance Payment** (New Field).
      </p>
      
      <button 
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        + Create New Daily Booking (Posts to /api/daily-bookings)
      </button>

      <h5 className="font-semibold mt-6 mb-3 border-t pt-3">Recent Daily Bookings</h5>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Crop/Variety</th>
              <th className="p-3 border">Total (₹)</th>
              <th className="p-3 border">Advance (₹)</th>
              <th className="p-3 border">Pending (₹)</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500 border">Loading...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500 border">No daily bookings found</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{booking.name}</td>
                  <td className="p-3 border">{booking.crop} / {booking.variety}</td>
                  <td className="p-3 border">₹{booking.total?.toLocaleString('en-IN')}</td>
                  <td className="p-3 border">₹{(booking.advancePayment || 0).toLocaleString('en-IN')}</td>
                  <td className="p-3 border">₹{(booking.pendingPayment || 0).toLocaleString('en-IN')}</td>
                  <td className="p-3 border">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-1 text-sm">Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded mr-1 text-sm">Delete</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm">Invoice</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4">
        Generate Invoice
      </button>
      <p className="text-sm text-gray-600 mt-2">
        *Deleting an entry should subtract/update the corresponding entry in the Income model.*
      </p>
    </div>
  </Section>
);


export default function DailyOperationsPage() {
  const [activeTab, setActiveTab] = useState('dailyBooking');
  
  // State for each tab's data
  const [sowingBatches, setSowingBatches] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [dailyBookings, setDailyBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token"); // get token from login storage

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const [sowingRes, stockRes, bookingRes] = await Promise.all([
      axios.get(`${API_BASE}/sowing-batches`, config),
      axios.get(`${API_BASE}/stock`, config),
      axios.get(`${API_BASE}/daily-bookings`, config),
    ]);

    setSowingBatches(sowingRes.data.data || sowingRes.data);
    setStocks(stockRes.data.data || stockRes.data);
    setDailyBookings(bookingRes.data.data || bookingRes.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};


  const getTabClass = (tabName) => {
    return activeTab === tabName 
      ? 'bg-white text-green-700 border-b-2 border-green-700 font-bold'
      : 'text-gray-500 hover:text-gray-700';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Daily Operations Dashboard 🪴</h1>

      <div className="bg-white rounded-xl shadow-md p-0">
        {/* Tabs Navigation */}
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 transition-colors duration-150 ${getTabClass('sowingBatch')}`}
            onClick={() => setActiveTab('sowingBatch')}
          >
            1. Add Extra Plant (Sowing)
          </button>
          <button 
            className={`px-6 py-3 transition-colors duration-150 ${getTabClass('stock')}`}
            onClick={() => setActiveTab('stock')}
          >
            2. Available Stock
          </button>
          <button 
            className={`px-6 py-3 transition-colors duration-150 ${getTabClass('dailyBooking')}`}
            onClick={() => setActiveTab('dailyBooking')}
          >
            3. Daily Booking
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'sowingBatch' && <SowingBatchManagement batches={sowingBatches} loading={loading} />}
          {activeTab === 'stock' && <StockManagement stocks={stocks} loading={loading} />}
          {activeTab === 'dailyBooking' && <DailyBookingManagement bookings={dailyBookings} loading={loading} />}
        </div>
      </div>
    </div>
  );
}