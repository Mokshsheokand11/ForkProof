import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass rounded-[40px] p-12 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-500">
            {isLogin ? "Sign in to your authentic food journey" : "Join the community of verified foodies"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border-none focus:ring-2 focus:ring-tea-dark outline-none text-slate-700"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border-none focus:ring-2 focus:ring-tea-dark outline-none text-slate-700"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border-none focus:ring-2 focus:ring-tea-dark outline-none text-slate-700"
            />
          </div>

          <button className="w-full bg-tea-dark text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
            {isLogin ? "Sign In" : "Sign Up"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-500 hover:text-tea-dark transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
