import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Star, MapPin, CheckCircle, AlertCircle, Heart, MessageCircle, Camera, Upload, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "motion/react";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResponse, revResponse] = await Promise.all([
          fetch(`/api/restaurants/${id}`),
          fetch(`/api/reviews/restaurant/${id}`)
        ]);
        const resData = await resResponse.json();
        const revData = await revResponse.json();
        setRestaurant(resData);
        setReviews(revData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!rating || !reviewText || !photo) {
      alert("Please provide a rating, review text, and a photo.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("restaurant_id", id!);
    formData.append("user_id", JSON.parse(localStorage.getItem("user") || "{}").id);
    formData.append("rating", rating.toString());
    formData.append("text", reviewText);
    formData.append("photo", photo);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setReviews([data, ...reviews]);
      setShowReviewModal(false);
      setRating(0);
      setReviewText("");
      setPhoto(null);
    } catch (error: any) {
      alert("Error posting review: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-display text-2xl text-tea-dark">Loading restaurant details...</div>;
  if (!restaurant) return <div className="p-20 text-center font-display text-2xl text-rose-500">Restaurant not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-[40px] overflow-hidden shadow-2xl mb-12">
        <img
          src={restaurant.photos[0]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-tea-dark text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-white" /> {restaurant.averageRating}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium">
              Breakfast & Brunch
            </span>
          </div>
          <h1 className="text-5xl font-display font-bold text-white mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-2">
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">About</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {restaurant.description}
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-800">Reviews</h2>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-tea-dark text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-tea-dark/90 transition-all flex items-center gap-2"
              >
                <Camera className="w-5 h-5" /> Post a Review
              </button>
            </div>

            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review._id} className="glass rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                      <div>
                        <h4 className="font-bold text-slate-800">{review.user.name}</h4>
                        <span className="text-xs text-slate-400">{review.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                    {review.text}
                  </p>

                  {review.photo ? (
                    <div className="rounded-2xl overflow-hidden mb-6 relative group">
                      <img src={review.photo} alt="Review" className="w-full h-64 object-cover" />
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ${review.verified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {review.verified ? (
                          <><CheckCircle className="w-3 h-3" /> Verified Visit</>
                        ) : (
                          <><AlertCircle className="w-3 h-3" /> Unverified Review</>
                        )}
                      </div>
                    </div>
                  ) : (
                    !review.verified && (
                      <div className="mb-6 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-sm font-medium">
                        <AlertCircle className="w-4 h-4" /> Unverified Review
                      </div>
                    )
                  )}

                  <div className="flex items-center gap-6 border-t border-black/5 pt-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                      <Heart className="w-5 h-5" /> <span className="text-sm font-bold">{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-tea-dark transition-colors">
                      <MessageCircle className="w-5 h-5" /> <span className="text-sm font-bold">Comment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <div className="glass rounded-[32px] p-8">
            <h3 className="text-xl font-display font-bold text-slate-800 mb-6">Location</h3>
            <div className="h-48 bg-tea/30 rounded-2xl mb-4 flex items-center justify-center text-tea-dark font-medium">
              <MapPin className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-slate-600 text-sm">{restaurant.location}</p>
          </div>

          <div className="glass rounded-[32px] p-8">
            <h3 className="text-xl font-display font-bold text-slate-800 mb-4">Photos</h3>
            <div className="grid grid-cols-2 gap-3">
              {restaurant.photos.slice(1).map((p, i) => (
                <img key={i} src={p} className="w-full h-24 object-cover rounded-xl" alt="Restro" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass rounded-[40px] p-10 shadow-2xl"
            >
              <button onClick={() => setShowReviewModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-display font-bold text-slate-800 mb-8">Post a Review</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        onClick={() => setRating(s)}
                        className={`w-8 h-8 cursor-pointer hover:text-amber-400 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Experience</label>
                  <textarea
                    className="w-full rounded-2xl bg-white/50 border-none focus:ring-2 focus:ring-tea-dark p-4 h-32 outline-none"
                    placeholder="Tell us about your visit..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Upload Photo (Must be Geo-tagged)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="border-2 border-dashed border-tea-dark/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-tea/5 hover:bg-tea/10 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-tea-dark" />
                    <span className="text-sm font-medium text-slate-500">
                      {photo ? photo.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">JPG, PNG up to 10MB</span>
                  </label>
                </div>

                <button
                  onClick={handleReviewSubmit}
                  disabled={submitting}
                  className="w-full bg-tea-dark text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting ? "Verifying & Posting..." : "Submit Verified Review"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RestaurantDetail;
