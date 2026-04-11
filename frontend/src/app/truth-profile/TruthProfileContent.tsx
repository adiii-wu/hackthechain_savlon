'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GitBranch, ArrowLeft, Star, GitPullRequest, GitCommit, Award, MessageSquare, CheckCircle2, ExternalLink } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import TrustRing from '@/components/TrustRing';
import ActivityBadge from '@/components/ActivityBadge';
import SBTBadge from '@/components/SBTBadge';
import AegisVault from '@/components/AegisVault';
import { candidates } from '@/lib/mockData';
import { getVaultData } from '@/lib/blockchain';

export default function TruthProfileContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'recruiter' | 'candidate' | undefined>(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem('aegis_user');
    if (!raw) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(raw);
    setCurrentUser(parsed);
    setUserRole(parsed.role);
  }, [router]);

  const id = params.get('id');
  const c = candidates.find(x => x.id === id) ?? candidates[0];
  
  // Use session username if viewing own profile as candidate without explicit ID
  const displayName = (userRole === 'candidate' && !id) ? currentUser?.username : c.name;
  const displayAvatar = (userRole === 'candidate' && !id) ? currentUser?.username?.slice(0, 2).toUpperCase() : c.avatar;

  const ratingColor = (r: number) => r >= 850 ? 'var(--emerald-muted)' : r >= 700 ? 'var(--amber-trust)' : '#9ca3af';

  if (!userRole) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian-black)' }}>
      <Sidebar role={userRole} />
      <div style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>
        <Topbar title="Truth Profile" subtitle={`Verified identity record for ${displayName}`} />

        <main style={{ padding: '28px', maxWidth: '1100px' }}>

          {/* Back */}
          <Link href="/command-center" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '24px' }}>
            <ArrowLeft size={13} /> Back to Command Center
          </Link>

          {/* ── HERO CARD ── */}
          <div className="card" style={{ marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '200px', background: 'radial-gradient(ellipse at top right, rgba(169,206,196,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '16px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(169,206,196,0.15), rgba(169,206,196,0.05))',
                border: '1px solid rgba(169,206,196,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--emerald-muted)',
              }}>
                {displayAvatar}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{displayName}</h2>
                  <ActivityBadge status={c.activityStatus} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{c.title}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {c.skills.map(s => (
                    <span key={s} className="badge badge-ghost">{s}</span>
                  ))}
                </div>
              </div>

              {/* Scores */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <TrustRing score={c.trustScore} size={80} label="Trust Score" />
                <TrustRing score={c.proctorScore} size={80} label="Proctor AI" color="var(--amber-trust)" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '8px' }}>
                    <Star size={16} color={ratingColor(c.compositeRating)} fill={ratingColor(c.compositeRating)} />
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 800, color: ratingColor(c.compositeRating), lineHeight: 1 }}>
                      {c.compositeRating}
                    </span>
                  </div>
                  <div className="stat-label">Composite / 1000</div>
                  <div style={{ marginTop: '8px' }}>
                    <span className="badge badge-emerald">{c.sbtCount} SBTs Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── TWO COLUMNS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

            {/* Left — Certifications */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={15} color="var(--emerald-muted)" />
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Verified Certifications
                </h3>
                <span className="badge badge-emerald" style={{ marginLeft: 'auto' }}>{c.certifications.length} locked</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {c.certifications.map(cert => (
                  <SBTBadge key={cert.id} name={cert.name} issuer={cert.issuer} hash={cert.ipfsHash} sbtId={cert.sbtId} />
                ))}
                {c.certifications.length === 0 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No certifications uploaded.</p>
                )}
              </div>
            </div>

            {/* Right — Referrals */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <MessageSquare size={15} color="var(--amber-trust)" />
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Verified Referrals
                </h3>
                <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>{c.referrals.length} locked</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {c.referrals.map(ref => (
                  <div key={ref.id} style={{
                    padding: '12px 14px', borderRadius: '10px',
                    background: 'rgba(212,168,83,0.03)', border: '1px solid rgba(212,168,83,0.1)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ref.from}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={11} color="var(--amber-trust)" />
                        <span style={{ fontSize: '0.65rem', color: 'var(--amber-trust)', fontWeight: 600 }}>Verified</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{ref.role} · {ref.company}</div>
                    <code style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
                      IPFS: {ref.ipfsHash}
                    </code>
                  </div>
                ))}
                {c.referrals.length === 0 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No referrals submitted.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── GITHUB PULSE ── */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <GitBranch size={15} color="var(--text-secondary)" />
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                GitHub Pulse Tracker
              </h3>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div className="animate-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald-muted)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--emerald-muted)' }}>Live sync</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
              {[
                { icon: GitCommit, label: 'Commits (30d)', value: c.commits30d, color: 'var(--emerald-muted)' },
                { icon: GitPullRequest, label: 'Pull Requests', value: c.prs30d, color: 'var(--amber-trust)' },
                { icon: Star, label: 'OS Projects', value: c.openSourceProjects, color: '#818cf8' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{ padding: '16px', borderRadius: '10px', background: 'var(--obsidian-700)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <Icon size={18} color={color} style={{ marginBottom: '8px' }} />
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Activity bar graph */}
            <div>
              <div className="stat-label" style={{ marginBottom: '10px' }}>Commit Frequency (last 12 weeks)</div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '48px' }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const heights = [40, 60, 30, 80, 55, 90, 45, 70, 95, 65, 85, 100];
                  const pct = (heights[i] / 100) * 48;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <div style={{
                        height: `${pct}px`, borderRadius: '3px 3px 0 0',
                        background: i === 11 ? 'var(--emerald-muted)' : 'rgba(169,206,196,0.2)',
                        transition: 'height 0.5s ease',
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── ASSESSMENTS & VAULT ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '20px', marginBottom: '20px' }}>
            
            {/* Left: Assessments */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={15} color="#818cf8" />
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Sentinel Assessments
                </h3>
              </div>
              {c.assessments.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No assessments completed.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {c.assessments.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', borderRadius: '10px', background: 'var(--obsidian-700)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{a.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.date} · {a.duration}</div>
                        <div style={{ marginTop: '8px' }}>
                          <div className="progress-bar" style={{ marginBottom: '4px' }}>
                            <div className="progress-fill" style={{ width: `${(a.score / a.maxScore) * 100}%` }} />
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Score: {a.score}/{a.maxScore}</div>
                        </div>
                      </div>
                      <TrustRing score={a.proctorScore} size={52} strokeWidth={3} label="Proctor" color="var(--amber-trust)" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Protocol Verification (Vault) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <AegisVault sbtList={getVaultData().filter(s => s.owner === c.id)} isRecruiter={true} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
