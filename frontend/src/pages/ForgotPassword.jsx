import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, ArrowRight, Cpu, ArrowLeft } from 'lucide-react';
import API from '../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // <-- Fix: Added missing pageLoading state
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Initial page load loader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await API.post('/auth/forgot-password', {
        email: email.trim(),
      });

      setMessage(response.data.message || 'Password reset link sent to your email.');
      setIsSuccess(true); 

      // 1.5 second baad user ko Reset Password page par redirect kar dein
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#070913]">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xl shadow-indigo-500/40">
            <Cpu className="w-7 h-7 animate-spin text-indigo-100" />
          </div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-indigo-400 uppercase">Loading Module...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#070913] p-4 text-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Background Animated Neon Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 right-[-100px] h-[450px] w-[450px] rounded-full bg-indigo-600/25 blur-[140px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-[-180px] left-[-120px] h-[450px] w-[450px] rounded-full bg-blue-600/25 blur-[140px]" 
      />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] [background-size:36px_36px] pointer-events-none"></div>

      {/* ================= WANDERING CUTE AI ROBOT ================= */}
      <motion.div
        animate={{
          x: [0, 45, -30, 35, 0],
          y: [0, -30, 25, -15, 0],
          rotate: [0, 6, -6, 4, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-6 right-6 lg:right-16 z-30 pointer-events-none hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-indigo-500/45 bg-[#0a0d16]/85 backdrop-blur-2xl shadow-[0_0_35px_rgba(99,102,241,0.35)]"
      >
        <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-indigo-400/50 bg-indigo-950/60 flex items-center justify-center shadow-lg">
          <img 
            src="https://thumbs.dreamstime.com/b/cute-robotic-character-glowing-eyes-pink-blue-background-369464025.jpg" 
            alt="Robot" 
            className="w-full h-full object-cover scale-110 animate-pulse"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0d16]" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold">
            Assistant
          </p>
          <p className="text-[11px] text-slate-200 font-medium">
            "Need recovery help?"
          </p>
        </div>
      </motion.div>

      {/* ================= FORGOT PASSWORD CONTAINER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d1224]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
      >
        
        {/* Simple Header with Pulse Icon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
            </motion.div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">Eventora</h1>
              <p className="text-[11px] text-slate-400">Account Recovery Module</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* MAGICAL SUCCESS ANIMATION WITH ORBITAL LOADER */
            <motion.div 
              key="success"
              initial={{ scale: 0.85, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 py-12 text-center"
            >
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-3xl border-2 border-dashed border-indigo-500/60"
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xl shadow-indigo-500/50">
                  <Sparkles className="h-8 w-8 animate-bounce" />
                </div>
              </div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-serif text-2xl text-white">Email Sent Successfully</h3>
                <p className="mt-1 text-xs tracking-wide text-indigo-300">{message}</p>
              </motion.div>
              <div className="pt-2">
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            </motion.div>
          ) : (
            /* INPUT FORM */
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">Forgot Password?</h2>
                <p className="mt-1 text-xs font-light text-white/50">Enter your email address to receive reset instructions.</p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                
                {/* Email Input */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-1.5"
                >
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">Email Address</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400 transition-colors group-focus-within:text-indigo-300">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3.5 text-xs text-white shadow-inner outline-none transition-all duration-300 placeholder:text-white/20 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </motion.div>

                {/* Magical Submit Button with Spinner */}
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.015, boxShadow: "0 0 25px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.985 }}
                  type="submit" 
                  disabled={loading}
                  className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-[length:200%_auto] py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-indigo-600/30 transition-all duration-500 hover:bg-[position:right_center] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 animate-spin text-indigo-200" />
                      <span>Sending Instructions...</span>
                    </div>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-2 text-center"
              >
                <p className="text-xs text-white/40">
                  Remember your password?{' '}
                  <Link to="/login" className="font-semibold text-indigo-400 tracking-wide hover:underline transition-colors">
                    Sign In
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default ForgotPassword;