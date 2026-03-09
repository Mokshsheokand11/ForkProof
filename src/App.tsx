import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Search, User, LogIn, Map as MapIcon, Star, CheckCircle, AlertCircle, Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pages
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

const Navbar = () => (
  <nav className="sticky top-0 z-50 glass border-b border-white/20 px-6 py-4 flex items-center justify-between">
    <Link to="/" className="flex items-center gap-2">
      <div className="w-10 h-10 bg-tea-dark rounded-xl flex items-center justify-center shadow-inner">
        <MapIcon className="text-white w-6 h-6" />
      </div>
      <span className="font-display font-bold text-xl tracking-tight text-slate-800">RestroCheck</span>
    </Link>
    
    <div className="flex items-center gap-6">
      <Link to="/" className="text-slate-600 hover:text-tea-dark transition-colors font-medium">Explore</Link>
      <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 shadow-sm hover:scale-105 transition-transform">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" referrerPolicy="no-referrer" />
      </Link>
    </div>
  </nav>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <footer className="py-12 px-6 text-center text-slate-500 text-sm border-t border-black/5 mt-12">
          <p>© 2026 RestroCheck. Authentic reviews, verified by AI.</p>
        </footer>
      </div>
    </Router>
  );
}
