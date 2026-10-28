'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { login, isAuthenticated, user, switchRole } = useAuth();
  const { t, locale, setLocale } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const quickDemoLogin = (role: 'customer' | 'restaurant_owner' | 'rider' | 'admin') => {
    const phoneMap = {
      customer: '9876543210',
      restaurant_owner: '9876543211',
      rider: '9876543212',
      admin: '9876543213',
    };
    const targetPhone = phoneMap[role];
    setPhone(targetPhone);
    setOtp(['1', '2', '3', '4', '5', '6']);
    const formatted = `+91${targetPhone}`;
    login(formatted, '123456').then(() => {
      switchRole(role);
      if (role === 'restaurant_owner') router.push('/restaurant');
      else if (role === 'rider') router.push('/rider');
      else if (role === 'admin') router.push('/admin');
      else router.push('/app');
    });
  };

  return (
    <div className="app-shell" style={{ background: '#ffffff', minHeight: '100dvh' }}>
      {/* Top Banner with Food Montage Background */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 230,
        overflow: 'hidden',
        background: '#0f172a',
      }}>
        <img
          src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
          alt="Pakka Local Food"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
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
              fontSize: '1.8rem',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {locale === 'te' ? 'పక్కా లోకల్' : 'Pakka Local'}
            </h1>
            <p style={{
              fontSize: '0.82rem',
              color: '#fdba74',
              fontWeight: 700,
              margin: '2px 0 0',
            }}>
              {locale === 'te' ? 'పక్కా లోకల్. పక్కా టేస్టీ.' : 'Pakka local. Pakka tasty.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {step === 'phone' ? (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                {locale === 'te' ? 'లాగిన్ లేదా సైన్ అప్' : 'Login or Sign up'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 20px' }}>
                {locale === 'te' ? 'ఆర్డర్ ప్రారంభించడానికి మీ మొబైల్ నంబర్ నమోదు చేయండి' : 'Enter your phone number to continue'}
              </p>

              {/* Phone Input with Country Code */}
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
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
                  {error}
                </p>
              )}

              <button
                onClick={handleSendOtp}
                className="btn-primary"
                style={{ width: '100%', height: 48, fontSize: '0.95rem', marginBottom: 16 }}
              >
                {locale === 'te' ? 'ఓటీపీ పంపండి →' : 'Continue with OTP →'}
              </button>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                By continuing, you agree to Pakka Local's Terms of Service & Privacy Policy.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <button
                  onClick={() => setStep('phone')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ←
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  {locale === 'te' ? 'ఓటీపీని ధృవీకరించండి' : 'Verify OTP'}
                </h2>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 20px' }}>
                {locale === 'te' ? `కోడ్ పంపబడింది +91 ${phone}` : `Code sent to +91 ${phone}`} •{' '}
                <button
                  onClick={() => setStep('phone')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Edit
                </button>
              </p>

              {/* 6 Digit OTP input */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    style={{
                      width: 46,
                      height: 52,
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      borderRadius: 'var(--radius-md)',
                      border: digit ? '2px solid var(--primary)' : '1.5px solid var(--border-color)',
                      background: digit ? '#fff7ed' : '#f8fafc',
                      outline: 'none',
                    }}
                  />
                ))}
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.78rem', textAlign: 'center', margin: '0 0 10px', fontWeight: 600 }}>
                  {error}
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

        {/* Quick Demo Switcher Section */}
        <div style={{
          marginTop: 30,
          padding: '14px',
          background: '#f8fafc',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed #cbd5e1',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 8, textAlign: 'center' }}>
            ⚡ 1-CLICK INSTANT DEMO ROLES:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => quickDemoLogin('customer')}
              style={{
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
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
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
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
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
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
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
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
