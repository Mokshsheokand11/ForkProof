import express from "express";
import { Restaurant } from "../models/schemas.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  const query = q ? { name: { $regex: String(q), $options: "i" } } : {};
  const restaurants = await Restaurant.find(query as any);
  res.json(restaurants);
});

router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.json(restaurant);
});

router.post("/", async (req, res) => {
  const restaurant = new Restaurant(req.body);
  await restaurant.save();
  res.status(201).json(restaurant);
});

export default router;
