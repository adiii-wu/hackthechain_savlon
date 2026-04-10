'use client';
import { useEffect, useState } from 'react';
import { Bell, Search, ChevronDown, User } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

interface SessionUser {
  username: string;
  email: string;
  role: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('aegis_user');
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  return (
    <header style={{
      height: '60px',
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Left */}
      <div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>{subtitle}</p>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--obsidian-800)', border: '1px solid var(--border-subtle)',
          borderRadius: '8px', padding: '6px 12px', width: '200px',
        }}>
          <Search size={13} color="var(--text-muted)" />
          <input
            placeholder="Search candidates..."
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.8rem', width: '100%' }}
          />
        </div>

        {/* Notifications */}
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
          <Bell size={17} />
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--emerald-muted)', border: '1px solid var(--obsidian-900)',
          }} />
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: user?.role === 'candidate' 
              ? 'linear-gradient(135deg, var(--amber-trust), var(--amber-dim))'
              : 'linear-gradient(135deg, var(--emerald-muted), var(--emerald-dim))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: 'var(--obsidian-900)',
          }}>
            {user ? user.username.slice(0, 2).toUpperCase() : <User size={14} color="var(--obsidian-900)" />}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user ? user.username : 'Guest'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user ? user.role : 'Unknown Role'}
            </div>
          </div>
          <ChevronDown size={12} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
}
