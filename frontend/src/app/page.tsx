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
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            AEGIS <span style={{ color: 'var(--emerald-muted)' }}>PROTOCOL</span>
          </span>
        </div>
        <Link href="/home" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
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
              background: 'rgba(169,206,196,0.08)', border: '1px solid rgba(169,206,196,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={24} color="var(--emerald-muted)" />
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Sign in to Aegis
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Select your role to access the right dashboard
            </p>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '10px' }}>
              I am a
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Recruiter option */}
              <button
                onClick={() => setRole('recruiter')}
                style={{
                  padding: '18px 16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid',
                  background: role === 'recruiter' ? 'rgba(169,206,196,0.07)' : 'var(--obsidian-800)',
                  borderColor: role === 'recruiter' ? 'rgba(169,206,196,0.4)' : 'var(--border-subtle)',
                  textAlign: 'left', transition: 'all 0.2s ease', position: 'relative',
                  boxShadow: role === 'recruiter' ? '0 0 20px rgba(169,206,196,0.08)' : 'none',
                }}
              >
                {role === 'recruiter' && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <CheckCircle2 size={14} color="var(--emerald-muted)" />
                  </div>
                )}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px', marginBottom: '10px',
                  background: role === 'recruiter' ? 'rgba(169,206,196,0.12)' : 'var(--obsidian-700)',
                  border: `1px solid ${role === 'recruiter' ? 'rgba(169,206,196,0.25)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Building2 size={16} color={role === 'recruiter' ? 'var(--emerald-muted)' : 'var(--text-muted)'} />
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: role === 'recruiter' ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '3px' }}>
                  Recruiter
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Access Command Center &amp; candidate profiles
                </div>
              </button>

              {/* Candidate option */}
              <button
                onClick={() => setRole('candidate')}
                style={{
                  padding: '18px 16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid',
                  background: role === 'candidate' ? 'rgba(212,168,83,0.06)' : 'var(--obsidian-800)',
                  borderColor: role === 'candidate' ? 'rgba(212,168,83,0.4)' : 'var(--border-subtle)',
                  textAlign: 'left', transition: 'all 0.2s ease', position: 'relative',
                  boxShadow: role === 'candidate' ? '0 0 20px rgba(212,168,83,0.07)' : 'none',
                }}
              >
                {role === 'candidate' && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <CheckCircle2 size={14} color="var(--amber-trust)" />
                  </div>
                )}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px', marginBottom: '10px',
                  background: role === 'candidate' ? 'rgba(212,168,83,0.1)' : 'var(--obsidian-700)',
                  border: `1px solid ${role === 'candidate' ? 'rgba(212,168,83,0.25)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={16} color={role === 'candidate' ? 'var(--amber-trust)' : 'var(--text-muted)'} />
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: role === 'candidate' ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '3px' }}>
                  Candidate
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  View your profile, take exams &amp; upload docs
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <User size={14} color={errors.username ? '#f87171' : 'var(--text-muted)'} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setErrors(er => ({ ...er, username: undefined })); }}
                  placeholder="e.g. arjun_mehta"
                  style={{
                    width: '100%', background: 'var(--obsidian-800)', borderRadius: '9px',
                    border: `1px solid ${errors.username ? 'rgba(248,113,113,0.5)' : 'var(--border-subtle)'}`,
                    padding: '11px 12px 11px 36px', color: 'var(--text-primary)', fontSize: '0.875rem',
                    outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
                    boxShadow: errors.username ? '0 0 0 3px rgba(248,113,113,0.08)' : 'none',
                  }}
                  onFocus={e => { if (!errors.username) e.target.style.borderColor = 'var(--border-active)'; }}
                  onBlur={e => { if (!errors.username) e.target.style.borderColor = 'var(--border-subtle)'; }}
                />
              </div>
              {errors.username && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                  <AlertCircle size={11} color="#f87171" />
                  <span style={{ fontSize: '0.72rem', color: '#f87171' }}>{errors.username}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Mail size={14} color={errors.email ? '#f87171' : 'var(--text-muted)'} />
                </div>
                <input
                  id="email"
                  type={showEmail ? 'text' : 'email'}
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })); }}
                  placeholder="yourname@gmail.com"
                  style={{
                    width: '100%', background: 'var(--obsidian-800)', borderRadius: '9px',
                    border: `1px solid ${errors.email ? 'rgba(248,113,113,0.5)' : 'var(--border-subtle)'}`,
                    padding: '11px 40px 11px 36px', color: 'var(--text-primary)', fontSize: '0.875rem',
                    outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
                    boxShadow: errors.email ? '0 0 0 3px rgba(248,113,113,0.08)' : 'none',
                  }}
                  onFocus={e => { if (!errors.email) e.target.style.borderColor = 'var(--border-active)'; }}
                  onBlur={e => { if (!errors.email) e.target.style.borderColor = 'var(--border-subtle)'; }}
                />
                <button
                  onClick={() => setShowEmail(s => !s)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                  type="button"
                >
                  {showEmail ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                  <AlertCircle size={11} color="#f87171" />
                  <span style={{ fontSize: '0.72rem', color: '#f87171' }}>{errors.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Role not selected warning */}
          {!role && form.username && form.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.15)', marginBottom: '16px' }}>
              <AlertCircle size={13} color="var(--amber-trust)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--amber-trust)' }}>Please select your role above</span>
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading || !isFormReady}
            style={{
              width: '100%', padding: '13px', borderRadius: '10px', border: 'none', cursor: isFormReady && !loading ? 'pointer' : 'not-allowed',
              background: success
                ? 'rgba(169,206,196,0.15)'
                : role === 'candidate'
                  ? 'var(--amber-trust)'
                  : 'var(--emerald-muted)',
              color: success ? 'var(--emerald-muted)' : 'var(--obsidian-900)',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 700,
              opacity: !isFormReady ? 0.4 : 1,
              transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: isFormReady && !loading ? `0 4px 20px rgba(${role === 'candidate' ? '212,168,83' : '169,206,196'},0.25)` : 'none',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'var(--obsidian-900)', animation: 'spin 0.8s linear infinite' }} />
                Authenticating...
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={16} color="var(--emerald-muted)" />
                Redirecting...
              </>
            ) : (
              <>
                Enter {role === 'recruiter' ? 'Command Center' : role === 'candidate' ? 'My Dashboard' : 'Aegis'}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Divider + decorative info */}
          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="divider" />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>secured by</span>
              <div className="divider" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {['Blockchain SBT', 'AI Proctor', 'IPFS Lock'].map(tag => (
                <div key={tag} className="badge badge-ghost" style={{ fontSize: '0.65rem' }}>{tag}</div>
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
