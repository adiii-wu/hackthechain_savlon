'use client';
import { useState } from 'react';
import { ShieldCheck, Database, Zap, Lock, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { SBTMetadata, verifyOnChain } from '@/lib/blockchain';

interface AegisVaultProps {
  sbtList: SBTMetadata[];
  isRecruiter?: boolean;
}

export default function AegisVault({ sbtList, isRecruiter = false }: AegisVaultProps) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  async function handleVerify(tokenId: string) {
    setVerifyingId(tokenId);
    const result = await verifyOnChain(tokenId);
    setVerificationResult(result);
    // Auto-clear after a few seconds or on next click
  }

  return (
    <div className="card" style={{ 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--obsidian-800), var(--obsidian-900))',
      border: '1px solid rgba(169,206,196,0.15)'
    }}>
      {/* Decorative Blur */}
      <div style={{ 
        position: 'absolute', top: -50, right: -50, width: 200, height: 200, 
        background: 'rgba(169,206,196,0.05)', borderRadius: '50%', filter: 'blur(60px)' 
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(169,206,196,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ShieldCheck size={18} color="var(--emerald-muted)" />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Aegis Vault <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '6px' }}>Protocol: AV-721S</span>
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{isRecruiter ? 'Protocol-level verification' : 'Secure soulbound assets on Polygon'}</p>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
             <div className="badge badge-emerald" style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={10} fill="currentColor" /> Polygon Mainnet
             </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sbtList.map((sbt) => (
          <div key={sbt.tokenId} style={{ 
            padding: '16px', borderRadius: '12px', background: 'var(--obsidian-700)', 
            border: '1px solid var(--border-subtle)', position: 'relative' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{sbt.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Token ID: #{sbt.tokenId} · Issued by Aegis Authority</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: 'var(--emerald-muted)', fontWeight: 600, marginBottom: '2px' }}>
                  <Lock size={10} /> Soulbound
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{sbt.issuedAt}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase' }}>TX Hash</div>
                    <code style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{sbt.transactionHash}</code>
                </div>
                <button 
                  onClick={() => handleVerify(sbt.tokenId)}
                  disabled={verifyingId === sbt.tokenId}
                  style={{
                    padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--emerald-muted)',
                    background: verifyingId === sbt.tokenId ? 'transparent' : 'rgba(169,206,196,0.05)',
                    color: 'var(--emerald-muted)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                  }}
                >
                  {verifyingId === sbt.tokenId ? (
                    <RefreshCw size={12} style={{ animation: 'spin 2s linear infinite' }} />
                  ) : (
                    <Database size={12} />
                  )}
                  {isRecruiter ? 'Full Audit' : 'On-chain Refresh'}
                </button>
            </div>

            {verificationResult && verifyingId === sbt.tokenId && (
              <div style={{ 
                marginTop: '12px', padding: '10px', borderRadius: '8px', 
                background: 'rgba(169,206,196,0.08)', border: '1px solid rgba(169,206,196,0.15)',
                display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease'
              }}>
                 <ShieldCheck size={16} color="var(--emerald-muted)" />
                 <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>Polygon Network Consensus Reached</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Source of truth: {verificationResult.contract}</div>
                 </div>
              </div>
            )}
          </div>
        ))}

        {sbtList.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
             Vault is currently empty. Complete an assessment to mint your first VeriCert.
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={12} color="var(--text-muted)" />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Protocol v2.1 (SBT Consensus)</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
             View Contract <ExternalLink size={10} />
          </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
