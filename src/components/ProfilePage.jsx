import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, FileText, Calendar, Building, Users, Home, Loader2, Save, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DEPARTMENTS } from '../config/constants';

const ProfilePage = () => {
    const { user, fetchProfile, updateProfile } = useAuthStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        dob: '',
        department: '',
        gender: '',
        accommodation: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
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
    }, [fetchProfile]);

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
            toast.success('Profile updated successfully!');
        } else {
            toast.error(res.error || 'Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-violet-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-violet-600 font-bold text-sm uppercase tracking-widest mb-8 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="mb-10 border-b border-slate-100 pb-8 flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="w-24 h-24 bg-linear-to-tr from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-violet-500/20 text-white font-black text-4xl uppercase tracking-tighter shrink-0">
                            {formData.name ? formData.name.charAt(0) : '?'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage your personal information</p>
                            <p className="text-sm font-bold text-violet-600 mt-2 bg-violet-50 inline-block px-3 py-1 rounded-full">{user?.studentId}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all" required />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all" required />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all" required />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all" required />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Department</label>
                                <div className="relative">
                                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Select Department</option>
                                        {DEPARTMENTS.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Gender</label>
                                <div className="relative">
                                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all appearance-none" required>
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                            <div className="relative group sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Accommodation</label>
                                <div className="relative">
                                    <Home className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                    <select name="accommodation" value={formData.accommodation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all appearance-none" required>
                                        <option value="" disabled>Select Accommodation</option>
                                        <option value="Hostel">Hostel</option>
                                        <option value="Dayscholar">Dayscholar</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="relative group pt-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Short Bio</label>
                            <div className="relative">
                                <FileText className="absolute left-5 top-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all resize-none" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button type="submit" disabled={saving} className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl py-3 px-8 font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-violet-600/20 active:scale-95 flex items-center gap-3">
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
