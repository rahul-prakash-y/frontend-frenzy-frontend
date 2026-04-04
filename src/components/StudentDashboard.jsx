import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Clock, Play, CheckCircle, LogOut, ArrowRight, Sparkles, UserCheck, Loader2, AlertTriangle, Check, ShieldAlert, User, Power, FileDown, Award, Timer, Users, Send, RefreshCw, XCircle, Trophy, BarChart3, BookOpen } from 'lucide-react';
import OtpGate from './OtpGate';
import { useAuthStore, api } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { SkeletonGrid } from './Skeleton';

const statusConfig = {
    LOCKED: {
        icon: Lock, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-500 border-slate-200', label: 'Classified'
    },
    WAITING_FOR_OTP: {
        icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Awaiting Auth'
    },
    RUNNING: {
        icon: Play, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Arena Live'
    },
    COMPLETED: {
        icon: CheckCircle, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Mission Accomplished'
    }
};

const SidebarItem = ({ icon: Icon, onClick, label, variant = "indigo", isActive = false }) => {
    const variants = {
        indigo: "text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white hover:shadow-indigo-200",
        violet: "text-violet-600 border-violet-100 hover:bg-violet-600 hover:text-white hover:shadow-violet-200",
        teal: "text-teal-600 border-teal-100 hover:bg-teal-600 hover:text-white hover:shadow-teal-200",
        amber: "text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white hover:shadow-amber-200",
        red: "text-red-500 border-slate-200 hover:bg-red-600 hover:text-white hover:shadow-red-200",
        slate: "text-slate-400 border-transparent hover:bg-slate-100 hover:text-slate-600"
    };

    return (
        <div className="relative group flex items-center justify-center">
            <button
                onClick={onClick}
                className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center border-2 active:scale-90
                    ${isActive ? 'bg-white shadow-lg ' + variants[variant] : 'bg-transparent border-transparent ' + variants[variant]}
                `}
            >
                <Icon size={20} className="transition-transform group-hover:scale-110" />
            </button>
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-50">
                {label}
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
        </div>
    );
};

const Toast = ({ message, type = 'info', onClose }) => {
    const icons = {
        success: <CheckCircle className="text-emerald-500" size={18} />,
        error: <AlertTriangle className="text-red-500" size={18} />,
        info: <Sparkles className="text-indigo-500" size={18} />,
        warning: <AlertTriangle className="text-amber-500" size={18} />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-5 py-3.5 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl min-w-[320px] max-w-md"
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="flex-1 text-xs font-black text-slate-700 tracking-tight leading-tight mr-4 whitespace-pre-line">
                {message}
            </p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
                <XCircle size={16} />
            </button>
        </motion.div>
    );
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRound, setSelectedRound] = useState(null);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
    const [attendanceOtp, setAttendanceOtp] = useState('');
    const [marking, setMarking] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState(null); // 'success', 'error', null
    const [attendanceMessage, setAttendanceMessage] = useState('');

    // Team enrollment request state
    const [teamRequestStatus, setTeamRequestStatus] = useState(user?.teamRequest?.status || 'NONE');
    const [teamRequestMsg, setTeamRequestMsg] = useState(user?.teamRequest?.message || '');

    // High-end animation variants for staggered entry
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            }
        }
    };
    const [submittingRequest, setSubmittingRequest] = useState(false);

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(p => ({ ...p, show: false })), 4000);
    }, []);

    // Guard: recovery logic must only run once per page session.
    const hasFiredRecovery = useRef(false);

    const fetchRounds = useCallback(async () => {
        try {
            const res = await api.get('/rounds');
            setRounds(res.data.data || []);
        } catch (e) {
            console.error('Failed to fetch rounds:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRounds();
    }, [fetchRounds]);

    // ─── STEP 4 & 5: Fallback recovery — silently re-fire dropped submissions ──
    // Runs once after the first rounds fetch completes. It scans localStorage for
    // any backup_submission_* entries written by CodeArena on submit.
    //
    //  • If the round already shows COMPLETED server-side → the async queue
    //    processed it fine → clear the stale backup (STEP 5).
    //  • Otherwise → the backend may have dropped the DB write → silently
    //    re-fire the original POST payload (STEP 4).
    //
    // The re-fire is entirely invisible to the student: no toast, no spinner.
    // The backend submit route must be idempotent (duplicate submits are no-ops).
    useEffect(() => {
        if (loading || hasFiredRecovery.current) return;
        hasFiredRecovery.current = true;

        const attemptRecovery = async () => {
            const backupKeys = Object.keys(localStorage).filter(k =>
                k.startsWith('backup_submission_')
            );
            if (backupKeys.length === 0) return;

            // Build a fast lookup: roundId -> mySubmissionStatus from live server data
            const statusMap = {};
            rounds.forEach(r => { statusMap[r._id] = r.mySubmissionStatus; });

            for (const key of backupKeys) {
                let backup;
                try {
                    backup = JSON.parse(localStorage.getItem(key));
                } catch {
                    localStorage.removeItem(key); // corrupted — discard
                    continue;
                }

                if (!backup?.roundId || !backup?.payload) {
                    localStorage.removeItem(key);
                    continue;
                }

                if (statusMap[backup.roundId] === 'COMPLETED') {
                    // ── STEP 5: Score is confirmed on the server ─────────────────
                    console.info(`[Recovery] Round ${backup.roundId} is COMPLETED. Clearing backup.`);
                    localStorage.removeItem(key);
                } else {
                    // ── STEP 4: Silent re-fire ───────────────────────────────────
                    // The backend did not confirm COMPLETED — assume the async
                    // queue dropped the write. Re-submit the original payload.
                    console.warn(`[Recovery] Round ${backup.roundId} not COMPLETED ("${statusMap[backup.roundId]}"). Silently re-firing.`);
                    try {
                        await api.post(`/rounds/${backup.roundId}/submit`, backup.payload);
                        // Fetch fresh data to check if the re-fire was confirmed
                        const updatedRes = await api.get('/rounds');
                        const updated = (updatedRes.data.data || []).find(
                            r => r._id === backup.roundId
                        );
                        if (updated?.mySubmissionStatus === 'COMPLETED') {
                            // ── STEP 5 (after re-fire): now confirmed — clear ────
                            localStorage.removeItem(key);
                            console.info(`[Recovery] Re-fire confirmed for round ${backup.roundId}. Backup cleared.`);
                            // Sync UI state with the fresh data
                            setRounds(updatedRes.data.data || []);
                        }
                        // If still not COMPLETED after re-fire, keep the backup.
                        // The next dashboard load will try again.
                    } catch (err) {
                        // Network down or server error — keep backup for next time.
                        console.error(`[Recovery] Re-fire failed for round ${backup.roundId}:`, err);
                    }
                }
            }
        };

        attemptRecovery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]); // Depends only on `loading` — fires exactly once after first load

    const displayRounds = React.useMemo(() => {
        const groups = {};
        const singles = [];

        rounds.forEach(r => {
            if (r.testGroupId) {
                if (!groups[r.testGroupId]) groups[r.testGroupId] = [];
                groups[r.testGroupId].push(r);
            } else {
                singles.push(r);
            }
        });

        const result = [...singles];

        Object.values(groups).forEach(groupRounds => {
            groupRounds.sort((a, b) => (a.roundOrder || 1) - (b.roundOrder || 1));

            // The "Active" round is the first one they haven't completed
            let activeRound = groupRounds[groupRounds.length - 1];
            for (const r of groupRounds) {
                if (r.mySubmissionStatus !== 'COMPLETED') {
                    activeRound = r;
                    break;
                }
            }

            const displayName = activeRound.name.split(' - Section')[0] || activeRound.name;

            result.push({
                ...activeRound,
                name: displayName,
                totalSections: groupRounds.length
            });
        });

        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [rounds]);

    const getTimeWindowStatus = (round) => {
        const now = new Date();
        const start = round.startTime ? new Date(round.startTime) : null;
        const end = round.endTime ? new Date(round.endTime) : null;

        if (start && now < start) {
            const diff = start - now;
            const mins = Math.floor(diff / 60000);
            const hours = Math.floor(mins / 60);
            if (hours > 24) return { label: `Starts In ${Math.floor(hours / 24)}d`, type: 'WAITING', color: 'text-amber-500' };
            if (hours > 0) return { label: `Starts In ${hours}h ${mins % 60}m`, type: 'WAITING', color: 'text-amber-500' };
            return { label: `Starts In ${mins}m`, type: 'WAITING', color: 'text-amber-500' };
        }

        if (end && now > end) {
            return { label: 'Test Window Closed', type: 'CLOSED', color: 'text-slate-400' };
        }

        if (end) {
            const diff = end - now;
            const mins = Math.floor(diff / 60000);
            if (mins < 60) return { label: 'Ending soon', value: `${mins}m left`, type: 'ENDING', color: 'text-red-500' };
            const hours = Math.floor(mins / 60);
            if (hours < 24) return { label: 'Ends today', value: `${hours}h left`, type: 'ENDING', color: 'text-indigo-500' };
        }

        return null;
    };

    const handleRoundClick = (round) => {
        const windowStatus = getTimeWindowStatus(round);
        if (windowStatus?.type === 'WAITING') {
            showToast(`Assessment starts at ${new Date(round.startTime).toLocaleString()}.`, 'info');
            return;
        }
        if (windowStatus?.type === 'CLOSED' && round.mySubmissionStatus !== 'IN_PROGRESS') {
            showToast('The testing window for this assessment has closed.', 'warning');
            return;
        }

        if (round.mySubmissionStatus === 'SUBMITTED' || round.mySubmissionStatus === 'COMPLETED') {
            showToast('Session complete. Assessment data is sealed.', 'info');
            return;
        }

        if (round.status === 'WAITING_FOR_OTP' || (round.status === 'RUNNING' && !round.mySubmissionStatus)) {
            setSelectedRound(round);
            setIsOtpOpen(true);
        } else if (round.status === 'RUNNING' || round.mySubmissionStatus === 'IN_PROGRESS') {
            navigate(`/arena/${round._id}`);
        }
    };

    const handleOtpUnlock = () => {
        setIsOtpOpen(false);
        if (selectedRound) {
            navigate(`/arena/${selectedRound._id}`);
        }
        setSelectedRound(null);
    };

    const handleTeamRequest = async () => {
        setSubmittingRequest(true);
        try {
            await api.post('/auth/team-request');
            setTeamRequestStatus('PENDING');
            setTeamRequestMsg('');
            showToast('Team enrollment request submitted successfully.', 'success');
        } catch (e) {
            const msg = e.response?.data?.error || 'Failed to submit request. Please try again.';
            showToast(msg, 'error');
        }
    };


    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans relative">
            {/* Ambient background glows for a premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Sidebar Navigation */}
            <aside className="w-20 bg-white/70 backdrop-blur-2xl border-r border-slate-200/50 flex flex-col items-center py-8 justify-between shrink-0 z-50">
                <div className="mb-12">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-2">
                        <Sparkles size={20} className="text-white" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <SidebarItem
                        icon={Play}
                        label="Dashboard"
                        variant="indigo"
                        isActive={true}
                        onClick={() => navigate('/dashboard')}
                    />
                    <SidebarItem
                        icon={UserCheck}
                        label="Mark Attendance"
                        variant="indigo"
                        onClick={() => setIsAttendanceOpen(true)}
                    />
                    <SidebarItem
                        icon={User}
                        label="Profile"
                        variant="violet"
                        onClick={() => navigate('/profile')}
                    />
                    <SidebarItem
                        icon={Clock}
                        label="History"
                        variant="teal"
                        onClick={() => navigate('/attendance-history')}
                    />
                    <SidebarItem
                        icon={Trophy}
                        label="Achievements"
                        variant="amber"
                        onClick={() => navigate('/achievements')}
                    />
                    <SidebarItem
                        icon={BarChart3}
                        label="Performance"
                        variant="violet"
                        onClick={() => navigate('/performance-report')}
                    />
                </div>

                <div className="mt-auto">
                    <SidebarItem
                        icon={Power}
                        label="Disconnect"
                        variant="red"
                        onClick={logout}
                    />
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                {/* Header Section */}
                <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 shrink-0 shadow-sm relative z-40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-linear-to-tr from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-200 group transition-transform hover:rotate-3 cursor-pointer">
                            <Sparkles className="text-white group-hover:scale-110 transition-transform" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">CodeCircle <span className="text-indigo-600">Arena</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Terminal Protocol Active</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">
                            Student: <span className="font-mono font-bold text-slate-700">{user?.name || 'Unknown'}</span> ({user?.studentId})
                            {user?.team?.name && (
                                <>
                                    <span className="mx-1 text-slate-300">|</span>
                                    Team: <span className="text-indigo-600 font-bold">{user.team.name}</span>
                                </>
                            )}
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">System Live</span>
                        </div>
                    </div>
                </header>

            <main className="flex-1 overflow-y-auto relative z-10 px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto space-y-8">

                {/* Team Enrollment Banner — shown only when student has no team */}
                {!user?.team && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                            ${teamRequestStatus === 'PENDING'
                                ? 'bg-amber-50 border-amber-200'
                                : teamRequestStatus === 'REJECTED'
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-indigo-50 border-indigo-200'
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl ${teamRequestStatus === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                teamRequestStatus === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                    'bg-indigo-100 text-indigo-600'
                                }`}>
                                {teamRequestStatus === 'PENDING' ? <Loader2 size={18} className="animate-spin" /> :
                                    teamRequestStatus === 'REJECTED' ? <XCircle size={18} /> :
                                        <Users size={18} />}
                            </div>
                            <div>
                                <p className={`font-black text-sm ${teamRequestStatus === 'PENDING' ? 'text-amber-800' :
                                    teamRequestStatus === 'REJECTED' ? 'text-red-800' :
                                        'text-indigo-800'
                                    }`}>
                                    {teamRequestStatus === 'PENDING'
                                        ? 'Team Enrollment Request Pending'
                                        : teamRequestStatus === 'REJECTED'
                                            ? 'Team Enrollment Request Rejected'
                                            : 'No Team Assigned'}
                                </p>
                                <p className={`text-xs mt-0.5 ${teamRequestStatus === 'PENDING' ? 'text-amber-600' :
                                    teamRequestStatus === 'REJECTED' ? 'text-red-600' :
                                        'text-indigo-500'
                                    }`}>
                                    {teamRequestStatus === 'PENDING'
                                        ? 'Your request has been submitted. Awaiting admin review.'
                                        : teamRequestStatus === 'REJECTED'
                                            ? (teamRequestMsg || 'Your request was rejected. You may re-submit.')
                                            : 'You are not assigned to any team. Request the admin to enroll you.'}
                                </p>
                            </div>
                        </div>
                        {teamRequestStatus === 'NONE' && (
                            <button
                                onClick={handleTeamRequest}
                                disabled={submittingRequest}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-sm disabled:opacity-60 whitespace-nowrap"
                            >
                                {submittingRequest ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Request Enrollment
                            </button>
                        )}
                        {teamRequestStatus === 'REJECTED' && (
                            <button
                                onClick={handleTeamRequest}
                                disabled={submittingRequest}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition-all active:scale-95 shadow-sm disabled:opacity-60 whitespace-nowrap"
                            >
                                {submittingRequest ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                Re-submit Request
                            </button>
                        )}
                    </motion.div>
                )}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Sparkles className="text-indigo-500" size={28} />
                            Available Assessments
                        </h2>
                        <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">
                            {loading ? 'Scanning server nodes for active deployments...' : 'Select an active assessment to initialize your session. Ensure you have the required access keys.'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-4">
                        <SkeletonGrid count={6} />
                    </div>
                ) : displayRounds.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-300 rounded-3xl bg-white/50 backdrop-blur-sm"
                    >
                        <Lock size={48} className="text-slate-300 mb-4" />
                        <p className="text-lg font-black text-slate-600">NO ACTIVE ASSESSMENTS</p>
                        <p className="text-sm text-slate-400 mt-2">Stand by for administrator deployment.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {displayRounds.map((round) => {
                                const eligibility = round.eligibility || { eligible: true };
                                const isEligible = eligibility.eligible !== false;

                                let config = isEligible ? statusConfig[round.status] : {
                                    icon: ShieldAlert,
                                    label: 'RESTRICTED',
                                    bg: 'bg-red-50',
                                    border: 'border-red-100',
                                    color: 'text-red-500',
                                    badge: 'border-red-200 bg-red-50 text-red-600'
                                };

                                if (isEligible && (round.mySubmissionStatus === 'SUBMITTED' || round.mySubmissionStatus === 'COMPLETED')) {
                                    config = {
                                        ...statusConfig['COMPLETED'],
                                        label: round.mySubmissionStatus === 'SUBMITTED' ? 'Response Locked' : 'Mission Accomplished'
                                    };
                                }

                                 const Icon = config.icon;
                                 const windowStatus = getTimeWindowStatus(round);
                                 const isWindowRestricted = windowStatus?.type === 'WAITING' || (windowStatus?.type === 'CLOSED' && round.mySubmissionStatus !== 'IN_PROGRESS');
                                 const isFinished = round.mySubmissionStatus === 'SUBMITTED' || round.mySubmissionStatus === 'COMPLETED';
                                 const isInteractable = (round.status === 'WAITING_FOR_OTP' || round.status === 'RUNNING') && isEligible && !isWindowRestricted && !isFinished;
                                 const isLive = round.status === 'RUNNING' && isEligible && !isWindowRestricted && !isFinished;

                                 return (
                                     <motion.div
                                         key={round._id}
                                         layout
                                         variants={itemVariants}
                                         whileHover={isInteractable ? { 
                                             scale: 1.03, 
                                             translateY: -8,
                                             transition: { duration: 0.3, ease: "easeOut" }
                                         } : {}}
                                         whileTap={isInteractable ? { scale: 0.98 } : {}}
                                         onClick={() => handleRoundClick(round)}
                                         className={`group relative overflow-hidden rounded-4xl p-8 transition-all duration-500 
                                             ${isInteractable ? 'cursor-pointer shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 bg-white/70 backdrop-blur-md border border-white/40' : 'shadow-sm'}
                                             ${isLive ? 'border-2 border-emerald-400/50 bg-white/80 ring-8 ring-emerald-50/50' : ''}
                                             ${isFinished ? 'bg-indigo-50/50 backdrop-blur-sm border border-indigo-200/40 opacity-95' : (!isInteractable && !isLive ? 'bg-white/40 border border-slate-100/50 opacity-60 cursor-not-allowed grayscale' : '')}
                                         `}
                                     >
                                        {/* Dynamic accent glow for active/hovered rounds */}
                                        <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isLive ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                                        
                                        {/* Subtle internal gradient for live rounds */}
                                        {isLive && <div className="absolute inset-0 bg-linear-to-br from-emerald-50/40 to-transparent pointer-events-none animate-pulse" />}

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className={`p-3 rounded-2xl border ${config.bg} ${config.border} ${config.color} transition-transform group-hover:scale-110`}>
                                                    <Icon size={24} />
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${config.badge}`}>
                                                    {config.label}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{round.name}</h3>

                                                {!isEligible ? (
                                                    <div className="bg-red-50/50 rounded-xl p-3 border border-red-100/50">
                                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none mb-1">Rank Requirement Failed</p>
                                                        <p className="text-xs font-bold text-red-800 leading-tight">
                                                            Top {eligibility.maxRank} only. Your rank: #{eligibility.rank}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                                            <Clock size={14} className="text-slate-400" />
                                                            {round.testDurationMinutes || round.durationMinutes} Minutes Limit
                                                            {round.totalSections > 1 && (
                                                                <>
                                                                    <span className="text-slate-300">|</span>
                                                                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500 bg-indigo-50 px-2 rounded-md">
                                                                        {round.totalSections} Sections
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {(() => {
                                                            const windowStatus = getTimeWindowStatus(round);
                                                            if (!windowStatus) return null;
                                                            return (
                                                                <div className={`flex items-center gap-1.5 text-[11px] font-bold ${windowStatus.color}`}>
                                                                    <Timer size={12} />
                                                                    {windowStatus.label}
                                                                    {windowStatus.value && <span className="opacity-60 ml-1">({windowStatus.value})</span>}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Interactive Footer */}
                                        <div className={`mt-8 pt-4 border-t transition-colors flex items-center justify-between gap-3
                                            ${isLive ? 'border-emerald-100/50' : 'border-slate-100'}
                                        `}>
                                            
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    {!isEligible ? 'Access Locked' :
                                                        round.mySubmissionStatus === 'COMPLETED' ? 'Evaluation Complete' :
                                                            round.mySubmissionStatus === 'SUBMITTED' ? 'Awaiting Evaluation' :
                                                                round.status === 'LOCKED' ? 'Access Restricted' :
                                                                    round.status === 'COMPLETED' ? 'Data Sealed' :
                                                                        round.status === 'WAITING_FOR_OTP' ? 'Requires Auth Key' :
                                                                            'Session Ready'}
                                                </p>
                                            <div className="flex items-center gap-2">
                                                {/* Practice Test Button — always visible */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/practice/${round._id}`); }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all active:scale-95 whitespace-nowrap"
                                                >
                                                    <BookOpen size={12} />
                                                    Practice
                                                </button>
                                                {isInteractable && (
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLive ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
                </div>
            </main>
            </div>

            <OtpGate
                isOpen={isOtpOpen}
                roundId={selectedRound?._id}
                roundName={selectedRound?.name}
                onClose={() => setIsOtpOpen(false)}
                onUnlock={handleOtpUnlock}
            />

            {/* Attendance Modal */}
            <AnimatePresence>
                {isAttendanceOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                        <UserCheck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 leading-none">Mark Attendance</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                                            Roll Call Protocol
                                        </p>
                                    </div>
                                </div>

                                {attendanceStatus === 'success' ? (
                                    <div className="py-4 text-center space-y-3">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                            <Check size={24} />
                                        </div>
                                        <h4 className="font-black text-slate-900">Attendance Marked!</h4>
                                        <p className="text-sm text-slate-500 font-medium">{attendanceMessage}</p>
                                        <button
                                            onClick={() => {
                                                setIsAttendanceOpen(false);
                                                setAttendanceStatus(null);
                                            }}
                                            className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-slate-800 transition-colors"
                                        >
                                            CONTINUE
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                                Enter Attendance Key
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={attendanceOtp}
                                                onChange={e => setAttendanceOtp(e.target.value.toUpperCase())}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center text-2xl font-mono font-black tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                placeholder="••••••"
                                                autoFocus
                                            />
                                            {attendanceStatus === 'error' && (
                                                <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1">
                                                    <AlertTriangle size={10} /> {attendanceMessage}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => setIsAttendanceOpen(false)}
                                                className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-100 transition-colors border border-slate-100"
                                            >
                                                CANCEL
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setMarking(true);
                                                    setAttendanceStatus(null);
                                                    try {
                                                        const res = await api.post('/attendance/mark', { otp: attendanceOtp });
                                                        setAttendanceStatus('success');
                                                        setAttendanceMessage(res.data.message);
                                                    } catch (e) {
                                                        setAttendanceStatus('error');
                                                        setAttendanceMessage(e.response?.data?.error || 'Validation failed');
                                                    } finally {
                                                        setMarking(false);
                                                    }
                                                }}
                                                disabled={marking || attendanceOtp.length < 6}
                                                className="flex-2 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {marking ? <Loader2 size={14} className="animate-spin" /> : 'VERIFY & MARK'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(p => ({ ...p, show: false }))}
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default StudentDashboard;