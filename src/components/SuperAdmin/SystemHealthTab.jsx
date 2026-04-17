import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, Shield, Database, Cpu, HardDrive, 
    Network, Server, AlertTriangle, CheckCircle2,
    RefreshCw, Gauge, Zap, Globe
} from 'lucide-react';
import { api } from '../../store/authStore';

const SystemHealthTab = () => {
    const [health, setHealth] = useState({
        cpu: 42,
        memory: 68,
        uptime: '12d 4h 22m',
        latency: '18ms',
        dbStatus: 'Connected',
        apiStatus: 'Operational',
        storage: 24,
        requestsPerSec: 142
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. OVERALL STATUS HEADER */}
            <div className="bg-linear-to-r from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Shield size={200} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center border border-emerald-500/30">
                            <Activity className="text-emerald-400 animate-pulse" size={40} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">System Integrity: 99.9%</h2>
                            <p className="text-indigo-300 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">All instances operating within optimal parameters</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <HealthBadge label="Uptime" value={health.uptime} color="indigo" />
                        <HealthBadge label="API Cluster" value="Healthy" color="emerald" />
                    </div>
                </div>
            </div>

            {/* 2. LIVE GAUGE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <GaugeCard label="CPU Utilization" value={health.cpu} icon={Cpu} color="indigo" />
                <GaugeCard label="Memory Allocation" value={health.memory} icon={Database} color="violet" />
                <GaugeCard label="Storage Capacity" value={health.storage} icon={HardDrive} color="amber" />
                <GaugeCard label="Network Load" value="Normal" icon={Network} color="emerald" extra="14.2 GB/s" />
            </div>

            {/* 3. DETAILED INFRASTRUCTURE STATUS */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Instance Synchronization</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Active Node Cluster Health</p>
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                        <RefreshCw size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <InstanceRow name="US-EAST-01 (Primary)" status="Active" ping="8ms" icon={Globe} />
                    <InstanceRow name="EU-WEST-01 (Replica)" status="Standby" ping="42ms" icon={Globe} />
                    <InstanceRow name="AS-SOUTH-01 (Edge)" status="Active" ping="128ms" icon={Globe} />
                    <InstanceRow name="DB-CLUSTER-01 (Master)" status="Active" ping="2ms" icon={Server} />
                </div>
            </div>
        </div>
    );
};

const HealthBadge = ({ label, value, color }) => {
    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
    return (
        <div className={`px-5 py-3 rounded-2xl border ${colors[color]} text-center min-w-[120px]`}>
            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
            <p className="text-sm font-black">{value}</p>
        </div>
    );
};

const GaugeCard = ({ label, value, icon: Icon, color, extra }) => {
    const colors = {
        indigo: 'text-indigo-600 bg-indigo-50',
        violet: 'text-violet-600 bg-violet-50',
        amber: 'text-amber-600 bg-amber-50',
        emerald: 'text-emerald-600 bg-emerald-50'
    };
    
    return (
        <div className="bg-white p-8 rounded-4xl border border-slate-50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-3xl ${colors[color]}`}>
                    <Icon size={24} />
                </div>
                {typeof value === 'number' && (
                    <span className="text-2xl font-black text-slate-900">{value}%</span>
                )}
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</h4>
            {typeof value === 'number' ? (
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className={`h-full rounded-full ${color === 'amber' && value > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
                    />
                </div>
            ) : (
                <p className="text-lg font-black text-slate-900">{value} <span className="text-[10px] text-slate-400 ml-2">{extra}</span></p>
            )}
        </div>
    );
};

const InstanceRow = ({ name, status, ping, icon: Icon }) => (
    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-slate-100 transition-colors group">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                <Icon size={20} />
            </div>
            <div>
                <h5 className="text-sm font-bold text-slate-800">{name}</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status: Operating</p>
            </div>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Latency</p>
                <p className="text-xs font-mono font-bold text-slate-700">{ping}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                {status}
            </div>
        </div>
    </div>
);

export default SystemHealthTab;
