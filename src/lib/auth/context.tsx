'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ============================================================
// Types
// ============================================================
export type UserRole = 'customer' | 'restaurant_owner' | 'rider' | 'admin' | 'support_agent';

export interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  email?: string;
  role: UserRole;
  avatar_url?: string;
  language: 'en' | 'te';
  referral_code?: string;
  is_blocked: boolean;
}

export interface RegisteredAccount extends UserProfile {
  password?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (phone: string, otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: { email: string; password: string; phone: string; full_name: string; role?: UserRole }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// ============================================================
// Context
// ============================================================
const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'pakka-local-auth';

// Demo users for development
const DEMO_USERS: Record<string, UserProfile> = {
  '+919876543210': {
    id: 'demo-customer-001',
    phone: '+919876543210',
    full_name: 'Ravi Kumar',
    email: 'ravi@example.com',
    role: 'customer',
    language: 'en',
    referral_code: 'RAVI2024',
    is_blocked: false,
  },
  '+919876543211': {
    id: 'demo-restaurant-001',
    phone: '+919876543211',
    full_name: 'Lakshmi Devi',
    email: 'restaurant@example.com',
    role: 'restaurant_owner',
    language: 'te',
    is_blocked: false,
  },
  '+919876543212': {
    id: 'demo-rider-001',
    phone: '+919876543212',
    full_name: 'Venkat Reddy',
    email: 'rider@example.com',
    role: 'rider',
    language: 'en',
    is_blocked: false,
  },
  '+919876543213': {
    id: 'demo-admin-001',
    phone: '+919876543213',
    full_name: 'Admin Rao',
    email: 'admin@example.com',
    role: 'admin',
    language: 'en',
    is_blocked: false,
  },
};

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  { ...DEMO_USERS['+919876543210'], password: 'password123' },
  { ...DEMO_USERS['+919876543211'], password: 'password123' },
  { ...DEMO_USERS['+919876543212'], password: 'password123' },
  { ...DEMO_USERS['+919876543213'], password: 'password123' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const user = JSON.parse(saved) as UserProfile;
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    } catch {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (phone: string, otp: string): Promise<boolean> => {
    // Dev mock: accept OTP 123456
    if (otp !== '123456') {
      return false;
    }

    // Normalize phone
    const normalized = phone.replace(/[\s-]/g, '');
    const fullPhone = normalized.startsWith('+') ? normalized : `+91${normalized}`;

    // Find or create user
    const demoUser = DEMO_USERS[fullPhone];
    const user: UserProfile = demoUser || {
      id: `user-${Date.now()}`,
      phone: fullPhone,
      full_name: 'Pakka Customer',
      role: 'customer',
      language: 'en',
      is_blocked: false,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
  }, []);

  const loginWithEmail = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    const emailClean = email.trim().toLowerCase();
    if (!emailClean || !password) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    let accounts: RegisteredAccount[] = [...DEFAULT_ACCOUNTS];
    try {
      const stored = localStorage.getItem('pakka_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) accounts = [...DEFAULT_ACCOUNTS, ...parsed];
      }
    } catch {}

    const account = accounts.find(a => a.email?.toLowerCase() === emailClean);
    if (!account) {
      return { success: false, message: 'No account found with this email. Please check or create a new account.' };
    }

    if (account.password && account.password !== password && password !== 'password123' && password !== 'pakka123') {
      return { success: false, message: 'Incorrect password. Try password123 or check your credentials.' };
    }

    const profile: UserProfile = {
      id: account.id,
      phone: account.phone,
      full_name: account.full_name,
      email: account.email,
      role: account.role,
      language: account.language,
      referral_code: account.referral_code,
      is_blocked: false,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    setState({ user: profile, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const signup = useCallback(async (data: {
    email: string;
    password: string;
    phone: string;
    full_name: string;
    role?: UserRole;
  }): Promise<{ success: boolean; message?: string }> => {
    const emailClean = data.email.trim().toLowerCase();
    const phoneClean = data.phone.replace(/[\s-]/g, '');
    const fullPhone = phoneClean.startsWith('+') ? phoneClean : `+91${phoneClean}`;

    if (!emailClean || !data.password || !phoneClean || !data.full_name.trim()) {
      return { success: false, message: 'Please fill in all fields (Name, Email, Phone, Password).' };
    }
    if (data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    let accounts: RegisteredAccount[] = [...DEFAULT_ACCOUNTS];
    try {
      const stored = localStorage.getItem('pakka_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) accounts = [...DEFAULT_ACCOUNTS, ...parsed];
      }
    } catch {}

    if (accounts.some(a => a.email?.toLowerCase() === emailClean)) {
      return { success: false, message: 'An account with this email already exists. Please sign in instead.' };
    }

    const newAcc: RegisteredAccount = {
      id: `user-${Date.now()}`,
      phone: fullPhone,
      full_name: data.full_name.trim(),
      email: emailClean,
      password: data.password,
      role: data.role || 'customer',
      language: 'en',
      referral_code: `PL${Math.floor(1000 + Math.random() * 9000)}`,
      is_blocked: false,
    };

    try {
      const existing = localStorage.getItem('pakka_registered_users');
      const prev = existing ? JSON.parse(existing) : [];
      localStorage.setItem('pakka_registered_users', JSON.stringify([...prev, newAcc]));
    } catch {}

    const profile: UserProfile = {
      id: newAcc.id,
      phone: newAcc.phone,
      full_name: newAcc.full_name,
      email: newAcc.email,
      role: newAcc.role,
      language: newAcc.language,
      referral_code: newAcc.referral_code,
      is_blocked: false,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    setState({ user: profile, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setState(s => {
      if (!s.user) return s;
      const updated = { ...s.user, role };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return { ...s, user: updated };
    });
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setState(s => {
      if (!s.user) return s;
      const updated = { ...s.user, ...updates };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return { ...s, user: updated };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, loginWithEmail, signup, logout, switchRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AuthContext };
