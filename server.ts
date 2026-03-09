import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes (to be created)
import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/users.js";

import { Restaurant } from "./models/schemas.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/restrocheck";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // Seed initial data if empty
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      await Restaurant.create([
        {
          name: "The Oat Milk Cafe",
          location: "123 Minimalist Way, Brooklyn, NY",
          coordinates: { lat: 40.7128, lng: -74.0060 },
          description: "A serene space dedicated to the art of plant-based brewing and organic brunch.",
          category: "Breakfast & Brunch",
          photos: ["https://picsum.photos/seed/cafe/800/600"],
          averageRating: 4.8
        },
        {
          name: "Green Tea Garden",
          location: "456 Zen Blvd, San Francisco, CA",
          coordinates: { lat: 37.7749, lng: -122.4194 },
          description: "Authentic Japanese tea garden experience with modern fusion bites.",
          category: "Japanese",
          photos: ["https://picsum.photos/seed/garden/800/600"],
          averageRating: 4.5
        }
      ]);
      console.log("Seed data created");
    }
  } catch (err) {
    console.warn("MongoDB connection failed. Using mock data mode.", err.message);
  }

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/restaurants", restaurantRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/users", userRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "RestroCheck API is running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
