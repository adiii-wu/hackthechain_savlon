'use client';
import { CheckCircle2, Lock } from 'lucide-react';

interface SBTBadgeProps {
  hash: string;
  sbtId: string;
  name: string;
  issuer: string;
}

export default function SBTBadge({ hash, sbtId, name, issuer }: SBTBadgeProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px 14px', borderRadius: '10px',
      background: 'rgba(169, 206, 196, 0.03)',
      border: '1px solid rgba(169, 206, 196, 0.1)',
    }}>
      <div style={{
        width: '32px', height: '32px', flexShrink: 0,
        background: 'rgba(169, 206, 196, 0.08)',
        border: '1px solid rgba(169, 206, 196, 0.2)',
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Lock size={13} color="var(--emerald-muted)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>Polygon</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={11} color="var(--emerald-muted)" />
              <span style={{ fontSize: '0.65rem', color: 'var(--emerald-muted)', fontWeight: 600 }}>Verified</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{issuer}</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <code style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
            {hash}
          </code>
          <code style={{ fontSize: '0.6rem', color: 'var(--emerald-dim)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(169, 206, 196, 0.06)', padding: '2px 6px', borderRadius: '4px' }}>
            {sbtId}
          </code>
        </div>
      </div>
    </div>
  );
}
