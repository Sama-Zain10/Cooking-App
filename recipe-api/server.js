import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// DB
import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import favoritesRoutes from "./src/routes/favorites.routes.js";
import shoppingRoutes from "./src/routes/shopping-list.routes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4500",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (dev only)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🎉 Recipe API is running!",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
      },
      favorites: {
        getAll: "GET /api/favorites",
        add: "POST /api/favorites",
        remove: "DELETE /api/favorites/:recipeId",
        clear: "DELETE /api/favorites",
      },
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/shopping", shoppingRoutes); 
// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});