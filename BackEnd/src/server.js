// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // load env first

import connectDB from "./config/db.js"; // ensure path matches your repo

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

// Production-safe CORS configuration (you can restrict later to your frontend domain)
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser
app.use(express.json());
app.use((req, res, next) => {
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

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // DEBUG LOG: tell us whether the runtime environment has MONGO_URI set (boolean)
    console.log("DEBUG: process.env.MONGO_URI present? ->", !!process.env.MONGO_URI);

    // Wait for DB connection first (throws if connection fails)
    await connectDB();

    // Only start HTTP server if DB connection succeeded
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server due to DB error:", err?.message || err);
    // Exit so Render marks deploy as failed and you fix env
    process.exit(1);
  }
};

start();
