import React, { useState, useEffect } from 'react';
import { 
    X, User, Mail, Phone, Calendar, Building, 
    Save, Loader2, ShieldCheck, Sparkles, MapPin, 
    Code, Users, Home, FileText, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { DEPARTMENTS } from '../config/constants';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, fetchProfile, updateProfile } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', bio: '', dob: '', 
        department: '', gender: '', accommodation: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const loadProfile = async () => {
                const res = await fetchProfile();
                if (res.success && res.profile) {
                    const profile = res.profile;
                    setFormData({
                        name: profile.name || '',
                        email: profile.email || '',
                        phone: profile.phone || '',
                        bio: profile.bio || '',
                        dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
                        department: profile.department || '',
                        gender: profile.gender || '',
                        accommodation: profile.accommodation || ''
                    });
                }
                setLoading(false);
            };
            loadProfile();
        }
    }, [isOpen, fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await updateProfile(formData);
        setSaving(false);
        if (res.success) {
            toast.success('Profile Synchronized!');
            onClose();
        } else {
            toast.error(res.error || 'Sync Failed');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden my-auto"
            >
                {/* MODAL HEADER */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Identity Configuration</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Personnel Record Modification</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-6">
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Secure Vault...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* IDENTITY PREVIEW */}
                            <div className="space-y-8">
                                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100/50 text-center flex flex-col items-center">
                                    <div className="relative group mb-6">
                                        <div className="w-32 h-32 bg-linear-to-tr from-indigo-600 to-violet-600 rounded-4xl flex items-center justify-center text-white font-black text-5xl shadow-xl">
                                            {formData.name.charAt(0) || 'U'}
                                        </div>
                                        <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-lg transition-all active:scale-90">
                                            <Camera size={18} />
                                        </button>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate w-full">{formData.name || 'Protocol User'}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase italic mb-6">Level 0 Personnel</p>
                                    
                                    <div className="w-full space-y-3">
                                        <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID Hash</span>
                                            <span className="text-[10px] font-mono font-bold text-slate-800">{user?.studentId}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                                    <ShieldCheck className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform duration-700" size={120} />
                                    <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Encryption Status</h5>
                                    <p className="text-sm font-medium leading-relaxed opacity-80">Identity parameters are sealed within hardware-level encrypted sectors.</p>
                                </div>
                            </div>

                            {/* CONFIGURATION FIELDS */}
                            <div className="lg:col-span-2 space-y-10">
                                <section className="space-y-6">
                                    <SectionHeader label="Core Identity" icon={User} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Operational Name" name="name" icon={User} value={formData.name} onChange={handleChange} />
                                        <InputField label="Deployment Date (DOB)" name="dob" icon={Calendar} value={formData.dob} onChange={handleChange} type="date" />
                                        <SelectField label="Biological Gender" name="gender" icon={Users} value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other", "Prefer not to say"]} />
                                        <SelectField label="Residential Sector" name="accommodation" icon={Home} value={formData.accommodation} onChange={handleChange} options={["Hostel", "Dayscholar"]} />
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <SectionHeader label="Professional Vector" icon={Building} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SelectField label="Department Branch" name="department" icon={Building} value={formData.department} onChange={handleChange} options={DEPARTMENTS} />
                                        <InputField label="Mobile Frequency" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} type="tel" />
                                    </div>
                                    <div className="relative group">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Personnel Bio</label>
                                        <FileText className="absolute left-4 top-10 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <textarea 
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all resize-none"
                                            placeholder="Update tactical background..."
                                        />
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                <Sparkles size={14} className="text-amber-400" />
                                Global Synchronization Protocol Active
                            </p>
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={onClose} className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm">DISCARD</button>
                                <button type="submit" disabled={saving} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3">
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    {saving ? 'SYNCHING...' : 'UPLOADING DATA'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

const SectionHeader = ({ label, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Icon size={16} />
        </div>
        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{label}</h4>
        <div className="flex-1 h-px bg-slate-100 ml-2" />
    </div>
);

const InputField = ({ label, name, icon: Icon, value, onChange, type = "text" }) => (
    <div className="space-y-2 group">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
                type={type} name={name} value={value} onChange={onChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all"
                required
            />
        </div>
    </div>
);

const SelectField = ({ label, name, icon: Icon, value, onChange, options }) => (
    <div className="space-y-2 group">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <select 
                name={name} value={value} onChange={onChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all appearance-none cursor-pointer"
            >
                <option value="">Select {label}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    </div>
);

export default ProfileModal;
