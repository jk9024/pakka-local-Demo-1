'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { COUPONS } from '@/lib/mock-data';
import Link from 'next/link';

export default function OffersPage() {
  const { t, locale } = useTranslation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ padding: '16px 16px 90px', background: '#f8fafc', minHeight: '100dvh' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 4, letterSpacing: '-0.02em' }}>
        🏷️ {locale === 'te' ? 'ఆఫర్లు & కూపన్లు' : 'Deals & Coupons'}
      </h1>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
        {locale === 'te'
          ? 'మీ ఆర్డర్లపై భారీ తగ్గింపులను ఆస్వాదించండి'
          : 'Apply these promo vouchers at checkout for maximum savings'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {COUPONS.map(coupon => (
          <div
            key={coupon.id}
            className="card"
            style={{
              padding: 18,
              position: 'relative',
              overflow: 'hidden',
              borderLeft: '5px solid var(--primary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: 'inline-block',
                  background: '#fff7ed',
                  color: '#c2410c',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.08em',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed #fdba74',
                }}>
                  {coupon.code}
                </span>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: 8, color: 'var(--text-main)', lineHeight: 1.3 }}>
                  {coupon.description}
                </div>
              </div>

              <button
                onClick={() => copyCode(coupon.code)}
                style={{
                  flexShrink: 0,
                  background: copiedCode === coupon.code ? 'var(--rating-green)' : '#ffffff',
                  color: copiedCode === coupon.code ? '#ffffff' : 'var(--primary)',
                  border: copiedCode === coupon.code ? 'none' : '1.5px solid var(--primary)',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {copiedCode === coupon.code
                  ? (locale === 'te' ? 'కాపీ చేయబడింది!' : 'COPIED!')
                  : (locale === 'te' ? 'కోడ్ కాపీ చేయండి' : 'COPY CODE')}
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: 12,
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid #f1f5f9',
              paddingTop: 10,
              marginTop: 6,
            }}>
              <span>
                • {locale === 'te' ? 'కనిష్ట ఆర్డర్:' : 'Min Order:'} ₹{coupon.min_order_amount}
              </span>
              {coupon.max_discount && (
                <span>
                  • {locale === 'te' ? 'గరిష్ట తగ్గింపు:' : 'Max Discount:'} ₹{coupon.max_discount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Link href="/app" className="btn-primary" style={{ padding: '12px 28px' }}>
          {locale === 'te' ? 'ఆహారాన్ని ఆర్డర్ చేయండి →' : 'Order Food Now →'}
        </Link>
      </div>
    </div>
  );
}
