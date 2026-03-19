import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserCheck, Clock, Calendar, Award, Loader2, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { api, useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const AttendanceHistoryPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/attendance/my-history');
                setRecords(res.data.data || []);
            } catch {
                setError('Failed to load attendance history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-y-auto scrollbar-hide">
            {/* Ambient glows */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-black text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-white rounded-xl transition-all active:scale-95"
                    >
                        <ArrowLeft size={14} />
                        Back
                    </button>
                    <div>
                        <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <UserCheck className="text-indigo-500" size={20} />
                            Attendance History
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">
                            {user?.name} · {user?.studentId}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-10 space-y-6">
                {/* Summary Card */}
                {!loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm"
                    >
                        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                            <CheckCircle size={32} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Sessions</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tight">{records.length}</p>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                {records.length === 0
                                    ? 'No attendance recorded yet.'
                                    : `Last marked on ${formatDate(records[0].createdAt)} at ${formatTime(records[0].createdAt)}`}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Records */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={36} className="text-indigo-400 animate-spin" />
                        <p className="text-sm font-bold text-slate-400">Loading attendance records...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <AlertTriangle size={36} className="text-red-400" />
                        <p className="text-sm font-bold text-red-500">{error}</p>
                    </div>
                ) : records.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50"
                    >
                        <UserCheck size={48} className="text-slate-300 mb-4" />
                        <p className="text-lg font-black text-slate-600">NO ATTENDANCE RECORDS</p>
                        <p className="text-sm text-slate-400 mt-2">Your attendance will appear here once marked.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                            {records.length} Record{records.length !== 1 ? 's' : ''} Found
                        </p>
                        <AnimatePresence>
                            {records.map((record, index) => (
                                <motion.div
                                    key={record._id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04, ease: 'easeOut' }}
                                    className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
                                >
                                    {/* Left: Session info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm">
                                                {record.round?.name || 'General Session'}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                    <Users size={10} />
                                                    Marked by: <span className="text-indigo-500">{record.markedBy?.name || 'Admin'}</span>
                                                </span>
                                                {record.markedBy?.studentId && (
                                                    <span className="text-[10px] font-mono font-bold text-slate-300">
                                                        ({record.markedBy.studentId})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Timestamp */}
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                                            <Calendar size={12} className="text-indigo-400" />
                                            {formatDate(record.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <Clock size={12} />
                                            {formatTime(record.createdAt)}
                                        </div>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            Present
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AttendanceHistoryPage;
