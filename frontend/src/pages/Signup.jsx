import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Mail, Phone, Lock, ArrowRight, Wrench, Cpu, Briefcase, HelpCircle, LifeBuoy } from 'lucide-react';
import API from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    role: 'user', // Default role configuration
    category: ''   // Worker ke liye category field
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Agar role user hai toh category empty ya undefined kar do
      const payload = {
        ...formData,
        category: formData.role === 'worker' ? formData.category : undefined
      };

      await API.post('/auth/signup', payload);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2800);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#070913] p-4 text-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Background Animated Neon Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 right-[-100px] h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[140px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.2, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-[-180px] left-[-120px] h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[140px]" 
      />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] [background-size:36px_36px] pointer-events-none"></div>

      {/* ================= WANDERING CUTE AI ROBOT (Support Assistant Theme) ================= */}
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
            alt="Cute AI Robot" 
            className="w-full h-full object-cover scale-110 animate-pulse"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0d16]" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold">
            Support Bot
          </p>
          <p className="text-[11px] text-slate-200 font-medium">
            "Here to assist setup!"
          </p>
        </div>
      </motion.div>

      {/* ================= EVENTORA SUPPORT FLOW CONTAINER ================= */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d1224]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        
        {/* Support Ticket / Flow Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/30">
              <LifeBuoy className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/25">
                  Ticket #SPF-REG
                </span>
              </div>
              <h1 className="text-base font-bold tracking-tight text-white mt-0.5">Eventora Support Desk</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            Live Flow
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
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
              <div>
                <h3 className="font-serif text-2xl text-white">Support Ticket Resolved</h3>
                <p className="mt-1 text-xs tracking-wide text-indigo-300">Account provisioned! Routing to login...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">Registration Assistance</h2>
                <p className="mt-1 text-xs font-light text-white/50">Provide your profile info below to generate your Eventora session.</p>
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

              <form onSubmit={handleSignup} className="space-y-4">
                
                {/* Role Selector Tabs (Support Flow Style) */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">Select Account Type</label>
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5">
                    {[
                      { id: 'user', label: 'User / Participant', icon: User },
                      { id: 'worker', label: 'Service Worker', icon: Wrench },
                    ].map((roleOption) => {
                      const IconComponent = roleOption.icon;
                      const isSelected = formData.role === roleOption.id;
                      return (
                        <button
                          key={roleOption.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: roleOption.id })}
                          className={`relative flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30"
                              : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          {roleOption.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Category Field if Worker is Selected */}
                {formData.role === 'worker' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1.5"
                  >
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">Worker Category</label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                        <Briefcase className="w-4 h-4" />
                      </span>
                      <input 
                        type="text" 
                        name="category" 
                        placeholder="e.g. Catering, Decoration, Security" 
                        value={formData.category}
                        onChange={handleChange} 
                        required={formData.role === 'worker'}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3 text-xs text-white shadow-inner outline-none transition placeholder:text-white/20 focus:border-indigo-500/60 focus:bg-white/[0.05]"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">Full Name</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Hooria Zahoor" 
                      value={formData.name}
                      onChange={handleChange} 
                      required 
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3 text-xs text-white shadow-inner outline-none transition placeholder:text-white/20 focus:border-indigo-500/60 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">Email Address</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="name@example.com" 
                      value={formData.email}
                      onChange={handleChange} 
                      required 
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3 text-xs text-white shadow-inner outline-none transition placeholder:text-white/20 focus:border-indigo-500/60 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">Contact Number</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input 
                      type="tel" 
                      name="contactNumber" 
                      placeholder="03XXXXXXXXX" 
                      value={formData.contactNumber}
                      onChange={handleChange} 
                      required 
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3 text-xs text-white shadow-inner outline-none transition placeholder:text-white/20 focus:border-indigo-500/60 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">Password</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleChange} 
                      required 
                      minLength={6}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3 text-xs text-white shadow-inner outline-none transition placeholder:text-white/20 focus:border-indigo-500/60 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit" 
                  disabled={loading}
                  className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-[length:200%_auto] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-indigo-600/30 transition-all duration-500 hover:bg-[position:right_center] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 animate-spin text-indigo-200" />
                      <span>Processing Support Request...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-xs text-white/40">
                  Already registered?{' '}
                  <Link to="/login" className="font-semibold text-indigo-400 tracking-wide hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Signup;