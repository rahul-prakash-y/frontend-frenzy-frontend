import React, { useState } from 'react';
import { 
    Server, Cpu, Database, Network, HardDrive, 
    Zap, Activity, Globe, Shield, RefreshCw,
    Plus, Search, Filter, MoreVertical, Terminal,
    ShieldCheck, AlertTriangle, CheckCircle2, Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';

const ServerAllocationTab = () => {
    const [servers, setServers] = useState([
        { id: 'NODE-01', name: 'Assessment-Primary-01', status: 'Optimal', type: 'Compute', health: 98, load: 42, ram: '14/32 GB', location: 'Local Cluster' },
        { id: 'NODE-02', name: 'Database-Master', status: 'Optimal', type: 'Storage', health: 100, load: 28, ram: '64/128 GB', location: 'Internal Subnet' },
        { id: 'NODE-03', name: 'Asset-Delivery-CDN', status: 'Warning', type: 'Edge', health: 84, load: 76, ram: '8/16 GB', location: 'Global Endpoint' },
        { id: 'NODE-04', name: 'Legacy-Proxy-Vault', status: 'Legacy', type: 'Security', health: 100, load: 5, ram: '4/8 GB', location: 'DMZ Layer 4' }
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. CLUSTER OVERVIEW HEADER */}
            <div className="bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <Cloud className="absolute -right-10 -bottom-10 opacity-10" size={240} />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center">
                                <Server size={36} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">Active Node Cluster</h2>
                                <p className="text-indigo-200 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Distributed computing architecture status</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4">
                                <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200 mb-1">Total Bandwidth</p>
                                <p className="text-xl font-black">1.4 GB/s</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4">
                                <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200 mb-1">Compute Power</p>
                                <p className="text-xl font-black">42.8 TFLOPS</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <NodeStat label="Active Nodes" value={servers.length} />
                        <NodeStat label="Active Requests" value="12,420" />
                        <NodeStat label="System Uptime" value="142:22:04" />
                        <NodeStat label="Health Average" value="94.2%" />
                    </div>
                </div>
            </div>

            {/* 2. NODE MANAGEMENT LIST */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Locate specific node protocol..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all"
                            />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                            <Filter size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                        <Plus size={16} /> ALLOCATE NODE
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instance Node</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type & Location</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilization</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Memory Sync</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {servers.map(server => (
                                <tr key={server.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                                                    ${server.status === 'Optimal' ? 'bg-emerald-50 text-emerald-600' : 
                                                      server.status === 'Warning' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Cpu size={20} />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                                                    ${server.status === 'Optimal' ? 'bg-emerald-500' : 
                                                      server.status === 'Warning' ? 'bg-rose-500' : 'bg-slate-400'}`} />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-black text-slate-900 leading-tight">{server.name}</h5>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">ID: {server.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest">
                                                <Terminal size={10} />
                                                {server.type}
                                            </span>
                                            <p className="text-[10px] text-slate-400 font-medium ml-1">{server.location}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5 w-32">
                                            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                                <span>Workload</span>
                                                <span>{server.load}%</span>
                                            </div>
                                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-1000 ${server.load > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${server.load}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <HardDrive size={14} className="opacity-40" />
                                            <span className="text-xs font-mono font-bold">{server.ram}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                                <RefreshCw size={16} />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const NodeStat = ({ label, value }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/5">
        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-100 opacity-60 mb-2">{label}</p>
        <p className="text-2xl font-black">{value}</p>
    </div>
);

export default ServerAllocationTab;
