import express from "express";
import multer from "multer";
import exif from "exif-reader";
import sharp from "sharp";
import { Review, Restaurant, User } from "../models/schemas.js";
import { validateImageWithGemini, calculateDistance } from "../services/validationService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("photo"), async (req: any, res: any) => {
  try {
    const { restaurant_id, user_id, rating, text } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Photo is required" });
    }

    // 1. Extract EXIF Data
    let exifData: any = null;
    try {
      const metadata = await sharp(file.buffer).metadata();
      if (metadata.exif) {
        exifData = exif(metadata.exif);
      }
    } catch (e) {
      console.warn("Could not extract EXIF data", e);
    }

    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    let isVerified = false;
    let verificationDetails = {
      location_match_score: 0,
      authenticity_score: 0,
      description: "No EXIF data found"
    };

    if (exifData && exifData.gps && exifData.image && exifData.image.ModifyDate) {
      const photoLat = exifData.gps.GPSLatitude;
      const photoLng = exifData.gps.GPSLongitude;
      const photoTime = new Date(exifData.image.ModifyDate);
      const now = new Date();

      // Check timestamp (within 48 hours)
      const hoursDiff = Math.abs(now.getTime() - photoTime.getTime()) / (1000 * 60 * 60);
      
      // Check distance (within 100 meters)
      const distance = calculateDistance(
        photoLat, photoLng, 
        restaurant.coordinates.lat, restaurant.coordinates.lng
      );

      if (hoursDiff <= 48 && distance <= 100) {
        // 2. Gemini Image Validation
        const aiResult = await validateImageWithGemini(file.buffer, file.mimetype);
        
        verificationDetails = {
          location_match_score: aiResult.location_match_score,
          authenticity_score: aiResult.authenticity_score,
          description: aiResult.description_of_image
        };

        if (aiResult.authenticity_score >= 70) {
          isVerified = true;
        }
      }
    }

    // Save review (In a real app, we'd save the image to S3/Cloudinary)
    // For now, we'll just use a placeholder URL or base64
    const review = new Review({
      user_id,
      restaurant_id,
      rating,
      text,
      photo: "https://picsum.photos/seed/restaurant/800/600", // Placeholder
      verified: isVerified,
      verification_details: verificationDetails,
      geo_location: exifData?.gps ? { lat: exifData.gps.GPSLatitude, lng: exifData.gps.GPSLongitude } : null,
      photo_timestamp: exifData?.image?.ModifyDate ? new Date(exifData.image.ModifyDate) : null
    });

    await review.save();

    // Log activity
    await User.findByIdAndUpdate(user_id, {
      $push: { activity_log: { action: "POST_REVIEW", details: `Reviewed ${restaurant.name}` } }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/restaurant/:id", async (req, res) => {
  const reviews = await Review.find({ restaurant_id: req.params.id }).populate("user_id", "name avatar");
  res.json(reviews);
});

export default router;
