'use client';
import { Suspense } from 'react';
import TruthProfileContent from './TruthProfileContent';

export default function TruthProfile() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Loading profile...</div>}>
      <TruthProfileContent />
    </Suspense>
  );
}
