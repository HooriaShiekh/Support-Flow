import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Sparkles, 
    Cpu, 
    Terminal, 
    Workflow, 
    Radio, 
    Layers, 
    ArrowRight,
    Code2,
    CheckCircle,
    ShieldCheck
} from 'lucide-react';

const About = () => {
    const navigate = useNavigate();

    const metrics = [
        { label: 'Dispatch Latency', value: '< 2.4s', detail: 'Realtime Socket Dispatch', color: 'from-cyan-500 to-blue-600' },
        { label: 'Triage Accuracy', value: '99.4%', detail: 'Auto-category Matching', color: 'from-violet-500 to-purple-600' },
        { label: 'Live Active Mesh', value: '1,480+', detail: 'Verified Workers Online', color: 'from-pink-500 to-rose-600' },
        { label: 'Resolution Rate', value: '98.2%', detail: 'Completed & Closed Tickets', color: 'from-emerald-500 to-teal-600' }
    ];

    const pipelineSteps = [
        { id: '01', title: 'Ticket Ingestion', desc: 'User logs issue -> Socket.io emits payload -> Realtime validation.', icon: Terminal },
        { id: '02', title: 'Automated Routing', desc: 'Engine analyzes category & matches available category experts.', icon: Cpu },
        { id: '03', title: 'Worker Acceptance', desc: 'Specialist receives instant alert -> Accepts or passes to sub-mesh.', icon: Radio },
        { id: '04', title: 'Admin Governance', desc: 'Command center monitors response time & handles auto-escalations.', icon: ShieldCheck }
    ];

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden font-sans bg-[#05070d] text-slate-100">
            
            {/* Minimal Back Header */}
            <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between z-20">
                <motion.button
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all shadow-xl backdrop-blur-xl cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 text-indigo-400" />
                    <span>Back</span>
                </motion.button>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    SYSTEM ARCHITECTURE
                </div>
            </header>

            {/* Glowing Ambient Background Orbs */}
            <motion.div 
                animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.28, 0.15] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-cyan-600/30 blur-[180px]" 
            />

            <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24 relative z-10 flex flex-col items-center">
                
                {/* Hero Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-6 shadow-xl backdrop-blur-md"
                >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                    <span>SupportFlow Engine v3.5 Architecture</span>
                </motion.div>

                {/* Cyber Main Heading */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center max-w-4xl space-y-4 mb-16"
                >
                    <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-none uppercase">
                        Not Just A Helpdesk. <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent font-serif italic">A Real-Time Engine.</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Traditional support tickets get lost in slow email threads. SupportFlow replaces manual queuing with real-time socket events, category-based routing, and live admin oversight.
                    </p>
                </motion.div>

                {/* Bento Box Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
                    
                    {/* Big Feature Card 1 */}
                    <motion.div 
                        whileHover={{ y: -6 }}
                        className="md:col-span-2 p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0d1222]/90 to-[#070a14]/90 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none" />
                        
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                <Workflow className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-white">Event-Driven Architecture</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-lg">
                                Powered by Socket.io and Node.js backend. Every ticket status change, worker assignment, and feedback rating triggers instant UI updates across Customer, Worker, and Admin views without page refreshes.
                            </p>
                        </div>

                        {/* Interactive CLI Terminal Graphic */}
                        <div className="mt-8 p-4 rounded-2xl bg-black/60 border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1.5 shadow-inner">
                            <div className="flex items-center gap-2 text-slate-500 pb-2 border-b border-slate-800">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                <span className="text-[10px] ml-2">supportflow-kernel.log</span>
                            </div>
                            <div className="text-indigo-400">$ socket.emit('create_ticket', payload)</div>
                            <div className="text-emerald-400">✔ Matcher: Category 'Web Dev' matched with Worker #4092</div>
                            <div className="text-slate-500">&gt; Status: Assigned -&gt; In Progress [Latency: 14ms]</div>
                        </div>
                    </motion.div>

                    {/* Feature Card 2 */}
                    <motion.div 
                        whileHover={{ y: -6 }}
                        className="p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0d1222]/90 to-[#070a14]/90 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between group shadow-2xl"
                    >
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-white">Role Isolation</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Triple-layered RBAC (Role-Based Access Control) keeping Customer requests, Worker dashboards, and Admin controls strictly partitioned.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2 text-xs font-bold text-slate-300">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle className="w-4 h-4" /> Customer Workspace
                            </div>
                            <div className="flex items-center gap-2 text-indigo-400">
                                <CheckCircle className="w-4 h-4" /> Worker Portal
                            </div>
                            <div className="flex items-center gap-2 text-purple-400">
                                <CheckCircle className="w-4 h-4" /> System Admin Hub
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* System Metrics Strip */}
                <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
                    {metrics.map((m, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="p-5 rounded-2xl border border-slate-800/80 bg-[#0a0e1a]/80 backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className={`h-1 w-full bg-gradient-to-r ${m.color} absolute top-0 left-0`} />
                            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{m.value}</span>
                            <div className="text-xs font-bold text-slate-200 mt-1">{m.label}</div>
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{m.detail}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Workflow Pipeline */}
                <div className="w-full space-y-8 mb-20">
                    <div className="text-center space-y-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">STEP-BY-STEP PROTOCOL</span>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">How The Engine Operates</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pipelineSteps.map((step) => {
                            const IconComponent = step.icon;
                            return (
                                <motion.div 
                                    key={step.id}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-2xl border border-slate-800/80 bg-[#0d1222]/70 backdrop-blur-xl space-y-3 relative group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-mono font-black text-indigo-500/40 group-hover:text-indigo-400 transition-colors">{step.id}</span>
                                        <IconComponent className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h4 className="text-sm font-black text-white">{step.title}</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Call To Action */}
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="w-full max-w-4xl rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-blue-950/80 border border-indigo-500/30 p-8 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-2xl relative overflow-hidden"
                >
                    <div className="space-y-2 text-center sm:text-left relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            <Code2 className="w-3.5 h-3.5" /> Full Stack MERN Architecture
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">Experience SupportFlow Live</h3>
                        <p className="text-xs text-slate-300 font-medium">Test real-time ticket creation, role-switching, and resolution workflows.</p>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/home')}
                        className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-indigo-600/40 flex items-center gap-2 shrink-0 relative z-10 cursor-pointer"
                    >
                        <span>Go to Platform</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>

            </main>
        </div>
    );
};

export default About;