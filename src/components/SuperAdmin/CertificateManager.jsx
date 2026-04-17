import React, { useState } from 'react';
import { 
    Award, Shield, Search, Filter, Download, 
    Trash2, Edit3, Plus, CheckCircle2, AlertTriangle,
    RefreshCw, FileText, ChevronLeft, ChevronRight,
    Star, Layout, Zap, ExternalLink, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificateManager = () => {
    const [certificates, setCertificates] = useState([
        { id: 'CERT-1024', studentName: 'Rahul Prakash', rollout: 'Spring 2024', course: 'Full Stack Development', date: '2024-05-01', status: 'Issued', hash: '8x2p...4m9z' },
        { id: 'CERT-1025', studentName: 'Srijan Kumar', rollout: 'Spring 2024', course: 'UI/UX Design Masterclass', date: '2024-05-02', status: 'Issued', hash: '3v7q...1n0x' },
        { id: 'CERT-1026', studentName: 'Sneha Singh', rollout: 'Spring 2024', course: 'Backend Engineering', date: '2024-05-03', status: 'Pending', hash: '5k9w...8j2y' },
        { id: 'CERT-1027', studentName: 'Aryan Roy', rollout: 'Winter 2023', course: 'Data structures & Algorithms', date: '2023-12-15', status: 'Issued', hash: '1m4b...2r5t' }
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* 1. CREDENTIAL STATUS HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <CredStat icon={Award} label="Total Issued" value={1242} color="indigo" />
                <CredStat icon={Shield} label="Verified Valid" value="100%" color="emerald" />
                <CredStat icon={RefreshCw} label="Pending Sync" value={14} color="amber" />
                <CredStat icon={Star} label="Distinction" value={42} color="violet" />
            </div>

            {/* 2. MANAGEMENT INTERFACE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/30">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Credential Registry</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Blockchain Verified Certificates</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by student name or ID..."
                                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                            <Plus size={16} /> ISSUE NEW
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Certification Details</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Hash</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {certificates.map(cert => (
                                <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                                                {cert.studentName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-black text-slate-900 leading-tight">{cert.studentName}</h5>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">ID: {cert.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-800 leading-tight">{cert.course}</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={10} className="text-slate-300" />
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cert.rollout}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-indigo-400" />
                                            <code className="bg-slate-50 px-2 py-1 rounded-md text-[10px] text-slate-400 font-mono font-bold">{cert.hash}</code>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${cert.status === 'Issued' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-amber-50 text-amber-600 border-amber-100/50'}`}>
                                            {cert.status === 'Issued' ? <CheckCircle2 size={12} /> : <RefreshCw size={12} className="animate-spin" />}
                                            {cert.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" title="View Digital Version">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" title="Print Hardcopy">
                                                <Printer size={16} />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between shrink-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 1-4 of 1,242 credentials</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-300 cursor-not-allowed transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-200 active:scale-95">1</button>
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 text-xs font-black hover:bg-slate-50 active:scale-95 transition-all">2</button>
                        <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm active:scale-95">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CredStat = ({ icon: Icon, label, value, color }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
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

export default CertificateManager;
