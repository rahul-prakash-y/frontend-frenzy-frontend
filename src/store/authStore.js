import { create } from 'zustand';
import axios from 'axios';
import { getBaseUrl, clearStickySession } from '../config/apiConfig';

// ─── Axios instance ─────────────────────────────────────────────────────────────
// NOTE: baseURL is intentionally left empty here.
// The load-balancing request interceptor below sets it dynamically on every
// request so that each student is always routed to their sticky backend.
export const api = axios.create();

// ─── Request interceptor ────────────────────────────────────────────────────────
// Two responsibilities:
//   1. Set the baseURL to the student's sticky backend on EVERY request.
//   2. Inject the Bearer token if the user is authenticated.
api.interceptors.request.use((config) => {
    // Load-balance: resolve the sticky backend at call-time, not module-load-time.
    // This means we never bake a stale URL into the axios instance.
    config.baseURL = getBaseUrl();

    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    loading: true,

    // Initialization: pull directly from LocalStorage on refresh
    initialize: () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                set({ user: JSON.parse(storedUser), token, loading: false });
                return;
            } catch (error) {
                console.error("Failed to parse stored user data:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        set({ user: null, token: null, loading: false });
    },

    login: (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, token });
    },

    updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
    },

    onboard: async (name, email, linkedinProfile, githubProfile, phone, bio, dob, password) => {
        try {
            const res = await api.post('/auth/onboard', { name, email, linkedinProfile, githubProfile, phone, bio, dob, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Onboarding failed' };
        }
    },

    logout: async () => {
        const { token } = get();
        if (token) {
            try {
                // Ping backend to trace organic logout
                await api.post('/auth/logout');
            } catch (err) {
                console.error('Logout request failed:', err);
            }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear sticky session so the next login gets a fresh random assignment.
        // This prevents a dead backend from haunting a student across events.
        clearStickySession();
        set({ user: null, token: null });
    }
}));
