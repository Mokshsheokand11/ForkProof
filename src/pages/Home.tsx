import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Star, ChevronRight, CheckCircle, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([
    {
      _id: "1",
      name: "The Oat Milk Cafe",
      location: "Brooklyn, NY",
      category: "Breakfast & Brunch",
      averageRating: 4.8,
      photos: ["https://picsum.photos/seed/cafe/400/300"]
    },
    {
      _id: "2",
      name: "Green Tea Garden",
      location: "San Francisco, CA",
      category: "Japanese",
      averageRating: 4.5,
      photos: ["https://picsum.photos/seed/garden/400/300"]
    },
    {
      _id: "3",
      name: "Minimalist Bistro",
      location: "Austin, TX",
      category: "Modern American",
      averageRating: 4.9,
      photos: ["https://picsum.photos/seed/bistro/400/300"]
    }
  ]);

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
          className="text-5xl md:text-7xl font-display font-bold text-slate-800 mb-6 tracking-tight"
        >
          Authentic Reviews.<br/>
          <span className="text-tea-dark">Verified by AI.</span>
        </motion.h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-10">
          Discover restaurants with reviews you can actually trust. 
          Every verified post is backed by geo-tagged photos and Gemini AI validation.
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search restaurants, cuisines, or locations..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl glass border-none focus:ring-2 focus:ring-tea-dark outline-none text-slate-700 shadow-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-slate-800">Trending Restaurants</h2>
          <button className="text-tea-dark font-semibold flex items-center gap-1 hover:underline">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
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
                <div className="glass rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={rest.photos[0]} 
                      alt={rest.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-800">{rest.averageRating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-slate-800 mb-1">{rest.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                      <MapPin className="w-3 h-3" />
                      <span>{rest.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-3 py-1 bg-tea/50 text-tea-dark rounded-full">
                        {rest.category}
                      </span>
                      <span className="text-xs text-slate-400">120+ Reviews</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-slate-800">Recent Community Activity</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockReviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-[32px] p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full border border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{review.user.name}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{review.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{review.rating}.0</span>
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
                    <h5 className="font-display font-bold text-slate-800 text-sm mb-1">{review.restaurant}</h5>
                    <p className="text-slate-600 text-xs line-clamp-2 italic">"{review.text}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Heart className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{review.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-[10px] font-bold">Reply</span>
                    </div>
                    {review.verified && (
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Verified Visit</span>
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
