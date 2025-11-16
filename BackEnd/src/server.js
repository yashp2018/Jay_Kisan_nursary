// BackEnd/src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // load env first

import connectDB from "./config/db.js"; // ensure path matches your repo

// --- NEW IMPORTS FOR SEEDING ---
import seedUsers from './seed/userSeeder.js'; 
import seedCrops from './seed/cropSeed.js';
import seedFarmers from './seed/seedFarmers.js';
// -------------------------------

// routes
import userRoutes from './routes/userRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import laborRoutes from "./routes/laborRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import staffDashboardRoutes from "./routes/staffDashboardRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import assetRoutes from './routes/assetRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import newEntryRoutes from './routes/newEntryRoutes.js';
import incomeRoutes from "./routes/incomeRoutes.js";
import dailyBookingRoutes from "./routes/dailyBookingRoutes.js";
import nutrientStockRoutes from "./routes/nutrientStockRoutes.js";
import scriptRoutes from './routes/scripts.js';

const app = express();

// Production CORS - adjust origin to your Vercel frontend domain after deployment
app.use(cors({
  // Use VERCEL_URL or the actual domain in production instead of hardcoding render.com
  origin: [
   // Placeholder: Change this!
    "http://localhost:5173" // for local development
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser
app.use(express.json());
app.use((req, res, next) => {
  // Console logging is fine in development/staging, but can be noisy in production serverless environments.
  console.log(`${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`);
  next();
});

// --- Routes (after CORS + body parser)
app.use('/api/user', userRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use("/api/labors", laborRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", staffDashboardRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use('/api/newEntry', newEntryRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/daily-bookings", dailyBookingRoutes);
app.use("/api/nutrient-stock", nutrientStockRoutes);
app.use('/api/scripts', scriptRoutes);

// Health check endpoint
app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

// Root route (friendly)
app.get("/", (req, res) => {
  res.send("API is running. Use /health for status or /api/* endpoints.");
});

// Error handler for CORS rejections (friendly message)
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS')) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// =======================================================
// CRITICAL: SERVERLESS-COMPATIBLE STARTUP & SEEDING LOGIC
// =======================================================

let isConnected = false; 

/**
 * Connects to the database and runs the seeding function if the SEED_DATABASE flag is set.
 * This function will run during the cold start of the Vercel function.
 */
const runDatabaseSetup = async () => {
  if (!isConnected) {
    try {
      console.log("DEBUG: Attempting to connect to MongoDB...");
      await connectDB();
      isConnected = true;
      console.log("DEBUG: MongoDB connection established.");

      // Check the environment variable to safely trigger seeding ONLY WHEN REQUESTED
      if (process.env.SEED_DATABASE === 'true') {
        console.log('*** SEEDING INITIATED VIA SERVER STARTUP (One-Time Execution) ***');
        await seedUsers();
        await seedCrops();
        await seedFarmers();
        console.log('*** SEEDING SEQUENCE FINISHED ***');
      }

    } catch (err) {
      // In a serverless function, log the error but allow the function to finish.
      console.error("Failed to establish DB connection:", err?.message || err);
      // We do NOT exit(1) as the process is expected to run as a lambda function.
    }
  }
};

// Start the asynchronous setup process immediately on module load (cold start).
runDatabaseSetup();

// REMOVED: const PORT = process.env.PORT || 5000;
// REMOVED: const start = async () => { ... app.listen(PORT, ...); ... };
// REMOVED: start();

// Final required step for Vercel: Export the configured app instance
export default app;
