import React, { useState } from "react";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Layers, Play, CheckCircle2, ChevronRight, LifeBuoy, MessageSquare, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Capabilities list with live search filtering for Section 3
  const capabilities = [
    { title: "Smart Ticket Triage & Routing", desc: "Advanced classification pipelines automatically scan incoming tickets, tag urgency levels, and assign them to the ideal support personnel.", tag: "AI Engine" },
    { title: "Real-Time Team Collaboration", desc: "Internal notes, threaded replies, and shared status boards keep your support engineers completely aligned on complex customer cases.", tag: "Collaboration" },
    { title: "Instant Knowledge Base Integration", desc: "Link help topics directly to common inquiries so users can self-serve before ever needing to raise a support ticket.", tag: "Self-Service" },
    { title: "Slack & Email Ecosystem", desc: "Automated thread bot and email-to-ticket pipelines for seamless tracking.", tag: "Integrations" }
  ];

  const filteredCapabilities = capabilities.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      <Navbar />

      {/* SECTION 1: HERO WITH ANIMATED AMBIENT GLOW (Clean as original) */}
      <section className="relative pt-36 pb-28 px-6 max-w-[1350px] mx-auto text-center overflow-hidden">
        {/* Dynamic Pulsing Ambient Glow */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 rounded-full blur-[150px] pointer-events-none" 
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Animated Badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-[0.25em] mb-8 shadow-lg shadow-indigo-500/10 backdrop-blur-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            SupportFlow AI Resolution Engine v3.5 Live
          </motion.div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.08]">
            Resolve Customer Issues with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400 bg-clip-text text-transparent font-serif italic font-normal">
              Ultimate Speed & Precision
            </span>
          </h1>

          <p className="mt-8 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Transform chaotic support tickets into seamless resolutions. Automated routing, instant AI triage, and collaborative helpdesk workflows in real time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
              whileTap={{ scale: 0.97 }}
              href="/create-ticket"
              className="w-full sm:w-auto bg-indigo-600 text-white px-9 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition duration-300 flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30"
            >
              Raise New Ticket <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              whileTap={{ scale: 0.97 }}
              href="/help"
              className="w-full sm:w-auto bg-white/[0.03] border border-white/10 text-slate-200 px-9 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-indigo-400" /> Explore Help Center
            </motion.a>
          </div>

          {/* Interactive Preview Card with Floating Effect */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 relative bg-slate-900/70 backdrop-blur-2xl border border-indigo-500/20 p-3 sm:p-5 rounded-3xl shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
            <div className="bg-[#0b0e17] rounded-2xl p-6 sm:p-10 border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8 text-left relative z-10">
              <div className="space-y-4 max-w-md">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-indigo-500/15 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 inline-block">
                  ● Active Support Queue #4092
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Cloud Infrastructure Gateway Issue</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Automated priority matching assigned to Tier-2 Engineering. Sentiment analysis indicates urgent client blocker.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" /> AI Resolution Match (98.2%)
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-full lg:w-72 bg-slate-900/95 p-5 rounded-xl border border-indigo-500/20 space-y-3 font-mono text-xs shadow-inner"
              >
                <div className="flex justify-between text-slate-400 border-b border-white/10 pb-2">
                  <span>Ticket Status</span>
                  <span className="text-emerald-400 font-bold">In Progress</span>
                </div>
                <p className="text-slate-200 leading-relaxed">"Patch deployed for database timeout. Awaiting client test confirmation."</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" 
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trusted Partners */}
        <div className="mt-28 pt-12 border-t border-white/10">
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.3em] mb-8 font-mono">
            Trusted by support and customer success teams at top global enterprises
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 opacity-40 hover:opacity-90 transition duration-500">
            {["Zendesk", "Intercom", "Freshdesk", "Salesforce", "Jira Service", "HubSpot"].map((brand, i) => (
              <motion.span 
                key={i} 
                whileHover={{ scale: 1.1, color: "#818cf8" }}
                className="font-bold tracking-wider text-sm sm:text-base font-mono text-slate-300 cursor-pointer transition-colors"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: METRICS BANNER */}
      <section className="py-20 bg-[#0b0e17] border-t border-b border-white/10 relative">
        <div className="max-w-[1250px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          {[
            { metric: "4x", label: "Faster Resolution", desc: "Automated routing cuts down initial ticket handling time significantly." },
            { metric: "99.1%", label: "Satisfaction Rate", desc: "Engineered for absolute client satisfaction and transparent communication." },
            { metric: "Zero", label: "Lost Queries", desc: "Guaranteed tracking from submission to permanent case closure." },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="pt-6 md:pt-0 px-6"
            >
              <h3 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent font-mono">{item.metric}</h3>
              <p className="text-sm font-bold mt-2 text-white">{item.label}</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CORE CAPABILITIES GRID WITH SEARCH FILTER */}
      <section className="py-32 px-6 max-w-[1350px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-indigo-400 font-bold">Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">Architected for Resolution</h2>
          </div>
          <div className="w-full md:w-72 mt-4 md:mt-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter capabilities..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white shadow-inner outline-none transition placeholder:text-white/30 focus:border-indigo-500/60 focus:bg-white/[0.07]"
            />
          </div>
        </div>

        {filteredCapabilities.length === 0 ? (
          <div className="text-center py-20 bg-[#0b0e17] rounded-3xl border border-white/10">
            <p className="text-sm text-slate-400 font-mono">No matching capabilities found for "{searchQuery}".</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-xs text-indigo-400 underline hover:text-indigo-300"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredCapabilities.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-[#0b0e17] border border-white/10 p-10 rounded-3xl hover:border-indigo-500/50 transition duration-500 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition shadow-sm">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-10 bg-[#07080c] border border-white/5 p-6 rounded-2xl h-28 flex items-center justify-center text-slate-500 text-xs font-mono group-hover:border-indigo-500/25 transition">
                  [ Interactive Live Module View ]
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Highlight Sub-box */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mt-12 bg-[#0b0e17] border border-white/10 p-10 sm:p-14 rounded-3xl text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Instant Knowledge Base Integration</h3>
          <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto font-light leading-relaxed">
            Link help topics directly to common inquiries so users can self-serve before ever needing to raise a support ticket.
          </p>
          <div className="mt-8">
            <a href="/help" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-white transition">
              Explore Help Center Directory <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: INTEGRATIONS */}
      <section className="py-24 bg-[#0b0e17] border-t border-b border-white/10">
        <div className="max-w-[1250px] mx-auto px-6 text-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-indigo-400 font-bold">ECOSYSTEM</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 mb-12 text-white">Seamless Integrations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Slack Support", desc: "Automated Thread Bot" },
              { name: "GitHub Issues", desc: "Bug Sync Pipeline" },
              { name: "Stripe Billing", desc: "Account Status Hook" },
              { name: "Gmail Workspace", desc: "Email-to-Ticket Pipe" },
            ].map((app, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.03, borderColor: "rgba(99, 102, 241, 0.4)" }}
                className="bg-[#07080c] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition cursor-pointer shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-bold text-indigo-400 font-mono text-sm shadow-inner">
                  {app.name[0]}
                </div>
                <span className="text-sm font-bold text-white">{app.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono">● Connected</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="py-32 px-6 max-w-[900px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-indigo-400 font-bold">SUPPORT & CLARITY</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 mt-2 font-light">Quick answers regarding ticketing, SLAs, security, and workflows.</p>
        </div>

        <div className="space-y-4">
          {[
            "How does SupportFlow automate ticket routing?",
            "Can I customize ticket priorities and workflow stages?",
            "How secure is our enterprise customer and support data?",
            "Can team members leave internal notes invisible to clients?",
            "Does SupportFlow provide real-time email & slack alerts?",
            "How do I export support metrics and ticket resolution logs?"
          ].map((q, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ scale: 1.01 }}
              className="bg-[#0b0e17] border border-white/10 p-6 rounded-2xl flex justify-between items-center hover:border-indigo-500/50 transition cursor-pointer group shadow-md"
            >
              <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition">{q}</span>
              <span className="w-7 h-7 rounded-full bg-white/[0.03] flex items-center justify-center text-slate-400 font-mono text-xs border border-white/10 group-hover:border-indigo-500/40 group-hover:text-indigo-400 transition">+</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: GRAND FINAL CTA */}
      <section className="relative py-36 px-6 text-center overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0b0e17] to-[#07080c]">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-indigo-400 font-bold">READY TO DEPLOY</span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mt-3 text-white">
            Stop Chasing Tickets. <br />
            <span className="text-indigo-400 font-serif italic font-normal">Start Delivering Solutions.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-6 max-w-lg mx-auto font-light leading-relaxed">
            Let SupportFlow handle your customer queues and resolution pipelines while your team focuses entirely on scaling satisfaction.
          </p>
          <div className="mt-10">
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              href="/create-ticket"
              className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition duration-300 shadow-2xl shadow-indigo-600/30"
            >
              Raise Your First Ticket <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;