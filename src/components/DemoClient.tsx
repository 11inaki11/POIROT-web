'use client';

import React, { useState, useRef, useEffect } from 'react';
import PhaseVectorSpace from './PhaseVectorSpace';
import PhaseIndividualAnalysis from './PhaseIndividualAnalysis';
import PhasePeerConsultation from './PhasePeerConsultation';
import PhaseConsensusVoting from './PhaseConsensusVoting';

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */
interface ChatMessage {
    id: number;
    sender: string;
    type: string;
    content: string;
    timestamp?: string;
}

interface DemoData {
    system: string;
    system_domain?: string;
    attempt_id: string;
    metadata: Record<string, string>;
    chat_logs: ChatMessage[];
    voting_data: any;
    agent_votes?: any[];
    individual_reports?: any[];
    peer_consultations?: any[];
    dimension_labels?: string[];
    phases: Record<string, string>;
    phase1_example?: any;
}

interface DemoClientProps {
    data: DemoData;
    cases?: { id: string; label: string }[];
    selectedCaseId?: string;
    onCaseChange?: (id: string) => void;
}

/* ═══════════════════════════════════════════════════════
   Phase Indicator
   ═══════════════════════════════════════════════════════ */
const PHASE_DEFS = [
    { id: 0, label: 'System Overview', icon: '📋' },
    { id: 1, label: 'Phase 1: Vector Space', icon: '🎯' },
    { id: 2, label: 'Phase 2: Individual Analysis', icon: '🔍' },
    { id: 3, label: 'Phase 3: Peer Consultation', icon: '💬' },
    { id: 4, label: 'Phase 4: Consensus Voting', icon: '🗳️' },
];

function PhaseIndicator({ current, setCurrent }: { current: number; setCurrent: (p: number) => void }) {
    return (
        <div className="phase-bar">
            {PHASE_DEFS.map((p, i) => (
                <React.Fragment key={p.id}>
                    {i > 0 && <div className="phase-connector" />}
                    <button
                        className={`phase-step ${current === p.id ? 'active' : ''}`}
                        onClick={() => setCurrent(p.id)}
                    >
                        <span className="phase-num">{p.icon}</span>
                        {p.label}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   Vector Grid
   ═══════════════════════════════════════════════════════ */
function VectorGrid({ vector, labels, title }: { vector: number[]; labels?: string[]; title?: string }) {
    return (
        <div>
            {title && <h3 className="section-heading">{title}</h3>}
            <div className="vector-grid">
                {vector.map((v, i) => (
                    <div key={i} className={`vector-cell ${v === 1 ? 'active' : 'inactive'}`}>
                        <span className="cell-value">{v}</span>
                        <span style={{ fontSize: '0.68rem', marginTop: 2 }}>
                            {labels?.[i] ?? `Dim ${i + 1}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   Chat Log
   ═══════════════════════════════════════════════════════ */
const MAX_BUBBLE = 400;

function ChatBubble({ msg }: { msg: ChatMessage }) {
    const [expanded, setExpanded] = useState(false);
    const roleClass = msg.type === 'HUMAN' || msg.type === 'HumanMessage'
        ? 'human'
        : msg.type === 'TOOL' || msg.type === 'ToolMessage'
            ? 'tool'
            : 'agent';

    const initials = msg.sender
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const long = msg.content.length > MAX_BUBBLE;
    const text = long && !expanded ? msg.content.slice(0, MAX_BUBBLE) + '…' : msg.content;

    return (
        <div className={`chat-msg ${roleClass}`}>
            <div className={`chat-avatar ${roleClass}`}>{initials}</div>
            <div>
                <div className="chat-sender">{msg.sender}</div>
                <div className="chat-bubble">{text}</div>
                {long && (
                    <button className="chat-expand-btn" onClick={() => setExpanded(!expanded)}>
                        {expanded ? '▲ Show less' : '▼ Show more'}
                    </button>
                )}
            </div>
        </div>
    );
}

function ChatLog({ messages }: { messages: ChatMessage[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(15);

    if (!messages || messages.length === 0) {
        return (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
                No chat messages available for this phase.
            </div>
        );
    }

    const displayed = messages.slice(0, visibleCount);
    const hasMore = visibleCount < messages.length;

    return (
        <div>
            <div className="chat-container" ref={containerRef}>
                {displayed.map((msg) => (
                    <ChatBubble key={msg.id} msg={msg} />
                ))}
            </div>
            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setVisibleCount((c) => c + 15)}>
                        Load more ({messages.length - visibleCount} remaining)
                    </button>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   Voting Bars
   ═══════════════════════════════════════════════════════ */
function VotingBars({ votingData, labels }: { votingData: any; labels?: string[] }) {
    // Extract dimension_probabilities or similar from voting_data
    const probs: number[] =
        votingData?.dimension_probabilities ??
        votingData?.scores ??
        votingData?.final_scores ??
        [];

    if (!probs || probs.length === 0) {
        return (
            <div style={{ padding: 16, color: 'var(--text-muted)' }}>
                No voting dimension data available.
            </div>
        );
    }

    const max = Math.max(...probs, 1);

    return (
        <div className="vote-bar-container">
            {probs.map((score: number, i: number) => (
                <div className="vote-bar-row" key={i}>
                    <div className="vote-bar-label">{labels?.[i] ?? `Dimension ${i + 1}`}</div>
                    <div className="vote-bar-track">
                        <div
                            className="vote-bar-fill"
                            style={{ width: `${(score / max) * 100}%` }}
                        />
                    </div>
                    <div className="vote-bar-value">{typeof score === 'number' ? score.toFixed(2) : score}</div>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   Metrics Row
   ═══════════════════════════════════════════════════════ */
function MetricsRow({ metadata }: { metadata: Record<string, string> }) {
    const metrics: Array<{ label: string; value: string; color?: string }> = [];

    // Only show tokens and detection status, NOT precision/recall/f1
    if (metadata.total_input_tokens) metrics.push({ label: 'Input Tokens', value: Number(metadata.total_input_tokens).toLocaleString() });
    if (metadata.total_output_tokens) metrics.push({ label: 'Output Tokens', value: Number(metadata.total_output_tokens).toLocaleString() });
    if (metadata.error_vector_detected) metrics.push({
        label: 'Detection',
        value: metadata.error_vector_detected === 'True' ? '✓ Detected' : '✗ Missed',
        color: metadata.error_vector_detected === 'True' ? 'var(--teal)' : 'var(--pink)'
    });

    if (metrics.length === 0) return null;

    return (
        <div className="metrics-row">
            {metrics.map((m, i) => (
                <div className="metric-card" key={i}>
                    <div className="metric-value" style={{ color: m.color || 'var(--text-primary)' }}>
                        {m.value}
                    </div>
                    <div className="metric-label">{m.label}</div>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   Agent Vote Cards
   ═══════════════════════════════════════════════════════ */
function AgentVoteCards({ votes }: { votes: any[] }) {
    if (!votes || votes.length === 0) return null;

    const colors = ['var(--pink)', 'var(--purple)', 'var(--cyan)', 'var(--teal)', 'var(--coral)'];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {votes.map((v, i) => (
                <div className="agent-card" key={i}>
                    <div className="agent-card-header">
                        <div className="agent-icon" style={{ background: colors[i % colors.length] }}>
                            {(v.agent_name || `A${i}`).slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="agent-name">{v.agent_name || `Agent ${i + 1}`}</div>
                            <div className="agent-role">Weight: {v.vote_weight ?? 1.0}</div>
                        </div>
                    </div>
                    {v.hazard_vector && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            <strong>Hazard:</strong> {v.hazard_vector}
                        </div>
                    )}
                    {v.voted_location && v.voted_location.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {v.voted_location.map((dim: number, j: number) => (
                                <span key={j} className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                                    Dim {dim}
                                </span>
                            ))}
                        </div>
                    )}
                    {v.justification && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
                            {v.justification.slice(0, 200)}{v.justification.length > 200 ? '…' : ''}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   GT vs Predicted comparison
   ═══════════════════════════════════════════════════════ */
function VectorComparison({
    gt, predicted, labels
}: { gt: number[]; predicted: number[]; labels?: string[] }) {
    if (!gt || !predicted) return null;

    return (
        <div>
            <h3 className="section-heading">Ground Truth vs Predicted</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6 }}>
                {gt.map((gv, i) => {
                    const pv = predicted[i] ?? 0;
                    const match = gv === pv;
                    const isTP = gv === 1 && pv === 1;
                    const isFP = gv === 0 && pv === 1;
                    const isFN = gv === 1 && pv === 0;
                    const bg = isTP ? '#dcfce7' : isFP ? '#fff7ed' : isFN ? '#fce7f3' : 'var(--surface-alt)';
                    const border = isTP ? '#86efac' : isFP ? '#fdba74' : isFN ? '#f9a8d4' : 'var(--border)';
                    const label = isTP ? 'TP' : isFP ? 'FP' : isFN ? 'FN' : 'TN';

                    return (
                        <div
                            key={i}
                            style={{
                                padding: '8px 4px',
                                borderRadius: 10,
                                background: bg,
                                border: `1.5px solid ${border}`,
                                textAlign: 'center',
                                fontSize: '0.72rem',
                                minHeight: 64,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: 2 }}>
                                {gv}→{pv}
                            </div>
                            <span className={`badge ${isTP ? 'badge-success' : isFP ? 'badge-info' : isFN ? 'badge-danger' : ''}`}
                                style={{ fontSize: '0.6rem', justifyContent: 'center' }}>
                                {label}
                            </span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                {labels?.[i] ?? `D${i + 1}`}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   System Overview
   ═══════════════════════════════════════════════════════ */
const SYSTEM_INFO: Record<string, {
    icon: string;
    domain: string;
    description: string;
    purpose: string;
    agents: { name: string; icon: string; role: string }[];
    accentColor: string;
    bgColor: string;
    borderColor: string;
}> = {
    CORTEX: {
        icon: '🏥',
        domain: 'Medical Robotics — Pediatric Exoskeleton Rehabilitation',
        description: 'CORTEX is a multi-agent clinical decision system that evaluates whether a child with cerebral palsy is ready for a rehabilitation session with the Discover2Walk exoskeleton — a wearable robotic device designed to assist gait in pediatric patients.',
        purpose: 'Before each session, a panel of medical specialist agents reviews the patient\'s current clinical status and exchanges structured assessments to reach a joint go/no-go recommendation. POIROT is applied to detect whether any agent\'s reasoning has been compromised by injected erroneous information.',
        agents: [
            { name: 'Diagnosis Doctor', icon: '🩺', role: 'Reviews clinical diagnosis, current symptoms, and contraindications for exoskeleton use' },
            { name: 'Chief of Rehabilitation', icon: '🦾', role: 'Evaluates exoskeleton readiness, session parameters, and therapeutic goals' },
            { name: 'General Physiotherapist', icon: '🏃', role: 'Assesses motor function, muscle tone, and progress since last session' },
        ],
        accentColor: '#ec4899',
        bgColor: 'rgba(236,72,153,0.05)',
        borderColor: 'rgba(236,72,153,0.3)',
    },
    TradingAgents: {
        icon: '💹',
        domain: 'Financial Markets — LLM-Powered Stock Trading',
        description: 'TradingAgents is an open-source framework where a panel of LLM-powered financial analysts collaboratively evaluate market conditions for a given stock and time window, producing a final investment recommendation (buy/hold/sell).',
        purpose: 'Each analyst brings a different analytical lens — from technical chart patterns to macroeconomic fundamentals. Agents share their analyses and debate before reaching consensus. POIROT detects when one agent\'s reasoning has been manipulated with false or inverted market data.',
        agents: [
            { name: 'Market Analyst', icon: '📊', role: 'Synthesizes overall market trends, sector performance, and macro conditions' },
            { name: 'Bull Researcher', icon: '📈', role: 'Constructs the bullish case with supporting evidence for upside potential' },
            { name: 'Bear Researcher', icon: '📉', role: 'Argues the bearish case and identifies downside risks and red flags' },
            { name: 'News Analyst', icon: '📰', role: 'Extracts trading signals from recent news articles and press releases' },
            { name: 'Fundamentals Analyst', icon: '🏦', role: 'Evaluates financial statements, earnings, valuations, and company health' },
            { name: 'Social Media Analyst', icon: '💬', role: 'Monitors retail investor sentiment, trending tickers, and viral narratives' },
            { name: 'Risk Manager', icon: '⚠️', role: 'Assesses portfolio risk, position sizing, and downside protection strategies' },
            { name: 'Technical Analyst', icon: '📐', role: 'Reads chart patterns, momentum indicators, support/resistance levels' },
        ],
        accentColor: '#06b6d4',
        bgColor: 'rgba(6,182,212,0.05)',
        borderColor: 'rgba(6,182,212,0.3)',
    },
};

function SystemOverview({ system, agentVotes, labels, gtVector }: {
    system: string;
    agentVotes: any[];
    labels: string[];
    gtVector: number[];
}) {
    const info = SYSTEM_INFO[system];

    if (!info) return (
        <div style={{ padding: 40, color: 'var(--text-muted)', textAlign: 'center' }}>
            No system description available.
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 32,
                padding: 40, background: info.bgColor,
                border: `2px solid ${info.borderColor}`,
                borderRadius: 20
            }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 18, flexShrink: 0,
                    background: `linear-gradient(135deg, ${info.accentColor}, ${info.accentColor}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem'
                }}>{info.icon}</div>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px', color: info.accentColor }}>
                        {system}
                    </h2>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 16 }}>{info.domain}</div>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                        {info.description}
                    </p>
                </div>
            </div>

            {/* Purpose */}
            <div className="card" style={{ padding: 28, marginBottom: 28 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.08em' }}>
                    WHY POIROT IS APPLIED
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                    {info.purpose}
                </p>
            </div>

            {/* Agents */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '0.08em' }}>
                    AGENT PANEL ({info.agents.length} agents)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {info.agents.map(agent => (
                        <div key={agent.name} className="card" style={{
                            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
                            border: `1.5px solid ${info.borderColor}`
                        }}>
                            <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{agent.icon}</span>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: info.accentColor, marginBottom: 4 }}>
                                    {agent.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {agent.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MAIN DEMO CLIENT COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function DemoClient({ data, cases, selectedCaseId, onCaseChange }: DemoClientProps) {
    const [phase, setPhase] = useState(0);

    // Parse vectors from metadata — try multiple key names
    const parseVec = (...keys: string[]): number[] => {
        for (const key of keys) {
            const raw = data.metadata?.[key];
            if (!raw) continue;
            try {
                const parsed = JSON.parse(raw.replace(/'/g, '"'));
                if (Array.isArray(parsed)) return parsed.map(Number);
            } catch {
                const nums = raw.replace(/[\[\]]/g, '').split(',').map(Number).filter(n => !isNaN(n));
                if (nums.length > 0) return nums;
            }
        }
        return [];
    };

    const gtVector = parseVec('ground_truth_labels', 'ground_truth_vector');
    const predVector = parseVec('predicted_labels', 'predicted_vector');
    const labels = data.dimension_labels ?? [];

    return (
        <div className="container demo-content">
            {/* ── Header ── */}
            <div className="demo-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
                        <span className="gradient-text">{data.system}</span>
                    </h1>
                    <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                        {data.system_domain || 'Multi-Agent System'}
                    </span>
                    {/* Case selector dropdown — only when multiple cases available */}
                    {cases && cases.length > 1 && onCaseChange && (
                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Case:</span>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={selectedCaseId}
                                    onChange={e => onCaseChange(e.target.value)}
                                    style={{
                                        background: 'var(--surface)',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: 8,
                                        color: 'var(--text-primary)',
                                        padding: '6px 28px 6px 10px',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                        minWidth: 180,
                                    }}
                                >
                                    {cases.map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                                <span style={{
                                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                                    pointerEvents: 'none', color: 'var(--text-muted)', fontSize: 10,
                                }}>▼</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Phase Nav ── */}
            <div style={{ margin: '20px 0' }}>
                <PhaseIndicator current={phase} setCurrent={setPhase} />
            </div>

            {/* ── Phase Content ── */}
            <div style={{ marginTop: 16 }}>
                {phase === 0 && (
                    <SystemOverview system={data.system} agentVotes={data.agent_votes ?? []} labels={labels} gtVector={gtVector} />
                )}

                {phase === 1 && (
                    <PhaseVectorSpace
                        labels={labels}
                        gtVector={gtVector}
                        system={data.system}
                    />
                )}

                {phase === 2 && (
                    <PhaseIndividualAnalysis
                        reports={data.individual_reports ?? []}
                        system={data.system}
                    />
                )}

                {phase === 3 && (
                    <PhasePeerConsultation
                        threads={data.peer_consultations ?? []}
                        system={data.system}
                    />
                )}

                {phase === 4 && (
                    <PhaseConsensusVoting
                        votingData={data.voting_data}
                        agentVotes={data.agent_votes ?? []}
                        labels={data.dimension_labels ?? []}
                        gtVector={gtVector}
                    />
                )}
            </div>
        </div>
    );
}
