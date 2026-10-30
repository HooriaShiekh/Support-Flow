import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkerNavbar from './WorkerNavbar'; // Agar aapne WorkerNavbar separate file mein banaya hai

const WorkerDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Theme state ('dark' or 'light')
    const [theme, setTheme] = useState(localStorage.getItem('workerTheme') || 'dark');

    const token = localStorage.getItem('token');
    const workerName = localStorage.getItem('userName') || 'Worker Portal';
    const workerCategory = localStorage.getItem('userCategory') || 'General Support';

    // Theme styles configuration
    const themes = {
        dark: {
            bg: 'bg-[#090714]',
            cardBg: 'bg-white/[0.04] backdrop-blur-2xl',
            border: 'border-white/10 hover:border-purple-500/40',
            text: 'text-white',
            subText: 'text-gray-400',
            titleText: 'text-white',
            selectBg: '#130f24',
            dropdownBg: 'bg-[#130f24] backdrop-blur-2xl'
        },
        light: {
            bg: 'bg-slate-50',
            cardBg: 'bg-white shadow-xl shadow-slate-200/50',
            border: 'border-slate-200 hover:border-purple-400/50',
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
            
            const response = await axios.get('http://https://support-flow-ten.vercel.app/api/tickets/worker-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTickets(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching tickets:", err.response || err);
            setError(err.response?.data?.error || "Tickets load karne mein masla ho gaya.");
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkerTickets();

        // Auto-refresh / Polling every 5 seconds
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
                `http://https://support-flow-ten.vercel.app/api/tickets/worker/update-status/${ticketId}`, 
                { status: newStatus, priority: newPriority },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage(response.data.message);
            fetchWorkerTickets();
        } catch (err) {
            setError(err.response?.data?.error || "Status update nahi ho saka.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    // Live Metrics calculations
    const pendingCount = tickets.filter(t => t.status === 'Pending' || t.status === 'Open').length;
    const doneCount = tickets.filter(t => t.status === 'Completed').length;
    const totalTickets = tickets.length;
    const scorePercentage = totalTickets > 0 ? Math.round((doneCount / totalTickets) * 100) : 0;
    const pendingRequests = tickets.filter(t => t.status === 'Pending' || !t.status);

    if (loading) return (
        <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center font-medium tracking-wide transition-colors duration-500`}>
            <div className="flex items-center gap-3 animate-pulse text-purple-500">
                <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping"></div>
                Loading Worker Portal...
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} relative overflow-x-hidden transition-colors duration-500`}>
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* --- REUSABLE WORKER NAVBAR INTEGRATED --- */}
            <WorkerNavbar 
                workerName={workerName}
                workerCategory={workerCategory}
                theme={theme}
                toggleTheme={toggleTheme}
                pendingRequests={pendingRequests}
                pendingCount={pendingCount}
                doneCount={doneCount}
                scorePercentage={scorePercentage}
                handleUpdate={handleUpdate}
                handleLogout={handleLogout}
                currentTheme={currentTheme}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 relative z-10">
                
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 p-4 mb-6 rounded-2xl shadow-md text-xs sm:text-sm">{error}</div>}
                {successMessage && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 p-4 mb-6 rounded-2xl shadow-md text-xs sm:text-sm">{successMessage}</div>}

                {/* --- TICKETS GRID --- */}
                {tickets.length === 0 ? (
                    <div className={`text-center py-20 sm:py-24 ${currentTheme.cardBg} border ${currentTheme.border} rounded-3xl shadow-xl px-4`}>
                        <p className={`${currentTheme.subText} text-sm sm:text-base`}>Aapko abhi tak koi ticket assign nahi hui hai.</p>
                        <p className="text-xs text-purple-500 mt-2">Note: Check karein ke backend route `/api/tickets/worker-tickets` sahi data bhej raha hai ya nahi.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {tickets.map((ticket) => {
                            const isLocked = ticket.status === 'Completed' || ticket.status === 'Rejected';

                            return (
                                <div key={ticket._id} className={`${currentTheme.cardBg} border ${currentTheme.border} p-5 sm:p-6 rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between group`}>
                                    <div>
                                        <div className="flex justify-between items-center mb-3.5 sm:mb-4 gap-2">
                                            <span className="text-[11px] sm:text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 shadow-sm truncate">
                                                {ticket.ticketId || ticket._id.slice(-6)}
                                            </span>
                                            <span className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-full font-medium border flex-shrink-0 ${
                                                ticket.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                                ticket.status === 'Rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                                                ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                                'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                            }`}>
                                                {ticket.status || 'Pending'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-wide group-hover:text-purple-500 transition-colors line-clamp-2">{ticket.title}</h3>
                                        <p className={`${currentTheme.subText} text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed line-clamp-3`}>{ticket.description}</p>
                                    </div>

                                    <div>
                                        <div className={`bg-black/[0.02] dark:bg-white/[0.02] border ${currentTheme.border} p-3 sm:p-3.5 rounded-2xl mb-4 sm:mb-5 text-[11px] sm:text-xs ${currentTheme.subText} space-y-1.5 shadow-inner`}>
                                            <p className="truncate"><strong>Category:</strong> {ticket.category}</p>
                                            <p className="truncate"><strong>Customer:</strong> {ticket.customer?.name || 'Customer'} ({ticket.customer?.email || 'N/A'})</p>
                                        </div>

                                        {/* Customer Feedback */}
                                        {ticket.feedback && (
                                            <div className="mb-4 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 shadow-sm">
                                                <p className="font-bold mb-1 flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                                    Customer Review:
                                                </p>
                                                <p className="leading-relaxed">{ticket.feedback}</p>
                                            </div>
                                        )}

                                        <div className={`grid grid-cols-2 gap-2.5 sm:gap-3 pt-3 border-t ${currentTheme.border}`}>
                                            <div>
                                                <label className={`block text-[10px] sm:text-[11px] font-semibold ${currentTheme.subText} mb-1.5 uppercase tracking-wider`}>Status</label>
                                                <select 
                                                    disabled={isLocked}
                                                    value={ticket.status || 'Pending'}
                                                    onChange={(e) => handleUpdate(ticket._id, e.target.value, ticket.priority)}
                                                    style={{ backgroundColor: currentTheme.selectBg }}
                                                    className={`w-full text-xs border ${currentTheme.border} rounded-xl p-2.5 focus:outline-none focus:border-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className={`block text-[10px] sm:text-[11px] font-semibold ${currentTheme.subText} mb-1.5 uppercase tracking-wider`}>Priority</label>
                                                <select 
                                                    disabled={isLocked}
                                                    value={ticket.priority || 'Medium'}
                                                    onChange={(e) => handleUpdate(ticket._id, ticket.status, e.target.value)}
                                                    style={{ backgroundColor: currentTheme.selectBg }}
                                                    className={`w-full text-xs border ${currentTheme.border} rounded-xl p-2.5 focus:outline-none focus:border-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>
                                        </div>

                                        {isLocked && (
                                            <p className="text-[10px] sm:text-[11px] text-red-500 dark:text-red-400 mt-3.5 text-center italic bg-red-500/5 py-1.5 rounded-xl border border-red-500/10">
                                                * Yeh ticket locked hai, ab update nahi ho sakti.
                                            </p>
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