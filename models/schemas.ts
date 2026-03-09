import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default" },
  activity_log: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    details: String
  }]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  description: String,
  photos: [String],
  category: String,
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  photo: String,
  geo_location: {
    lat: Number,
    lng: Number
  },
  photo_timestamp: Date,
  verified: { type: Boolean, default: false },
  verification_details: {
    location_match_score: Number,
    authenticity_score: Number,
    description: String
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);

const commentSchema = new mongoose.Schema({
  review_id: { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
