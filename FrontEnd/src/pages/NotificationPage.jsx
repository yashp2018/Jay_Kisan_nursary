import React, { useState, useEffect, useCallback } from "react";
import { FaSeedling, FaPlus, FaFileExport, FaCalendarAlt } from 'react-icons/fa';
import axios from "../lib/axios";

const NotificationPage = () => {
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [modalView, setModalView] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    startDate: '',
    endDate: '',
    duration: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch schedules from your existing API
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get("/schedules");
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        // Frontend Deduplication (same as your existing code)
        const uniqueSchedulesMap = new Map();
        data.forEach(sch => {
            if (sch._id) {
                 uniqueSchedulesMap.set(sch._id, sch); 
            }
        });
        const uniqueSchedules = Array.from(uniqueSchedulesMap.values());
        
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

  const selectedSchedule = schedules.find(schedule => schedule._id === selectedScheduleId);

  // Format functions from your existing code
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Create new schedule functionality
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => {
      const updated = { ...prev, [name]: value };
      
      // Calculate duration if both dates are present
      if ((name === 'startDate' || name === 'endDate') && updated.startDate && updated.endDate) {
        const start = new Date(updated.startDate);
        const end = new Date(updated.endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        updated.duration = duration > 0 ? duration : 0;
      }
      
      return updated;
    });
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    
    if (!newSchedule.startDate || !newSchedule.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (newSchedule.duration > 5) {
      alert('Schedule duration cannot exceed 5 days');
      return;
    }

    try {
      // Create the schedule using your existing API structure
      const scheduleToAdd = {
        name: newSchedule.name || `Schedule ${schedules.length + 1}`,
        startDate: newSchedule.startDate,
        endDate: newSchedule.endDate,
        duration: newSchedule.duration,
        groups: [{
          groupName: '',
          varieties: []
        }]
      };

      // Send to your backend API
      const response = await axios.post("/schedules", scheduleToAdd);
      
      // Refresh the schedules list
      await fetchSchedules();
      
      // Select the newly created schedule
      if (response.data && response.data._id) {
        setSelectedScheduleId(response.data._id);
      }
      
      resetNewScheduleForm();
      setModalView(null);
      setMessage("Schedule created successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to create schedule:", err);
      setMessage("Error creating schedule.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const resetNewScheduleForm = () => {
    setNewSchedule({
      name: '',
      startDate: '',
      endDate: '',
      duration: 0
    });
  };

  const exportToCSV = () => {
    const csvData = schedules.flatMap(schedule => 
      schedule.groups.flatMap(group =>
        group.varieties.map(variety => ({
          'Schedule Name': schedule.name,
          'Date Range': formatDateRange(schedule.startDate, schedule.endDate),
          'Group': group.groupName || group.groupId || group.groupRef,
          'Variety Name': variety.varietyName || variety.varietyId || variety.varietyRef,
          'Total Seeds': variety.total || 0,
          'Completed Seeds': variety.completed || 0,
          'Remaining Seeds': (variety.total || 0) - (variety.completed || 0),
          'Progress': `${getProgressPercentage(variety.completed || 0, variety.total || 0)}%`
        }))
      )
    );

    if (csvData.length === 0) {
      setMessage("No data to export.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(item => 
      Object.values(item).map(value => 
        `"${value}"`
      ).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sowing_schedules.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Schedule Card Component using your data structure
  const ScheduleCard = ({ schedule, isSelected, onSelect }) => {
    const totalSeeds = schedule.groups?.reduce((total, group) => 
      total + (group.varieties?.reduce((sum, variety) => sum + (variety.total || 0), 0) || 0), 0
    ) || 0;
    
    const completedSeeds = schedule.groups?.reduce((total, group) => 
      total + (group.varieties?.reduce((sum, variety) => sum + (variety.completed || 0), 0) || 0), 0
    ) || 0;

    // Determine schedule status (same logic as your existing code)
    const varietiesFlat = (schedule.groups || []).flatMap(g => g.varieties || []);
    const allCompleted = varietiesFlat.length > 0 && varietiesFlat.every(v => (v.completed || 0) >= (v.total || 0));
    const anyProgress = varietiesFlat.some(v => (v.completed || 0) > 0);

    let statusColor = "bg-orange-400";
    if (varietiesFlat.length === 0) {
      statusColor = "bg-gray-400";
    } else if (allCompleted) {
      statusColor = "bg-green-500";
    } else if (!anyProgress) {
      statusColor = "bg-red-500";
    }

    return (
      <div 
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={onSelect}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">{schedule.name || formatRange(schedule.startDate, schedule.endDate)}</h3>
            <p className="text-sm text-gray-600">
              ({formatDateRange(schedule.startDate, schedule.endDate)})
            </p>
          </div>
          <span className={`text-xs text-white px-2 py-1 rounded-full ${statusColor}`}>
            {schedule.duration || 5} days
          </span>
        </div>

        {schedule.groups?.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            {group.groupName && (
              <h4 className="font-medium text-gray-700 text-sm">{group.groupName}</h4>
            )}
            {group.varieties?.map((variety, varietyIndex) => (
              <div key={varietyIndex} className="border-l-4 border-green-500 pl-3 py-1">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-medium text-gray-800">
                      {variety.varietyName || variety.varietyId || variety.varietyRef}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgressPercentage(variety.completed || 0, variety.total || 0)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {getProgressPercentage(variety.completed || 0, variety.total || 0)}%
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>In Progress</span>
                  <span>{(variety.completed || 0).toLocaleString()}/{(variety.total || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Progress</span>
            <span className="font-medium text-gray-800">
              {completedSeeds.toLocaleString()}/{totalSeeds.toLocaleString()} 
              ({getProgressPercentage(completedSeeds, totalSeeds)}%)
            </span>
          </div>
        </div>
      </div>
    );
  };

  // RENDER LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-xl font-semibold">Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Create Schedule Modal */}
      {modalView === 'create-schedule' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Create New Notification Schedule
              </h3>
              
              <form onSubmit={handleCreateSchedule}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newSchedule.name}
                      onChange={handleScheduleChange}
                      placeholder="Tomato"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newSchedule.startDate}
                      onChange={handleScheduleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newSchedule.endDate}
                      onChange={handleScheduleChange}
                      required
                    />
                  </div>

                  {newSchedule.duration > 0 && (
                    <div className={`p-3 rounded-md ${
                      newSchedule.duration > 5 ? 'bg-red-50' : 'bg-blue-50'
                    }`}>
                      <p className={`text-sm ${
                        newSchedule.duration > 5 ? 'text-red-800' : 'text-blue-800'
                      }`}>
                        Duration: <strong>{newSchedule.duration} days</strong>
                        {newSchedule.duration > 5 && (
                          <span className="block text-red-600 mt-1">
                            Schedule duration cannot exceed 5 days
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      resetNewScheduleForm();
                      setModalView(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={newSchedule.duration > 5 || !newSchedule.startDate || !newSchedule.endDate}
                  >
                    Create Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <header className="py-8 text-center bg-white border-b border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center">
          <FaSeedling className="mr-3 text-green-600" />
          Sowing & Schedule Management
        </h1>
        <p className="mt-2 text-gray-600">Track and manage your sowing schedules efficiently</p>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg font-semibold ${
            message.toLowerCase().includes("error") ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          }`}>
            {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <button
            onClick={() => setModalView('create-schedule')}
            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center whitespace-nowrap font-medium"
          >
            <FaPlus className="mr-2" /> New Notification Schedule
          </button>
          
          <div className="flex-1">
            <label htmlFor="schedule-select" className="block text-gray-700 font-semibold mb-2">
              Select Schedule
            </label>
            <select
              id="schedule-select"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
            >
              <option value="">-- Select a Schedule --</option>
              {schedules.map(schedule => (
                <option key={schedule._id} value={schedule._id}>
                  {schedule.name || formatRange(schedule.startDate, schedule.endDate)} 
                  ({formatDateRange(schedule.startDate, schedule.endDate)})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Schedules List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-800">Sowing Schedules</h2>
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {schedules.length} schedules
                  </span>
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  title="Export to CSV"
                >
                  <FaFileExport className="mr-2" /> Export CSV
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Last updated: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {message || "No schedules available."}
                </div>
              ) : (
                schedules.map(schedule => (
                  <ScheduleCard 
                    key={schedule._id} 
                    schedule={schedule}
                    isSelected={selectedScheduleId === schedule._id}
                    onSelect={() => setSelectedScheduleId(schedule._id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Side - Schedule Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Schedule Details</h2>
            </div>
            <div className="p-6">
              {selectedSchedule ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {selectedSchedule.name || formatRange(selectedSchedule.startDate, selectedSchedule.endDate)}
                    </h3>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {formatDateRange(selectedSchedule.startDate, selectedSchedule.endDate)}
                      <span className="ml-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedSchedule.duration || 5} days
                      </span>
                    </div>
                  </div>

                  {selectedSchedule.groups?.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-4">
                      {group.groupName && (
                        <h4 className="font-semibold text-gray-700 text-lg border-b pb-2">
                          {group.groupName}
                        </h4>
                      )}
                      {group.varieties?.map((variety, varietyIndex) => (
                        <div key={varietyIndex} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg">
                                {variety.varietyName || variety.varietyId || variety.varietyRef}
                              </h4>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Total: {(variety.total || 0).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm font-bold text-gray-800">
                                {getProgressPercentage(variety.completed || 0, variety.total || 0)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${getProgressPercentage(variety.completed || 0, variety.total || 0)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>In Progress</span>
                              <span className="font-medium">
                                {(variety.completed || 0).toLocaleString()}/{(variety.total || 0).toLocaleString()} seeds
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaSeedling className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Select a schedule to view details</p>
                  <p className="text-gray-400 text-sm mt-2">Choose from the list on the left</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
