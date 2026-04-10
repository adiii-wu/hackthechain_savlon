'use client';
import { Activity, Zap, Moon } from 'lucide-react';

type Status = 'HyperActive' | 'Learning' | 'Dormant';

const statusConfig: Record<Status, { icon: typeof Activity; color: string; bg: string; border: string; label: string }> = {
  HyperActive: {
    icon: Zap,
    color: 'var(--emerald-muted)',
    bg: 'rgba(169, 206, 196, 0.08)',
    border: 'rgba(169, 206, 196, 0.2)',
    label: 'Hyper-Active',
  },
  Learning: {
    icon: Activity,
    color: 'var(--amber-trust)',
    bg: 'rgba(212, 168, 83, 0.08)',
    border: 'rgba(212, 168, 83, 0.2)',
    label: 'Learning',
  },
  Dormant: {
    icon: Moon,
    color: '#9ca3af',
    bg: 'rgba(156, 163, 175, 0.06)',
    border: 'rgba(156, 163, 175, 0.15)',
    label: 'Dormant',
  },
};

interface ActivityBadgeProps {
  status: Status;
  showLabel?: boolean;
}

export default function ActivityBadge({ status, showLabel = true }: ActivityBadgeProps) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      <div style={{ position: 'relative' }}>
        <Icon size={10} color={cfg.color} />
        {status === 'HyperActive' && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            width: '4px', height: '4px', borderRadius: '50%',
            background: cfg.color, animation: 'pulse-dot 2s infinite',
          }} />
        )}
      </div>
      {showLabel && (
        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {cfg.label}
        </span>
      )}
    </div>
  );
}
