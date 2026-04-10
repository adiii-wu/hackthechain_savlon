'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import TrustRing from '@/components/TrustRing';
import { candidates } from '@/lib/mockData';

export default function ExamResults() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'recruiter' | 'candidate' | undefined>(undefined);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('aegis_user');
    if (!raw) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(raw);
    if (parsed.role !== 'recruiter') {
      router.push('/candidate');
      return;
    }
    setUserRole(parsed.role);
  }, [router]);

  // Flatten the candidate assessments
  const allResults = candidates.flatMap(c => 
    c.assessments.map(a => ({
      candidateId: c.id,
      candidateName: c.name,
      candidateTitle: c.title,
      candidateAvatar: c.avatar,
      ...a
    }))
  ).filter(r => r.candidateName.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase()));

  if (!userRole) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian-black)' }}>
      <Sidebar role={userRole} />

      <div style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>
        <Topbar title="Exam Results" subtitle="Track candidate performance on Sentinel AI proctored exams" />

        <main style={{ padding: '24px 32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recent Assessments
            </h2>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--obsidian-800)', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', padding: '8px 14px', width: '280px',
            }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search candidate or exam..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--obsidian-800)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate & Exam</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Duration</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Raw Score</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Proctor AI Confidence</th>
                </tr>
              </thead>
              <tbody>
                {allResults.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No results found
                    </td>
                  </tr>
                ) : allResults.map((r, i) => (
                  <tr key={`${r.candidateId}-${r.id}`} style={{ borderBottom: i === allResults.length - 1 ? 'none' : '1px solid var(--border-subtle)', transition: 'background 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(169,206,196,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, rgba(169,206,196,0.15), rgba(169,206,196,0.05))',
                          border: '1px solid rgba(169,206,196,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-muted)'
                        }}>
                          {r.candidateAvatar}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.candidateName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '3px' }}>{r.date}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.duration}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.score}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {r.maxScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                         <TrustRing score={r.proctorScore} size={42} strokeWidth={4} />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
