import React, { useState, useEffect } from 'react';
import { 
    X, Save, BookOpen, Code, Image as ImageIcon, Plus, 
    Trash2, HelpCircle, FileText, Layout, Zap, Award,
    CheckCircle2, AlertCircle, RefreshCw, ChevronRight,
    Monitor, Database, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionModal = ({ isOpen, onClose, question, onSave, mode = 'create' }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'GENERAL',
        difficulty: 'EASY',
        points: 10,
        options: ['', '', '', ''],
        correctAnswer: '',
        constraints: '',
        testCases: []
    });

    useEffect(() => {
        if (question) {
            setFormData({
                ...formData,
                ...question,
                options: question.options || ['', '', '', '']
            });
        }
    }, [question]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-auto"
            >
                {/* 1. MODAL HEADER */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                {mode === 'create' ? 'Intel Prototype Generation' : 'Directive Modification'}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                                Assessment Question Protocol
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-90 shadow-sm">
                        <X size={24} />
                    </button>
                </div>

                {/* 2. MODAL CONTENT - SCROLLABLE */}
                <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* LEFT COLUMN: CORE INFO */}
                        <div className="lg:col-span-2 space-y-10">
                            <section className="space-y-6">
                                <SectionHeader label="Strategic Blueprint" icon={FileText} />
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Question Title</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Memory Optimization Protocol"
                                            className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Mission Context (Question Description)</label>
                                        <textarea 
                                            rows={6}
                                            placeholder="Describe the technical challenge or objective..."
                                            className="w-full bg-slate-50 border border-slate-200/60 rounded-3xl py-4 px-6 font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <SectionHeader label="Response Parameters" icon={Terminal} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(idx => (
                                        <div key={idx} className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all shadow-sm">
                                                {idx}
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder={`Protocol Option 0${idx}`}
                                                className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: CONFIGURATION */}
                        <div className="space-y-10">
                            <section className="space-y-6">
                                <SectionHeader label="Tactical Settings" icon={Zap} />
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Complexity Level</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['EASY', 'MEDIUM', 'HARD', 'EXPERT'].map(lvl => (
                                                <button key={lvl} className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${lvl === 'EASY' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'}`}>
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Reward Yield (Points)</label>
                                        <div className="relative group">
                                            <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
                                            <input type="number" className="w-full bg-white border border-slate-200/60 rounded-xl py-3 pl-12 pr-4 font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" defaultValue={10} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Deployment Type</label>
                                        <select className="w-full bg-white border border-slate-200/60 rounded-xl py-3 px-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm appearance-none cursor-pointer">
                                            <option>General Combined</option>
                                            <option>Logic & Reasoning</option>
                                            <option>System Design</option>
                                            <option>Data Engineering</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="p-8 bg-linear-to-br from-slate-900 to-indigo-950 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                                <Zap className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform duration-700" size={120} />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Quality Protocol</h4>
                                <p className="text-xs font-medium leading-relaxed opacity-70">
                                    Ensure questions are clear, concise, and provide enough context for accurate evaluation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MODAL FOOTER */}
                <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/20">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Shield className="text-indigo-400" size={14} />
                        Changes are staged in encrypted buffer
                    </p>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button onClick={onClose} className="flex-1 sm:flex-none py-4 px-10 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                            DISCARD
                        </button>
                        <button className="flex-2 sm:flex-none py-4 px-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3">
                            <Save size={16} />
                            SYNCHRONIZE TO CLUSTER
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const SectionHeader = ({ label, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Icon size={16} />
        </div>
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{label}</h4>
        <div className="flex-1 h-px bg-slate-100 ml-2" />
    </div>
);

export default QuestionModal;
