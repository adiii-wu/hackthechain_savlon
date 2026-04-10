'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Bell, Lock, CreditCard, Users, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    description: 'For early-stage startups doing their first hires.',
    features: ['50 candidate profiles/mo', '10 Sentinel exams/mo', 'Basic GitHub Pulse', 'Email support'],
    color: 'var(--text-muted)',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₹14,999',
    period: '/month',
    description: 'For scaling teams hiring consistently.',
    features: ['500 candidate profiles/mo', '100 Sentinel exams/mo', 'Full GitHub Pulse + SBT verification', 'Custom assessments', 'Priority support'],
    color: 'var(--emerald-muted)',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For institutions with complex, high-volume hiring.',
    features: ['Unlimited profiles', 'Unlimited exams', 'Dedicated SBT infrastructure', 'White-label portal', 'HRMS integrations', 'Dedicated CSM'],
    color: 'var(--amber-trust)',
    popular: false,
  },
];

const sections = [
  { id: 'plan', icon: CreditCard, label: 'Plan & Billing' },
  { id: 'team', icon: Users, label: 'Team Members' },
  { id: 'sentinel', icon: Shield, label: 'Sentinel Config' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Lock, label: 'Security' },
];

export default function Settings() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'recruiter' | 'candidate' | undefined>(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem('aegis_user');
    if (!raw) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(raw);
    setUserRole(parsed.role);
  }, [router]);

  const [activeSection, setActiveSection] = useState('plan');
  const [currentPlan, setCurrentPlan] = useState('growth');
  const [notifications, setNotifications] = useState({
    newCandidate: true, assessmentComplete: true, sbtVerified: true, weeklyReport: false,
  });
  const [sentinelConfig, setSentinelConfig] = useState({
    eyeTracking: true, tabDetection: true, facialOrientation: true, autoFail: false,
  });

  if (!userRole) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian-black)' }}>
      <Sidebar role={userRole} />
      <div style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>
        <Topbar title="Settings" subtitle="Organization preferences and configuration" />

        <main style={{ padding: '28px', display: 'flex', gap: '24px', maxWidth: '1100px' }}>

          {/* Left nav */}
          <div style={{ width: '190px', flexShrink: 0 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`nav-link ${activeSection === id ? 'active' : ''}`}
                  style={{ background: 'none', border: activeSection === id ? '1px solid rgba(169,206,196,0.1)' : '1px solid transparent', textAlign: 'left', cursor: 'pointer', width: '100%' }}
                >
                  <Icon size={14} />
                  {label}
                  {activeSection === id && <ChevronRight size={11} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── PLAN ── */}
            {activeSection === 'plan' && (
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Plan & Billing</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Choose the plan that fits your hiring volume. Upgrade or downgrade any time.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                  {plans.map(plan => (
                    <div
                      key={plan.id}
                      onClick={() => setCurrentPlan(plan.id)}
                      style={{
                        padding: '20px', borderRadius: '12px', cursor: 'pointer',
                        background: currentPlan === plan.id ? `rgba(${plan.color === 'var(--emerald-muted)' ? '169,206,196' : plan.color === 'var(--amber-trust)' ? '212,168,83' : '255,255,255'},0.04)` : 'var(--obsidian-800)',
                        border: `1px solid ${currentPlan === plan.id ? plan.color : 'var(--border-subtle)'}`,
                        transition: 'all 0.2s', position: 'relative',
                      }}
                    >
                      {plan.popular && (
                        <div className="badge badge-emerald" style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                          Most Popular
                        </div>
                      )}
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: plan.color, marginBottom: '6px' }}>{plan.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{plan.price}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.period}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{plan.description}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <CheckCircle2 size={11} color={plan.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button className="btn-ghost">Cancel Plan</button>
                  <button className="btn-primary"><Zap size={14} /> Confirm Selection</button>
                </div>
              </div>
            )}

            {/* ── SENTINEL CONFIG ── */}
            {activeSection === 'sentinel' && (
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Sentinel AI Configuration</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Configure how the AI proctor monitors your assessments.
                </p>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.entries(sentinelConfig).map(([key, val]) => {
                    const labels: Record<string, { label: string; desc: string }> = {
                      eyeTracking: { label: 'Eye Movement Tracking', desc: 'Detect when candidate looks away from screen' },
                      tabDetection: { label: 'Tab Switch Detection', desc: 'Flag when candidate switches browser tabs' },
                      facialOrientation: { label: 'Facial Orientation', desc: 'Detect head turning and face absence' },
                      autoFail: { label: 'Auto-fail on 5 violations', desc: 'Automatically end exam after repeated violations' },
                    };
                    const cfg = labels[key];
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{cfg.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cfg.desc}</div>
                        </div>
                        <button
                          onClick={() => setSentinelConfig(s => ({ ...s, [key]: !val }))}
                          style={{
                            width: '42px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: val ? 'var(--emerald-muted)' : 'var(--obsidian-600)',
                            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                          }}
                        >
                          <div style={{
                            position: 'absolute', top: '3px',
                            left: val ? '21px' : '3px',
                            width: '18px', height: '18px', borderRadius: '9px',
                            background: val ? 'var(--obsidian-900)' : 'var(--text-muted)',
                            transition: 'left 0.2s',
                          }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-primary"><CheckCircle2 size={14} /> Save Configuration</button>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === 'notifications' && (
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Notification Preferences</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Choose when to be alerted about platform events.
                </p>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.entries(notifications).map(([key, val]) => {
                    const labels: Record<string, { label: string; desc: string }> = {
                      newCandidate: { label: 'New Candidate Indexed', desc: 'When a new profile is added to the platform' },
                      assessmentComplete: { label: 'Assessment Complete', desc: 'When a candidate finishes a Sentinel exam' },
                      sbtVerified: { label: 'SBT Verified', desc: 'When a document is locked on-chain' },
                      weeklyReport: { label: 'Weekly Summary Report', desc: 'Sunday digest of platform activity' },
                    };
                    const cfg = labels[key];
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{cfg.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cfg.desc}</div>
                        </div>
                        <button
                          onClick={() => setNotifications(n => ({ ...n, [key]: !val }))}
                          style={{
                            width: '42px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: val ? 'var(--emerald-muted)' : 'var(--obsidian-600)',
                            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                          }}
                        >
                          <div style={{
                            position: 'absolute', top: '3px',
                            left: val ? '21px' : '3px',
                            width: '18px', height: '18px', borderRadius: '9px',
                            background: val ? 'var(--obsidian-900)' : 'var(--text-muted)',
                            transition: 'left 0.2s',
                          }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-primary"><CheckCircle2 size={14} /> Save Preferences</button>
                </div>
              </div>
            )}

            {/* ── TEAM ── */}
            {activeSection === 'team' && (
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Team Members</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Manage who has access to your Aegis workspace.</p>
                <div className="card">
                  {[
                    { name: 'Rohan Verma', email: 'rohan@apexventures.com', role: 'Admin', avatar: 'RV' },
                    { name: 'Deepa Nair', email: 'deepa@apexventures.com', role: 'Recruiter', avatar: 'DN' },
                    { name: 'Sameer Khan', email: 'sameer@apexventures.com', role: 'Viewer', avatar: 'SK' },
                  ].map((m, i, arr) => (
                    <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--obsidian-700)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {m.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.email}</div>
                      </div>
                      <span className={`badge ${m.role === 'Admin' ? 'badge-emerald' : m.role === 'Recruiter' ? 'badge-amber' : 'badge-ghost'}`}>
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <button className="btn-primary"><Users size={14} /> Invite Member</button>
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeSection === 'security' && (
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Security</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Manage authentication and access policies.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Require 2FA for all team members', on: true },
                    { label: 'SSO via Google Workspace', desc: 'Login with your org Google account', on: true },
                    { label: 'Session Timeout (30 min)', desc: 'Auto-logout after inactivity', on: false },
                  ].map(item => (
                    <div key={item.label} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{item.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                      <div className={`badge ${item.on ? 'badge-emerald' : 'badge-ghost'}`}>{item.on ? 'Enabled' : 'Disabled'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
