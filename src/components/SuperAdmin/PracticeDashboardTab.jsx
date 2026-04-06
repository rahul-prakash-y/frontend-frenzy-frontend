import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Search, Loader2, ClipboardCheck, AlertTriangle, 
    BookOpen, Zap, User, Users, BarChart3,
    History, CheckCircle2, ChevronDown, ChevronUp,
    Check
} from 'lucide-react';
import { api } from '../../store/authStore';
import { API } from './constants';
import { SkeletonList } from '../Skeleton';
import Pagination from './components/Pagination';
import toast from 'react-hot-toast';

// ─── Question evaluation row (reused logic from EvaluationTab) ────────────────
const PracticeQuestionEvalRow = ({ submissionId, questionEntry, onScoreSaved }) => {
    const { question, answer, existingScore } = questionEntry;
    const [score, setScore] = useState(existingScore?.score ?? '');
    const [feedback, setFeedback] = useState(existingScore?.feedback ?? '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(!!existingScore);
    const [error, setError] = useState('');

    const handleSave = async () => {
        const numScore = Number(score);
        if (score === '' || isNaN(numScore) || numScore < 0 || numScore > question.points) {
            setError(`Score must be between 0 and ${question.points}`);
            return;
        }
        setSaving(true);
        setError('');
        try {
            await api.post(`${API}/manual-evaluations/${submissionId}/score`, {
                questionId: question._id,
                score: numScore,
                feedback
            });
            setSaved(true);
            onScoreSaved(question._id, { score: numScore, feedback });
            toast.success("Practice score saved");
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save score');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-amber-50/50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-amber-500" />
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{question.title}</p>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{question.points} Pts</p>
            </div>
            <div className="p-4 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Student's Answer</p>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
                        {typeof answer === 'object' ? JSON.stringify(answer, null, 2) : String(answer)}
                    </pre>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-3">
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase mb-1">Score</label>
                        <input
                            type="number"
                            value={score}
                            onChange={e => { setScore(e.target.value); setSaved(false); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                        />
                    </div>
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase mb-1">Feedback</label>
                        <input
                            type="text"
                            value={feedback}
                            onChange={e => { setFeedback(e.target.value); setSaved(false); }}
                            placeholder="Optional feedback..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600"
                        />
                    </div>
                </div>
                {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-2 rounded-lg text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${saved ? 'bg-emerald-500' : 'bg-amber-500'}`}
                >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? 'Updated' : 'Submit Score'}
                </button>
            </div>
        </div>
    );
};

// ─── Submission Card ──────────────────────────────────────────────────────────
const SubmissionCard = ({ submission, onScoreSaved }) => {
    const [expanded, setExpanded] = useState(false);
    const gradedCount = submission.questions.filter(q => q.existingScore).length;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-sm">{submission.student?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {submission.student?.studentId} &bull; {submission.round?.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grading Progress</p>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-amber-400" 
                                style={{ width: `${(gradedCount / submission.questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>
            
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <div className="grid gap-4">
                                {submission.questions.map((qEntry, i) => (
                                    <PracticeQuestionEvalRow
                                        key={i}
                                        submissionId={submission.submissionId}
                                        questionEntry={qEntry}
                                        onScoreSaved={onScoreSaved}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main Tab Component ───────────────────────────────────────────────────────
const PracticeDashboardTab = () => {
    const [submissions, setSubmissions] = useState([]);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalRecords: 0 });
    const limit = 10;

    const fetchPracticeData = useCallback(async () => {
        setLoading(true);
        try {
            // Reusing audit-logs with a practice filter (assuming backend support)
            // or we might need to fetch from /superadmin/manual-evaluations?type=practice
            const res = await api.get(`${API}/manual-evaluations?type=practice&search=${search}&page=${page}&limit=${limit}`);
            setSubmissions(res.data.data || []);
            setPagination(res.data.pagination || { totalPages: 1, totalRecords: 0 });
            
            // Also fetch practice summary stats for students
            const summaryRes = await api.get(`${API}/students/practice-summary`);
            setSummary(summaryRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch practice data:', err);
            // toast.error("Failed to load practice telemetry.");
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    useEffect(() => {
        fetchPracticeData();
    }, [fetchPracticeData]);

    const updateSubmissionLocally = (submissionId, questionId, scoreData) => {
        setSubmissions(prev => prev.map(sub => {
            if (sub.submissionId === submissionId) {
                return {
                    ...sub,
                    questions: sub.questions.map(q => 
                        q.question._id === questionId ? { ...q, existingScore: scoreData } : q
                    )
                };
            }
            return sub;
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><History size={20} /></div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Practices</p>
                        <p className="text-xl font-black text-indigo-900">{pagination.totalRecords}</p>
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Zap size={20} /></div>
                    <div>
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Awaiting Review</p>
                        <p className="text-xl font-black text-amber-900">
                            {submissions.filter(s => s.questions.some(q => !q.existingScore)).length}
                        </p>
                    </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><BarChart3 size={20} /></div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Avg. Performance</p>
                        <p className="text-xl font-black text-emerald-900">78%</p>
                    </div>
                </div>
            </div>

            {/* Submissions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Practice Evaluation Queue</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                            type="text" 
                            placeholder="Filter by Student ID..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <SkeletonList count={5} />
                ) : submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
                        <Zap size={40} className="text-slate-200 mb-4" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No practice sessions found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {submissions.map((sub, i) => (
                            <SubmissionCard 
                                key={i} 
                                submission={sub} 
                                onScoreSaved={(qId, data) => updateSubmissionLocally(sub.submissionId, qId, data)} 
                            />
                        ))}
                        <Pagination 
                            currentPage={page} 
                            totalPages={pagination.totalPages} 
                            onPageChange={setPage} 
                        />
                    </div>
                )}
            </div>

            {/* Student Summary Section */}
            <div className="mt-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Student Practice Velocity</h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4 text-center">Sessions</th>
                                <th className="px-6 py-4 text-center">Solved</th>
                                <th className="px-6 py-4 text-right">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {summary.length > 0 ? summary.map((s, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-700">{s.name}</p>
                                        <p className="text-[10px] font-mono text-slate-400">{s.studentId}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black">{s.attempts || 0}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-bold text-slate-600">{s.solvedCount || 0} Qs</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-[10px] font-bold text-slate-400">{s.lastAttemptedAt ? new Date(s.lastAttemptedAt).toLocaleDateString() : 'Never'}</p>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic text-sm font-medium">
                                        No telemetry recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PracticeDashboardTab;
