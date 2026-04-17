import React, { useState } from 'react';
import { 
    Briefcase, Clock, CheckCircle2, AlertCircle, 
    Calendar, MapPin, Users, Star, ArrowRight,
    Search, Filter, LayoutGrid, List, FileText,
    Zap, Target, Shield, BookOpen
} from 'lucide-react';

const MyAdminAssignmentsTab = () => {
    const [assignments, setAssignments] = useState([
        { 
            id: 'REF-1024', 
            name: 'Mid-term Data Evaluation', 
            type: 'Manual Review', 
            priority: 'High', 
            deadline: '2024-05-15', 
            status: 'In Progress',
            count: 42,
            target: 'Engineering Batch A'
        },
        { 
            id: 'REF-2048', 
            name: 'Round 2 Logic Question Pool', 
            status: 'Completed',
            type: 'Content Generation', 
            priority: 'Urgent', 
            deadline: '2024-05-10', 
            count: 15,
            target: 'Coding Assessment'
        },
        { 
            id: 'REF-4096', 
            name: 'Attendance Audit Phase 1', 
            status: 'Pending',
            type: 'System Audit', 
            priority: 'Medium', 
            deadline: '2024-05-20', 
            count: 120,
            target: 'All Departments'
        }
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. ASSIGNMENT OVERVIEW HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Command Protocol</h2>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Assigned Directives</h3>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group max-w-xs">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search directives..."
                            className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                        <Zap size={14} /> NEW TASK
                    </button>
                </div>
            </div>

            {/* 2. STATS BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DirectiveStat label="Active Missions" value={2} icon={Target} color="indigo" />
                <DirectiveStat label="Completed Repreive" value={14} icon={CheckCircle2} color="emerald" />
                <DirectiveStat label="Critical Priority" value={1} icon={AlertCircle} color="rose" />
            </div>

            {/* 3. ASSIGNMENT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map(task => (
                    <motion.div 
                        key={task.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group hover:border-indigo-200 transition-all p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {task.type === 'Manual Review' ? <Shield size={20} /> : 
                                 task.type === 'Content Generation' ? <BookOpen size={20} /> : 
                                 <Briefcase size={20} />}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                task.priority === 'Urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                task.priority === 'High' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-slate-50 text-slate-500 border-slate-100'
                            }`}>
                                {task.priority}
                            </span>
                        </div>

                        <div className="flex-1">
                            <h4 className="text-base font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{task.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">ID: {task.id}</p>
                            
                            <div className="space-y-4 mb-8">
                                <AssignmentDetail icon={Target} label="Operation Target" value={task.target} />
                                <AssignmentDetail icon={Clock} label="Protocol Deadline" value={task.deadline} />
                                <AssignmentDetail icon={Users} label="Entity Count" value={task.count} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                    task.status === 'Completed' ? 'bg-emerald-500' :
                                    task.status === 'In Progress' ? 'bg-indigo-500' :
                                    'bg-slate-300'
                                }`} />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.status}</span>
                            </div>
                            <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const DirectiveStat = ({ icon: Icon, label, value, color }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        rose: 'bg-rose-50 text-rose-600'
    };
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h4 className="text-2xl font-black text-slate-900 leading-none">{value}</h4>
            </div>
        </div>
    );
};

const AssignmentDetail = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <Icon size={14} className="text-slate-300" />
        <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-[11px] font-black text-slate-700 leading-none">{value}</p>
        </div>
    </div>
);

export default MyAdminAssignmentsTab;
