import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import FarmerForm from "./FarmerForm";

export default function FarmerManagement() {
  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewFarmer, setViewFarmer] = useState(null);
  const [loadingView, setLoadingView] = useState(false);
  const [editFarmer, setEditFarmer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // NEW STATE FOR REGISTRATION POPUP
  const [showRegPopup, setShowRegPopup] = useState(false);
  const [newFarmerRegNo, setNewFarmerRegNo] = useState("");

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch farmers from backend
  const fetchFarmers = async () => {
    try {
      const res = await axios.get("/farmers/all-farmers", { withCredentials: true });
      setFarmers(res.data.data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  // NEW: Handle successful farmer creation
  const handleFarmerCreated = (registrationNo) => {
    fetchFarmers(); // Refresh the list
    setShowForm(false); // Close the form modal
    
    // Show registration number popup
    if (registrationNo) {
      setNewFarmerRegNo(registrationNo);
      setShowRegPopup(true);
    }
  };

  // View single farmer details
  const handleViewFarmer = async (id) => {
    setLoadingView(true);
    try {
      const res = await axios.get(`/farmers/${id}`, { withCredentials: true });
      setViewFarmer(res.data.farmer); // Fixed: should be res.data.farmer
    } catch (error) {
      console.error("Error fetching farmer:", error);
    }
    setLoadingView(false);
  };

  const handleUpdateFarmer = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/farmers/${editFarmer._id}`, editFarmer, { withCredentials: true });
      setShowEditModal(false);
      fetchFarmers();
      alert("Farmer updated successfully");
    } catch (error) {
      console.error("Error updating farmer:", error);
      alert("Failed to update farmer");
    }
  };

  // Delete farmer
  const handleDeleteFarmer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;
    try {
      await axios.delete(`/farmers/${id}`);
      setFarmers((prev) => prev.filter((farmer) => farmer._id !== id));
      alert("Farmer deleted successfully");
    } catch (error) {
      console.error("Error deleting farmer:", error);
      alert("Failed to delete farmer");
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  // Filter & paginate data
  const filteredFarmers = farmers.filter((f) =>
    f.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone?.includes(searchTerm) ||
    f.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentFarmers = filteredFarmers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFarmers.length / rowsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Farmer Management</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowForm(true)}
        >
          Add Farmer
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg shadow-xl">
        {/* Search & Row limiter */}
        <div className="flex justify-between items-center mb-3">
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
            placeholder="Search by name, phone, registration no..."
            value={String(searchTerm)}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-1 rounded w-64"
          />
        </div>

        {/* Farmers Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Registration No</th>
                <th className="p-3">Address</th>
                <th className="p-3">Vehicle No</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFarmers.length > 0 ? (
                currentFarmers.map((farmer) => (
                  <tr key={farmer._id} className="text-center border-t">
                    <td className="p-3">{farmer.fullName}</td>
                    <td className="p-3">{farmer.phone}</td>
                    <td className="p-3 font-mono text-sm">{farmer.registrationNo}</td>
                    <td className="p-3">{farmer.address}</td>
                    <td className="p-3">{farmer.vehicleNumber || "N/A"}</td>
                    <td className="p-3 space-x-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleViewFarmer(farmer._id)}
                        title="View Details"
                      >
                        👁
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        onClick={() => {
                          setEditFarmer(farmer);
                          setShowEditModal(true);
                        }}
                        title="Edit Farmer"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => handleDeleteFarmer(farmer._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        title="Delete Farmer"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-gray-500 text-center">
                    No farmers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-3">
          <p>
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredFarmers.length)} of {filteredFarmers.length} entries
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Add Farmer Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
              <FarmerForm
                onSuccess={handleFarmerCreated}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* NEW: Registration Number Popup */}
        {showRegPopup && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative text-center">
              <button
                onClick={() => setShowRegPopup(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                &times;
              </button>
              
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-green-600">✓</span>
                </div>
                <h2 className="text-xl font-bold text-green-600 mb-2">
                  Farmer Added Successfully!
                </h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Please note the registration number for future reference:
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                <p className="text-2xl font-bold text-gray-800 font-mono">
                  {newFarmerRegNo}
                </p>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                This registration number will be used for all future transactions and bookings.
              </p>
              
              <button
                onClick={() => setShowRegPopup(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                OK, I've noted it down
              </button>
            </div>
          </div>
        )}

        {/* View Farmer Modal */}
        {viewFarmer && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
              <button
                onClick={() => setViewFarmer(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✖
              </button>
              {loadingView ? (
                <p className="text-center">Loading...</p>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    {viewFarmer.fullName}
                  </h2>
                  <div className="space-y-2">
                    <p><strong>Registration No:</strong> <span className="font-mono">{viewFarmer.registrationNo}</span></p>
                    <p><strong>Phone:</strong> {viewFarmer.phone}</p>
                    <p><strong>Address:</strong> {viewFarmer.address}</p>
                    <p><strong>Aadhaar:</strong> {viewFarmer.aadhaarNumber || "N/A"}</p>
                    <p><strong>Vehicle No:</strong> {viewFarmer.vehicleNumber || "N/A"}</p>
                    <p><strong>Driver Name:</strong> {viewFarmer.driverName || "N/A"}</p>
                    <p><strong>Pincode:</strong> {viewFarmer.pincode || "N/A"}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{viewFarmer.status}</span></p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Edit Farmer Modal */}
        {showEditModal && editFarmer && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Update Farmer</h2>
              <form onSubmit={handleUpdateFarmer}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editFarmer.fullName}
                      onChange={(e) =>
                        setEditFarmer({
                          ...editFarmer,
                          fullName: e.target.value,
                        })
                      }
                      className="border w-full p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={editFarmer.phone}
                      onChange={(e) =>
                        setEditFarmer({ ...editFarmer, phone: e.target.value })
                      }
                      className="border w-full p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Registration No</label>
                    <input
                      type="text"
                      value={editFarmer.registrationNo}
                      onChange={(e) =>
                        setEditFarmer({ ...editFarmer, registrationNo: e.target.value })
                      }
                      className="border w-full p-2 rounded font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 rounded text-white hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}