import { useForm } from "react-hook-form";
import axios from "../../lib/axios";

export default function FarmerForm({ onSuccess, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/farmers", data, {
        withCredentials: true,
      });
      
      // Get the registration number from the response
      const registrationNo = res.data.farmer?.registrationNo;
      
      alert("Farmer saved successfully");
      reset();
      
      // Pass the registration number to onSuccess callback
      if (onSuccess) {
        onSuccess(registrationNo);
      }
    } catch (error) {
      console.error("Error saving farmer:", error.response?.data || error);
      alert("Failed to save farmer: " + (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="w-full bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Add New Farmer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Full Name *</label>
            <input
              type="text"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Phone *</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter 10-digit phone"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div>
          <label className="block text-sm font-medium">Aadhaar Number (Optional)</label>
          <input
            type="text"
            {...register("aadhaar", {
              pattern: {
                value: /^[0-9]{12}$/,
                message: "Aadhaar must be 12 digits"
              }
            })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter 12-digit Aadhaar"
          />
          {errors.aadhaar && (
            <p className="text-red-600 text-sm mt-1">{errors.aadhaar.message}</p>
          )}
        </div>

        {/* Row 3 */}
        <div>
          <label className="block text-sm font-medium">Address *</label>
          <textarea
            {...register("address", { required: "Address is required" })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter full address"
            rows="3"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Pincode</label>
            <input
              type="text"
              {...register("pincode", {
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Pincode must be 6 digits"
                }
              })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter pincode"
            />
            {errors.pincode && (
              <p className="text-red-600 text-sm mt-1">{errors.pincode.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Vehicle Number</label>
            <input
              type="text"
              {...register("vehicleNumber")}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter vehicle number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Driver Name</label>
            <input
              type="text"
              {...register("driverName")}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter driver name"
            />
          </div>
        </div>

        {/* Registration Number Field */}
        <div>
          <label className="block text-sm font-medium">
            Registration Number (Optional)
          </label>
          <input
            type="text"
            {...register("registrationNo", {
              pattern: {
                value: /^REG-\d{6}$/,
                message: "Must be in REG-000001 format"
              }
            })}
            placeholder="REG-000001 (auto-generated if empty)"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.registrationNo && (
            <p className="text-red-600 text-sm mt-1">{errors.registrationNo.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to auto-generate sequential registration number
          </p>
        </div>

        {/* Status Field */}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full border px-3 py-2 rounded"
            defaultValue="new"
          >
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="sowing">Sowing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Saving..." : "Save Farmer"}
          </button>
        </div>
      </form>
    </div>
  );
}