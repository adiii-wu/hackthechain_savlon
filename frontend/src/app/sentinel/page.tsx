'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Clock, CheckCircle2, XCircle, Camera, AlertTriangle, ChevronRight, Shield, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import TrustRing from '@/components/TrustRing';
import { sentinelQuestions } from '@/lib/mockData';

type Phase = 'intro' | 'exam' | 'results';

export default function Sentinel() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'recruiter' | 'candidate' | undefined>(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem('aegis_user');
    if (!raw) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(raw);
    setUserRole(parsed.role);
  }, [router]);

  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  
  const [generating, setGenerating] = useState(false);
  const [examQuestions, setExamQuestions] = useState(sentinelQuestions);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(sentinelQuestions.length).fill(null));

  const [timeLeft, setTimeLeft] = useState(60); // initialize with some default, will update when exam starts
  const [camActive, setCamActive] = useState(false);
  const [eyeWarnings, setEyeWarnings] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [proctorScore, setProctorScore] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = examQuestions[current];

  /* Timer countdown */
  useEffect(() => {
    if (phase !== 'exam') return;
    setTimeLeft(q.timeLimit);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleNext(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [current, phase]);

  /* Simulate eye-tracking warnings */
  useEffect(() => {
    if (phase !== 'exam') return;
    const id = setInterval(() => {
      if (Math.random() < 0.08) {
        setEyeWarnings(w => w + 1);
        setProctorScore(s => Math.max(60, s - 3));
      }
    }, 4000);
    return () => clearInterval(id);
  }, [phase]);

  /* Tab visibility warning */
  useEffect(() => {
    if (phase !== 'exam') return;
    const handler = () => {
      if (document.hidden) {
        setTabWarnings(w => w + 1);
        setProctorScore(s => Math.max(60, s - 5));
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [phase]);

  function handleNext(timedOut = false) {
    clearInterval(intervalRef.current!);
    const newAnswers = [...answers];
    newAnswers[current] = timedOut ? null : selected;
    setAnswers(newAnswers);
    setSelected(null);

    if (current < examQuestions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setPhase('results');
    }
  }

  async function startExam() {
    setGenerating(true);
    try {
      const res = await fetch('/api/exam-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'Senior Full Stack Engineer' }) // Typically derived from candidate profile
      });
      const data = await res.json();
      if (data.success && data.questions) {
         setExamQuestions(data.questions);
         setAnswers(Array(data.questions.length).fill(null));
      }
    } catch(e) {
      console.error(e);
    }
    setGenerating(false);
    setCamActive(true);
    setPhase('exam');
  }

  const score = answers.reduce<number>((sum, a, i) => (a === examQuestions[i]?.correct ? sum + 1 : sum), 0);
  const pct = Math.round((score / examQuestions.length) * 100);
  const finalProctor = proctorScore - eyeWarnings * 2 - tabWarnings * 4;

  if (!userRole) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian-black)' }}>
      <Sidebar role={userRole} />
      <div style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>
        <Topbar title="Sentinel AI Exam Room" subtitle="AI-proctored assessment platform" />

        <main style={{ padding: '28px', maxWidth: '900px', margin: '0 auto' }}>

          {/* ── INTRO ── */}
          {phase === 'intro' && (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 24px',
                background: 'rgba(169,206,196,0.08)', border: '1px solid rgba(169,206,196,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Shield size={32} color="var(--emerald-muted)" />
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>
                Sentinel Proctored Assessment
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                This assessment uses AI to monitor eye movements, tab switching, and facial orientation. Your <strong style={{ color: 'var(--emerald-muted)' }}>Proctor Trust Score</strong> is generated in real time.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', maxWidth: '560px', margin: '0 auto 36px', textAlign: 'left' }}>
                {[
                  { icon: Camera, label: 'Webcam Monitoring', desc: 'Facial orientation tracked' },
                  { icon: Eye, label: 'Eye Tracking', desc: 'Gaze detection active' },
                  { icon: Clock, label: 'Timed Questions', desc: 'Per-question time limits' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} style={{ padding: '14px', borderRadius: '10px', background: 'var(--obsidian-800)', border: '1px solid var(--border-subtle)' }}>
                    <Icon size={16} color="var(--emerald-muted)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={startExam} disabled={generating} style={{ fontSize: '0.95rem', padding: '12px 32px', opacity: generating ? 0.7 : 1 }}>
                {generating ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={16} />}
                {generating ? 'Compiling AI Exam...' : 'Start Proctored Exam'}
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                {examQuestions.length} questions · Mixed time limits · Webcam required
              </p>
            </div>
          )}

          {/* ── EXAM ── */}
          {phase === 'exam' && (
            <div>
              {/* Proctor bar */}
              <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 18px' }}>
                  {/* Cam preview */}
                  <div className="cam-frame cam-scan" style={{ width: '80px', height: '60px', background: 'var(--obsidian-700)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={20} color="var(--emerald-muted)" />
                  </div>
                  {/* Proctor stats */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div>
                        <div className="stat-label">Proctor Score</div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--emerald-muted)' }}>{proctorScore}%</div>
                      </div>
                      <div>
                        <div className="stat-label">Eye Warnings</div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: eyeWarnings > 0 ? 'var(--amber-trust)' : 'var(--text-primary)' }}>{eyeWarnings}</div>
                      </div>
                      <div>
                        <div className="stat-label">Tab Switches</div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: tabWarnings > 0 ? '#f87171' : 'var(--text-primary)' }}>{tabWarnings}</div>
                      </div>
                    </div>
                    {eyeWarnings > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                        <AlertTriangle size={11} color="var(--amber-trust)" />
                        <span style={{ fontSize: '0.7rem', color: 'var(--amber-trust)' }}>Eye movement warning detected</span>
                      </div>
                    )}
                  </div>
                  {/* Timer */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: timeLeft <= 10 ? '#f87171' : 'var(--text-primary)', lineHeight: 1 }}>
                      {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                    </div>
                    <div className="stat-label">Time Left</div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                {examQuestions.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < current ? 'var(--emerald-muted)' : i === current ? 'rgba(169,206,196,0.4)' : 'var(--obsidian-600)' }} />
                ))}
              </div>

              {/* Question card */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span className="badge badge-ghost">Question {current + 1} of {examQuestions.length}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.timeLimit}s limit</span>
                </div>

                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '24px' }}>
                  {q.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelected(idx)}
                      style={{
                        textAlign: 'left', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                        background: selected === idx ? 'rgba(169,206,196,0.08)' : 'var(--obsidian-700)',
                        border: `1px solid ${selected === idx ? 'rgba(169,206,196,0.3)' : 'var(--border-subtle)'}`,
                        color: selected === idx ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '0.875rem', lineHeight: 1.5, transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: selected === idx ? 'var(--emerald-muted)' : 'var(--text-muted)', marginRight: '10px' }}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-primary"
                  onClick={() => handleNext(false)}
                  disabled={selected === null}
                  style={{ opacity: selected === null ? 0.4 : 1, cursor: selected === null ? 'not-allowed' : 'pointer' }}
                >
                  {current < examQuestions.length - 1 ? 'Next Question' : 'Submit Exam'}
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {phase === 'results' && (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '32px' }}>
                Assessment Complete
              </h2>

              <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
                <TrustRing score={pct} size={110} strokeWidth={6} label="Knowledge Score" />
                <TrustRing score={Math.max(60, finalProctor)} size={110} strokeWidth={6} label="Proctor Score" color="var(--amber-trust)" />
              </div>

              <div style={{ maxWidth: '560px', margin: '0 auto 32px' }}>
                <div className="card" style={{ textAlign: 'left' }}>
                  <div className="stat-label" style={{ marginBottom: '14px' }}>Question Breakdown</div>
                  {examQuestions.map((q, i) => {
                    const correct = answers[i] === q.correct;
                    const notAnswered = answers[i] === null;
                    return (
                      <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < examQuestions.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                        {notAnswered ? (
                          <Clock size={15} color="var(--text-muted)" />
                        ) : correct ? (
                          <CheckCircle2 size={15} color="var(--emerald-muted)" />
                        ) : (
                          <XCircle size={15} color="#f87171" />
                        )}
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', flex: 1 }}>
                          Q{i + 1}: {q.question?.slice(0, 60) || ''}...
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: notAnswered ? 'var(--text-muted)' : correct ? 'var(--emerald-muted)' : '#f87171' }}>
                          {notAnswered ? 'Timed out' : correct ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                  SBT will be minted for this result
                </div>
                <button className="btn-ghost" onClick={() => { setPhase('intro'); setCurrent(0); setAnswers(Array(examQuestions.length).fill(null)); setProctorScore(100); setEyeWarnings(0); setTabWarnings(0); }}>
                  Retake Exam
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
