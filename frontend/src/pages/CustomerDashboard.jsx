import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, UserCheck, Layers, Send, CheckCircle2, AlertCircle, Sun, Moon, Cpu } from 'lucide-react';
import Navbar from '../components/customerNav';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]); // DB se aane wali categories
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // 1. Page load par DB se unique categories fetch karna
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('${import.meta.env.VITE_BACKEND_URI}/api/tickets/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // 2. Jab category select ho, toh us category ke workers fetch karna
    useEffect(() => {
        if (!category) {
            setWorkers([]);
            setSelectedWorker('');
            return;
        }

        const fetchWorkers = async () => {
            setLoadingWorkers(true);
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/tickets/workers/${category}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWorkers(response.data);
            } catch (error) {
                console.error("Error fetching workers:", error);
            } finally {
                setLoadingWorkers(false);
            }
        };

        fetchWorkers();
    }, [category]);

    // Ticket Submit Handler with Redirection
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('${import.meta.env.VITE_BACKEND_URI}/api/tickets/create', {
                title,
                description,
                category,
                assignedWorker: selectedWorker || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`Success! Ticket ID: ${response.data.ticket.ticketId}. Redirecting...`);
            setIsSuccess(true);
            setTitle('');
            setDescription('');
            setCategory('');
            setSelectedWorker('');

            // Ticket create hone ke baad My Tickets page par redirect karna
            setTimeout(() => {
                navigate('/my-tickets');
            }, 1500);

        } catch (error) {
            setIsSuccess(false);
            setMessage(error.response?.data?.error || 'Something went wrong');
        }
    };

    if (pageLoading) {
        return (
            <div className={`flex min-h-screen items-center justify-center ${isDarkMode ? 'bg-[#070403] text-[#f4eae3]' : 'bg-slate-50 text-slate-900'}`}>
                <div className="flex flex-col items-center gap-3">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-2xl border-2 border-dashed border-indigo-500"
                        />
                        <Cpu className="h-6 w-6 animate-pulse text-indigo-500" />
                    </div>
                    <p className="text-xs font-mono tracking-widest uppercase opacity-60">Loading Portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#070403] text-[#f4eae3]' : 'bg-slate-100 text-slate-900'}`}>
            
            {/* Navbar Rendered Here */}
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

            <div className="flex flex-1 w-full items-center justify-center p-4 sm:p-8 relative">
                {/* Background Orbs */}
                <motion.div 
                    animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className={`pointer-events-none absolute -top-32 left-[-100px] h-[400px] w-[400px] rounded-full blur-[130px] ${isDarkMode ? 'bg-indigo-600/20' : 'bg-indigo-400/20'}`} 
                />

                <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`relative z-10 w-full max-w-2xl rounded-3xl border p-6 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
                        isDarkMode 
                            ? 'border-white/10 bg-[#0d1224]/85 text-white shadow-indigo-950/50' 
                            : 'border-slate-300 bg-white/90 text-slate-900 shadow-slate-300/50'
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-5 mb-6 border-opacity-20 border-current">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/30">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight">SupportFlow</h1>
                                <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Create and manage your service complaints</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`p-2.5 rounded-2xl border transition-colors ${
                                    isDarkMode 
                                        ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10' 
                                        : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                            </motion.button>
                        </div>
                    </div>

                    {/* Message Banner */}
                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className={`mb-6 flex items-center gap-3 rounded-2xl p-4 text-xs font-medium border ${
                                    isSuccess 
                                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' 
                                        : 'border-red-500/20 bg-red-500/10 text-red-300'
                                }`}
                            >
                                {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                                <span>{message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className={`block text-[10px] uppercase tracking-[0.2em] font-semibold ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>Issue Title</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
                                    <FileText className="w-4 h-4" />
                                </span>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                    className={`w-full rounded-2xl border pl-11 pr-4 py-3.5 text-xs shadow-inner outline-none ${
                                        isDarkMode ? 'border-white/10 bg-white/[0.03] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                                    }`}
                                    placeholder="e.g., Network Issue"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Dynamic Category Selector */}
                            <div className="space-y-1.5">
                                <label className={`block text-[10px] uppercase tracking-[0.2em] font-semibold ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>Category (From DB)</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
                                        <Layers className="w-4 h-4" />
                                    </span>
                                    <select 
                                        value={category} 
                                        onChange={(e) => setCategory(e.target.value)} 
                                        required 
                                        className={`w-full rounded-2xl border pl-11 pr-4 py-3.5 text-xs shadow-inner outline-none cursor-pointer ${
                                            isDarkMode ? 'border-white/10 bg-[#0d1224] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                                        }`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Worker Selector */}
                            <div className="space-y-1.5">
                                <label className={`block text-[10px] uppercase tracking-[0.2em] font-semibold ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>Assign Worker</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
                                        <UserCheck className="w-4 h-4" />
                                    </span>
                                    <select 
                                        value={selectedWorker} 
                                        onChange={(e) => setSelectedWorker(e.target.value)} 
                                        className={`w-full rounded-2xl border pl-11 pr-4 py-3.5 text-xs shadow-inner outline-none cursor-pointer ${
                                            isDarkMode ? 'border-white/10 bg-[#0d1224] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                                        }`}
                                    >
                                        <option value="">
                                            {loadingWorkers ? "Loading workers..." : "Select Worker (Optional)"}
                                        </option>
                                        {workers.map((worker) => (
                                            <option key={worker._id} value={worker._id}>
                                                {worker.name} (Rating: {worker.rating || 0} ⭐)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className={`block text-[10px] uppercase tracking-[0.2em] font-semibold ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>Detailed Description</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                                rows="4"
                                className={`w-full rounded-2xl border p-4 text-xs shadow-inner outline-none resize-none ${
                                    isDarkMode ? 'border-white/10 bg-white/[0.03] text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                                }`}
                                placeholder="Describe your issue..."
                            ></textarea>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            type="submit" 
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
                        >
                            <span>Generate Ticket</span>
                            <Send className="w-4 h-4" />
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CustomerDashboard;