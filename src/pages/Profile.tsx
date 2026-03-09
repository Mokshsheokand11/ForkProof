import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Star, Heart, MessageCircle, Clock, Settings, LogOut, AlertCircle } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  
  const user = {
    name: "Felix Arvid",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    stats: {
      totalReviews: 42,
      verifiedReviews: 38,
      likesReceived: 156
    }
  };

  const handleStatClick = (type: string) => {
    if (type === "reviews") {
      setActiveTab("reviews");
      setShowOnlyVerified(false);
    } else if (type === "verified") {
      setActiveTab("reviews");
      setShowOnlyVerified(true);
    } else if (type === "likes") {
      setActiveTab("likes");
      setShowOnlyVerified(false);
    }
  };

  const tabs = [
    { id: "reviews", label: "Reviews" },
    { id: "comments", label: "Comments" },
    { id: "likes", label: "Likes" },
    { id: "activity", label: "Activity" }
  ];

  const allReviews = [
    { id: 1, restaurant: "The Oat Milk Cafe", rating: 5.0, text: "Absolutely loved the vibe here. The verification process was easy and I feel good knowing my review helps others find real quality.", verified: true, date: "March 9, 2026" },
    { id: 2, restaurant: "Green Tea Garden", rating: 4.0, text: "Great tea, but the wait was long. Still, the food was authentic.", verified: true, date: "March 8, 2026" },
    { id: 3, restaurant: "Minimalist Bistro", rating: 3.0, text: "It was okay, but I've had better. Not verified because I forgot to take a photo.", verified: false, date: "March 7, 2026" },
    { id: 4, restaurant: "The Oat Milk Cafe", rating: 5.0, text: "Second time here, even better than the first!", verified: true, date: "March 6, 2026" },
  ];

  const filteredReviews = showOnlyVerified ? allReviews.filter(r => r.verified) : allReviews;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      {/* Profile Header */}
      <div className="glass rounded-[40px] p-10 mb-12 flex flex-col md:flex-row items-center gap-10 shadow-sm">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-40 h-40 rounded-full border-4 border-white shadow-xl" />
          <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <h1 className="text-4xl font-display font-bold text-slate-800">{user.name}</h1>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
            <div 
              className="text-center md:text-left cursor-pointer group"
              onClick={() => handleStatClick("reviews")}
            >
              <span className={`block text-2xl font-bold transition-colors ${activeTab === 'reviews' && !showOnlyVerified ? 'text-tea-dark' : 'text-slate-800 group-hover:text-tea-dark'}`}>{user.stats.totalReviews}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Reviews</span>
            </div>
            <div 
              className="text-center md:text-left cursor-pointer group"
              onClick={() => handleStatClick("verified")}
            >
              <span className={`block text-2xl font-bold transition-colors ${showOnlyVerified ? 'text-emerald-600' : 'text-emerald-600/60 group-hover:text-emerald-600'}`}>{user.stats.verifiedReviews}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Verified</span>
            </div>
            <div 
              className="text-center md:text-left cursor-pointer group"
              onClick={() => handleStatClick("likes")}
            >
              <span className={`block text-2xl font-bold transition-colors ${activeTab === 'likes' ? 'text-rose-500' : 'text-rose-500/60 group-hover:text-rose-500'}`}>{user.stats.likesReceived}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Likes</span>
            </div>
          </div>
          
          <button className="text-slate-400 hover:text-rose-500 flex items-center gap-2 text-sm font-bold transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-black/5 mb-10 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== 'reviews') setShowOnlyVerified(false);
            }}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-tea-dark' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-tea-dark rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {activeTab === "reviews" && (
          <div>
            {showOnlyVerified && (
              <div className="mb-6 flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" /> Showing Only Verified Reviews
                </div>
                <button 
                  onClick={() => setShowOnlyVerified(false)}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Show All
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredReviews.map(review => (
                <div key={review.id} className="glass rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-800">{review.restaurant}</h4>
                    <div className="flex gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                    {review.text}
                  </p>
                  <div className="flex items-center justify-between">
                    {review.verified ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        <AlertCircle className="w-3 h-3" /> Unverified
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-tea/30 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-tea-dark" />
                </div>
                <div>
                  <p className="text-slate-700 font-medium">You posted a verified review for <span className="font-bold">Minimalist Bistro</span></p>
                  <span className="text-xs text-slate-400">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
