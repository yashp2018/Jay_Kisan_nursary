// BackEnd/src/server.js
// Clean, optimized and production-safe version with correct CORS + all routes.

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load env first
dotenv.config();

// DB
import connectDB from "./config/db.js";

// Seeder scripts (optional)
import seedUsers from './seed/userSeeder.js';
import seedCrops from './seed/cropSeed.js';
import seedFarmers from './seed/seedFarmers.js';

// Routes
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

/* -------------------- GLOBAL ERROR HANDLERS -------------------- */
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
/* -------------------------------------------------------------- */

/* ---------------------- FIXED CORS CONFIG ---------------------- */

// Allowed frontend domains
const allowedOrigins = [
  "https://jaykisannursery.com",
  "https://www.jaykisannursery.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / curl

      console.log("CORS request from:", origin);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------------------------------------------------- */

app.use(express.json());

// Debug incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

/* ----------------------------- ROUTES --------------------------- */

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

app.get("/", (req, res) => {
  res.send("API is working ✔");
});

app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

/* --------------- CORS specific error handler ---------------- */

app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith("CORS")) {
    console.error("CORS Error:", err.message);
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

/* -------------------- GENERIC ERROR HANDLER ------------------ */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ---------------------- START SERVER -------------------------- */

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected ✔");

    if (process.env.SEED_DATABASE === "true") {
      console.log("Seeding Database...");
      await seedUsers();
      await seedCrops();
      await seedFarmers();
      console.log("Seeding Completed ✔");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup Error:", err);
    process.exit(1);
  }
};

start();

export default app;
