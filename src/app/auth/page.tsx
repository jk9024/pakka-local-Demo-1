'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, type UserRole } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { login, loginWithEmail, signup, isAuthenticated, user, switchRole } = useAuth();
  const { locale, setLocale } = useTranslation();
  const router = useRouter();

  // Mode: 'signin' | 'signup' | 'otp'
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'otp'>('signin');

  // Sign In with Email
  const [email, setEmail] = useState('ravi@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up / New Account
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpRole, setSignUpRole] = useState<UserRole>('customer');

  // Phone OTP Flow
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'restaurant_owner': router.replace('/restaurant'); break;
        case 'rider': router.replace('/rider'); break;
        case 'admin': case 'support_agent': router.replace('/admin'); break;
        default: router.replace('/app');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle New Account Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      const res = await signup({
        full_name: signUpName,
        email: signUpEmail,
        phone: signUpPhone,
        password: signUpPassword,
        role: signUpRole,
      });
      if (!res.success) {
        setError(res.message || 'Registration failed.');
      } else {
        setSuccessMsg(locale === 'te' ? 'ఖాతా విజయవంతంగా సృష్టించబడింది!' : 'Account created successfully! Redirecting...');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Phone OTP
  const handleSendOtp = () => {
    const cleaned = phone.replace(/[\s-]/g, '');
    if (cleaned.length < 10) {
      setError(locale === 'te' ? 'దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి' : 'Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setStep('otp');
    setResendTimer(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError(locale === 'te' ? 'దయచేసి పూర్తి 6 అంకెల OTP ని నమోదు చేయండి' : 'Please enter the complete 6-digit OTP');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/[\s-]/g, '')}`;
      const success = await login(formattedPhone, code);
      if (!success) {
        setError(locale === 'te' ? 'చెల్లని OTP. దయచేసి మళ్లీ ప్రయత్నించండి (డెమో OTP: 123456)' : 'Invalid OTP. Try 123456');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickDemoLogin = (role: UserRole) => {
    const demoAccounts: Record<UserRole, { email: string; pass: string }> = {
      customer: { email: 'ravi@example.com', pass: 'password123' },
      restaurant_owner: { email: 'restaurant@example.com', pass: 'password123' },
      rider: { email: 'rider@example.com', pass: 'password123' },
      admin: { email: 'admin@example.com', pass: 'password123' },
      support_agent: { email: 'admin@example.com', pass: 'password123' },
    };

    const target = demoAccounts[role];
    loginWithEmail(target.email, target.pass).then(() => {
      switchRole(role);
      if (role === 'restaurant_owner') router.push('/restaurant');
      else if (role === 'rider') router.push('/rider');
      else if (role === 'admin' || role === 'support_agent') router.push('/admin');
      else router.push('/app');
    });
  };

  return (
    <div className="app-shell" style={{ background: '#ffffff', minHeight: '100dvh' }}>
      {/* Top Banner with Food Montage Background */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 200,
        overflow: 'hidden',
        background: '#0f172a',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
          alt="Pakka Local Food"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px',
        }}>
          {/* Top Language Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setLocale(locale === 'en' ? 'te' : 'en')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {locale === 'en' ? '🇮🇳 తెలుగు' : '🇬🇧 English'}
            </button>
          </div>

          {/* Brand Name on Image */}
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {locale === 'te' ? 'పక్కా లోకల్' : 'Pakka Local'}
            </h1>
            <p style={{
              fontSize: '0.8rem',
              color: '#fdba74',
              fontWeight: 700,
              margin: '2px 0 0',
            }}>
              {locale === 'te' ? 'పక్కా లోకల్. పక్కా టేస్టీ.' : 'Pakka local. Pakka tasty.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ padding: '20px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Authentication Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
            gap: 4,
          }}>
            <button
              type="button"
              onClick={() => { setAuthTab('signin'); setError(''); }}
              style={{
                flex: 1,
                padding: '9px 10px',
                borderRadius: 9,
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                background: authTab === 'signin' ? '#ffffff' : 'transparent',
                color: authTab === 'signin' ? '#f97316' : '#64748b',
                boxShadow: authTab === 'signin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {locale === 'te' ? 'ఈమెయిల్ లాగిన్' : 'Email Sign In'}
            </button>

            <button
              type="button"
              onClick={() => { setAuthTab('signup'); setError(''); }}
              style={{
                flex: 1.1,
                padding: '9px 10px',
                borderRadius: 9,
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                background: authTab === 'signup' ? '#ffffff' : 'transparent',
                color: authTab === 'signup' ? '#f97316' : '#64748b',
                boxShadow: authTab === 'signup' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {locale === 'te' ? 'కొత్త ఖాతా (సైన్ అప్)' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={() => { setAuthTab('otp'); setError(''); }}
              style={{
                flex: 0.9,
                padding: '9px 10px',
                borderRadius: 9,
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                background: authTab === 'otp' ? '#ffffff' : 'transparent',
                color: authTab === 'otp' ? '#f97316' : '#64748b',
                boxShadow: authTab === 'otp' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {locale === 'te' ? 'ఫోన్ OTP' : 'Phone OTP'}
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: SIGN IN WITH EMAIL & PASSWORD                           */}
          {/* ============================================================== */}
          {authTab === 'signin' && (
            <form onSubmit={handleEmailLogin}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>
                {locale === 'te' ? 'ఈమెయిల్‌తో లాగిన్ అవ్వండి' : 'Sign in with Email & Password'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                {locale === 'te' ? 'మీ ఖాతా వివరాలను నమోదు చేయండి' : 'Enter your registered email and password to access your account'}
              </p>

              {/* Email Input */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>
                  {locale === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Password Input with show/hide toggle */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569' }}>
                    {locale === 'te' ? 'పాస్‌వర్డ్' : 'Password'} *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {showPassword ? 'Hide 👁️' : 'Show 👁️'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.78rem', margin: '0 0 12px', fontWeight: 700 }}>
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', height: 48, fontSize: '0.95rem', marginBottom: 14 }}
              >
                {isSubmitting ? 'Signing in...' : (locale === 'te' ? 'లాగిన్ అవ్వండి →' : 'Sign In with Email →')}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                {locale === 'te' ? 'ఖాతా లేదా?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setAuthTab('signup'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#f97316', fontWeight: 800, cursor: 'pointer' }}
                >
                  {locale === 'te' ? 'కొత్త ఖాతా సృష్టించండి' : 'Create an Account'}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CREATE NEW ACCOUNT (EMAIL + PASSWORD + PHONE)            */}
          {/* ============================================================== */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignUp}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>
                {locale === 'te' ? 'కొత్త ఖాతా సృష్టించండి' : 'Create New Account'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 14px' }}>
                {locale === 'te' ? 'ఈమెయిల్, పాస్‌వర్డ్ మరియు ఫోన్ నంబర్‌తో సైన్ అప్ చేయండి' : 'Sign up with your email, password, and phone number'}
              </p>

              {/* Full Name */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>
                  {locale === 'te' ? 'పూర్తి పేరు' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ravi Kumar"
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>
                  {locale === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Phone Number */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>
                  {locale === 'te' ? 'మొబైల్ నంబర్' : 'Phone Number'} *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 10,
                  background: '#f8fafc',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '10px 12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    borderRight: '1px solid var(--border-color)',
                    background: '#ffffff',
                  }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={signUpPhone}
                    onChange={e => setSignUpPhone(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '10px 12px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Create Password */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569' }}>
                    {locale === 'te' ? 'పాస్‌వర్డ్ సృష్టించండి (కనీసం 6 అక్షరాలు)' : 'Create Password (min 6 characters)'} *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {showSignUpPassword ? 'Hide 👁️' : 'Show 👁️'}
                  </button>
                </div>
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Create a strong password"
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border-color)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Role Selection */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: 6 }}>
                  {locale === 'te' ? 'ఖాతా రకం' : 'Account Type'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {[
                    { id: 'customer', label: '🛍️ Customer' },
                    { id: 'restaurant_owner', label: '🏪 Partner' },
                    { id: 'rider', label: '🛵 Rider' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSignUpRole(r.id as UserRole)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 8,
                        border: '1.5px solid ' + (signUpRole === r.id ? '#f97316' : '#cbd5e1'),
                        background: signUpRole === r.id ? '#fff7ed' : '#ffffff',
                        color: signUpRole === r.id ? '#c2410c' : '#475569',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.78rem', margin: '0 0 12px', fontWeight: 700 }}>
                  ⚠️ {error}
                </p>
              )}

              {successMsg && (
                <p style={{ color: '#059669', fontSize: '0.78rem', margin: '0 0 12px', fontWeight: 700 }}>
                  ✓ {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', height: 48, fontSize: '0.95rem', marginBottom: 14 }}
              >
                {isSubmitting ? 'Creating account...' : (locale === 'te' ? 'ఖాతా సృష్టించి లాగిన్ అవ్వండి →' : 'Create Account & Sign In →')}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                {locale === 'te' ? 'ఇప్పటికే ఖాతా ఉందా?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => { setAuthTab('signin'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#f97316', fontWeight: 800, cursor: 'pointer' }}
                >
                  {locale === 'te' ? 'ఇక్కడ లాగిన్ అవ్వండి' : 'Sign In'}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 3: PHONE NUMBER + OTP                                      */}
          {/* ============================================================== */}
          {authTab === 'otp' && (
            <div>
              {step === 'phone' ? (
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>
                    {locale === 'te' ? 'మొబైల్ OTP లాగిన్' : 'Mobile OTP Sign In'}
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                    {locale === 'te' ? 'ఆర్డర్ ప్రారంభించడానికి మీ మొబైల్ నంబర్ నమోదు చేయండి' : 'Enter your mobile number to receive 6-digit OTP'}
                  </p>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: 10,
                      background: '#f8fafc',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        padding: '12px 14px',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: 'var(--text-main)',
                        borderRight: '1px solid var(--border-color)',
                        background: '#ffffff',
                      }}>
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                        maxLength={10}
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          padding: '12px 14px',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          outline: 'none',
                          letterSpacing: '0.05em',
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <p style={{ color: '#ef4444', fontSize: '0.78rem', margin: '0 0 10px', fontWeight: 600 }}>
                      ⚠️ {error}
                    </p>
                  )}

                  <button
                    onClick={handleSendOtp}
                    className="btn-primary"
                    style={{ width: '100%', height: 48, fontSize: '0.95rem', marginBottom: 14 }}
                  >
                    {locale === 'te' ? 'ఓటీపీ పంపండి →' : 'Continue with OTP →'}
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <button
                      onClick={() => setStep('phone')}
                      style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}
                    >
                      ←
                    </button>
                    <div>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                        {locale === 'te' ? 'OTP నమోదు చేయండి' : 'Enter Verification Code'}
                      </h2>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        Sent to <b>+91 {phone}</b>
                      </p>
                    </div>
                  </div>

                  {/* 6 OTP Boxes */}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => { otpRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleKeyDown(idx, e)}
                        style={{
                          width: 44,
                          height: 52,
                          textAlign: 'center',
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          borderRadius: 10,
                          border: '2px solid ' + (digit ? 'var(--primary)' : 'var(--border-color)'),
                          background: digit ? '#fff7ed' : '#f8fafc',
                          outline: 'none',
                        }}
                      />
                    ))}
                  </div>

                  {error && (
                    <p style={{ color: '#ef4444', fontSize: '0.78rem', textAlign: 'center', margin: '0 0 10px', fontWeight: 600 }}>
                      ⚠️ {error}
                    </p>
                  )}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ width: '100%', height: 48, fontSize: '0.95rem', marginBottom: 12 }}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Continue →'}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {resendTimer > 0 ? (
                      <span>Resend OTP in <b>{resendTimer}s</b></span>
                    ) : (
                      <button
                        onClick={() => { setResendTimer(30); alert('Demo OTP is: 123456'); }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Demo Switcher Section */}
        <div style={{
          marginTop: 24,
          padding: '14px',
          background: '#f8fafc',
          borderRadius: 14,
          border: '1px dashed #cbd5e1',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 8, textAlign: 'center' }}>
            ⚡ 1-CLICK INSTANT DEMO ACCOUNTS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => quickDemoLogin('customer')}
              style={{
                padding: '9px 6px',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🛍️ Customer
            </button>
            <button
              onClick={() => quickDemoLogin('restaurant_owner')}
              style={{
                padding: '9px 6px',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🏪 Restaurant
            </button>
            <button
              onClick={() => quickDemoLogin('rider')}
              style={{
                padding: '9px 6px',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🛵 Delivery Rider
            </button>
            <button
              onClick={() => quickDemoLogin('admin')}
              style={{
                padding: '9px 6px',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🛡️ Admin Ops
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
