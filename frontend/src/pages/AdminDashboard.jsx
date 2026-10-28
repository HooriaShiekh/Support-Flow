import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { 
    Users, 
    Wrench, 
    ShieldCheck, 
    Trash2, 
    Sun, 
    Moon, 
    LogOut, 
    Activity, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    XCircle,
    Search,
    PieChart as PieIcon,
    LayoutGrid,
    List,
    UserPlus,
    Filter,
    X,
    ExternalLink,
    BarChart2,
    Hash,
    Sparkles,
    Download,
    Star,
    MessageSquare,
    Flame,
    Menu,
    ChevronDown,
    SlidersHorizontal
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalWorkers: 0, totalTickets: 0 });
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    // Desktop View Switcher & Mobile Section Tab
    const [viewMode, setViewMode] = useState('cards');
    const [mobileTab, setMobileTab] = useState('overview'); // 'overview' | 'tickets' | 'users'
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Advanced Search & Category Filters
    const [ticketFilter, setTicketFilter] = useState('all');
    const [ticketCategoryFilter, setTicketCategoryFilter] = useState('all');
    const [ticketSearch, setTicketSearch] = useState('');

    // User Directory Filters
    const [filterRole, setFilterRole] = useState('all');
    const [userSearchTerm, setUserSearchTerm] = useState('');

    // Reassign Modal State
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedWorkerId, setSelectedWorkerId] = useState('');

    // Worker Mini-Dashboard Modal State
    const [activeWorkerProfile, setActiveWorkerProfile] = useState(null);

    const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'dark');

    const themes = {
        dark: {
            bg: 'bg-[#06080e]',
            cardBg: 'bg-[#0d121f]/90 backdrop-blur-2xl border-slate-800/80',
            border: 'border-slate-800/80 hover:border-indigo-500/50',
            innerCard: 'bg-[#121829]/80 border-slate-800/80 hover:border-indigo-500/60 transition-all duration-300',
            text: 'text-slate-100',
            subText: 'text-slate-400',
            titleText: 'text-white',
            inputBg: 'bg-[#101524] border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500',
            pillBg: 'bg-slate-900/80 border-slate-800',
            bottomNavBg: 'bg-[#0a0e1a]/95 border-slate-800/80 backdrop-blur-xl'
        },
        light: {
            bg: 'bg-slate-100',
            cardBg: 'bg-white shadow-xl border-slate-200',
            border: 'border-slate-200',
            innerCard: 'bg-slate-50 border-slate-200 hover:border-indigo-500 transition-all duration-300',
            text: 'text-slate-900',
            subText: 'text-slate-600 font-medium',
            titleText: 'text-slate-950 font-black',
            inputBg: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600',
            pillBg: 'bg-slate-200/80 border-slate-300',
            bottomNavBg: 'bg-white/95 border-slate-300 backdrop-blur-xl shadow-2xl'
        }
    };

    const currentTheme = themes[theme] || themes.dark;
    const token = localStorage.getItem('token');
    const adminName = localStorage.getItem('userName') || 'Admin';

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('adminTheme', nextTheme);
    };

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            setError('');
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, usersRes, ticketsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', { headers }),
                axios.get('http://localhost:5000/api/admin/users', { headers }),
                axios.get('http://localhost:5000/api/admin/tickets', { headers })
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setTickets(ticketsRes.data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
            setError(err.response?.data?.error || "Failed to sync command center metrics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleExportCSV = () => {
        if (tickets.length === 0) {
            alert("No tickets available to export.");
            return;
        }

        const headers = ["Ticket ID,Title,Category,Status,Priority,Customer,Worker,Created At\n"];
        const rows = tickets.map((t, idx) => {
            const ticketId = t.ticketNumber || `TK-${(idx + 1).toString().padStart(4, '0')}`;
            const title = `"${(t.title || 'Untitled').replace(/"/g, '""')}"`;
            const category = `"${t.category || 'General'}"`;
            const status = t.status || 'Pending';
            const priority = t.priority || 'Medium';
            const customer = `"${t.customer?.name || 'Guest'}"`;
            const worker = `"${t.assignedWorker?.name || 'Unassigned'}"`;
            const createdAt = t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A';

            return `${ticketId},${title},${category},${status},${priority},${customer},${worker},${createdAt}`;
        });

        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Eventora_Tickets_Report_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReassignSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTicket || !selectedWorkerId) return;

        try {
            setActionLoading(selectedTicket._id);
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.put(
                `http://localhost:5000/api/admin/ticket/${selectedTicket._id}/reassign`, 
                { workerId: selectedWorkerId },
                { headers }
            );

            setSuccessMsg("Ticket reassigned successfully!");
            setTimeout(() => setSuccessMsg(''), 4000);

            setTickets(tickets.map(t => t._id === selectedTicket._id ? res.data.ticket : t));
            setSelectedTicket(null);
            setSelectedWorkerId('');
        } catch (err) {
            alert(err.response?.data?.error || "Failed to reassign ticket.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId, userRole) => {
        if (userRole === 'admin') {
            alert("Security Violation: Super Admin accounts cannot be purged.");
            return;
        }

        if (!window.confirm("Confirm Account Termination: Permanently revoke platform access?")) return;

        try {
            setActionLoading(userId);
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, { headers });
            
            setSuccessMsg("User account deleted successfully.");
            setTimeout(() => setSuccessMsg(''), 4000);

            setUsers(users.filter(u => u._id !== userId));
            setStats(prev => ({
                ...prev,
                totalUsers: userRole === 'user' ? prev.totalUsers - 1 : prev.totalUsers,
                totalWorkers: userRole === 'worker' ? prev.totalWorkers - 1 : prev.totalWorkers
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Delete action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const availableWorkers = users.filter(u => u.role === 'worker');
    const categories = ['all', ...new Set(tickets.map(t => t.category).filter(Boolean))];

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = ticketFilter === 'all' || t.status === ticketFilter;
        const matchesCategory = ticketCategoryFilter === 'all' || t.category === ticketCategoryFilter;
        const searchLower = ticketSearch.toLowerCase();
        const matchesSearch = 
            (t.ticketNumber || t._id || '').toLowerCase().includes(searchLower) ||
            (t.title || '').toLowerCase().includes(searchLower) ||
            (t.description || '').toLowerCase().includes(searchLower) ||
            (t.customer?.name || '').toLowerCase().includes(searchLower) ||
            (t.assignedWorker?.name || '').toLowerCase().includes(searchLower);

        return matchesStatus && matchesCategory && matchesSearch;
    });

    const filteredUsers = users.filter(u => {
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        const matchesSearch = (u.name || '').toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                              (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const getWorkerStats = (workerId) => {
        const workerTickets = tickets.filter(t => t.assignedWorker?._id === workerId);
        const total = workerTickets.length;
        const pending = workerTickets.filter(t => t.status === 'Pending' || !t.status).length;
        const inProgress = workerTickets.filter(t => t.status === 'In Progress').length;
        const completed = workerTickets.filter(t => t.status === 'Completed').length;
        const rejected = workerTickets.filter(t => t.status === 'Rejected').length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const ratedTickets = workerTickets.filter(t => t.review && t.review.rating);
        const totalRatingSum = ratedTickets.reduce((acc, t) => acc + (t.review?.rating || 0), 0);
        const avgRating = ratedTickets.length > 0 ? (totalRatingSum / ratedTickets.length).toFixed(1) : "5.0";

        const chartData = [
            { name: 'Pending', count: pending, fillId: 'url(#pendingGrad)' },
            { name: 'Progress', count: inProgress, fillId: 'url(#progressGrad)' },
            { name: 'Done', count: completed, fillId: 'url(#completedGrad)' },
            { name: 'Rejected', count: rejected, fillId: 'url(#rejectedGrad)' },
        ];

        return { 
            total, 
            pending, 
            inProgress, 
            completed, 
            rejected, 
            rate, 
            tickets: workerTickets, 
            chartData,
            avgRating,
            reviewsCount: ratedTickets.length,
            reviews: ratedTickets.map(t => ({
                id: t._id,
                rating: t.review.rating,
                comment: t.review.comment || 'Great service provided!',
                customerName: t.customer?.name || 'Client',
                ticketTitle: t.title || 'Service Ticket'
            }))
        };
    };

    const pendingCount = tickets.filter(t => t.status === 'Pending' || !t.status).length;
    const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
    const completedCount = tickets.filter(t => t.status === 'Completed').length;
    const rejectedCount = tickets.filter(t => t.status === 'Rejected').length;

    const pieChartData = [
        { name: 'Pending', value: pendingCount, color: '#f59e0b' },
        { name: 'In Progress', value: inProgressCount, color: '#3b82f6' },
        { name: 'Completed', value: completedCount, color: '#10b981' },
        { name: 'Rejected', value: rejectedCount, color: '#f43f5e' }
    ].filter(item => item.value > 0);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                );
            case 'In Progress':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        <Clock className="w-3 h-3" /> Progress
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3" /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <AlertCircle className="w-3 h-3" /> Pending
                    </span>
                );
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <Flame className="w-2.5 h-2.5" /> High
                    </span>
                );
            case 'low':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-500/20 text-slate-400 border border-slate-500/30">
                        Low
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Med
                    </span>
                );
        }
    };

    if (loading) return (
        <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center p-4`}>
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xs font-black tracking-widest uppercase text-indigo-500 animate-pulse">Loading Command Center...</p>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pb-24 md:pb-12 p-3 sm:p-6 md:p-10 relative font-sans transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                
                {/* RESPONSIVE HEADER */}
                <header className={`${currentTheme.cardBg} border p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg text-white shrink-0">
                                <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className={`text-base sm:text-2xl font-black tracking-tight ${currentTheme.titleText}`}>{adminName}</h1>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Admin</span>
                                </div>
                                <p className={`text-[11px] sm:text-xs ${currentTheme.subText} flex items-center gap-1.5 mt-0.5`}>
                                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> SupportFlow Realtime Ops
                                </p>
                            </div>
                        </div>

                        {/* Theme Switcher Quick Toggle Mobile */}
                        <button onClick={toggleTheme} className="sm:hidden p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-amber-400">
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                        </button>
                    </div>

                    {/* Desktop Utility Actions */}
                    <div className="hidden sm:flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button 
                            onClick={handleExportCSV} 
                            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>

                        <button onClick={toggleTheme} className={`p-2.5 rounded-2xl ${currentTheme.cardBg} border text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100`}>
                            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                        </button>

                        <button onClick={handleLogout} className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-black transition-all flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs font-bold">{error}</div>}
                {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs font-bold">{successMsg}</div>}

                {/* 📱 MOBILE VIEW NAVIGATION TABS (Visible only on mobile) */}
                <div className="flex md:hidden items-center justify-between p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-black">
                    <button 
                        onClick={() => setMobileTab('overview')}
                        className={`flex-1 py-2.5 rounded-xl transition-all ${mobileTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setMobileTab('tickets')}
                        className={`flex-1 py-2.5 rounded-xl transition-all ${mobileTab === 'tickets' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        Tickets ({tickets.length})
                    </button>
                    <button 
                        onClick={() => setMobileTab('users')}
                        className={`flex-1 py-2.5 rounded-xl transition-all ${mobileTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        Directory
                    </button>
                </div>

                {/* SECTION 1: STATS & PIE CHART (Desktop: Always Visible, Mobile: Under 'overview' tab) */}
                <div className={`${mobileTab === 'overview' ? 'block' : 'hidden md:grid'} grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6`}>
                    <div className={`${currentTheme.cardBg} border p-4 sm:p-6 rounded-2xl sm:rounded-3xl lg:col-span-1 flex flex-col justify-between shadow-xl`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <PieIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                                <h2 className={`text-xs sm:text-sm font-black ${currentTheme.titleText}`}>Ticket Status Breakdown</h2>
                            </div>
                        </div>

                        <div className="h-44 sm:h-52 w-full relative flex items-center justify-center">
                            {pieChartData.length === 0 ? (
                                <p className="text-xs text-slate-500 italic">No tickets recorded yet.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={4} dataKey="value">
                                            {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                                <span className={`text-xl sm:text-2xl font-black ${currentTheme.titleText}`}>{stats.totalTickets}</span>
                                <span className={`text-[8px] sm:text-[9px] uppercase tracking-widest ${currentTheme.subText} font-extrabold`}>Tickets</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className={`flex items-center gap-2 text-[11px] font-bold p-2 rounded-xl border ${theme === 'light' ? 'bg-slate-200/70 border-slate-300 text-slate-900' : 'bg-slate-900/60 border-slate-800 text-slate-200'}`}>
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                <span>Pending: {pendingCount}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-[11px] font-bold p-2 rounded-xl border ${theme === 'light' ? 'bg-slate-200/70 border-slate-300 text-slate-900' : 'bg-slate-900/60 border-slate-800 text-slate-200'}`}>
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span>Progress: {inProgressCount}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-[11px] font-bold p-2 rounded-xl border ${theme === 'light' ? 'bg-slate-200/70 border-slate-300 text-slate-900' : 'bg-slate-900/60 border-slate-800 text-slate-200'}`}>
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span>Done: {completedCount}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-[11px] font-bold p-2 rounded-xl border ${theme === 'light' ? 'bg-slate-200/70 border-slate-300 text-slate-900' : 'bg-slate-900/60 border-slate-800 text-slate-200'}`}>
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                <span>Rejected: {rejectedCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-0">
                        <div className={`${currentTheme.cardBg} border p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xl`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className={`text-xs font-black uppercase tracking-wider ${currentTheme.subText}`}>Registered Clients</p>
                                    <h3 className="text-3xl sm:text-4xl font-black text-indigo-500 tracking-tight mt-1">{stats.totalUsers}</h3>
                                </div>
                                <div className="p-2.5 sm:p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl sm:rounded-2xl">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <p className={`text-[11px] ${currentTheme.subText} mt-3`}>Customers creating service tickets</p>
                        </div>

                        <div className={`${currentTheme.cardBg} border p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xl`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className={`text-xs font-black uppercase tracking-wider ${currentTheme.subText}`}>Active Workers</p>
                                    <h3 className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight mt-1">{stats.totalWorkers}</h3>
                                </div>
                                <div className="p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl sm:rounded-2xl">
                                    <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <p className={`text-[11px] ${currentTheme.subText} mt-3`}>Specialized workers assigned to tickets</p>
                        </div>

                        <div className={`${currentTheme.cardBg} border p-4 sm:p-6 rounded-2xl sm:rounded-3xl sm:col-span-2 flex items-center justify-between shadow-xl`}>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></div>
                                <div>
                                    <h4 className={`text-xs sm:text-sm font-black ${currentTheme.titleText}`}>Realtime Socket Engine</h4>
                                    <p className={`text-[11px] ${currentTheme.subText}`}>Live ticket sync & updates active.</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black">Active</span>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: MASTER TICKET OVERSIGHT (Desktop: Always Visible, Mobile: Under 'tickets' tab) */}
                <section className={`${mobileTab === 'tickets' || mobileTab === 'overview' ? 'block' : 'hidden md:block'} ${currentTheme.cardBg} border rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl`}>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className={`text-base sm:text-lg font-black tracking-tight ${currentTheme.titleText}`}>Master Ticket Oversight</h2>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30">Live</span>
                            </div>
                            <p className={`text-xs ${currentTheme.subText} mt-0.5`}>Search, filter, or override worker assignments.</p>
                        </div>

                        {/* Mobile Collapsible Filter Toggle Button */}
                        <div className="flex items-center justify-between w-full lg:w-auto gap-2">
                            <button 
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>Filters</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {/* View Mode Switches (Desktop Only) */}
                            <div className={`hidden sm:flex items-center gap-1 p-1 rounded-xl border ${currentTheme.pillBg}`}>
                                <button onClick={() => setViewMode('cards')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar Controls (Always visible on desktop, drawer on mobile) */}
                    <div className={`${showMobileFilters ? 'block' : 'hidden sm:block'} space-y-3 mb-6 transition-all`}>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search by Ticket #, Title, Customer, or Worker..."
                                    value={ticketSearch}
                                    onChange={(e) => setTicketSearch(e.target.value)}
                                    className={`w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold border outline-none ${currentTheme.inputBg}`}
                                />
                            </div>

                            {categories.length > 1 && (
                                <div className="w-full sm:w-auto">
                                    <select 
                                        value={ticketCategoryFilter}
                                        onChange={(e) => setTicketCategoryFilter(e.target.value)}
                                        className={`w-full sm:w-auto px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold border outline-none ${currentTheme.inputBg} cursor-pointer`}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat === 'all' ? 'All Categories' : cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Status Pills Bar */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {['all', 'Pending', 'In Progress', 'Completed', 'Rejected'].map((status) => (
                                <button 
                                    key={status}
                                    onClick={() => setTicketFilter(status)}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap ${
                                        ticketFilter === status 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : `${currentTheme.subText} hover:text-indigo-400`
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TICKET CARDS / TABLE LISTING */}
                    {viewMode === 'cards' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {filteredTickets.length === 0 ? (
                                <div className="col-span-full text-center py-10 text-slate-500 font-medium text-xs">
                                    No ticket records match current search and filter.
                                </div>
                            ) : (
                                filteredTickets.map((t, index) => (
                                    <div key={t._id} className={`${currentTheme.innerCard} border p-4 sm:p-5 rounded-2xl shadow-md flex flex-col justify-between`}>
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-black font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                                                        <Hash className="w-2.5 h-2.5" />
                                                        {t.ticketNumber || `TK-${(index + 1).toString().padStart(4, '0')}`}
                                                    </span>
                                                    {getPriorityBadge(t.priority)}
                                                </div>
                                                {getStatusBadge(t.status)}
                                            </div>

                                            <h3 className={`font-black text-xs sm:text-sm ${currentTheme.titleText} line-clamp-1 mb-1`}>{t.title || 'Service Ticket'}</h3>
                                            <p className={`text-[11px] ${currentTheme.subText} line-clamp-2 mb-3`}>{t.description || 'No ticket notes provided.'}</p>
                                        </div>

                                        <div className="space-y-2.5 pt-3 border-t border-slate-300 dark:border-slate-800/80">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <div>
                                                    <span className="text-[9px] uppercase font-black text-slate-500 block">Customer</span>
                                                    <span className={`font-bold ${currentTheme.titleText}`}>{t.customer?.name || 'Guest User'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[9px] uppercase font-black text-slate-500 block">Assigned Worker</span>
                                                    <span className={`font-bold ${t.assignedWorker?.name ? 'text-amber-400' : 'text-slate-500 italic'}`}>
                                                        {t.assignedWorker?.name || 'Unassigned'}
                                                    </span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => { setSelectedTicket(t); setSelectedWorkerId(t.assignedWorker?._id || ''); }}
                                                className="w-full py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 text-xs font-black transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                <span>Re-assign Worker</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-300 dark:border-slate-800">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-black border-b border-slate-300 dark:border-slate-800">
                                        <th className="p-3.5 pl-5">Ticket ID</th>
                                        <th className="p-3.5">Title</th>
                                        <th className="p-3.5">Priority</th>
                                        <th className="p-3.5">Customer</th>
                                        <th className="p-3.5">Worker</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 pr-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-300 dark:divide-slate-800 font-bold">
                                    {filteredTickets.map((t, index) => (
                                        <tr key={t._id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                                            <td className="p-3.5 pl-5 font-mono text-indigo-400 font-black">
                                                #{t.ticketNumber || `TK-${(index + 1).toString().padStart(4, '0')}`}
                                            </td>
                                            <td className="p-3.5">{t.title || 'Untitled'}</td>
                                            <td className="p-3.5">{getPriorityBadge(t.priority)}</td>
                                            <td className="p-3.5">{t.customer?.name || 'Guest'}</td>
                                            <td className="p-3.5">{t.assignedWorker?.name || 'Unassigned'}</td>
                                            <td className="p-3.5">{getStatusBadge(t.status)}</td>
                                            <td className="p-3.5 pr-5 text-right">
                                                <button 
                                                    onClick={() => { setSelectedTicket(t); setSelectedWorkerId(t.assignedWorker?._id || ''); }}
                                                    className="px-2.5 py-1 rounded-lg bg-indigo-600/15 border border-indigo-600/30 text-indigo-400 font-black text-[10px]"
                                                >
                                                    Reassign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* SECTION 3: USER & WORKER DIRECTORY (Desktop: Always Visible, Mobile: Under 'users' tab) */}
                <section className={`${mobileTab === 'users' || mobileTab === 'overview' ? 'block' : 'hidden md:block'} ${currentTheme.cardBg} border rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className={`text-base sm:text-lg font-black tracking-tight ${currentTheme.titleText}`}>User & Worker Directory</h2>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">Directory</span>
                            </div>
                            <p className={`text-xs ${currentTheme.subText} mt-0.5`}>Tap any worker card to view performance analytics.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-56">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="text"
                                    placeholder="Search user or worker..."
                                    value={userSearchTerm}
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                    className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs font-bold border outline-none ${currentTheme.inputBg}`}
                                />
                            </div>

                            <div className={`flex items-center justify-center gap-1 p-1 rounded-xl border ${currentTheme.pillBg}`}>
                                {['all', 'user', 'worker'].map((role) => (
                                    <button 
                                        key={role}
                                        onClick={() => setFilterRole(role)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-black capitalize transition-all ${
                                            filterRole === role ? 'bg-indigo-600 text-white' : `${currentTheme.subText}`
                                        }`}
                                    >
                                        {role === 'all' ? `All (${users.length})` : role === 'user' ? 'Clients' : 'Workers'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                        {filteredUsers.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-slate-500 font-medium text-xs">
                                No registered accounts found matching search criteria.
                            </div>
                        ) : (
                            filteredUsers.map((u) => {
                                const wStats = u.role === 'worker' ? getWorkerStats(u._id) : null;

                                return (
                                    <div 
                                        key={u._id} 
                                        onClick={() => u.role === 'worker' && setActiveWorkerProfile(u)}
                                        className={`${currentTheme.innerCard} border p-3.5 sm:p-5 rounded-2xl shadow-md flex items-center justify-between group`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm shadow-md shrink-0 ${
                                                u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                u.role === 'worker' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                            }`}>
                                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <h4 className={`font-black text-xs sm:text-sm ${currentTheme.titleText}`}>{u.name || 'Anonymous User'}</h4>
                                                    {u.role === 'worker' && <ExternalLink className="w-3 h-3 text-indigo-400 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                </div>
                                                <p className={`text-[10px] sm:text-[11px] ${currentTheme.subText} truncate max-w-[120px] sm:max-w-[130px] font-bold`}>{u.email}</p>
                                                
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                                                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                                                        u.role === 'worker' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-indigo-500/20 text-indigo-400'
                                                    }`}>
                                                        {u.role}
                                                    </span>

                                                    {wStats && (
                                                        <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
                                                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {wStats.avgRating}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {u.role !== 'admin' ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteUser(u._id, u.role); }}
                                                disabled={actionLoading === u._id}
                                                className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition-all shadow-sm disabled:opacity-50 shrink-0"
                                                title="Delete Account"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        ) : (
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800">Admin</span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

            </div>

            {/* 📱 MOBILE BOTTOM NAVIGATION BAR (FIXED AT BOTTOM FOR MOBILE PHONES) */}
            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 p-2 ${currentTheme.bottomNavBg} border-t flex items-center justify-around`}>
                <button 
                    onClick={() => setMobileTab('overview')} 
                    className={`flex flex-col items-center gap-1 text-[10px] font-black transition-all ${mobileTab === 'overview' ? 'text-indigo-400' : 'text-slate-400'}`}
                >
                    <BarChart2 className="w-4 h-4" />
                    <span>Overview</span>
                </button>
                <button 
                    onClick={() => setMobileTab('tickets')} 
                    className={`flex flex-col items-center gap-1 text-[10px] font-black transition-all ${mobileTab === 'tickets' ? 'text-indigo-400' : 'text-slate-400'}`}
                >
                    <List className="w-4 h-4" />
                    <span>Tickets</span>
                </button>
                <button 
                    onClick={() => setMobileTab('users')} 
                    className={`flex flex-col items-center gap-1 text-[10px] font-black transition-all ${mobileTab === 'users' ? 'text-indigo-400' : 'text-slate-400'}`}
                >
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                </button>
                <button 
                    onClick={handleExportCSV} 
                    className="flex flex-col items-center gap-1 text-[10px] font-black text-emerald-400"
                >
                    <Download className="w-4 h-4" />
                    <span>Report</span>
                </button>
            </div>

            {/* WORKER MINI-DASHBOARD MODAL (Full Responsive Sheet) */}
            {activeWorkerProfile && (() => {
                const wStats = getWorkerStats(activeWorkerProfile._id);

                return (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div className={`${currentTheme.cardBg} border-t sm:border rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in duration-200`}>
                            
                            <button 
                                onClick={() => setActiveWorkerProfile(null)}
                                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Worker Header */}
                            <div className="flex items-center gap-3.5 mb-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-lg">
                                    {activeWorkerProfile.name ? activeWorkerProfile.name.charAt(0).toUpperCase() : 'W'}
                                </div>
                                <div>
                                    <h3 className={`text-lg sm:text-xl font-black ${currentTheme.titleText}`}>{activeWorkerProfile.name}</h3>
                                    <p className={`text-xs ${currentTheme.subText}`}>{activeWorkerProfile.email}</p>
                                </div>
                            </div>

                            {/* Rating & Review Hero Badge */}
                            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2.5">
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-amber-400">Satisfaction</p>
                                        <span className="text-lg font-black text-white">{wStats.avgRating} / 5.0</span>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                    {wStats.rate}% Success
                                </span>
                            </div>

                            {/* Recharts Workload Bar Chart */}
                            <div className="p-4 rounded-2xl bg-[#090d18] border border-indigo-500/20 shadow-inner mb-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                                        <BarChart2 className="w-4 h-4 text-indigo-400" /> Workload Breakdown
                                    </span>
                                </div>

                                <div className="h-40 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={wStats.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.4} />
                                                </linearGradient>
                                                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.4} />
                                                </linearGradient>
                                                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#047857" stopOpacity={0.4} />
                                                </linearGradient>
                                                <linearGradient id="rejectedGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#be123c" stopOpacity={0.4} />
                                                </linearGradient>
                                            </defs>

                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={700} tickLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight={700} tickLine={false} allowDecimals={false} />
                                            <Tooltip 
                                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                                contentStyle={{ backgroundColor: '#0d121f', borderColor: '#3b82f6', borderRadius: '12px', fontSize: '11px', color: '#fff' }} 
                                            />
                                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                                {wStats.chartData.map((entry, index) => (
                                                    <Cell key={`bar-${index}`} fill={entry.fillId} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Assigned Tickets Listing */}
                            <h4 className={`text-xs font-black uppercase tracking-wider ${currentTheme.subText} mb-2.5`}>
                                Assigned Tickets ({wStats.total})
                            </h4>

                            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                {wStats.tickets.length === 0 ? (
                                    <p className="text-xs text-slate-500 italic py-4 text-center bg-slate-900/40 rounded-xl border border-slate-800">
                                        No tickets assigned yet.
                                    </p>
                                ) : (
                                    wStats.tickets.map((t, idx) => (
                                        <div key={t._id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                                    #{t.ticketNumber || `TK-${(idx + 1).toString().padStart(4, '0')}`}
                                                </span>
                                                <span className="font-bold text-slate-200 line-clamp-1 max-w-[120px]">{t.title || 'Ticket'}</span>
                                            </div>
                                            {getStatusBadge(t.status)}
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    </div>
                );
            })()}

            {/* REASSIGN WORKER MODAL */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className={`${currentTheme.cardBg} border rounded-3xl p-6 max-w-md w-full shadow-2xl relative`}>
                        <h3 className={`text-base font-black ${currentTheme.titleText} mb-1`}>Reassign Ticket Worker</h3>
                        <p className={`text-xs ${currentTheme.subText} mb-4`}>
                            Override assignment for ticket: <strong className="text-indigo-400 font-mono">#{selectedTicket.ticketNumber || selectedTicket._id.slice(-6)}</strong>
                        </p>

                        <form onSubmit={handleReassignSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-[11px] font-black uppercase mb-1.5 ${currentTheme.subText}`}>Select Available Worker</label>
                                <select 
                                    value={selectedWorkerId}
                                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                                    className={`w-full p-2.5 rounded-xl text-xs font-bold border outline-none ${currentTheme.inputBg} cursor-pointer`}
                                    required
                                >
                                    <option value="">-- Choose Worker --</option>
                                    {availableWorkers.map(w => (
                                        <option key={w._id} value={w._id}>
                                            {w.name} ({w.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-3.5 py-2 rounded-xl border text-xs font-bold hover:bg-slate-500/10"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={actionLoading === selectedTicket._id}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 shadow-lg disabled:opacity-50"
                                >
                                    {actionLoading === selectedTicket._id ? 'Saving...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;