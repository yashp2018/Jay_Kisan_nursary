import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function DailyOperationsPage() {
  const [activeTab, setActiveTab] = useState('sowingBatch');
  const [sowingBatches, setSowingBatches] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [dailyBookings, setDailyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showSowingModal, setShowSowingModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const getToken = () => localStorage.getItem("token");
  const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sowingRes, stockRes, bookingRes] = await Promise.all([
        axios.get(`${API_BASE}/sowing-batches`, getConfig()),
        axios.get(`${API_BASE}/stock`, getConfig()),
        axios.get(`${API_BASE}/daily-bookings`, getConfig()),
      ]);
      setSowingBatches(sowingRes.data.data || sowingRes.data);
      setStocks(stockRes.data.data || stockRes.data);
      setDailyBookings(bookingRes.data.data || bookingRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading data. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  // Sowing Batch CRUD
  const handleSaveSowing = async (data) => {
    try {
      if (editingItem) {
        await axios.put(`${API_BASE}/sowing-batches/${editingItem._id}`, data, getConfig());
      } else {
        await axios.post(`${API_BASE}/sowing-batches`, data, getConfig());
      }
      fetchAllData();
      setShowSowingModal(false);
      setEditingItem(null);
    } catch (error) {
      alert("Error saving sowing batch: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteSowing = async (id) => {
    if (!window.confirm("Delete this sowing batch?")) return;
    try {
      await axios.delete(`${API_BASE}/sowing-batches/${id}`, getConfig());
      fetchAllData();
    } catch (error) {
      alert("Error deleting: " + (error.response?.data?.message || error.message));
    }
  };

  // Stock CRUD
  const handleSaveStock = async (data) => {
    try {
      await axios.put(`${API_BASE}/stock/${editingItem._id}`, data, getConfig());
      fetchAllData();
      setShowStockModal(false);
      setEditingItem(null);
    } catch (error) {
      alert("Error updating stock: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm("Delete this stock entry?")) return;
    try {
      await axios.delete(`${API_BASE}/stock/${id}`, getConfig());
      fetchAllData();
    } catch (error) {
      alert("Error deleting: " + (error.response?.data?.message || error.message));
    }
  };

  // Daily Booking CRUD
  const handleSaveBooking = async (data) => {
    try {
      if (editingItem) {
        await axios.put(`${API_BASE}/daily-bookings/${editingItem._id}`, data, getConfig());
      } else {
        await axios.post(`${API_BASE}/daily-bookings`, data, getConfig());
      }
      fetchAllData();
      setShowBookingModal(false);
      setEditingItem(null);
    } catch (error) {
      alert("Error saving booking: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete this booking? Income will be updated.")) return;
    try {
      await axios.delete(`${API_BASE}/daily-bookings/${id}`, getConfig());
      fetchAllData();
    } catch (error) {
      alert("Error deleting: " + (error.response?.data?.message || error.message));
    }
  };

  const handleGenerateInvoice = (booking) => {
    alert(`Invoice generation for ${booking.name} - Coming soon!`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Daily Operations Dashboard 🪴</h1>

      <div className="bg-white rounded-xl shadow-md">
        {/* Tabs */}
        <div className="flex border-b">
          {['sowingBatch', 'stock', 'dailyBooking'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 ${activeTab === tab ? 'bg-white text-green-700 border-b-2 border-green-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'sowingBatch' ? '1. Add Extra Plant' : tab === 'stock' ? '2. Available Stock' : '3. Daily Booking'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'sowingBatch' && (
            <SowingBatchTab
              batches={sowingBatches}
              loading={loading}
              onAdd={() => { setEditingItem(null); setShowSowingModal(true); }}
              onEdit={(item) => { setEditingItem(item); setShowSowingModal(true); }}
              onDelete={handleDeleteSowing}
            />
          )}
          {activeTab === 'stock' && (
            <StockTab
              stocks={stocks}
              loading={loading}
              onEdit={(item) => { setEditingItem(item); setShowStockModal(true); }}
              onDelete={handleDeleteStock}
            />
          )}
          {activeTab === 'dailyBooking' && (
            <DailyBookingTab
              bookings={dailyBookings}
              loading={loading}
              onAdd={() => { setEditingItem(null); setShowBookingModal(true); }}
              onEdit={(item) => { setEditingItem(item); setShowBookingModal(true); }}
              onDelete={handleDeleteBooking}
              onInvoice={handleGenerateInvoice}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showSowingModal && <SowingModal item={editingItem} onSave={handleSaveSowing} onClose={() => { setShowSowingModal(false); setEditingItem(null); }} />}
      {showStockModal && <StockModal item={editingItem} onSave={handleSaveStock} onClose={() => { setShowStockModal(false); setEditingItem(null); }} />}
      {showBookingModal && <BookingModal item={editingItem} onSave={handleSaveBooking} onClose={() => { setShowBookingModal(false); setEditingItem(null); }} />}
    </div>
  );
}

// Tab Components
function SowingBatchTab({ batches, loading, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <button onClick={onAdd} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
        + Add New Sowing Batch
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
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
            <tr><td colSpan="6" className="p-3 text-center">Loading...</td></tr>
          ) : batches.length === 0 ? (
            <tr><td colSpan="6" className="p-3 text-center">No data</td></tr>
          ) : (
            batches.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="p-3 border">{b.cropName}</td>
                <td className="p-3 border">{b.varietyName}</td>
                <td className="p-3 border">{b.quantity}</td>
                <td className="p-3 border">{new Date(b.sowingDate).toLocaleDateString()}</td>
                <td className="p-3 border">{b.lotNo} / {b.plotNo}</td>
                <td className="p-3 border">
                  <button onClick={() => onEdit(b)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => onDelete(b._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StockTab({ stocks, loading, onEdit, onDelete }) {
  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Variety</th>
            <th className="p-3 border">Quantity</th>
            <th className="p-3 border">Unit</th>
            <th className="p-3 border">Lower Limit</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="p-3 text-center">Loading...</td></tr>
          ) : stocks.length === 0 ? (
            <tr><td colSpan="5" className="p-3 text-center">No data</td></tr>
          ) : (
            stocks.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="p-3 border">{s.variety?.name || 'N/A'}</td>
                <td className="p-3 border">{s.quantity}</td>
                <td className="p-3 border">{s.unit}</td>
                <td className="p-3 border">{s.lowerLimit}</td>
                <td className="p-3 border">
                  <button onClick={() => onEdit(s)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Update</button>
                  <button onClick={() => onDelete(s._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function DailyBookingTab({ bookings, loading, onAdd, onEdit, onDelete, onInvoice }) {
  return (
    <div>
      <button onClick={onAdd} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mb-4">
        + Create New Daily Booking
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
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
            <tr><td colSpan="6" className="p-3 text-center">Loading...</td></tr>
          ) : bookings.length === 0 ? (
            <tr><td colSpan="6" className="p-3 text-center">No data</td></tr>
          ) : (
            bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="p-3 border">{b.name}</td>
                <td className="p-3 border">{b.crop} / {b.variety}</td>
                <td className="p-3 border">₹{b.total?.toLocaleString('en-IN')}</td>
                <td className="p-3 border">₹{(b.advancePayment || 0).toLocaleString('en-IN')}</td>
                <td className="p-3 border">₹{(b.pendingPayment || 0).toLocaleString('en-IN')}</td>
                <td className="p-3 border">
                  <button onClick={() => onEdit(b)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-1 text-sm">Edit</button>
                  <button onClick={() => onDelete(b._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded mr-1 text-sm">Delete</button>
                  <button onClick={() => onInvoice(b)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm">Invoice</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Modal Components
function SowingModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { cropName: '', varietyName: '', quantity: '', sowingDate: '', dispatchDate: '', lotNo: '', plotNo: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{item ? 'Edit' : 'Add'} Sowing Batch</h2>
        <form onSubmit={handleSubmit}>
          <input required className="w-full p-2 border rounded mb-3" placeholder="Crop Name" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} />
          <input required className="w-full p-2 border rounded mb-3" placeholder="Variety Name" value={form.varietyName} onChange={(e) => setForm({ ...form, varietyName: e.target.value })} />
          <input required type="number" className="w-full p-2 border rounded mb-3" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input required type="date" className="w-full p-2 border rounded mb-3" value={form.sowingDate} onChange={(e) => setForm({ ...form, sowingDate: e.target.value })} />
          <input type="date" className="w-full p-2 border rounded mb-3" placeholder="Dispatch Date (optional)" value={form.dispatchDate} onChange={(e) => setForm({ ...form, dispatchDate: e.target.value })} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Lot No" value={form.lotNo} onChange={(e) => setForm({ ...form, lotNo: e.target.value })} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Plot No" value={form.plotNo} onChange={(e) => setForm({ ...form, plotNo: e.target.value })} />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StockModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ quantity: item?.quantity || '', lowerLimit: item?.lowerLimit || '', unit: item?.unit || '', notes: item?.notes || '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Stock: {item?.variety?.name}</h2>
        <form onSubmit={handleSubmit}>
          <input required type="number" className="w-full p-2 border rounded mb-3" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Lower Limit" value={form.lowerLimit} onChange={(e) => setForm({ ...form, lowerLimit: e.target.value })} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Unit (e.g., kg)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          <textarea className="w-full p-2 border rounded mb-3" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookingModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: '', number: '', address: '', crop: '', variety: '', quantity: '', rate: '', advancePayment: '' });
  const total = (form.quantity || 0) * (form.rate || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, total, pendingPayment: total - (form.advancePayment || 0) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
        <h2 className="text-xl font-bold mb-4">{item ? 'Edit' : 'Create'} Daily Booking</h2>
        <form onSubmit={handleSubmit}>
          <input required className="w-full p-2 border rounded mb-3" placeholder="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required className="w-full p-2 border rounded mb-3" placeholder="Phone Number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
          <input required className="w-full p-2 border rounded mb-3" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input required className="w-full p-2 border rounded mb-3" placeholder="Crop Name" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} />
          <input required className="w-full p-2 border rounded mb-3" placeholder="Variety Name" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} />
          <input required type="number" className="w-full p-2 border rounded mb-3" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input required type="number" className="w-full p-2 border rounded mb-3" placeholder="Rate per unit" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
          <div className="bg-gray-100 p-2 rounded mb-3">Total: ₹{total.toLocaleString('en-IN')}</div>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Advance Payment" value={form.advancePayment} onChange={(e) => setForm({ ...form, advancePayment: e.target.value })} />
          <div className="flex gap-2">
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
