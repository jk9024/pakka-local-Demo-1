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

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// ============================================================
// Context
// ============================================================
const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'mana-ruchulu-auth';

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
    role: 'restaurant_owner',
    language: 'te',
    is_blocked: false,
  },
  '+919876543212': {
    id: 'demo-rider-001',
    phone: '+919876543212',
    full_name: 'Venkat Reddy',
    role: 'rider',
    language: 'en',
    is_blocked: false,
  },
  '+919876543213': {
    id: 'demo-admin-001',
    phone: '+919876543213',
    full_name: 'Admin Rao',
    role: 'admin',
    language: 'en',
    is_blocked: false,
  },
};

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
      full_name: '',
      role: 'customer',
      language: 'en',
      is_blocked: false,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
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
    <AuthContext.Provider value={{ ...state, login, logout, switchRole, updateProfile }}>
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
