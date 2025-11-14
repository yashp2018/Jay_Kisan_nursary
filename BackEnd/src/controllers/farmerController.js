// BackEnd/src/controllers/farmerController.js
import Farmer from "../models/Farmer.js";
import mongoose from "mongoose";

/**
 * Helper: generate sequential registrationNo in REG-000001 format
 */
async function generateRegistrationNo() {
  try {
    // Find the highest existing registration number with REG- format
    const lastFarmer = await Farmer.findOne(
      { registrationNo: /^REG-\d+$/ },
      { registrationNo: 1 }
    ).sort({ registrationNo: -1 }).lean();

    let counter = 1;

    // Use any existing registrationNo to start counter
    if (lastFarmer && lastFarmer.registrationNo) {
      const match = lastFarmer.registrationNo.match(/^REG-(\d+)$/);
      if (match && match[1]) {
        counter = parseInt(match[1], 10) + 1;
      }
    } else {
      // If no REG- format found, check for any existing registration numbers
      const existingRegs = await Farmer.find(
        { registrationNo: { $exists: true, $ne: null } },
        { registrationNo: 1 }
      ).lean();
      
      if (existingRegs.length > 0) {
        const nums = existingRegs.map(f => {
          const match = String(f.registrationNo).match(/(\d+)$/);
          return match ? parseInt(match[1], 10) : null;
        }).filter(n => n !== null);
        
        if (nums.length > 0) {
          counter = Math.max(...nums) + 1;
        }
      }
    }

    // Format as REG-000001, REG-000002, etc.
    const reg = 'REG-' + String(counter).padStart(6, '0');
    
    // Double-check for duplicates (safety measure)
    const exists = await Farmer.findOne({ registrationNo: reg }).lean();
    if (exists) {
      // If duplicate found, try next number
      return await generateRegistrationNo();
    }
    
    return reg;
  } catch (error) {
    console.error("Error generating registration number:", error);
    // Fallback: use timestamp-based format
    return `REG-${Date.now().toString().slice(-6)}`;
  }
}

/**
 * getAllFarmers
 * GET /api/farmers/all-farmers
 * Query: q, page, limit, status
 */
export const getAllFarmers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, Math.min(200, parseInt(req.query.limit || "25", 10)));
    const status = req.query.status;

    const filter = {};
    if (status) {
      const statuses = String(status).split(",").map(s => s.trim()).filter(Boolean);
      if (statuses.length === 1) filter.status = statuses[0];
      else if (statuses.length > 1) filter.status = { $in: statuses };
    }

    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { fullName: re },
        { phone: re },
        { registrationNo: re },
        { aadhaarNumber: re },
        { address: re },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, farmers] = await Promise.all([
      Farmer.countDocuments(filter),
      Farmer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id fullName phone address registrationNo status pincode vehicleNumber driverName createdAt")
        .lean()
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: farmers
    });
  } catch (err) {
    console.error("getAllFarmers error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * listFarmers (simple list used in some frontend modals)
 * GET /api/farmers  (keeps backward compatibility with some code)
 * Query: search, status
 */
export const listFarmers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const q = {};
    if (status) q.status = status;
    if (search) {
      const re = new RegExp(String(search).trim(), "i");
      q.$or = [{ fullName: re }, { phone: re }, { registrationNo: re }, { address: re }];
    }

    const farmers = await Farmer.find(q).sort({ fullName: 1 }).lean();
    // return array directly (many frontends expect array)
    return res.status(200).json(farmers);
  } catch (err) {
    console.error("listFarmers error:", err);
    return res.status(500).json({ message: "Server error fetching farmers", error: err.message });
  }
};

/**
 * createFarmer
 * POST /api/farmers
 * - accepts fields from FarmerForm; if registrationNo absent, server generates unique one
 */
export const createFarmer = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      aadhaar, // front-end field alias
      vehicleNumber,
      driverName,
      pincode,
      status,
      registrationNo: registrationNoFromClient,
    } = req.body || {};

    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({ message: "fullName is required" });
    }
    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ message: "phone is required" });
    }

    let finalRegNo = registrationNoFromClient && String(registrationNoFromClient).trim() ? String(registrationNoFromClient).trim() : null;

    if (!finalRegNo) {
      // Use the new sequential registration number generator
      finalRegNo = await generateRegistrationNo();
    } else {
      // Validate custom registration number format
      if (!finalRegNo.match(/^REG-\d{6}$/)) {
        return res.status(400).json({ message: "registrationNo must be in REG-000001 format" });
      }
      
      const dup = await Farmer.findOne({ registrationNo: finalRegNo }).lean();
      if (dup) {
        return res.status(409).json({ message: "registrationNo already exists" });
      }
    }

    const newFarmer = new Farmer({
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      address: address ? String(address).trim() : "",
      aadhaarNumber: aadhaar ? String(aadhaar).trim() : undefined,
      vehicleNumber: vehicleNumber ? String(vehicleNumber).trim() : undefined,
      driverName: driverName ? String(driverName).trim() : undefined,
      pincode: pincode ? String(pincode).trim() : undefined,
      status: status || "new",
      registrationNo: finalRegNo,
    });

    await newFarmer.save();

    return res.status(201).json({ 
      message: "Farmer created successfully", 
      farmer: newFarmer 
    });
  } catch (err) {
    console.error("createFarmer error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate registration number", 
        detail: "This registration number already exists" 
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    return res.status(500).json({ message: "Server error creating farmer", error: err.message });
  }
};

/**
 * getFarmerById
 * GET /api/farmers/:id
 */
export const getFarmerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid farmer id" });
    const farmer = await Farmer.findById(id).lean();
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    return res.status(200).json({ farmer });
  } catch (err) {
    console.error("getFarmerById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * updateFarmer
 * PUT /api/farmers/:id
 */
export const updateFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid farmer id" });

    const update = {};
    const allowed = ["fullName", "phone", "address", "aadhaar", "aadhaarNumber", "vehicleNumber", "driverName", "pincode", "status", "registrationNo"];
    for (const k of allowed) {
      if (req.body[k] !== undefined) {
        if (k === "aadhaar" && req.body[k]) update["aadhaarNumber"] = String(req.body[k]).trim();
        else update[k === "aadhaarNumber" ? "aadhaarNumber" : k] = req.body[k];
      }
    }

    if (update.registrationNo) {
      // Validate registration number format
      if (!update.registrationNo.match(/^REG-\d{6}$/)) {
        return res.status(400).json({ message: "registrationNo must be in REG-000001 format" });
      }
      
      const existing = await Farmer.findOne({ registrationNo: update.registrationNo, _id: { $ne: id } }).lean();
      if (existing) return res.status(409).json({ message: "registrationNo already in use by another farmer" });
    }

    const farmer = await Farmer.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    return res.status(200).json({ message: "Farmer updated", farmer });
  } catch (err) {
    console.error("updateFarmer error:", err);
    if (err.name === "ValidationError") return res.status(400).json({ message: "Validation error", errors: err.errors });
    return res.status(500).json({ message: "Server error updating farmer", error: err.message });
  }
};

/**
 * deleteFarmer
 * DELETE /api/farmers/:id
 */
export const deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid farmer id" });
    const farmer = await Farmer.findByIdAndDelete(id).lean();
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    return res.status(200).json({ message: "Farmer deleted", farmerId: id });
  } catch (err) {
    console.error("deleteFarmer error:", err);
    return res.status(500).json({ message: "Server error deleting farmer", error: err.message });
  }
};

/**
 * verifyFarmerByRegistrationNo
 * GET /api/farmers/verify/:registrationNo
 */
export const verifyFarmerByRegistrationNo = async (req, res) => {
  try {
    const { registrationNo } = req.params;
    if (!registrationNo) return res.status(400).json({ message: "registrationNo is required" });
    const farmer = await Farmer.findOne({ registrationNo }).lean();
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    return res.status(200).json({ farmer });
  } catch (err) {
    console.error("verifyFarmerByRegistrationNo error:", err);
    return res.status(500).json({ message: "Server error verifying farmer", error: err.message });
  }
};

/**
 * getFarmerByRegistration
 * GET /api/farmers/registration/:registrationNo
 */
export const getFarmerByRegistration = async (req, res) => {
  try {
    const reg = req.params.registrationNo;
    if (!reg) return res.status(400).json({ message: "registrationNo is required" });
    const farmer = await Farmer.findOne({ registrationNo: reg }).lean();
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    return res.status(200).json({ farmer });
  } catch (err) {
    console.error("getFarmerByRegistration error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Helper filtered lists used by front-end
 * - getNewFarmers => status === 'new'
 * - getPendingFarmers => status === 'pending'
 * - getSowingFarmers => status === 'sowing'
 * - getCompletedFarmers => status === 'completed'
 */
const makeStatusGetter = (status) => async (req, res) => {
  try {
    const docs = await Farmer.find({ status }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(docs);
  } catch (err) {
    console.error(`get${status}Farmers error:`, err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getNewFarmers = makeStatusGetter("new");
export const getPendingFarmers = makeStatusGetter("pending");
export const getSowingFarmers = makeStatusGetter("sowing");
export const getCompletedFarmers = makeStatusGetter("completed");

/**
 * updateFarmerStatus
 * PATCH /api/farmers/:id/status
 * Body: { status: "pending" } etc
 */
export const updateFarmerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid farmer id" });
    if (!status) return res.status(400).json({ message: "status is required" });

    const farmer = await Farmer.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    return res.status(200).json({ message: "Farmer status updated", farmer });
  } catch (err) {
    console.error("updateFarmerStatus error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};