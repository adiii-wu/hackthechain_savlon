'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, User, Building2, Mail, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';

type Role = 'recruiter' | 'candidate' | null;

interface FormState {
  username: string;
  email: string;
}

interface Errors {
  username?: string;
  email?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [form, setForm] = useState<FormState>({ username: '', email: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const newErrors: Errors = {};
    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (form.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!form.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Invalid email — only @gmail.com accounts are accepted';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!role) return;
    if (!validate()) return;

    setLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1200));

    // Store session info
    sessionStorage.setItem('aegis_user', JSON.stringify({
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      role,
    }));

    setSuccess(true);
    await new Promise(r => setTimeout(r, 600));

    router.push(role === 'recruiter' ? '/command-center' : '/candidate');
  }

  const isFormReady = role && form.username && form.email;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--obsidian-black)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background layers */}
      <div className="bg-grid" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(169,206,196,0.1) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 40% 30% at 85% 70%, rgba(212,168,83,0.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top nav bar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '60px',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={18} color="var(--emerald-muted)" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            AEGIS <span style={{ color: 'var(--emerald-muted)' }}>PROTOCOL</span>
          </span>
        </div>
        <Link href="/home" style={{ fontSize: '0.85rem', color: '#cbd5e1', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to home
        </Link>
      </nav>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 20px 40px', position: 'relative', zIndex: 2,
      }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 20px',
              background: 'rgba(169,206,196,0.12)', border: '1px solid rgba(169,206,196,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={24} color="var(--emerald-muted)" />
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Sign in to Aegis
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 400 }}>
              Select your role to access the right dashboard
            </p>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>
              I am a
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Recruiter option */}
              <button
                onClick={() => setRole('recruiter')}
                style={{
                  padding: '18px 16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid',
                  background: role === 'recruiter' ? 'rgba(169,206,196,0.07)' : 'var(--obsidian-800)',
                  borderColor: role === 'recruiter' ? 'var(--emerald-muted)' : 'var(--border-subtle)',
                  textAlign: 'left', transition: 'all 0.2s ease', position: 'relative',
                  boxShadow: role === 'recruiter' ? '0 0 20px rgba(169,206,196,0.15)' : 'none',
                }}
              >
                {role === 'recruiter' && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <CheckCircle2 size={16} color="var(--emerald-muted)" />
                  </div>
                )}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px', marginBottom: '10px',
                  background: role === 'recruiter' ? 'rgba(169,206,196,0.15)' : 'var(--obsidian-700)',
                  border: `1px solid ${role === 'recruiter' ? 'rgba(169,206,196,0.4)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Building2 size={16} color={role === 'recruiter' ? 'var(--emerald-muted)' : '#cbd5e1'} />
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Recruiter
                </div>
                <div style={{ fontSize: '0.75rem', color: role === 'recruiter' ? '#e2e8f0' : '#cbd5e1', lineHeight: 1.4 }}>
                  Access Command Center &amp; profiles
                </div>
              </button>

              {/* Candidate option */}
              <button
                onClick={() => setRole('candidate')}
                style={{
                  padding: '18px 16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid',
                  background: role === 'candidate' ? 'rgba(212,168,83,0.06)' : 'var(--obsidian-800)',
                  borderColor: role === 'candidate' ? 'var(--amber-trust)' : 'var(--border-subtle)',
                  textAlign: 'left', transition: 'all 0.2s ease', position: 'relative',
                  boxShadow: role === 'candidate' ? '0 0 20px rgba(212,168,83,0.15)' : 'none',
                }}
              >
                {role === 'candidate' && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <CheckCircle2 size={16} color="var(--amber-trust)" />
                  </div>
                )}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px', marginBottom: '10px',
                  background: role === 'candidate' ? 'rgba(212,168,83,0.15)' : 'var(--obsidian-700)',
                  border: `1px solid ${role === 'candidate' ? 'rgba(212,168,83,0.4)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={16} color={role === 'candidate' ? 'var(--amber-trust)' : '#cbd5e1'} />
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Candidate
                </div>
                <div style={{ fontSize: '0.75rem', color: role === 'candidate' ? '#e2e8f0' : '#cbd5e1', lineHeight: 1.4 }}>
                  View profile, exams &amp; docs
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <User size={16} color={errors.username ? '#f87171' : '#cbd5e1'} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setErrors(er => ({ ...er, username: undefined })); }}
                  placeholder="e.g. arjun_mehta"
                  style={{
                    width: '100%', background: 'var(--obsidian-800)', borderRadius: '9px',
                    border: `1px solid ${errors.username ? 'rgba(248,113,113,0.6)' : 'rgba(203, 213, 225, 0.2)'}`,
                    padding: '12px 14px 12px 38px', color: '#ffffff', fontSize: '0.9rem',
                    outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
                    boxShadow: errors.username ? '0 0 0 3px rgba(248,113,113,0.1)' : 'none',
                  }}
                  onFocus={e => { if (!errors.username) e.target.style.borderColor = 'rgba(203, 213, 225, 0.5)'; }}
                  onBlur={e => { if (!errors.username) e.target.style.borderColor = 'rgba(203, 213, 225, 0.2)'; }}
                />
              </div>
              {errors.username && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <AlertCircle size={12} color="#f87171" />
                  <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 500 }}>{errors.username}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Mail size={16} color={errors.email ? '#f87171' : '#cbd5e1'} />
                </div>
                <input
                  id="email"
                  type={showEmail ? 'text' : 'email'}
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })); }}
                  placeholder="yourname@gmail.com"
                  style={{
                    width: '100%', background: 'var(--obsidian-800)', borderRadius: '9px',
                    border: `1px solid ${errors.email ? 'rgba(248,113,113,0.6)' : 'rgba(203, 213, 225, 0.2)'}`,
                    padding: '12px 42px 12px 38px', color: '#ffffff', fontSize: '0.9rem',
                    outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
                    boxShadow: errors.email ? '0 0 0 3px rgba(248,113,113,0.1)' : 'none',
                  }}
                  onFocus={e => { if (!errors.email) e.target.style.borderColor = 'rgba(203, 213, 225, 0.5)'; }}
                  onBlur={e => { if (!errors.email) e.target.style.borderColor = 'rgba(203, 213, 225, 0.2)'; }}
                />
                <button
                  onClick={() => setShowEmail(s => !s)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#cbd5e1' }}
                  type="button"
                >
                  {showEmail ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <AlertCircle size={12} color="#f87171" />
                  <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 500 }}>{errors.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Role not selected warning */}
          {!role && form.username && form.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: '16px' }}>
              <AlertCircle size={14} color="#fbbf24" />
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#fbbf24' }}>Please select your role above</span>
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading || !isFormReady}
            style={{
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none', cursor: isFormReady && !loading ? 'pointer' : 'not-allowed',
              background: success
                ? 'rgba(169,206,196,0.15)'
                : role === 'candidate'
                  ? 'var(--amber-trust)'
                  : role === 'recruiter' ? 'var(--emerald-muted)' : 'var(--obsidian-700)',
              color: success ? 'var(--emerald-muted)' : !isFormReady ? '#64748b' : 'var(--obsidian-900)',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 700,
              opacity: !isFormReady ? 0.6 : 1,
              transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: isFormReady && !loading ? `0 4px 24px rgba(${role === 'candidate' ? '212,168,83' : '169,206,196'},0.3)` : 'none',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2.5px solid rgba(0,0,0,0.2)', borderTopColor: 'var(--obsidian-900)', animation: 'spin 0.8s linear infinite' }} />
                Authenticating...
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={18} color="var(--emerald-muted)" />
                Redirecting...
              </>
            ) : (
              <>
                Enter {role === 'recruiter' ? 'Command Center' : role === 'candidate' ? 'My Dashboard' : 'Aegis'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Divider + decorative info */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div className="divider" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>secured by</span>
              <div className="divider" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {['Blockchain SBT', 'AI Proctor', 'IPFS Lock'].map(tag => (
                <div key={tag} className="badge badge-ghost" style={{ fontSize: '0.67rem', fontWeight: 600, color: '#cbd5e1' }}>{tag}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
