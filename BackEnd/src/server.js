// BackEnd/src/server.js
// Final copy-paste-ready server file with improved CORS, error handling, process-level handlers,
// conditional seeding, and debug logs for Render / local usage.

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load env as early as possible (for local dev). Render provides env vars automatically.
dotenv.config();

import connectDB from "./config/db.js"; // must throw if MONGO_URI missing or connection fails

// --- SEEDING IMPORTS (conditional seeding if SEED_DATABASE === 'true') ---
import seedUsers from './seed/userSeeder.js';
import seedCrops from './seed/cropSeed.js';
import seedFarmers from './seed/seedFarmers.js';
// ----------------------------------------------------------------------

/* ROUTES */
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

/* ----------------------- Process-level handlers ----------------------- */
// Catch unhandled promise rejections and uncaught exceptions to make logs clear.
// You may choose to exit process on these in production.
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // optionally: process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // optionally: process.exit(1);
});
/* --------------------------------------------------------------------- */

/* -------------------------- CORS configuration ------------------------ */
/*
  Use a comma-separated FRONTEND_URL env variable if you want multiple origins:
  e.g. FRONTEND_URL="https://prod.example.com,http://localhost:5173"
*/



// CORS config (copy-paste into server.js)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(u => u.trim())
  .filter(Boolean);

console.log('CORS allowedOrigins =', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // origin === undefined for curl/Postman/server-side requests — allow them
    if (!origin) return callback(null, true);

    // log origin for debugging
    console.log('CORS check - incoming Origin:', origin);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

/* --------------------------------------------------------------------- */

/* Body parser + request logging */
app.use(express.json());
app.use((req, res, next) => {
  // Don't log large bodies in production — this is helpful in development/debugging.
  try {
    console.log(`${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`);
  } catch (e) {
    console.log(`${req.method} ${req.originalUrl} - body: <unserializable>`);
  }
  next();
});

/* ------------------------------ Routes -------------------------------- */
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

/* Health check + root */
app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);
app.get("/", (req, res) => {
  res.send("API is running. Use /health for status or /api/* endpoints.");
});

/* ---------- CORS short-circuit error middleware (keeps message clear) -------- */
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS')) {
    console.error('CORS error:', err.message);
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

/* ------------------------ Final error handler (last) ------------------------ */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const payload = { message: err.message || 'Server error' };
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  res.status(err.status || 500).json(payload);
});
/* ---------------------------------------------------------------------------- */

/* RENDER: use process.env.PORT if provided */
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log("DEBUG: process.env.MONGO_URI present? ->", !!process.env.MONGO_URI);
    // 1) Connect to DB (connectDB should throw if MONGO_URI missing/invalid)
    await connectDB();
    console.log('DB connection successful.');

    // 2) Conditional, idempotent seeding (only run when explicitly requested)
    if (process.env.SEED_DATABASE === 'true') {
      console.log('*** SEEDING INITIATED VIA SERVER STARTUP (SEED_DATABASE=true) ***');
      try {
        await seedUsers();
        await seedCrops();
        await seedFarmers();
        console.log('*** SEEDING SEQUENCE FINISHED ***');
      } catch (seedErr) {
        console.error('Error during seeding:', seedErr);
        // Continue startup even if seeding fails, or decide to exit:
        // process.exit(1);
      }
    }

    // 3) Start server listener AFTER DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server due to error:", err?.message || err);
    // Exit with failure so Render marks deploy as failed
    process.exit(1);
  }
};

start();
