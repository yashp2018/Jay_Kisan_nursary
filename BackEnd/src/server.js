// BackEnd/src/server.js (FIXED for RENDER)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// IMPORTANT: Render sets its environment variables automatically, but this line ensures 
// it loads any .env file variables if present (for local testing/setup).
dotenv.config(); 

import connectDB from "./config/db.js"; // ensure path matches your repo

// --- SEEDING IMPORTS (Required for conditional seeding) ---
import seedUsers from './seed/userSeeder.js'; 
import seedCrops from './seed/cropSeed.js';
import seedFarmers from './seed/seedFarmers.js';
// -----------------------------------------------------------

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

// RENDER CORS - IMPORTANT: Use process.env.FRONTEND_URL for dynamic linking on Render.
// You must set the FRONTEND_URL environment variable on Render if deploying separately.
const FRONTEND_URL = "https://jay-kisan-nursary-1.onrender.com" || "http://localhost:5173"; 
app.use(cors({
  origin: [
    "https://jay-kisan-nursary-1.onrender.com", // Render will replace this with your actual frontend URL
    "http://localhost:5173" // for local development
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`);
  next();
});

// --- Routes
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

// Root route
app.get("/", (req, res) => {
  res.send("API is running. Use /health for status or /api/* endpoints.");
});

// Error handler
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS')) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// RENDER REQUIRES BINDING TO THE PROCESS.ENV.PORT VARIABLE
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log("DEBUG: process.env.MONGO_URI present? ->", !!process.env.MONGO_URI);

    // 1. Wait for DB connection first (throws if connection fails)
    await connectDB();

    // 2. Conditional Seeding (Runs only if SEED_DATABASE=true is set in Render Environment)
    if (process.env.SEED_DATABASE === 'true') {
        console.log('*** SEEDING INITIATED VIA SERVER STARTUP (One-Time Execution) ***');
        // Ensure your seed files (userSeeder.js) have the password hashing implemented (CRITICAL)
        await seedUsers(); 
        await seedCrops();
        await seedFarmers();
        console.log('*** SEEDING SEQUENCE FINISHED ***');
    }

    // 3. START THE SERVER LISTENER (The fix for the "No open ports detected" error)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server due to DB error:", err?.message || err);
    // Render expects an exit code on fatal error
    process.exit(1);
  }
};

start(); 

// REMOVED: export default app; (This line is for Vercel Serverless, not Render Web Service)
