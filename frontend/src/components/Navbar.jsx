import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  UserRound,
  LifeBuoy,
  Sparkles,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", path: "/", protected: false },
  { name: "Tickets", path: "/tickets", protected: true },
  { name: "Help Center", path: "/help", protected: false },
  { name: "About", path: "/about", protected: false },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  // 🔒 Check Authentication Token from localStorage
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  const isActive = (path) => location.pathname === path;

  // 🔐 Protected Navigation Handler
  const handleProtectedNavigation = (e, path) => {
    e.preventDefault();
    setMobileOpen(false);

    if (isAuthenticated) {
      navigate(path);
    } else {
      // Professional UX: Redirect to login with intended target path
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  // 🚪 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔍 Handle Search Submission
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/help?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* ================= DESKTOP / TABLET NAVBAR ================= */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 lg:px-10 pt-5"
      >
        <nav className="max-w-[1450px] mx-auto">
          <motion.div
            whileHover={{ borderColor: "rgba(99, 102, 241, 0.35)" }}
            transition={{ duration: 0.4 }}
            className="
              relative
              flex items-center justify-between
              h-[74px]
              px-6 md:px-8
              rounded-2xl
              border border-white/10
              bg-[#07080c]/85
              backdrop-blur-2xl
              shadow-[0_20px_50px_rgba(0,0,0,0.6)]
              overflow-hidden
            "
          >
            {/* Dynamic Ambient Backlight Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/[0.08] via-violet-600/[0.04] to-sky-500/[0.08] pointer-events-none" />
            
            {/* Subtle top border illumination line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />

            {/* ================= LOGO ================= */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="relative z-10 flex items-center gap-3.5 group"
            >
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="
                  relative
                  w-11 h-11
                  rounded-xl
                  bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400
                  text-white
                  flex items-center justify-center
                  shadow-lg shadow-indigo-600/30
                  overflow-hidden
                "
              >
                <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                <motion.div
                  animate={{ x: ["-150%", "150%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-y-0 w-8 bg-white/30 skew-x-12"
                />
              </motion.div>

              <div className="hidden sm:block">
                <p className="text-white font-black tracking-[0.2em] text-sm flex items-center gap-2">
                  SUPPORT<span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">FLOW</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500 animate-ping" />
                </p>
                <p className="text-[8px] tracking-[0.4em] text-slate-400 uppercase font-mono mt-0.5">
                  Seamless Resolution
                </p>
              </div>
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <div className="hidden lg:flex items-center gap-2 relative z-10 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl shadow-inner">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => item.protected ? handleProtectedNavigation(e, item.path) : null}
                  className="
                    relative
                    px-4 py-2
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    font-medium
                    text-slate-400
                    hover:text-white
                    transition-all duration-300
                  "
                >
                  {item.name}

                  {isActive(item.path) && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className="
                        absolute
                        inset-0
                        bg-indigo-600/15
                        border border-indigo-500/40
                        rounded-lg
                        -z-10
                        shadow-[0_0_15px_rgba(99,102,241,0.2)]
                      "
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="hidden md:flex items-center gap-3 relative z-10">
              {/* Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.08, borderColor: "rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="
                  w-10 h-10
                  rounded-xl
                  border border-white/10
                  flex items-center justify-center
                  text-slate-300
                  hover:text-indigo-400
                  bg-white/[0.03]
                  transition-all
                  shadow-sm
                "
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Protected Raise Ticket CTA */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/login"
                  onClick={(e) => handleProtectedNavigation(e, "/login")}
                  className="
                    group
                    flex items-center gap-2.5
                    px-6 py-3
                    rounded-xl
                    bg-gradient-to-r from-indigo-600 to-violet-600
                    text-white
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    hover:from-indigo-500 hover:to-violet-500
                    shadow-xl shadow-indigo-600/30
                    transition-all duration-300
                  "
                >
                  New Ticket
                  <motion.span
                    whileHover={{ rotate: 45, scale: 1.2 }}
                    className="inline-flex transition-transform"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </motion.div>

              {/* Auth Status Button */}
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleLogout}
                  title="Logout"
                  className="
                    w-10 h-10
                    rounded-xl
                    border border-red-500/30
                    flex items-center justify-center
                    text-red-400
                    hover:bg-red-500/10
                    transition-all
                    shadow-sm
                  "
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                  <Link
                    to="/login"
                    title="Login"
                    className="
                      w-10 h-10
                      rounded-xl
                      border border-white/10
                      flex items-center justify-center
                      text-slate-300
                      hover:text-white
                      hover:border-indigo-500/40
                      bg-white/[0.03]
                      transition-all
                      shadow-sm
                    "
                  >
                    <UserRound className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>

            {/* ================= TABLET & MOBILE TOGGLES ================= */}
            <div className="flex md:hidden items-center gap-2.5 relative z-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-300 bg-white/[0.03]"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(true)}
                className="
                  w-10 h-10
                  rounded-xl
                  bg-indigo-600
                  text-white
                  flex items-center justify-center
                  shadow-lg shadow-indigo-600/40
                "
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* ================= WORKING SEARCH DROPDOWN ================= */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="
                  mt-3
                  rounded-2xl
                  border border-indigo-500/30
                  bg-[#0a0d16]/95
                  backdrop-blur-2xl
                  p-3.5
                  shadow-[0_25px_60px_rgba(0,0,0,0.8)]
                "
              >
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <Search className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="Type search & press Enter (e.g. ticket #4092)..."
                    className="
                      bg-transparent
                      outline-none
                      text-sm
                      text-white
                      placeholder:text-slate-500
                      w-full
                      font-light
                    "
                  />
                  <span className="hidden sm:inline-block text-[9px] tracking-widest text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                    ESC to close
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* ================= MOBILE FULL SCREEN DRAWER ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                fixed
                top-0 right-0
                bottom-0
                w-[90%] sm:w-[440px]
                bg-[#07080c]
                z-[120]
                border-l border-white/10
                flex flex-col
                shadow-2xl
              "
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-[0.2em] text-white flex items-center gap-1.5">
                      SUPPORT<span className="text-indigo-400">FLOW</span>
                    </p>
                    <p className="text-[7px] text-slate-400 tracking-[0.3em] uppercase font-mono">
                      Seamless Resolution
                    </p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(false)}
                  className="
                    w-10 h-10
                    rounded-xl
                    border border-white/10
                    flex items-center justify-center
                    text-slate-300
                    bg-white/[0.03]
                    hover:bg-white/10
                    transition
                  "
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 px-6 py-8 overflow-y-auto">
                <p className="text-[9px] uppercase tracking-[0.35em] text-indigo-400 font-mono mb-6 font-bold">
                  Navigation Directory
                </p>

                <div className="space-y-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.07,
                        duration: 0.4,
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={(e) => item.protected ? handleProtectedNavigation(e, item.path) : setMobileOpen(false)}
                        className="
                          group
                          flex items-center justify-between
                          p-4
                          rounded-2xl
                          border border-white/5
                          bg-white/[0.02]
                          hover:bg-indigo-600/10
                          hover:border-indigo-500/30
                          transition-all duration-300
                        "
                      >
                        <span
                          className={`text-xl sm:text-2xl font-bold tracking-tight transition ${
                            isActive(item.path)
                              ? "text-indigo-400 font-black"
                              : "text-slate-200 group-hover:text-indigo-300"
                          }`}
                        >
                          {item.name}
                        </span>

                        <div className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition">
                          <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-6 border-t border-white/10 bg-[#090b12]">
                <Link
                  to="/create-ticket"
                  onClick={(e) => handleProtectedNavigation(e, "/create-ticket")}
                  className="
                    flex items-center justify-center gap-3
                    w-full
                    bg-gradient-to-r from-indigo-600 to-violet-600
                    text-white
                    px-5 py-4
                    rounded-xl
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.18em]
                    shadow-xl shadow-indigo-600/30
                    hover:from-indigo-500 hover:to-violet-500
                    transition-all
                  "
                >
                  Raise New Ticket <ArrowUpRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 mt-5 text-slate-400 text-[10px] font-mono">
                  <LifeBuoy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Support • Resolve • Scale</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;