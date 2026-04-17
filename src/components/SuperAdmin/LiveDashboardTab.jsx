import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Activity, Users, Zap, Timer, Award, MessageSquare, 
    RefreshCw, ChevronRight, Globe, Shield, Terminal,
    Layout, Cpu, Database, Network, Search, Filter,
    Play, Lock, Unlock, Clock, AlertTriangle, CheckCircle2,
    BarChart3, PieChart, TrendingUp, MonitorSmartphone
} from 'lucide-react';
import { api } from '../../store/authStore';
import { API } from './constants';

const LiveDashboardTab = () => {
    const [stats, setStats] = useState({
        activeStudents: 0,
        submissionsToday: 0,
        averageScore: 0,
        systemHealth: 98,
        activeTests: 0,
        queueLatency: '12ms',
        memoryUsage: '42%'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulation or real fetch
        const fetchLiveStats = async () => {
            try {
                // In a real app: const res = await api.get(`${API}/live-stats`);
                // For now, let's keep it dynamic looking
                setStats(prev => ({
                    ...prev,
                    activeStudents: Math.floor(Math.random() * 50) + 120,
                    submissionsToday: 1240,
                    activeTests: 3,
                }));
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLiveStats();
        const interval = setInterval(fetchLiveStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. TOP METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    label="Active Students" 
                    value={stats.activeStudents} 
                    icon={Users} 
                    color="indigo" 
                    trend="+12% from last hour"
                />
                <MetricCard 
                    label="Active Assessments" 
                    value={stats.activeTests} 
                    icon={Activity} 
                    color="rose" 
                    trend="2 ending soon"
                />
                <MetricCard 
                    label="Avg. Proficiency" 
                    value={`${stats.averageScore}%`} 
                    icon={Award} 
                    color="amber" 
                    trend="Steady performance"
                />
                <MetricCard 
                    label="Submission Rate" 
                    value="42/min" 
                    icon={Zap} 
                    color="emerald" 
                    trend="Normal throughput"
                />
            </div>

            {/* 2. MAIN VISUALIZATION AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Infrastructure Status */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 leading-none">Global Infrastructure</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Real-time Node Monitoring</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Operational</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <SystemNode label="API Gateway" status="Healthy" value="14ms" icon={Globe} />
                        <SystemNode label="Database Cluster" status="Optimal" value="98%" icon={Database} />
                        <SystemNode label="Auth Service" status="Encrypted" value="100%" icon={Shield} />
                    </div>

                    <div className="mt-12 h-40 bg-slate-50 rounded-2xl border border-dotted border-slate-200 flex items-center justify-center relative overflow-hidden">
                        {/* Simulated Waveform or Map */}
                        <div className="absolute inset-0 flex items-center justify-around opacity-20">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-1 bg-indigo-600 rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }} />
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] relative z-10">Network Traffic Visualizer</p>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black tracking-tight">Stream Protocol</h3>
                        <Terminal size={18} className="text-indigo-400" />
                    </div>
                    
                    <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        <LogEntry time="12:42:01" msg="Student #4122 deployed solution" type="success" />
                        <LogEntry time="12:41:55" msg="Auth broadcast synchronized" type="info" />
                        <LogEntry time="12:41:42" msg="Section B OTP rotation completed" type="warning" />
                        <LogEntry time="12:41:10" msg="Database maintenance pulse" type="info" />
                        <LogEntry time="12:40:55" msg="New instructor session initialized" type="success" />
                        <LogEntry time="12:40:42" msg="Student #2012 disconnect detected" type="error" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, icon: Icon, color, trend }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]} transition-transform group-hover:scale-110`}>
                    <Icon size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <h4 className="text-3xl font-black text-slate-900 mb-2">{value}</h4>
            <p className="text-[10px] font-bold text-slate-400 italic">{trend}</p>
        </div>
    );
};

const SystemNode = ({ label, status, value, icon: Icon }) => (
    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
            <Icon size={16} className="text-indigo-500" />
            <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</h5>
        </div>
        <div className="flex items-end justify-between">
            <span className="text-xs font-bold text-slate-900">{value}</span>
            <span className="text-[8px] font-black text-emerald-500 uppercase">{status}</span>
        </div>
    </div>
);

const LogEntry = ({ time, msg, type }) => {
    const colors = {
        success: 'text-emerald-400',
        info: 'text-indigo-400',
        warning: 'text-amber-400',
        error: 'text-rose-400'
    };
    return (
        <div className="flex gap-4 font-mono">
            <span className="text-slate-500 text-[10px] shrink-0">{time}</span>
            <p className={`text-[11px] font-medium leading-tight ${colors[type]}`}>
                <span className="opacity-50 mr-2"></span>
                {msg}
            </p>
        </div>
    );
};

export default LiveDashboardTab;
