import express from "express";
import { User, Review, Comment } from "../models/schemas.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });

  const reviews = await Review.find({ user_id: req.params.id }).populate("restaurant_id");
  const comments = await Comment.find({ user_id: req.params.id }).populate("review_id");
  const likedReviews = await Review.find({ likes: req.params.id }).populate("restaurant_id");

  res.json({
    user,
    reviews,
    comments,
    likedReviews,
    stats: {
      totalReviews: reviews.length,
      verifiedReviews: reviews.filter(r => r.verified).length,
      likesReceived: reviews.reduce((acc, r) => acc + r.likes.length, 0)
    }
  });
});

export default router;
