'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, ChevronRight, GitBranch, Star, TrendingUp, X, Sparkles, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import TrustRing from '@/components/TrustRing';
import ActivityBadge from '@/components/ActivityBadge';
import { candidates, platformStats } from '@/lib/mockData';

const statCards = [
  { label: 'Total Candidates', value: platformStats.totalCandidates.toLocaleString(), delta: '+214 this week', positive: true },
  { label: 'Verified SBTs', value: platformStats.verifiedSBTs.toLocaleString(), delta: '+1,203 this week', positive: true },
  { label: 'Assessments Run', value: platformStats.assessmentsRun.toLocaleString(), delta: '+3,812 this month', positive: true },
  { label: 'Avg Trust Score', value: `${platformStats.avgTrustScore}%`, delta: '+0.3% vs last month', positive: true },
];

const filters = ['All', 'HyperActive', 'Learning', 'Dormant'];

export default function CommandCenter() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'recruiter' | 'candidate' | undefined>(undefined);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hello! I am Aegis Intelligence. I can analyze the talent pool or filter the dashboard for you. What role are you trying to fill?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/recruiter-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg })
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.ai) {
        setMessages(prev => [...prev, { role: 'ai', content: data.ai.reply }]);
        if (data.ai.filterString) {
           setSearch(data.ai.filterString);
        }
      } else {
        const errorMsg = res.status === 429 
          ? "DeepMind's AI quota reached. Please wait 1 minute before your next message."
          : (data.error || 'Aegis Intelligence is currently unavailable.');
        setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
      }
    } catch (err) {
       console.error("Chat Error:", err);
       setMessages(prev => [...prev, { role: 'ai', content: 'Connection to Aegis Intelligence lost. Check your API key or wait for quota reset.' }]);
    } finally {
      setIsTyping(false);
    }
  }

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

  const filtered = candidates.filter((c) => {
    const matchFilter = selectedFilter === 'All' || c.activityStatus === selectedFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const ratingColor = (r: number) => r >= 850 ? 'var(--emerald-muted)' : r >= 700 ? 'var(--amber-trust)' : '#9ca3af';

  if (!userRole) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian-black)' }}>
      <Sidebar role={userRole} />

      <div style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>
        <Topbar title="Recruiter Command Center" subtitle="Institutional talent intelligence dashboard" />

        <main style={{ padding: '28px 28px', maxWidth: '1200px' }}>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {statCards.map((s) => (
              <div key={s.label} className="card" style={{ padding: '18px' }}>
                <div className="stat-label" style={{ marginBottom: '8px' }}>{s.label}</div>
                <div className="stat-value" style={{ marginBottom: '6px' }}>{s.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={10} color="var(--emerald-muted)" />
                  <span style={{ fontSize: '0.7rem', color: 'var(--emerald-muted)' }}>{s.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', background: 'var(--obsidian-800)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px' }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, title, or skill..."
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Filter size={14} color="var(--text-muted)" style={{ alignSelf: 'center', marginRight: '4px' }} />
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', border: '1px solid',
                    background: selectedFilter === f ? 'rgba(169,206,196,0.1)' : 'transparent',
                    color: selectedFilter === f ? 'var(--emerald-muted)' : 'var(--text-muted)',
                    borderColor: selectedFilter === f ? 'rgba(169,206,196,0.25)' : 'var(--border-subtle)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 120px 110px 100px 80px 40px',
              padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)',
            }}>
              {['Candidate', 'Activity', 'Composite', 'Trust Score', 'GitHub Pulse', 'SBTs', ''].map(h => (
                <div key={h} className="stat-label" style={{ fontSize: '0.65rem' }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No candidates match your filters.
              </div>
            ) : (
              filtered.map((c, i) => (
                <Link key={c.id} href={`/truth-profile?id=${c.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 120px 110px 100px 80px 40px',
                      padding: '16px 20px',
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(169,206,196,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Name + title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                        background: 'var(--obsidian-700)', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-muted)',
                      }}>
                        {c.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '3px' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.title}</div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {c.skills.slice(0, 3).map(s => (
                            <span key={s} className="badge badge-ghost" style={{ fontSize: '0.58rem', padding: '1px 7px' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Activity */}
                    <ActivityBadge status={c.activityStatus} />

                    {/* Composite rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={13} color={ratingColor(c.compositeRating)} fill={ratingColor(c.compositeRating)} />
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: ratingColor(c.compositeRating) }}>
                        {c.compositeRating}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/1000</span>
                    </div>

                    {/* Trust */}
                    <TrustRing score={c.trustScore} size={52} strokeWidth={4} />

                    {/* GitHub */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                        <GitBranch size={11} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>{c.commits30d}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>commits</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{c.prs30d} PRs · {c.openSourceProjects} projects</div>
                    </div>

                    {/* SBTs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        {c.sbtCount} SBTs
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer note */}
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
            Composite Rating = (SBT Score × 0.35) + (Trust Score × 0.30) + (Proctor Score × 0.20) + (Activity Score × 0.15)
          </p>
        </main>
      </div>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setChatOpen(true)}
        style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '56px', height: '56px', borderRadius: '28px',
          background: 'var(--emerald-muted)', color: 'var(--obsidian-900)', border: 'none', cursor: 'pointer',
          display: chatOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(169,206,196,0.3)', zIndex: 100
        }}
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '380px', height: '540px', borderRadius: '16px',
          background: 'var(--obsidian-900)', border: '1px solid rgba(169,206,196,0.3)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 100
        }}>
          {/* header */}
          <div style={{ background: 'var(--obsidian-800)', borderBottom: '1px solid var(--border-subtle)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Sparkles size={16} color="var(--emerald-muted)" />
               <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Aegis Copilot</span>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
          </div>

          {/* messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                 <div style={{
                   background: m.role === 'user' ? 'rgba(169,206,196,0.1)' : 'var(--obsidian-800)',
                   border: `1px solid ${m.role === 'user' ? 'rgba(169,206,196,0.2)' : 'var(--border-subtle)'}`,
                   padding: '10px 14px', borderRadius: '12px', borderBottomRightRadius: m.role === 'user' ? '4px' : '12px',
                   borderBottomLeftRadius: m.role === 'ai' ? '4px' : '12px', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5
                 }}>
                   {m.content}
                 </div>
              </div>
            ))}
            {isTyping && (
               <div style={{ alignSelf: 'flex-start', background: 'var(--obsidian-800)', padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <Loader2 size={14} color="var(--emerald-muted)" style={{ animation: 'spin 1s linear infinite' }} />
               </div>
            )}
          </div>

          {/* input */}
          <div style={{ padding: '14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--obsidian-800)', display: 'flex', gap: '8px' }}>
             <input 
               value={chatInput} 
               onChange={e => setChatInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               placeholder="Chat with Aegis..."
               style={{ flex: 1, background: 'var(--obsidian-900)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
             />
             <button disabled={isTyping || !chatInput.trim()} onClick={handleSend} style={{ background: 'var(--emerald-muted)', color: 'var(--obsidian-900)', border: 'none', borderRadius: '8px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (isTyping || !chatInput.trim()) ? 0.5 : 1 }}>
                <ChevronRight size={18} strokeWidth={3} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
