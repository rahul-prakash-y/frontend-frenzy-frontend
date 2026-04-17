import React, { useState, useEffect, useCallback } from 'react';
import { 
    Database, Search, Filter, Trash2, Edit3, 
    Plus, Download, Upload, RefreshCw, ChevronLeft, 
    ChevronRight, MoreVertical, AlertCircle, CheckCircle2,
    HardDrive, List, LayoutGrid, FileText
} from 'lucide-react';
import { api } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const COLLECTIONS = [
    { id: 'students', label: 'Students', icon: 'Users', description: 'Registered student profiles and data' },
    { id: 'questions', label: 'Questions', icon: 'BookOpen', description: 'Assessment question library' },
    { id: 'submissions', label: 'Submissions', icon: 'FileText', description: 'Student assessment responses' },
    { id: 'rounds', label: 'Rounds', icon: 'Zap', description: 'Assessment sessions and metadata' },
    { id: 'attendance', label: 'Attendance', icon: 'Clock', description: 'Student attendance records' },
    { id: 'admins', label: 'Admins', icon: 'Shield', description: 'Administrative user accounts' }
];

const DatabaseManagerTab = () => {
    const [selectedCollection, setSelectedCollection] = useState('students');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalDocuments: 12420,
        storageUsed: '4.2 GB',
        lastBackup: '2h ago',
        indexCount: 42
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Real implementation would fetch based on selectedCollection
            // const res = await api.get(`/admin/db/${selectedCollection}`);
            // setData(res.data.data);
            
            // Simulation
            setTimeout(() => {
                setData(Array(10).fill({
                    _id: '507f1f77bcf86cd799439011',
                    name: 'Sample Entity',
                    createdAt: new Date().toISOString(),
                    status: 'Active',
                    details: 'Encrypted document fragment...'
                }));
                setLoading(false);
            }, 800);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [selectedCollection]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* 1. TOP STATS PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DBStat icon={Database} label="Total Records" value={stats.totalDocuments} color="indigo" />
                <DBStat icon={HardDrive} label="Storage Used" value={stats.storageUsed} color="amber" />
                <DBStat icon={RefreshCw} label="Last Backup" value={stats.lastBackup} color="emerald" />
                <DBStat icon={List} label="Active Indices" value={stats.indexCount} color="violet" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* 2. COLLECTION SELECTOR */}
                <aside className="w-full lg:w-72 shrink-0 space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Collections</h3>
                    {COLLECTIONS.map(col => (
                        <button
                            key={col.id}
                            onClick={() => setSelectedCollection(col.id)}
                            className={`w-full group flex items-center gap-4 p-4 rounded-2xl border transition-all text-left
                                ${selectedCollection === col.id 
                                    ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-50' 
                                    : 'bg-transparent border-transparent hover:bg-slate-50 opacity-60 hover:opacity-100'}`}
                        >
                            <div className={`p-2.5 rounded-xl transition-colors
                                ${selectedCollection === col.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                <Database size={16} />
                            </div>
                            <div>
                                <h4 className={`text-xs font-black uppercase tracking-widest ${selectedCollection === col.id ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {col.label}
                                </h4>
                                <p className="text-[9px] text-slate-400 font-bold mt-1 line-clamp-1">{col.description}</p>
                            </div>
                        </button>
                    ))}
                </aside>

                {/* 3. DATA BROWSER */}
                <div className="flex-1 w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/30">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-md group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder={`Search in ${selectedCollection}...`}
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all placeholder:text-slate-300"
                                />
                            </div>
                            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 transition-colors shadow-sm">
                                <Filter size={18} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                                <Plus size={16} />
                                <span className="hidden sm:inline">Add Entry</span>
                            </button>
                            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/60">Entity Metadata</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/60">Raw Data Identifier</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/60">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/60">Created At</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/60 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <RefreshCw className="text-indigo-600 animate-spin" size={32} />
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Hydrating data from cluster...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length > 0 ? (
                                    data.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-800">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <code className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-[10px] text-slate-500 font-mono font-bold tracking-tight">
                                                    {item._id}
                                                </code>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 size={12} />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-[11px] font-bold text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                <p className="text-[9px] text-slate-400">{new Date(item.createdAt).toLocaleTimeString()}</p>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">No documents found in this collection.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between shrink-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 1-10 of 1,242 records</p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-300 cursor-not-allowed">
                                <ChevronLeft size={20} />
                            </button>
                            {[1, 2, 3].map(i => (
                                <button key={i} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${i === 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                    {i}
                                </button>
                            ))}
                            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors shadow-sm">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DBStat = ({ icon: Icon, label, value, color }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        violet: 'bg-violet-50 text-violet-600'
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition-colors">
            <div className={`p-4 rounded-2xl ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h4 className="text-xl font-black text-slate-900 leading-none">{value}</h4>
            </div>
        </div>
    );
};

export default DatabaseManagerTab;
