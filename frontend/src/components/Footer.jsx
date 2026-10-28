import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, ArrowRight, Sparkles, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#050508] text-white">
      {/* Background Neon Glows Matching the Navbar Vibe */}
      <div className="pointer-events-none absolute -top-40 right-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-180px] left-[-120px] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
        
        {/* ================= CTA SECTION ================= */}
        <section className="border-b border-white/10 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end"
          >
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-indigo-400">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Streamline Your Queue
              </div>
              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
                Resolve tickets with
                <span className="block bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-200 bg-clip-text font-serif font-normal italic text-transparent">
                  unmatched precision.
                </span>
              </h2>
            </div>

            <Link
              to="/create-ticket"
              className="group flex w-fit items-center gap-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-600/40"
            >
              Raise New Ticket
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </section>

        {/* ================= MAIN FOOTER GRID ================= */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            
            {/* BRAND INFO */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <Link to="/" className="flex w-fit items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-xl font-black text-white shadow-md shadow-indigo-500/20">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xl font-black tracking-[0.15em]">
                    SUPPORT<span className="text-indigo-400">FLOW</span>
                  </div>
                  <div className="mt-1 text-[7px] uppercase tracking-[0.4em] text-white/40">
                    Seamless Resolution
                  </div>
                </div>
              </Link>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/50">
                Empowering support teams with intelligent ticket triage, automated routing, real-time collaboration, and ultimate customer satisfaction.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm text-white/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                </div>
                Karachi, Pakistan
              </div>

              <div className="mt-4 flex items-center gap-3 text-sm text-white/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
                  <Mail className="h-4 w-4 text-indigo-400" />
                </div>
                support@supportflow.com
              </div>
            </motion.div>

            {/* EXPLORE LINKS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h3 className="mb-7 text-[10px] uppercase tracking-[0.35em] text-indigo-400">
                Platform
              </h3>
              <div className="space-y-4">
                <Link to="/tickets" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  Active Tickets
                </Link>
                <Link to="/help" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  Help Center
                </Link>
                <Link to="/create-ticket" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  New Ticket
                </Link>
                <Link to="/knowledge" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  Knowledge Base
                </Link>
              </div>
            </motion.div>

            {/* COMPANY LINKS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h3 className="mb-7 text-[10px] uppercase tracking-[0.35em] text-indigo-400">
                Company
              </h3>
              <div className="space-y-4">
                <Link to="/about" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  About Us
                </Link>
                <Link to="/contact" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  Contact Team
                </Link>
                <Link to="/careers" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  Careers
                </Link>
                <Link to="/status" className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">
                  System Status
                </Link>
              </div>
            </motion.div>

            {/* NEWSLETTER */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:col-span-3"
            >
              <h3 className="mb-7 text-[10px] uppercase tracking-[0.35em] text-indigo-400">
                Stay Updated
              </h3>
              <p className="mb-5 text-sm leading-6 text-white/50">
                Get the latest helpdesk tips, feature updates, and product releases directly in your inbox.
              </p>
              <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-indigo-500/50">
                <input
                  type="email"
                  placeholder="Your work email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-xs text-white outline-none placeholder:text-white/25"
                />
                <button
                  type="button"
                  className="flex w-12 items-center justify-center bg-indigo-600 text-white transition hover:bg-indigo-500"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-[9px] text-white/30">
                No spam. Unsubscribe anytime.
              </p>
            </motion.div>

          </div>
        </section>

        {/* ================= SOCIAL SECTION ================= */}
        <section className="border-t border-white/10 py-7">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                Connect
              </span>
              <div className="h-px w-8 bg-white/10" />
              <div className="flex gap-2">
                <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-white/60 transition hover:-translate-y-1 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white">
                  in
                </a>
                <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs font-black text-white/60 transition hover:-translate-y-1 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white">
                  gh
                </a>
                <a href="#" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-white/60 transition hover:-translate-y-1 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white">
                  𝕏
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[9px] text-white/30">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
              Support systems fully operational
            </div>
          </div>
        </section>

        {/* ================= BOTTOM BAR ================= */}
        <section className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-[9px] uppercase tracking-[0.2em] text-white/40 md:text-left">
              © 2026 SupportFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-[9px] uppercase tracking-[0.15em] text-white/40 transition hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="text-[9px] uppercase tracking-[0.15em] text-white/40 transition hover:text-white">
                Terms
              </Link>
              <Link to="/help" className="text-[9px] uppercase tracking-[0.15em] text-white/40 transition hover:text-white">
                Help
              </Link>
            </div>
          </div>
        </section>

      </div>
    </footer>
  );
};

export default Footer;