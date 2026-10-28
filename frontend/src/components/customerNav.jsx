import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, LogOut, LayoutDashboard, Sun, Moon, ChevronDown, Sparkles, Bell, Check, X, Clock, CheckCircle2, TrendingUp, User } from 'lucide-react';
import axios from 'axios';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Real User Data from DB/LocalStorage
    const [userData, setUserData] = useState({ name: 'Loading...', email: 'Loading...' });

    // Real Stats & Notifications
    const [stats, setStats] = useState({ pending: 0, completed: 0, progress: 0 });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchUserProfile();
        fetchNotifications();
        fetchUserStats();

        // Background polling to keep stats & notifications updated every 10 seconds
        const interval = setInterval(() => {
            fetchUserStats();
            fetchNotifications();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Fetch Real User Profile from Backend DB
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data) {
                setUserData({
                    name: res.data.name || 'User',
                    email: res.data.email || ''
                });
                // Cache locally for instant loading next time
                localStorage.setItem('userName', res.data.name);
                localStorage.setItem('userEmail', res.data.email);
            }
        } catch (error) {
            console.error("Error fetching user profile from DB:", error);
            // Fallback to local storage if API fails
            setUserData({
                name: localStorage.getItem('userName') || 'User',
                email: localStorage.getItem('userEmail') || ''
            });
        }
    };

    // Fetch Real Notifications from DB
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get('http://localhost:5000/api/notifications/my-notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Fetch Real Ticket Stats from DB and Calculate Pending, Completed & Progress Score
    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get('http://localhost:5000/api/tickets/my-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const tickets = res.data || [];
            
            const pending = tickets.filter(t => t.status === 'Pending' || t.status === 'Open' || t.status === 'In Progress').length;
            const completed = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
            
            const total = tickets.length;
            const progressScore = total > 0 ? Math.round((completed / total) * 100) : 0;

            setStats({ pending, completed, progress: progressScore });
        } catch (error) {
            console.error("Error fetching real user stats:", error);
        }
    };

    // Mark notification as read
    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/notifications/mark-read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking notification read:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    const isCreatePage = location.pathname.includes('create');

    return (
        <motion.nav 
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`sticky top-0 z-50 w-full backdrop-blur-3xl border-b transition-all duration-500 shadow-xl ${
                isDarkMode 
                    ? 'bg-[#090d16]/85 border-white/10 text-white shadow-black/40' 
                    : 'bg-white/85 border-slate-200/80 text-slate-900 shadow-slate-200/50'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between">
                
                {/* Logo & Brand */}
                <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3.5 cursor-pointer group" 
                    onClick={() => navigate('/customer-dashboard')}
                >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
                        <div className={`w-full h-full rounded-[14px] flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
                            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <span className="font-black text-base tracking-tight block bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                            SupportFlow
                        </span>
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-indigo-300/50' : 'text-slate-400'}`}>
                            Customer Portal
                        </span>
                    </div>
                </motion.div>

                {/* Navigation Links */}
                {!isCreatePage && (
                    <div className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 shadow-inner backdrop-blur-2xl">
                        <button
                            onClick={() => navigate('/user-dashboard')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                location.pathname === '/customer-dashboard'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                                    : isDarkMode ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => navigate('/my-tickets')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                location.pathname === '/my-tickets'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                                    : isDarkMode ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
                            }`}
                        >
                            <Ticket className="w-4 h-4" />
                            <span>My Tickets</span>
                        </button>
                    </div>
                )}

                {/* Right Actions: Notifications & Profile Dropdown */}
                <div className="flex items-center gap-3.5">
                    
                    {/* Notification Bell */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) fetchNotifications();
                            }}
                            className={`p-3 rounded-2xl border transition-all duration-300 relative ${
                                isDarkMode 
                                    ? 'border-white/10 bg-white/5 text-indigo-300 hover:bg-white/10 shadow-lg shadow-indigo-500/10' 
                                    : 'border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200 shadow-sm'
                            }`}
                        >
                            <Bell className="w-4.5 h-4.5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50 animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>

                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className={`absolute right-0 mt-3 w-84 sm:w-96 rounded-3xl border shadow-2xl backdrop-blur-3xl z-50 overflow-hidden ${
                                        isDarkMode ? 'bg-[#090d16]/95 border-white/15 text-white shadow-black/80' : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50'
                                    }`}
                                >
                                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-transparent">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                                                <Bell className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-wider">Notifications</h3>
                                                <p className="text-[10px] opacity-60">Real-time DB sync</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setShowNotifications(false)} 
                                            className="p-1.5 rounded-xl hover:bg-white/10 opacity-70 hover:opacity-100 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                                        {notifications.length === 0 ? (
                                            <div className="text-center py-12 opacity-50 space-y-3">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-400">
                                                    <Bell className="w-6 h-6 opacity-40 animate-pulse" />
                                                </div>
                                                <p className="text-xs font-semibold">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div 
                                                    key={notif._id} 
                                                    className={`p-4 text-xs flex items-start justify-between gap-3.5 transition-all ${
                                                        notif.isRead 
                                                            ? 'opacity-50 hover:opacity-75' 
                                                            : isDarkMode ? 'bg-indigo-600/20 font-bold border-l-4 border-indigo-500' : 'bg-indigo-50/80 font-bold border-l-4 border-indigo-600'
                                                    }`}
                                                >
                                                    <p className="leading-relaxed">{notif.message}</p>
                                                    {!notif.isRead && (
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => handleMarkAsRead(notif._id, e)}
                                                            className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 shrink-0"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                        </motion.button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile & Settings Dropdown */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-3 p-1.5 sm:px-4 sm:py-2 rounded-2xl border transition-all duration-300 ${
                                isDarkMode 
                                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-lg shadow-black/20' 
                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-sm'
                            }`}
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-purple-500/30">
                                {userData.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden sm:inline-block text-xs font-black tracking-wide truncate max-w-[100px]">{userData.name}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 opacity-70 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className={`absolute right-0 mt-3 w-80 rounded-3xl border p-4 shadow-2xl backdrop-blur-3xl z-50 ${
                                        isDarkMode ? 'bg-[#090d16]/95 border-white/15 text-white shadow-black/80' : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50'
                                    }`}
                                >
                                    {/* Real User Profile Info Header inside Dropdown */}
                                    <div className="flex items-center gap-3.5 p-3.5 border-b border-white/10 mb-3 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-2xl">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-black shadow-lg shadow-purple-500/30 shrink-0 border-2 border-white/20">
                                            {userData.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Account Profile</p>
                                            <p className="text-xs font-black truncate">{userData.name}</p>
                                            <p className={`text-[10px] font-medium truncate ${isDarkMode ? 'text-indigo-300/60' : 'text-slate-500'}`}>{userData.email}</p>
                                        </div>
                                    </div>

                                    {/* Theme Switcher Shifted Inside Profile Dropdown */}
                                    <div className="mb-3 p-3 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                                                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black">Appearance Mode</p>
                                                <p className="text-[10px] opacity-60">{isDarkMode ? 'Dark Theme' : 'Light Theme'}</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                                isDarkMode 
                                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                                    : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                            }`}
                                        >
                                            {isDarkMode ? 'Light On' : 'Dark On'}
                                        </motion.button>
                                    </div>

                                    {/* Real DB Stats Box (Pending, Completed, Progress) */}
                                    <div className="mb-3 p-3 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-black tracking-wider uppercase opacity-80 px-1">
                                            <span>Task/Ticket Stats</span>
                                            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                                <div className="flex items-center justify-center text-amber-400 mb-1">
                                                    <Clock className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-black text-amber-400 block">{stats.pending}</span>
                                                <span className="text-[9px] font-semibold opacity-60 uppercase">Pending</span>
                                            </div>

                                            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="flex items-center justify-center text-emerald-400 mb-1">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-black text-emerald-400 block">{stats.completed}</span>
                                                <span className="text-[9px] font-semibold opacity-60 uppercase">Done</span>
                                            </div>

                                            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                                <div className="flex items-center justify-center text-indigo-400 mb-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-black text-indigo-400 block">{stats.progress}%</span>
                                                <span className="text-[9px] font-semibold opacity-60 uppercase">Score</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Responsive Navigation Links inside Dropdown */}
                                    {!isCreatePage && (
                                        <div className="md:hidden space-y-1 mb-2.5 pb-2.5 border-b border-white/10">
                                            <button
                                                onClick={() => { navigate('/customer-dashboard'); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-500/15 hover:text-indigo-400 transition-all"
                                            >
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </button>
                                            <button
                                                onClick={() => { navigate('/my-tickets'); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-500/15 hover:text-indigo-400 transition-all"
                                            >
                                                <Ticket className="w-4 h-4" /> My Tickets
                                            </button>
                                        </div>
                                    )}

                                    {/* Logout Action */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-rose-400 hover:bg-rose-500/15 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout Account
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>
        </motion.nav>
    );
};

export default Navbar;