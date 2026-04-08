import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, ChevronRight, CheckCircle, Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

const Home = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRest, setNewRest] = useState({ name: "", location: "", category: "Restaurant", description: "" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const url = search ? `/api/restaurants?q=${search}` : "/api/restaurants";
        const response = await fetch(url);
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRest.name || !newRest.location) return;
    
    setIsAdding(true);
    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRest,
          coordinates: { lat: 40.7128, lng: -74.0060 }, // Default coordinates
          photos: ["https://picsum.photos/seed/" + Math.random() + "/800/600"]
        })
      });
      const data = await response.json();
      setRestaurants([data, ...restaurants]);
      setShowAddModal(false);
      setNewRest({ name: "", location: "", category: "Restaurant", description: "" });
    } catch (error) {
      console.error("Error adding restaurant:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Generate 20 mock reviews
  const mockReviews = Array.from({ length: 20 }).map((_, i) => ({
    _id: `rev-${i}`,
    user: {
      name: ["Alex", "Jordan", "Taylor", "Casey", "Riley"][i % 5] + " " + ["W.", "M.", "S.", "K.", "L."][i % 5],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
    },
    restaurant: ["The Oat Milk Cafe", "Green Tea Garden", "Minimalist Bistro"][i % 3],
    rating: 4 + (i % 2),
    text: [
      "Absolutely incredible experience! The atmosphere was so calming.",
      "Best food I've had in a while. The verification process is so cool!",
      "Verified and delicious. Highly recommend the signature dish.",
      "A bit busy but worth it. The AI validation makes me trust these reviews more.",
      "Minimalist perfection. Everything from the decor to the plate was stunning."
    ][i % 5],
    photo: `https://picsum.photos/seed/rev-img-${i}/600/400`,
    verified: i % 4 !== 0, // Most are verified
    likes: 10 + i,
    timestamp: `${i + 1}h ago`
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <header className="text-center mb-16">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight"
        >
          Authentic Reviews.<br />
          <span className="text-tea-dark">Verified by AI.</span>
        </motion.h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-10">
          Discover restaurants with reviews you can actually trust.
          Every verified post is backed by geo-tagged photos and Gemini AI validation.
        </p>

        <div className="relative max-w-xl mx-auto flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or locations..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass border-none focus:ring-2 focus:ring-tea-dark outline-none dark:text-white shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-tea-dark text-white px-6 rounded-2xl font-bold shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            Add New
          </motion.button>
        </div>
      </header>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold">
            {search ? `Search Results for "${search}"` : "Trending Restaurants"}
          </h2>
          {!search && (
            <button className="text-tea-dark font-semibold flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {restaurants.map((rest, idx) => (
              <motion.div
                key={rest._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={`/restaurant/${rest._id}`}>
                  <div className="glass-card overflow-hidden !p-0 hover:shadow-2xl">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={rest.photos[0]}
                        alt={rest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-colors">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{rest.averageRating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold mb-1">{rest.name}</h3>
                      <div className="flex items-center gap-1 text-muted text-sm mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{rest.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium px-3 py-1 bg-tea/50 dark:bg-tea-dark/30 text-tea-dark dark:text-tea-200 rounded-full transition-colors">
                          {rest.category}
                        </span>
                        <span className="text-xs text-muted">Reviews</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 dark:bg-slate-900/40 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-muted mb-6">No restaurants found matching your search.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-tea-dark text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
              Add {search} to ForkProof
            </button>
          </div>
        )}
      </section>

      {/* Add Restaurant Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass rounded-[40px] p-10 shadow-2xl"
            >
              <h2 className="text-3xl font-display font-bold mb-8">Add New Restaurant</h2>
              <form onSubmit={handleAddRestaurant} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-2xl bg-white/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-tea-dark p-4 outline-none transition-colors"
                    placeholder="Enter name..."
                    value={newRest.name}
                    onChange={e => setNewRest({ ...newRest, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">Location</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-2xl bg-white/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-tea-dark p-4 outline-none transition-colors"
                    placeholder="Address or City..."
                    value={newRest.location}
                    onChange={e => setNewRest({ ...newRest, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">Category</label>
                  <select
                    className="w-full rounded-2xl bg-white/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-tea-dark p-4 outline-none appearance-none transition-colors"
                    value={newRest.category}
                    onChange={e => setNewRest({ ...newRest, category: e.target.value })}
                  >
                    <option>Breakfast & Brunch</option>
                    <option>Italian</option>
                    <option>Japanese</option>
                    <option>Cafe</option>
                    <option>Fine Dining</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full bg-tea-dark text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Add Restaurant"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold">Recent Community Activity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockReviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full border border-white dark:border-slate-700 shadow-sm transition-colors" />
                  <div>
                    <h4 className="font-bold text-sm">{review.user.name}</h4>
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">{review.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full transition-colors">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold">{review.rating}.0</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                  <img src={review.photo} alt="Food" className="w-full h-full object-cover" />
                  {review.verified && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h5 className="font-display font-bold text-sm mb-1">{review.restaurant}</h5>
                    <p className="text-muted text-xs line-clamp-2 italic">"{review.text}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted">
                      <Heart className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{review.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted">
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-[10px] font-bold">Reply</span>
                    </div>
                    {review.verified && (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter transition-colors">Verified Visit</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
