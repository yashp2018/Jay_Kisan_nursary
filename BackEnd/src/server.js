// BackEnd/src/server.js
// Final server file: strict CORS for your domains only, seeding, error handling, etc.

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load env vars
dotenv.config();

import connectDB from "./config/db.js";

// --- SEEDING IMPORTS (run only if SEED_DATABASE === "true") ---
import seedUsers from "./seed/userSeeder.js";
import seedCrops from "./seed/cropSeed.js";
import seedFarmers from "./seed/seedFarmers.js";
// --------------------------------------------------------------

/* ROUTES */
import userRoutes from "./routes/userRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import laborRoutes from "./routes/laborRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import staffDashboardRoutes from "./routes/staffDashboardRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import newEntryRoutes from "./routes/newEntryRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import dailyBookingRoutes from "./routes/dailyBookingRoutes.js";
import nutrientStockRoutes from "./routes/nutrientStockRoutes.js";
import scriptRoutes from "./routes/scripts.js";

const app = express();

/* ----------------------- Process-level handlers ----------------------- */
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});
/* --------------------------------------------------------------------- */

/* -------------------------- CORS configuration ------------------------ */
/*
  FRONTEND_URL can override defaults, e.g.:

  FRONTEND_URL="https://jaykisannursery.com,https://www.jaykisannursery.com"

  If FRONTEND_URL is not set, we use a safe default list with:
  - your domain (http + https, with and without www)
  - localhost for dev
*/

const FRONTEND_URLS =
  process.env.FRONTEND_URL ||
  [
    "https://jaykisannursery.com",
    "https://www.jaykisannursery.com",
    "http://jaykisannursery.com",
    "http://www.jaykisannursery.com",
    "http://localhost:5173",
    "http://localhost:3000",
  ].join(",");

const allowedOrigins = FRONTEND_URLS.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / curl / server-to-server with no Origin
      if (!origin) {
        return callback(null, true);
      }

      console.log("CORS request from:", origin);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❌ No Render / wildcard logic – only explicit origins above
      const err = new Error(`CORS: Origin ${origin} not allowed`);
      return callback(err);
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
/* --------------------------------------------------------------------- */

/* Body parser + request logging */
app.use(express.json());

app.use((req, res, next) => {
  try {
    console.log(
      `${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`
    );
  } catch (e) {
    console.log(`${req.method} ${req.originalUrl} - body: <unserializable>`);
  }
  next();
});

/* ------------------------------ Routes -------------------------------- */
app.use("/api/user", userRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/labors", laborRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", staffDashboardRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/newEntry", newEntryRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/daily-bookings", dailyBookingRoutes);
app.use("/api/nutrient-stock", nutrientStockRoutes);
app.use("/api/scripts", scriptRoutes);

/* Health check + root */
app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

app.get("/", (req, res) => {
  res.send("API is running. Use /health for status or /api/* endpoints.");
});

/* ---------- CORS error middleware (clear message) -------- */
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith("CORS:")) {
    console.error("CORS Error:", err.message);
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

/* ------------------------ Final error handler ------------------------ */
app.use((err, req, res, next) => {
  console.error("Unhandled error in middleware:", err);
  const payload = { message: err.message || "Server error" };
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }
  res.status(err.status || 500).json(payload);
});
/* --------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log(
      "DEBUG: process.env.MONGO_URI present? ->",
      !!process.env.MONGO_URI
    );
    console.log(
      "Connecting to MongoDB... (using MONGO_URI?)",
      !!process.env.MONGO_URI
    );

    await connectDB();
    console.log("MongoDB Connected ✔");

    // Conditional seeding
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
