import React, { useState, useEffect } from 'react';
import { 
    BarChart3, Users, BookOpen, Award, TrendingUp, 
    Calendar, Filter, Search, Download, Star,
    Zap, Clock, FileText, CheckCircle2, MoreVertical
} from 'lucide-react';
import { api } from '../../store/authStore';

const AdminContributionsTab = () => {
    const [stats, setStats] = useState({
        totalAdmins: 12,
        totalQuestions: 442,
        evaluatedSubmissions: 2840,
        engagementScore: 94
    });

    const [topContributors, setTopContributors] = useState([
        { id: 1, name: 'Rahul Prakash', role: 'Head Admin', questions: 124, evaluations: 842, impact: 98 },
        { id: 2, name: 'Srijan Kumar', role: 'Content Lead', questions: 110, evaluations: 620, impact: 92 },
        { id: 3, name: 'Sneha Singh', role: 'Evaluator', questions: 42, evaluations: 942, impact: 95 },
        { id: 4, name: 'Aryan Roy', role: 'Junior Admin', questions: 56, evaluations: 434, impact: 88 }
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. CONTRIBUTION METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ContributionMetric label="Operational Admins" value={stats.totalAdmins} icon={Users} color="indigo" />
                <ContributionMetric label="Content Repository" value={stats.totalQuestions} icon={BookOpen} color="violet" />
                <ContributionMetric label="Manual Reviews" value={stats.evaluatedSubmissions} icon={CheckCircle2} color="emerald" />
                <ContributionMetric label="Impact Quotient" value={`${stats.engagementScore}%`} icon={Star} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. LEADERBOARD / LEAGUE OF ADMINS */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Administrative Performance</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Live Contribution Leaderboard</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-50 rounded-xl p-1 flex">
                                <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-100">Monthly</button>
                                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Overall</button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Intel (Questions)</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reviews (Evaluations)</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Power</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {topContributors.map((admin, idx) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                                                        {admin.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    {idx === 0 && (
                                                        <div className="absolute -top-2 -right-2 bg-amber-400 p-1 rounded-full border-2 border-white text-white">
                                                            <Award size={10} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-bold text-slate-900">{admin.name}</h5>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{admin.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-600 text-sm">{admin.questions}</td>
                                        <td className="px-8 py-5 font-bold text-slate-600 text-sm">{admin.evaluations}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-24">
                                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${admin.impact}%` }} />
                                                </div>
                                                <span className="text-[11px] font-black text-slate-900">{admin.impact}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. TRENDS / STATS */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                        <TrendingUp className="absolute -right-8 -bottom-8 opacity-10" size={160} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Velocity Report</h4>
                        <div className="space-y-6">
                            <ProgressTrend label="Question Intake" value={82} color="indigo" />
                            <ProgressTrend label="Evaluation Speed" value={94} color="emerald" />
                            <ProgressTrend label="Uptime Sync" value={100} color="violet" />
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
                        <Star className="text-indigo-400 mb-6" size={32} />
                        <h3 className="text-2xl font-black leading-tight mb-4">Elite Admin Network</h3>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80 mb-6">
                            Performance data indicates 94% administrative efficiency across the global cluster.
                        </p>
                        <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors">
                            Generate Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContributionMetric = ({ label, value, icon: Icon, color }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        violet: 'bg-violet-50 text-violet-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600'
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{label}</p>
                <h4 className="text-xl font-black text-slate-900">{value}</h4>
            </div>
        </div>
    );
};

const ProgressTrend = ({ label, value, color }) => {
    const barColors = {
        indigo: 'bg-indigo-400',
        emerald: 'bg-emerald-400',
        violet: 'bg-violet-400'
    };
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black text-white/60 uppercase tracking-widest">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColors[color]}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
};

export default AdminContributionsTab;
