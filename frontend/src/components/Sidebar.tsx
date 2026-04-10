'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, LayoutDashboard, UserCheck, FlaskConical,
  Settings, Activity, ChevronRight, Zap, LogOut, User, FileText
} from 'lucide-react';

const recruiterNav = [
  { href: '/command-center', label: 'Command Center', icon: LayoutDashboard },
  { href: '/truth-profile', label: 'Truth Profile', icon: UserCheck },
  { href: '/exam-results', label: 'Exam Results', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const candidateNav = [
  { href: '/candidate', label: 'My Dashboard', icon: User },
  { href: '/sentinel', label: 'Take Exam', icon: FlaskConical },
  { href: '/truth-profile', label: 'My Profile', icon: UserCheck },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  role?: 'recruiter' | 'candidate';
}

export default function Sidebar({ role = 'recruiter' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = role === 'candidate' ? candidateNav : recruiterNav;
  const accentColor = role === 'candidate' ? 'var(--amber-trust)' : 'var(--emerald-muted)';
  const accentBg = role === 'candidate' ? 'rgba(212,168,83,0.1)' : 'rgba(169,206,196,0.1)';
  const accentBorder = role === 'candidate' ? 'rgba(212,168,83,0.25)' : 'rgba(169,206,196,0.25)';

  function handleLogout() {
    sessionStorage.removeItem('aegis_user');
    router.push('/');
  }

  return (
    <aside style={{
      width: '220px', minHeight: '100vh',
      background: 'var(--obsidian-900)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px',
      position: 'fixed', top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '32px', display: 'block' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 4px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: accentBg, border: `1px solid ${accentBorder}`,
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={16} color={accentColor} />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              AEGIS
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Protocol
            </div>
          </div>
        </div>
      </Link>

      {/* Role badge */}
      <div style={{ padding: '6px 10px', borderRadius: '8px', background: accentBg, border: `1px solid ${accentBorder}`, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {role === 'candidate' ? <User size={11} color={accentColor} /> : <LayoutDashboard size={11} color={accentColor} />}
        <span style={{ fontSize: '0.65rem', color: accentColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {role === 'candidate' ? 'Candidate' : 'Recruiter'}
        </span>
      </div>

      {/* Section label */}
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 4px', marginBottom: '8px' }}>
        Navigation
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                borderRadius: '8px', border: '1px solid',
                borderColor: active ? (role === 'candidate' ? 'rgba(212,168,83,0.15)' : 'rgba(169,206,196,0.1)') : 'transparent',
                background: active ? accentBg : 'transparent',
                color: active ? accentColor : 'var(--text-muted)',
                fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(169,206,196,0.03)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
              >
                <Icon size={15} />
                <span style={{ flex: 1 }}>{label}</span>
                {active && <ChevronRight size={12} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ marginTop: 'auto' }}>
        <div className="divider" style={{ marginBottom: '16px' }} />

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(169,206,196,0.04)', marginBottom: '8px' }}>
          <Activity size={13} color="var(--emerald-muted)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--emerald-muted)', fontWeight: 600 }}>System Live</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>All services online</div>
          </div>
          <div className="animate-pulse-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--emerald-muted)', marginLeft: 'auto' }} />
        </div>

        {/* Plan badge */}
        <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.12)', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Zap size={11} color="var(--amber-trust)" />
            <span style={{ fontSize: '0.65rem', color: 'var(--amber-trust)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enterprise</span>
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>12,487 candidates indexed</div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px',
          borderRadius: '8px', background: 'transparent', border: '1px solid transparent',
          color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.05)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
