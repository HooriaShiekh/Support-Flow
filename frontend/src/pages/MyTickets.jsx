import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clock, CheckCircle2, AlertCircle, ArrowLeft, Trash2, Cpu, Layers, Edit3, X, Save, Sparkles, Star } from 'lucide-react';
import Navbar from '../components/customerNav';

const MyTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', category: '' });
    const [updating, setUpdating] = useState(false);

    // Feedback Modal States
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedTicketForFeedback, setSelectedTicketForFeedback] = useState(null);
    const [rating, setRating] = useState(5);
    const [feedbackText, setFeedbackText] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    // Fetch user tickets on page load
    const fetchMyTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/tickets/my-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            setMessage('Failed to load your tickets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTickets();
    }, []);

    // Delete / Cancel Ticket Handler
    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm("Aap waqayi is ticket ko cancel/delete karna chahti hain?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/tickets/customer/delete/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        } catch (error) {
            console.error("Error deleting ticket:", error);
            alert(error.response?.data?.error || 'Failed to delete ticket');
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (ticket) => {
        setCurrentTicket(ticket);
        setEditForm({
            title: ticket.title || '',
            description: ticket.description || '',
            category: ticket.category || ''
        });
        setIsEditModalOpen(true);
    };

    // Submit Updated Ticket to DB
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/tickets/customer/update/${currentTicket._id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTickets(tickets.map(t => (t._id === currentTicket._id ? response.data.ticket || response.data : t)));
            setIsEditModalOpen(false);
            setCurrentTicket(null);
        } catch (error) {
            console.error("Error updating ticket:", error);
            alert(error.response?.data?.error || 'Failed to update ticket');
        } finally {
            setUpdating(false);
        }
    };

    // Submit Feedback Handler
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTicketForFeedback) return;
        
        setSubmittingFeedback(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/api/tickets/customer/feedback/${selectedTicketForFeedback._id}`,
                { rating, feedback: feedbackText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTickets(tickets.map(t => (t._id === selectedTicketForFeedback._id ? response.data.ticket : t)));
            setIsFeedbackModalOpen(false);
            setSelectedTicketForFeedback(null);
            setFeedbackText('');
            setRating(5);
            alert("Feedback kamyabi se submit ho gaya! Shukriya.");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert(error.response?.data?.error || 'Failed to submit feedback');
        } finally {
            setSubmittingFeedback(false);
        }
    };

    // Helper for Progress Steps & Line Tracker
    const renderProgressTimeline = (status) => {
        const s = status?.toLowerCase() || 'pending';
        
        const steps = [
            { key: 'pending', label: 'Pending' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'resolved', label: 'Resolved' }
        ];

        let currentIndex = 0;
        if (s === 'in-progress') currentIndex = 1;
        if (s === 'resolved' || s === 'completed') currentIndex = 2;

        return (
            <div className="w-full py-3 my-2">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full z-0" />
                    
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full z-0"
                        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border ${
                                    isCompleted 
                                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/40' 
                                        : isDarkMode 
                                            ? 'bg-[#0d1224] text-white/40 border-white/10' 
                                            : 'bg-white text-slate-400 border-slate-300'
                                } ${isCurrent ? 'ring-4 ring-indigo-500/20 scale-110' : ''}`}>
                                    {idx < currentIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] font-medium tracking-wide ${
                                    isCurrent ? 'text-indigo-400 font-bold' : isDarkMode ? 'text-white/50' : 'text-slate-500'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Status badge helper
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved':
            case 'completed':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
            case 'in-progress':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"><Clock className="w-3 h-3" /> In Progress</span>;
            default:
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertCircle className="w-3 h-3" /> Pending</span>;
        }
    };

    if (loading) {
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
                    <p className="text-xs font-mono tracking-widest uppercase opacity-60">Loading Tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen w-full font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#070403] text-[#f4eae3]' : 'bg-slate-100 text-slate-900'}`}>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            
            {/* Background Orbs */}
            <motion.div 
                animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className={`pointer-events-none absolute -top-32 left-[-100px] h-[400px] w-[400px] rounded-full blur-[130px] ${isDarkMode ? 'bg-indigo-600/20' : 'bg-indigo-400/20'}`} 
            />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                
                {/* Top Header & Back Navigation */}
                <div className="flex items-center justify-between border-b pb-5 border-opacity-20 border-current">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/customer-dashboard')}
                            className={`p-2.5 rounded-2xl border transition-colors flex items-center gap-2 text-xs font-medium ${
                                isDarkMode 
                                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' 
                                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Dashboard</span>
                        </motion.button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-500" /> My Tickets Tracker
                            </h1>
                            <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Monitor, progress track and update your service requests</p>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                        {message}
                    </div>
                )}

                {/* Tickets Grid / List */}
                {tickets.length === 0 ? (
                    <div className={`text-center py-16 rounded-3xl border border-dashed ${isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-slate-300 bg-white/50'}`}>
                        <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-500" />
                        <h3 className="text-sm font-semibold">No tickets found</h3>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>You haven't generated any service tickets yet.</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/customer-dashboard')}
                            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30"
                        >
                            Create Ticket
                        </motion.button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5">
                        {tickets.map((ticket, index) => (
                            <motion.div
                                key={ticket._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`rounded-3xl border p-6 shadow-xl backdrop-blur-xl transition-all ${
                                    isDarkMode 
                                        ? 'border-white/10 bg-[#0d1224]/85 text-white shadow-black/40' 
                                        : 'border-slate-300 bg-white text-slate-900 shadow-slate-200'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4 border-opacity-10 border-current">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                #{ticket.ticketId || ticket._id?.slice(-6)}
                                            </span>
                                            <span className={`text-xs font-medium flex items-center gap-1 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                                                <Layers className="w-3.5 h-3.5 text-indigo-500" /> {ticket.category}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold tracking-tight">{ticket.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        {getStatusBadge(ticket.status)}
                                        
                                        {/* Edit Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleOpenEdit(ticket)}
                                            className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                                            title="Edit Ticket"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </motion.button>

                                        {/* Delete Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteTicket(ticket._id)}
                                            className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                            title="Cancel / Delete Ticket"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                <p className={`text-xs leading-relaxed mb-3 ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                                    {ticket.description}
                                </p>

                                {/* Visual Progress Timeline Tracker Bar */}
                                <div className={`my-4 p-3 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-1">Execution Status Pipeline</p>
                                    {renderProgressTimeline(ticket.status)}
                                </div>

                                {/* Feedback Section if Completed */}
                                {(ticket.status === 'Completed' || ticket.status === 'Resolved') && (
                                    <div className="mt-3 pt-3 border-t border-opacity-10 border-current flex items-center justify-between">
                                        {ticket.rating ? (
                                            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                <span>Rated:</span>
                                                <span className="font-bold">{ticket.rating} / 5</span>
                                                {ticket.feedback && <span className="opacity-70 truncate max-w-[250px]">("{ticket.feedback}")</span>}
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setSelectedTicketForFeedback(ticket);
                                                    setIsFeedbackModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
                                            >
                                                ⭐ Rate Service
                                            </motion.button>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-3 text-[11px] opacity-70 border-t border-opacity-10 border-current font-mono">
                                    <span>Assigned Worker: {ticket.assignedWorker?.name || 'Unassigned / Pending Assignment'}</span>
                                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* EDIT TICKET MODAL */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${
                                isDarkMode ? 'bg-[#0d1224] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                        >
                            <div className="flex items-center justify-between border-b pb-4 mb-4 border-opacity-10 border-current">
                                <h2 className="text-base font-bold flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-indigo-500" /> Edit Ticket Details
                                </h2>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1 opacity-70">Ticket Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                            isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1 opacity-70">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                            isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1 opacity-70">Description / Issue details</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                                            isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                                        }`}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-medium border border-current opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={updating}
                                        className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FEEDBACK MODAL */}
            <AnimatePresence>
                {isFeedbackModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
                                isDarkMode ? 'bg-[#0d1224] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                        >
                            <div className="flex items-center justify-between border-b pb-4 mb-4 border-opacity-10 border-current">
                                <h2 className="text-base font-bold flex items-center gap-2">
                                    ⭐ Rate Your Experience
                                </h2>
                                <button
                                    onClick={() => setIsFeedbackModalOpen(false)}
                                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                {/* Star Rating Selector */}
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <label className="text-xs font-medium opacity-70">Select Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`text-2xl transition-transform hover:scale-125 ${
                                                    star <= rating ? 'text-amber-400' : 'text-gray-400 opacity-30'
                                                }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1 opacity-70">Your Feedback / Review (Optional)</label>
                                    <textarea
                                        rows={3}
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Service kaisi lagi? Apne alfaz mein likhein..."
                                        className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none ${
                                            isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                                        }`}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsFeedbackModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-medium border border-current opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={submittingFeedback}
                                        className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20"
                                    >
                                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyTickets;