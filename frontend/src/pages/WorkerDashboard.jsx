import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkerDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    // Tab state: 'active' or 'history'
    const [activeTab, setActiveTab] = useState('active');
    
    // Theme state ('dark' or 'light')
    const [theme, setTheme] = useState(localStorage.getItem('workerTheme') || 'dark');

    const token = localStorage.getItem('token');
    const workerName = localStorage.getItem('userName') || 'Worker Portal';
    const workerCategory = localStorage.getItem('userCategory') || 'General Support';

    const themes = {
        dark: {
            bg: 'bg-[#0b0f19]',
            cardBg: 'bg-[#131827]/80 backdrop-blur-xl',
            border: 'border-slate-800 hover:border-slate-700',
            text: 'text-slate-100',
            subText: 'text-slate-400',
            titleText: 'text-white',
            selectBg: '#131827',
            dropdownBg: 'bg-[#131827] border-slate-800 shadow-2xl'
        },
        light: {
            bg: 'bg-slate-50',
            cardBg: 'bg-white shadow-lg shadow-slate-200/50',
            border: 'border-slate-200 hover:border-slate-300',
            text: 'text-slate-900',
            subText: 'text-slate-600',
            titleText: 'text-slate-900',
            selectBg: '#ffffff',
            dropdownBg: 'bg-white shadow-2xl border-slate-200'
        }
    };

    const currentTheme = themes[theme] || themes.dark;

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('workerTheme', nextTheme);
    };

    const fetchWorkerTickets = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            
            const response = await axios.get('${import.meta.env.VITE_BACKEND_URI}/api/worker/my-assigned-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTickets(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching tickets:", err.response || err);
            setError(err.response?.data?.error || "Failed to retrieve assigned tickets. Please try again.");
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkerTickets();

        const interval = setInterval(() => {
            fetchWorkerTickets(true);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleUpdate = async (ticketId, newStatus, newPriority) => {
        try {
            setError('');
            setSuccessMessage('');
            
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URI}/api/worker/update-status/${ticketId}`, 
                { status: newStatus, priority: newPriority },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage(response.data.message || "Ticket status updated successfully.");
            fetchWorkerTickets(true);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update ticket status. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    // --- AUTOMATIC FILTERING LOGIC ---
    const activeTickets = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Rejected');
    const historyTickets = tickets.filter(t => t.status === 'Completed' || t.status === 'Rejected');

    const displayedTickets = activeTab === 'active' ? activeTickets : historyTickets;

    const doneCount = historyTickets.filter(t => t.status === 'Completed').length;
    const totalTickets = tickets.length;
    const scorePercentage = totalTickets > 0 ? Math.round((historyTickets.filter(t => t.status === 'Completed').length / totalTickets) * 100) : 0;
    const pendingRequests = activeTickets.filter(t => t.status === 'Pending' || !t.status);

    if (loading) return (
        <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center transition-colors duration-300`}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className={`text-xs font-medium tracking-wide ${currentTheme.subText}`}>Loading Worker Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} p-4 sm:p-6 md:p-8 relative overflow-x-hidden transition-colors duration-300`}>
            
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- HEADER --- */}
                <div className={`flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 pb-5 border-b ${currentTheme.border} gap-4`}>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                            <div className={`w-full h-full ${theme === 'dark' ? 'bg-[#131827]' : 'bg-white'} rounded-[10px] flex items-center justify-center text-sm font-bold text-indigo-500`}>
                                W
                            </div>
                        </div>
                        <div>
                            <h1 className={`text-lg sm:text-xl font-bold tracking-tight ${currentTheme.titleText}`}>
                                SupportFlow
                            </h1>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                                WORKER PORTAL
                            </span>
                        </div>
                    </div>

                    {/* --- NAVIGATION TABS --- */}
                    <div className={`flex items-center gap-1 p-1 rounded-xl ${theme === 'dark' ? 'bg-[#131827] border border-slate-800' : 'bg-slate-100 border border-slate-200'}`}>
                        <button 
                            onClick={() => setActiveTab('active')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'active' ? 'bg-indigo-600 text-white shadow-sm' : currentTheme.subText}`}
                        >
                            Active Tasks ({activeTickets.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-sm' : currentTheme.subText}`}
                        >
                            History ({historyTickets.length})
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-3 relative">
                        
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                                className={`p-2.5 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} transition relative flex items-center justify-center shadow-sm active:scale-95`}
                            >
                                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                                {pendingRequests.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className={`absolute right-0 mt-2 w-72 sm:w-80 ${currentTheme.dropdownBg} border ${currentTheme.border} rounded-2xl shadow-2xl p-4 z-50`}>
                                    <div className={`flex justify-between items-center mb-3 pb-2 border-b ${currentTheme.border}`}>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">New Requests</h3>
                                        <span className={`text-[10px] ${currentTheme.subText}`}>Live sync</span>
                                    </div>
                                    {pendingRequests.length === 0 ? (
                                        <p className={`text-xs ${currentTheme.subText} py-3 text-center`}>No new incoming requests.</p>
                                    ) : (
                                        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                                            {pendingRequests.map(req => (
                                                <div key={req._id} className={`p-2.5 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} space-y-2`}>
                                                    <p className="text-xs font-semibold truncate">{req.title}</p>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleUpdate(req._id, 'In Progress', req.priority)}
                                                            className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdate(req._id, 'Rejected', req.priority)}
                                                            className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} shadow-sm active:scale-95 transition`}
                            >
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                    {workerName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-medium max-w-[100px] truncate">{workerName.split(' ')[0]}</span>
                                <svg className={`w-3 h-3 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            {showProfileMenu && (
                                <div className={`absolute right-0 mt-2 w-72 ${currentTheme.dropdownBg} border ${currentTheme.border} rounded-2xl shadow-2xl p-4 z-50 space-y-3.5`}>
                                    
                                    <div className={`p-3 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} flex items-center gap-2.5`}>
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                            {workerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] tracking-wider uppercase font-semibold text-indigo-400">Category: {workerCategory}</p>
                                            <p className="text-xs font-bold truncate">{workerName}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-between p-2.5 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border}`}>
                                        <div>
                                            <p className="text-xs font-medium">Appearance</p>
                                            <p className={`text-[10px] ${currentTheme.subText}`}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                                        </div>
                                        <button 
                                            onClick={toggleTheme}
                                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white transition active:scale-95 shadow-sm"
                                        >
                                            Toggle
                                        </button>
                                    </div>

                                    <div>
                                        <p className={`text-[10px] font-semibold uppercase tracking-wider ${currentTheme.subText} mb-1.5 px-0.5`}>Performance Metrics</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className={`p-2 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} text-center`}>
                                                <p className={`text-[9px] ${currentTheme.subText} uppercase`}>Active</p>
                                                <p className="text-xs font-bold text-amber-400">{activeTickets.length}</p>
                                            </div>
                                            <div className={`p-2 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} text-center`}>
                                                <p className={`text-[9px] ${currentTheme.subText} uppercase`}>Done</p>
                                                <p className="text-xs font-bold text-emerald-400">{doneCount}</p>
                                            </div>
                                            <div className={`p-2 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} text-center`}>
                                                <p className={`text-[9px] ${currentTheme.subText} uppercase`}>Score</p>
                                                <p className="text-xs font-bold text-indigo-400">{scorePercentage}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition flex items-center justify-center gap-1.5"
                                    >
                                        Logout Account
                                    </button>

                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 mb-5 rounded-xl text-xs">{error}</div>}
                {successMessage && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 mb-5 rounded-xl text-xs">{successMessage}</div>}

                {/* --- TICKETS GRID --- */}
                {displayedTickets.length === 0 ? (
                    <div className={`text-center py-20 ${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl shadow-sm px-4`}>
                        <p className={`${currentTheme.subText} text-sm`}>
                            {activeTab === 'active' ? 'No active tasks found in your queue.' : 'No completed tasks in history.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {displayedTickets.map((ticket) => {
                            const isLocked = ticket.status === 'Completed' || ticket.status === 'Rejected';

                            return (
                                <div key={ticket._id} className={`${currentTheme.cardBg} border ${currentTheme.border} p-5 rounded-2xl shadow-sm transition-all duration-200 flex flex-col justify-between`}>
                                    <div>
                                        <div className="flex justify-between items-center mb-3 gap-2">
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 truncate">
                                                {ticket.ticketId || ticket._id.slice(-6)}
                                            </span>
                                            <span className={`px-2.5 py-0.5 text-[11px] rounded-full font-medium border flex-shrink-0 ${
                                                ticket.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                ticket.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                                {ticket.status || 'Pending'}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold mb-1.5 tracking-tight line-clamp-1">{ticket.title}</h3>
                                        <p className={`${currentTheme.subText} text-xs mb-4 leading-relaxed line-clamp-3`}>{ticket.description}</p>
                                    </div>

                                    <div>
                                        <div className={`bg-black/20 border ${currentTheme.border} p-3 rounded-xl mb-4 text-[11px] ${currentTheme.subText} space-y-1`}>
                                            <p className="truncate"><strong>Category:</strong> {ticket.category}</p>
                                            <p className="truncate"><strong>Customer:</strong> {ticket.customer?.name || 'Customer'} ({ticket.customer?.email || 'N/A'})</p>
                                        </div>

                                        {/* Customer Feedback */}
                                        {ticket.feedback && (
                                            <div className="mb-3.5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                                                <p className="font-semibold mb-0.5">Customer Review:</p>
                                                <p className="leading-relaxed">{ticket.feedback}</p>
                                            </div>
                                        )}

                                        <div className={`grid grid-cols-2 gap-2.5 pt-3 border-t ${currentTheme.border}`}>
                                            <div>
                                                <label className={`block text-[10px] font-semibold ${currentTheme.subText} mb-1 uppercase tracking-wider`}>Status</label>
                                                <select 
                                                    disabled={isLocked}
                                                    value={ticket.status || 'Pending'}
                                                    onChange={(e) => handleUpdate(ticket._id, e.target.value, ticket.priority)}
                                                    style={{ backgroundColor: currentTheme.selectBg }}
                                                    className={`w-full text-xs border ${currentTheme.border} rounded-xl p-2 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className={`block text-[10px] font-semibold ${currentTheme.subText} mb-1 uppercase tracking-wider`}>Priority</label>
                                                <select 
                                                    disabled={isLocked}
                                                    value={ticket.priority || 'Medium'}
                                                    onChange={(e) => handleUpdate(ticket._id, ticket.status, e.target.value)}
                                                    style={{ backgroundColor: currentTheme.selectBg }}
                                                    className={`w-full text-xs border ${currentTheme.border} rounded-xl p-2 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50`}
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>
                                        </div>

                                        {isLocked && (
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-[10px] text-emerald-400 font-medium">
                                                    ✓ Moved to History tab
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerDashboard;