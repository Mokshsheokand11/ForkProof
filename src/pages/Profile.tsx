import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle, Star, Heart, MessageCircle, Clock, Settings, LogOut, AlertCircle } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user.id) {
        navigate("/auth");
        return;
      }
      try {
        const response = await fetch(`/api/users/${user.id}`);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
    window.location.reload();
  };

  if (loading && !profileData) return <div className="p-20 text-center font-display text-2xl text-tea-dark">Loading profile...</div>;

  const displayUser = profileData?.user || user;
  const stats = profileData?.stats || { totalReviews: 0, verifiedReviews: 0, likesReceived: 0 };
  const reviews = profileData?.reviews || [];
  const activity = profileData?.user?.activity_log || [];

  const filteredReviews = showOnlyVerified ? reviews.filter((r: any) => r.verified) : reviews;

  const tabs = [
    { id: "reviews", label: "Reviews" },
    { id: "comments", label: "Comments" },
    { id: "likes", label: "Likes" },
    { id: "activity", label: "Activity" }
  ];

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
            <h1 className="text-4xl font-display font-bold text-slate-800">{displayUser.name}</h1>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
            <div
              className="text-center md:text-left cursor-pointer group"
              onClick={() => { setActiveTab("reviews"); setShowOnlyVerified(false); }}
            >
              <span className={`block text-2xl font-bold transition-colors ${activeTab === 'reviews' && !showOnlyVerified ? 'text-tea-dark' : 'text-slate-800 group-hover:text-tea-dark'}`}>{stats.totalReviews}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Reviews</span>
            </div>
            <div
              className="text-center md:text-left cursor-pointer group"
              onClick={() => { setActiveTab("reviews"); setShowOnlyVerified(true); }}
            >
              <span className={`block text-2xl font-bold transition-colors ${showOnlyVerified ? 'text-emerald-600' : 'text-emerald-600/60 group-hover:text-emerald-600'}`}>{stats.verifiedReviews}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Verified</span>
            </div>
            <div
              className="text-center md:text-left cursor-pointer group"
              onClick={() => setActiveTab("likes")}
            >
              <span className={`block text-2xl font-bold transition-colors ${activeTab === 'likes' ? 'text-rose-500' : 'text-rose-500/60 group-hover:text-rose-500'}`}>{stats.likesReceived}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Likes</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-500 flex items-center gap-2 text-sm font-bold transition-colors"
          >
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
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-tea-dark' : 'text-slate-400 hover:text-slate-600'
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
                <div key={review._id} className="glass rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-800">{review.restaurant_id?.name || "Restaurant"}</h4>
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
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            {activity.map((item: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-tea/30 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-tea-dark" />
                </div>
                <div>
                  <p className="text-slate-700 font-medium">{item.action}: <span className="font-bold">{item.details}</span></p>
                  <span className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</span>
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
