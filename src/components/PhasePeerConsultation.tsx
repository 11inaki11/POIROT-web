'use client';

import React, { useState } from 'react';

/* ─── Shared Agent Colors & Icons (consistent with PhaseIndividualAnalysis) ─── */
const AGENT_COLORS: Record<string, string> = {
    'Diagnosis Doctor': '#8b5cf6',
    'Chief of Rehabilitation': '#06b6d4',
    'General Physiotherapist': '#10b981',
    'Parent/Guardian': '#f97316',
    'System Router': '#64748b',
    'Tool Call': '#64748b',
    'System': '#64748b',
    'Market Analyst': '#ec4899',
    'Bull Researcher': '#22c55e',
    'Bear Researcher': '#ef4444',
};

const AGENT_ICONS: Record<string, string> = {
    'Diagnosis Doctor': '🩺',
    'Chief of Rehabilitation': '👨‍⚕️',
    'General Physiotherapist': '🏋️',
    'Parent/Guardian': '👨‍👧',
    'System Router': '⚙️',
    'Tool Call': '🔧',
    'System': '⚙️',
    'Market Analyst': '📊',
    'Bull Researcher': '📈',
    'Bear Researcher': '📉',
};

interface PeerMessage {
    id: number;
    sender: string;
    sender_key: string;
    receiver: string;
    receiver_key: string;
    type: string;
    raw_type: string;
    content: string;
    is_system: boolean;
}

interface AgentThread {
    agent_name: string;
    agent_key: string;
    session: string;
    total_messages: number;
    messages: PeerMessage[];
    vote?: AgentVote;
    source_file: string;
}

interface AgentVote {
    hazard_vector: string;
    location: number[];
    justification: string;
}

/* ─── Vote Summary Card ─── */
function VoteSummary({ vote, agentName }: { vote: AgentVote; agentName: string }) {
    const color = AGENT_COLORS[agentName] || '#6366f1';

    return (
        <div style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 'var(--radius-md)',
            background: `linear-gradient(135deg, ${color}10, ${color}05)`,
            border: `1px solid ${color}30`,
            borderLeft: `4px solid ${color}`,
        }}>
            <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '0.95rem',
                color: color,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                <span style={{ fontSize: '1.2rem' }}>🗳️</span> Final Decision
            </h4>

            <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    IDENTIFIED HAZARD
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {vote.hazard_vector}
                </span>
            </div>

            <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    AFFECTED COMPONENTS (Vector)
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                    {vote.location.map((val, i) => (
                        <div key={i} style={{
                            width: 20, height: 20,
                            borderRadius: 4,
                            background: val ? 'var(--pink)' : '#334155',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 700, color: 'white'
                        }}>
                            {val}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    JUSTIFICATION
                </span>
                <p style={{
                    fontSize: '0.85rem',
                    margin: 0,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)'
                }}>
                    {vote.justification}
                </p>
            </div>
        </div>
    );
}

/* ─── Single Chat Message Bubble ─── */
function ChatBubble({ msg, isOwnAgent }: { msg: PeerMessage; isOwnAgent: boolean }) {
    const color = AGENT_COLORS[msg.sender] || '#6366f1';
    const icon = AGENT_ICONS[msg.sender] || '🤖';
    const isToolComm = msg.type === 'TOOL_COMM';

    // Tool communication messages → show differently
    if (isToolComm) {
        // Strip the "[Communication via ...]:" prefix for cleaner display
        const cleanContent = msg.content.replace(/\[Communication via .+?\]:\s*/, '');
        return (
            <div style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-alt)',
                border: '1px dashed var(--border)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
            }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔧</span>
                <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        Tool Invocation → {msg.receiver}
                    </span>
                    <p style={{ margin: '4px 0 0 0', lineHeight: 1.55 }}>{cleanContent}</p>
                </div>
            </div>
        );
    }

    // Determine alignment: the "owning" agent (whose tab we're in) goes to the left
    const alignRight = !isOwnAgent;

    return (
        <div style={{
            display: 'flex',
            flexDirection: alignRight ? 'row-reverse' : 'row',
            gap: 12,
            maxWidth: '88%',
            marginLeft: alignRight ? 'auto' : 0,
            marginRight: alignRight ? 0 : 'auto',
        }}>
            {/* Avatar */}
            <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                flexShrink: 0,
                boxShadow: `0 2px 8px ${color}30`,
            }}>
                {icon}
            </div>

            {/* Bubble */}
            <div style={{
                background: isOwnAgent ? `${color}0a` : 'var(--surface)',
                border: `1.5px solid ${isOwnAgent ? `${color}28` : 'var(--border)'}`,
                borderRadius: isOwnAgent
                    ? '4px 16px 16px 16px'
                    : '16px 4px 16px 16px',
                padding: '14px 18px',
                flex: 1,
            }}>
                {/* Sender header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                }}>
                    <span style={{
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        color: color,
                    }}>
                        {msg.sender}
                    </span>
                    <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                    }}>
                        → {msg.receiver}
                    </span>
                </div>

                {/* Content */}
                <div style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>
                    {renderContent(msg.content)}
                </div>
            </div>
        </div>
    );
}

/* ─── Render message content with markdown-lite formatting ─── */
function renderContent(text: string) {
    // Truncate extremely long messages with an expand option would be ideal
    // For now, just clean up and render
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Bold markdown
        if (line.match(/\*\*.+?\*\*/)) {
            const parts = line.split(/(\*\*.+?\*\*)/g);
            elements.push(
                <span key={i}>
                    {parts.map((p, j) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                            return <strong key={j}>{p.slice(2, -2)}</strong>;
                        }
                        return p;
                    })}
                    {'\n'}
                </span>
            );
        } else if (line.startsWith('###') || line.startsWith('##') || line.startsWith('#')) {
            // Headers → bold
            const headerText = line.replace(/^#+\s*/, '');
            elements.push(
                <strong key={i} style={{ display: 'block', marginTop: 8, fontSize: '0.95rem' }}>
                    {headerText}{'\n'}
                </strong>
            );
        } else if (line.trim().startsWith('*   ') || line.trim().startsWith('- ')) {
            // Bullet points
            const bulletText = line.replace(/^\s*[\*\-]\s+/, '');
            elements.push(
                <span key={i} style={{ display: 'block', paddingLeft: 16 }}>
                    • {bulletText}{'\n'}
                </span>
            );
        } else {
            elements.push(<span key={i}>{line}{'\n'}</span>);
        }
    }

    return elements;
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT — PhasePeerConsultation
   ═══════════════════════════════════════════════════════ */
export default function PhasePeerConsultation({
    threads,
    system,
}: {
    threads: AgentThread[];
    system: string;
}) {
    const [activeTab, setActiveTab] = useState(0);

    if (!threads || threads.length === 0) {
        return (
            <div className="card" style={{ padding: 24 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                    No peer consultation data available for this test case.
                </p>
            </div>
        );
    }

    const activeThread = threads[activeTab];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header */}
            <div
                className="card"
                style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 20 }}
            >
                <img src="/logo.png" alt="POIROT" style={{ width: 64, height: 64 }} />
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, marginBottom: 8 }}>
                        <span className="gradient-text">Phase 3 — Peer Consultation</span>
                    </h3>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                        Agents interrogate their peers through structured dialogue, asking questions and challenging observations.
                        Select an agent below to view their conversation thread.
                    </p>
                </div>
            </div>

            {/* Agent Tabs */}
            <div style={{
                display: 'flex',
                gap: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1.5px solid var(--border)',
            }}>
                {threads.map((thread, i) => {
                    const color = AGENT_COLORS[thread.agent_name] || '#6366f1';
                    const icon = AGENT_ICONS[thread.agent_name] || '🤖';
                    const isActive = i === activeTab;

                    return (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            style={{
                                flex: 1,
                                padding: '14px 16px',
                                border: 'none',
                                borderRight: i < threads.length - 1 ? '1px solid var(--border)' : 'none',
                                cursor: 'pointer',
                                background: isActive
                                    ? `linear-gradient(135deg, ${color}18, ${color}08)`
                                    : 'var(--surface)',
                                borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                            <span style={{
                                fontWeight: isActive ? 800 : 600,
                                fontSize: '0.85rem',
                                color: isActive ? color : 'var(--text-secondary)',
                                textAlign: 'center',
                                lineHeight: 1.3,
                            }}>
                                {thread.agent_name}
                            </span>
                            <span style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                            }}>
                                {thread.total_messages} messages
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Active Agent Conversation */}
            <div className="card" style={{ padding: 28 }}>
                {/* Thread header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: '1px solid var(--border)',
                }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${AGENT_COLORS[activeThread.agent_name] || '#6366f1'}, ${(AGENT_COLORS[activeThread.agent_name] || '#6366f1')}cc)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        boxShadow: `0 4px 12px ${(AGENT_COLORS[activeThread.agent_name] || '#6366f1')}40`,
                    }}>
                        {AGENT_ICONS[activeThread.agent_name] || '🤖'}
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            margin: 0,
                            color: AGENT_COLORS[activeThread.agent_name] || '#6366f1',
                        }}>
                            {activeThread.agent_name}&apos;s Peer Consultation
                        </h3>
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                        }}>
                            Session {activeThread.session} • {activeThread.total_messages} messages exchanged
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {activeThread.messages.map((msg, i) => {
                        const isOwnAgent = msg.sender === activeThread.agent_name
                            || msg.sender_key === activeThread.agent_key;
                        return (
                            <ChatBubble
                                key={i}
                                msg={msg}
                                isOwnAgent={isOwnAgent}
                            />
                        );
                    })}

                    {activeThread.messages.length === 0 && (
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            padding: 24,
                        }}>
                            No peer consultation messages recorded for this agent.
                        </p>
                    )}

                    {/* Final Vote Display */}
                    {activeThread.vote && (
                        <VoteSummary
                            vote={activeThread.vote}
                            agentName={activeThread.agent_name}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
