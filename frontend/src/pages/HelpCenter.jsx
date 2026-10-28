import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    HelpCircle, 
    Ticket, 
    UserCheck, 
    ShieldCheck, 
    Zap, 
    ChevronDown, 
    ArrowRight, 
    LifeBuoy, 
    Sparkles,
    MessageSquareText,
    ArrowLeft
} from 'lucide-react';

const HelpCenter = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);

    const categories = [
        {
            id: 'tickets',
            title: 'Ticket Management',
            description: 'Learn how to create, track, and update your support requests seamlessly.',
            icon: Ticket,
            color: 'from-indigo-500 via-blue-600 to-cyan-500',
            articlesCount: '8 Articles'
        },
        {
            id: 'workers',
            title: 'Worker Assignment',
            description: 'How our automated routing matches your issue with specialized experts.',
            icon: UserCheck,
            color: 'from-violet-500 via-purple-600 to-pink-500',
            articlesCount: '5 Articles'
        },
        {
            id: 'account',
            title: 'Account & Security',
            description: 'Manage your profile, password reset, and role-based workspace access.',
            icon: ShieldCheck,
            color: 'from-pink-500 via-rose-600 to-red-500',
            articlesCount: '6 Articles'
        },
        {
            id: 'resolution',
            title: 'Resolution Speed',
            description: 'Tips to get your tickets resolved faster with priority tagging.',
            icon: Zap,
            color: 'from-amber-500 via-orange-600 to-yellow-500',
            articlesCount: '4 Articles'
        }
    ];

    const faqs = [
        {
            id: 1,
            question: "How do I create a new support ticket?",
            answer: "Click on the 'NEW TICKET' button or the 'Create New Ticket' banner at the bottom. Fill in your issue title, category, worker preferences, and description to generate a request."
        },
        {
            id: 2,
            question: "How long does it take for a worker to accept my ticket?",
            answer: "Support Flow uses a real-time Socket.io engine to dispatch tickets instantly. Workers in your selected category get notified immediately and usually accept within 5 to 15 minutes."
        },
        {
            id: 3,
            question: "Can an Admin reassign my ticket to a different worker?",
            answer: "Yes! If a worker is unavailable or taking longer than expected, the System Admin can manually override and reassign your ticket to another available specialist from the Admin Command Center."
        },
        {
            id: 4,
            question: "How do I leave feedback and ratings for a worker?",
            answer: "Once your ticket status is marked as 'Completed', a feedback popup will appear on your My Tickets dashboard allowing you to rate the service from 1 to 5 stars."
        },
        {
            id: 5,
            question: "What should I do if my ticket status is marked as 'Rejected'?",
            answer: "A ticket may be rejected if the information provided is incomplete or outside the selected category scope. You can review the worker's note and generate a new ticket with updated details."
        }
    ];

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    const handleCreateTicketClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/customer/dashboard');
        } else {
            navigate('/login');
        }
    };

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden font-sans bg-[#06080e] text-slate-100">
            
            {/* Top Navigation Bar: Back Button Only */}
            <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between z-20">
                <motion.button
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all shadow-lg backdrop-blur-md cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 text-indigo-400" />
                    <span>Back</span>
                </motion.button>

                <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    SupportFlow Desk
                </div>
            </header>

            {/* Floating Glowing Background Orbs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.15, 0.3, 0.15],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[850px] rounded-full bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-sky-600/30 blur-[160px]" 
            />

            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    x: [0, -40, 0],
                    y: [0, 30, 0],
                    opacity: [0.1, 0.25, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute bottom-10 right-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[140px]" 
            />

            <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24 relative z-10 flex flex-col items-center">
                
                {/* Badge Animation */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-6 shadow-xl shadow-indigo-500/10 backdrop-blur-md"
                >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-300" />
                    <span>SupportFlow Knowledge Base v3.5</span>
                </motion.div>

                {/* Hero Text */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center max-w-3xl space-y-4 mb-10"
                >
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                        How can we <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent italic font-serif">help you</span> today?
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl mx-auto">
                        Search for answers, explore guides, or get in touch with our expert resolution engineers.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-2xl relative mb-16"
                >
                    <div className="relative group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:scale-110 group-focus-within:text-sky-300 transition-all duration-300" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type a question or keyword (e.g., ticket, worker, rating)..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl text-xs sm:text-sm font-bold border border-slate-800 bg-[#0d121f]/90 text-white placeholder-slate-500 outline-none backdrop-blur-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 shadow-2xl"
                        />
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
                >
                    {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                            <motion.div
                                key={cat.id}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-6 rounded-3xl border border-slate-800/80 bg-[#0d121f]/80 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col justify-between group cursor-pointer backdrop-blur-xl relative overflow-hidden"
                            >
                                <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-tr ${cat.color} opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500 pointer-events-none`} />

                                <div>
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-base font-black mb-1.5">{cat.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium line-clamp-3 mb-4">
                                        {cat.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50 text-[10px] font-black uppercase tracking-wider text-indigo-400">
                                    <span>{cat.articlesCount}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* FAQ Section */}
                <div className="w-full max-w-3xl space-y-6 mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-2 mb-8"
                    >
                        <h2 className="text-2xl font-black tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-xs text-slate-400">Quick answers to common queries about Support Flow</p>
                    </motion.div>

                    <div className="space-y-3.5">
                        {filteredFaqs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 text-xs text-slate-500 italic flex flex-col items-center gap-2"
                            >
                                <MessageSquareText className="w-6 h-6 text-slate-600" />
                                <span>No questions found matching "{searchQuery}". Try a different keyword!</span>
                            </motion.div>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <motion.div 
                                    layout
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl border border-slate-800 bg-[#0d121f]/80 hover:border-slate-700 transition-all duration-300 overflow-hidden"
                                >
                                    <button 
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm outline-none cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <HelpCircle className={`w-4 h-4 shrink-0 transition-colors ${activeFaq === faq.id ? 'text-sky-400' : 'text-indigo-400'}`} />
                                            {faq.question}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${activeFaq === faq.id ? 'rotate-180 text-indigo-400' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {activeFaq === faq.id && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs text-slate-400 font-medium border-t border-slate-800/40 leading-relaxed"
                                            >
                                                <p className="mt-3">{faq.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Direct Contact Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-4xl rounded-3xl bg-gradient-to-r from-indigo-900/50 via-violet-900/50 to-blue-900/50 border border-indigo-500/30 p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-2xl"
                >
                    <div className="space-y-2 text-center sm:text-left relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            <LifeBuoy className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> 24/7 Priority Support
                        </span>
                        <h3 className="text-lg sm:text-2xl font-black text-white">Still can't find your answer?</h3>
                        <p className="text-xs text-slate-300 font-medium">Create a service complaint ticket and our automated routing will match you with a specialist.</p>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreateTicketClick}
                        className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-indigo-600/40 flex items-center gap-2 shrink-0 relative z-10 cursor-pointer"
                    >
                        <span>Create New Ticket</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>

            </main>
        </div>
    );
};

export default HelpCenter;