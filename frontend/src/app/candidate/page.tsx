'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Award, FlaskConical, GitBranch, CheckCircle2, Lock, Star, ArrowUpRight, AlertCircle, FileText, Clock, X, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import TrustRing from '@/components/TrustRing';
import ActivityBadge from '@/components/ActivityBadge';
import SBTBadge from '@/components/SBTBadge';
import AegisVault from '@/components/AegisVault';
import { candidates } from '@/lib/mockData';
import { getVaultData, mintSBT } from '@/lib/blockchain';
import { addCertToProfile } from '@/lib/mockData';

interface SessionUser {
  username: string;
  email: string;
  role: string;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  // Fetch session
  useEffect(() => {
    const raw = sessionStorage.getItem('aegis_user');
    if (!raw) { router.push('/'); return; }
    const parsed: SessionUser = JSON.parse(raw);
    if (parsed.role !== 'candidate') { router.push('/command-center'); return; }
    
    // Dynamically update the mock candidate identity to match the session
    candidates[0].name = parsed.username;
    candidates[0].avatar = parsed.username.slice(0, 2).toUpperCase();
    
    setUser(parsed);
  }, [router]);

  const [profile, setProfile] = useState(candidates[0]);
  const [showModal, setShowModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!certName.trim()) return;
    setUploading(true);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: profile.id,
          certName,
          issuer
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Mint on Blockchain (Simulation)
        const mintedSBT = await mintSBT(profile.id, certName, data.certificate.ipfsHash || "QmXoyp...MOCK");
        
        // Global persistence
        const certObj = {
          ...data.certificate,
          sbtId: mintedSBT.tokenId
        };
        addCertToProfile(profile.id, certObj);

        setProfile(prev => ({
          ...prev,
          certifications: [certObj, ...prev.certifications],
          assessments: [data.assignedExam, ...prev.assessments]
        }));
        setShowModal(false);
        setCertName('');
        setIssuer('');
        setSelectedFile(null);
      }
    } catch(e) {
       console.error(e);
    }
    setUploading(false);
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian-black)' }}>
      <Sidebar role="candidate" />
      <div style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>
        <Topbar title="My Dashboard" subtitle={`Welcome back, ${user.username}`} />

        <main style={{ padding: '28px', maxWidth: '1100px' }}>

          {/* ── PROFILE HERO ── */}
          <div className="card" style={{ marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '180px', background: 'radial-gradient(ellipse at top right, rgba(212,168,83,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{
                width: '68px', height: '68px', borderRadius: '16px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.05))',
                border: '1px solid rgba(212,168,83,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--amber-trust)',
              }}>
                {user.username.slice(0, 2).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.username}</h2>
                  <ActivityBadge status={profile.activityStatus} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{user.email}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{profile.title}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {profile.skills.map(s => (
                    <span key={s} className="badge badge-ghost">{s}</span>
                  ))}
                </div>
              </div>

              {/* Scores */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <TrustRing score={profile.trustScore} size={74} label="Trust Score" />
                <TrustRing score={profile.proctorScore} size={74} label="Proctor AI" color="var(--amber-trust)" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', marginBottom: '6px' }}>
                    <Star size={15} color="var(--emerald-muted)" fill="var(--emerald-muted)" />
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-muted)', lineHeight: 1 }}>
                      {profile.compositeRating}
                    </span>
                  </div>
                  <div className="stat-label">Composite / 1000</div>
                  <div style={{ marginTop: '6px' }}>
                    <span className="badge badge-emerald">{profile.sbtCount} SBTs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { icon: FlaskConical, label: 'Take Sentinel Exam', desc: 'Get AI-proctored & earn SBT', href: '/sentinel', color: 'var(--emerald-muted)', bg: 'rgba(169,206,196,0.06)', border: 'rgba(169,206,196,0.15)' },
              { icon: Upload, label: 'Upload Certificate', desc: 'Lock it to IPFS + blockchain', href: '#upload', color: 'var(--amber-trust)', bg: 'rgba(212,168,83,0.06)', border: 'rgba(212,168,83,0.15)', onClick: () => setShowModal(true) },
              { icon: GitBranch, label: 'Connect GitHub', desc: 'Enable live Pulse tracking', href: '#github', color: '#818cf8', bg: 'rgba(129,140,248,0.06)', border: 'rgba(129,140,248,0.15)' },
            ].map(({ icon: Icon, label, desc, href, color, bg, border, onClick }) => {
              const innerContent = (
                <div style={{ padding: '18px', borderRadius: '12px', background: bg, border: `1px solid ${border}`, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  onClick={onClick}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <Icon size={18} color={color} />
                    <ArrowUpRight size={13} color={color} style={{ opacity: 0.6 }} />
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              );
              
              if (onClick) {
                return <div key={label}>{innerContent}</div>;
              }
              return (
                <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                  {innerContent}
                </Link>
              );
            })}
          </div>

          {/* ── TWO COLUMNS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '20px', marginBottom: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Aegis Vault (Blockchain View) */}
              <AegisVault sbtList={getVaultData().filter(s => s.owner === profile.id)} />

              {/* Upcoming / Assessments */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <FlaskConical size={14} color="var(--amber-trust)" />
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>My Assessments</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {profile.assessments.map(a => (
                    <div key={a.id} style={{ padding: '12px', borderRadius: '10px', background: 'var(--obsidian-700)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</span>
                        <TrustRing score={a.proctorScore} size={40} strokeWidth={3} color="var(--amber-trust)" />
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{a.date} · {a.duration}</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(a.score / a.maxScore) * 100}%` }} />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>Score: {a.score}/{a.maxScore}</div>
                    </div>
                  ))}
                </div>
                <Link href="/sentinel" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', marginTop: '14px', justifyContent: 'center' }}>
                    <FlaskConical size={13} />
                    Take New Assessment
                  </button>
                </Link>
              </div>
            </div>

            {/* Certifications (Standard List) */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={14} color="var(--emerald-muted)" />
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>My Certifications</h3>
                <span className="badge badge-emerald" style={{ marginLeft: 'auto' }}>{profile.certifications.length} locked</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.certifications.map(cert => (
                  <SBTBadge key={cert.id} name={cert.name} issuer={cert.issuer} hash={cert.ipfsHash} sbtId={cert.sbtId} />
                ))}
              </div>
              <button 
                onClick={() => setShowModal(true)}
                style={{ width: '100%', marginTop: '14px', padding: '10px', borderRadius: '8px', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-active)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}>
                <Upload size={12} />
                Upload new certificate
              </button>
            </div>

          </div>

          {/* ── ALERTS / TO-DO ── */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <AlertCircle size={14} color="var(--amber-trust)" />
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Action Items</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: FileText, text: 'Upload your latest employer referral to get it blockchain-verified', done: false, color: 'var(--amber-trust)' },
                { icon: GitBranch, text: 'Connect GitHub to activate live Pulse Tracker', done: false, color: '#818cf8' },
                { icon: CheckCircle2, text: 'AWS Certification SBT confirmed on-chain', done: true, color: 'var(--emerald-muted)' },
                { icon: Clock, text: 'System Design assessment available — complete to boost composite score', done: false, color: 'var(--text-muted)' },
              ].map(({ icon: Icon, text, done, color }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: done ? 'rgba(169,206,196,0.03)' : 'var(--obsidian-700)', border: `1px solid ${done ? 'rgba(169,206,196,0.08)' : 'var(--border-subtle)'}`, opacity: done ? 0.6 : 1 }}>
                  <Icon size={13} color={color} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: done ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
                  {done && <CheckCircle2 size={13} color="var(--emerald-muted)" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── UPLOAD MODAL ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
               <X size={16} />
            </button>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Upload Certificate</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Upload a file, and Aegis AI will parsing it, issue an SBT, and assign a Sentinel placement exam.</p>
            
            <div style={{ marginBottom: '16px' }}>
               <div style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certificate File</div>
               <label style={{ display: 'block', border: `1px dashed ${selectedFile ? 'var(--emerald-muted)' : 'var(--border-subtle)'}`, padding: '20px', borderRadius: '8px', textAlign: 'center', background: 'var(--obsidian-800)', cursor: 'pointer' }}>
                  <input type="file" style={{ display: 'none' }} accept=".pdf,image/*" onChange={e => e.target.files && setSelectedFile(e.target.files[0])} />
                  <Upload size={18} color={selectedFile ? "var(--emerald-muted)" : "var(--text-muted)"} style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.8rem', color: selectedFile ? 'var(--emerald-muted)' : 'var(--text-primary)' }}>
                     {selectedFile ? selectedFile.name : 'Click to upload PDF or image'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Max size 5MB</div>
               </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
               <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certificate Name / Skill</label>
               <input 
                  type="text" 
                  value={certName}
                  onChange={e => setCertName(e.target.value)}
                  placeholder="e.g. AWS Solutions Architect"
                  style={{ width: '100%', background: 'var(--obsidian-800)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
               />
            </div>

            <div style={{ marginBottom: '24px' }}>
               <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issuing Organization</label>
               <input 
                  type="text" 
                  value={issuer}
                  onChange={e => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  style={{ width: '100%', background: 'var(--obsidian-800)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
               />
            </div>

             <button 
               onClick={handleUpload}
               disabled={uploading || !certName.trim() || !selectedFile}
               style={{
                  width: '100%', padding: '12px', borderRadius: '8px', border: 'none', cursor: uploading || !certName.trim() || !selectedFile ? 'not-allowed' : 'pointer',
                  background: 'var(--emerald-muted)', color: 'var(--obsidian-900)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: uploading || !certName.trim() || !selectedFile ? 0.6 : 1
               }}
            >
               {uploading ? (
                 <>
                   <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                   Processing with AI...
                 </>
               ) : (
                 'Extract, Hash & Assign Exam'
               )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
