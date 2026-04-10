'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Shield, Activity, Lock, Brain, GitBranch, ArrowRight, CheckCircle2, Zap, ChevronRight } from 'lucide-react';
import { platformStats } from '@/lib/mockData';

const pillars = [
  {
    id: 1,
    icon: Lock,
    name: 'Aegis Vault',
    subtitle: 'Web3 Document Locking',
    description: 'Documents are hashed to IPFS and minted as Soulbound Tokens — cryptographic truth that cannot be faked or transferred.',
    color: 'var(--emerald-muted)',
    stat: '38,924',
    statLabel: 'Verified SBTs',
  },
  {
    id: 2,
    icon: Brain,
    name: 'Sentinel AI',
    subtitle: 'Proctoring & Assessments',
    description: 'Eye-tracking, tab-switching detection, and facial orientation analysis via OpenCV. Every test generates a human-authenticity score.',
    color: 'var(--amber-trust)',
    stat: '94,210',
    statLabel: 'Assessments Run',
  },
  {
    id: 3,
    icon: GitBranch,
    name: 'Pulse Tracker',
    subtitle: 'Continuous Activity Engine',
    description: 'Live GitHub commit tracking, PRs, and open-source contributions. Know if a candidate is actively building or dormant.',
    color: '#818cf8',
    stat: '12,487',
    statLabel: 'Profiles Tracked',
  },
  {
    id: 4,
    icon: Activity,
    name: 'Recruiter Terminal',
    subtitle: 'The Command Center',
    description: 'A sleek institutional dashboard aggregating SBTs, AI Trust Scores, and GitHub Pulse into a single Composite Rating out of 1000.',
    color: 'var(--emerald-muted)',
    stat: '1,000',
    statLabel: 'Max Composite Score',
  },
];

const stats = [
  { value: platformStats.totalCandidates.toLocaleString(), label: 'Candidates Indexed' },
  { value: platformStats.verifiedSBTs.toLocaleString(), label: 'Verified SBTs' },
  { value: platformStats.assessmentsRun.toLocaleString(), label: 'Assessments Run' },
  { value: `${platformStats.avgTrustScore}%`, label: 'Avg Trust Score' },
];

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handle = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--obsidian-black)', position: 'relative', overflow: 'hidden' }}>

      {/* Background layers */}
      <div className="bg-grid" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div className="bg-radial-emerald" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div className="bg-radial-amber" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* Mouse glow follower */}
      {mounted && (
        <div style={{
          position: 'fixed',
          left: mousePos.x - 200, top: mousePos.y - 200,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(169,206,196,0.04) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1, transition: 'left 0.3s ease, top 0.3s ease',
        }} />
      )}

      {/* ─── NAV ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="var(--emerald-muted)" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            AEGIS <span style={{ color: 'var(--emerald-muted)' }}>PROTOCOL</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/command-center" className="btn-ghost" style={{ padding: '7px 16px' }}>
            Recruiter Login
          </Link>
          <Link href="/truth-profile" className="btn-primary" style={{ padding: '7px 16px' }}>
            Profile Demo
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 40px 80px', position: 'relative', zIndex: 2 }}>

        {/* Tag */}
        <div className="badge badge-emerald" style={{ marginBottom: '24px' }}>
          <CheckCircle2 size={9} />
          Blockchain · AI · Open Source Intelligence
        </div>

        {/* H1 */}
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '-0.04em',
          lineHeight: 1.08,
          maxWidth: '900px',
          marginBottom: '24px',
        }}>
          The Institutional{' '}
          <span className="gradient-text">Truth Layer</span>
          <br />for Modern Hiring.
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '560px', lineHeight: 1.7, marginBottom: '40px' }}>
          Blockchain-locked credentials. AI-proctored assessments. Live GitHub intelligence. A single Composite Rating that recruiters can trust — with cryptographic certainty.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          <Link href="/command-center" className="btn-primary" style={{ fontSize: '0.95rem', padding: '12px 28px' }}>
            <Zap size={16} />
            Enter Command Center
          </Link>
          <Link href="/truth-profile" className="btn-ghost" style={{ fontSize: '0.95rem', padding: '12px 28px' }}>
            View Truth Profile
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
          background: 'var(--border-subtle)', borderRadius: '12px', overflow: 'hidden',
          maxWidth: '700px', width: '100%',
          border: '1px solid var(--border-subtle)',
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'var(--obsidian-900)', padding: '20px 16px', textAlign: 'center' }}>
              <div className="stat-value" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section style={{ padding: '80px 40px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge badge-ghost" style={{ marginBottom: '16px' }}>The Architecture</div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Built on 4 Pillars of Truth
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
            Each pillar independently verifiable. Combined, they produce an unimpeachable hiring signal.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className="card glass-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Number */}
                <div style={{ position: 'absolute', top: '16px', right: '20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>
                  0{pillar.id}
                </div>

                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
                  background: `rgba(${pillar.color === 'var(--emerald-muted)' ? '169,206,196' : pillar.color === 'var(--amber-trust)' ? '212,168,83' : '129,140,248'}, 0.1)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid rgba(${pillar.color === 'var(--emerald-muted)' ? '169,206,196' : pillar.color === 'var(--amber-trust)' ? '212,168,83' : '129,140,248'}, 0.2)`,
                }}>
                  <Icon size={18} color={pillar.color} />
                </div>

                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  Pillar {pillar.id}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {pillar.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: pillar.color, marginBottom: '12px', fontWeight: 500 }}>
                  {pillar.subtitle}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '20px' }}>
                  {pillar.description}
                </p>

                <div className="divider" style={{ marginBottom: '16px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: pillar.color }}>
                      {pillar.stat}
                    </div>
                    <div className="stat-label" style={{ marginTop: '2px' }}>{pillar.statLabel}</div>
                  </div>
                  <CheckCircle2 size={18} color="var(--border-active)" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '80px 40px 120px', position: 'relative', zIndex: 2 }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto', textAlign: 'center',
          padding: '60px 40px', borderRadius: '20px',
          background: 'var(--obsidian-800)', border: '1px solid var(--border-subtle)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(169,206,196,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Shield size={40} color="var(--emerald-muted)" style={{ marginBottom: '20px', opacity: 0.7 }} />
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Ready to Hire with Certainty?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Join 400+ institutions already using Aegis Protocol to eliminate resume fraud and trust every hire.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/command-center" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              <Zap size={16} />
              Launch Command Center
            </Link>
            <Link href="/sentinel" className="btn-ghost" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              Try Sentinel Exam
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
