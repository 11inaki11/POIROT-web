'use client';

import React, { useState, useEffect } from 'react';

/* ─── Agent Colors & Icons ─── */
const AGENT_COLORS: Record<string, string> = {
    'Diagnosis Doctor': '#8b5cf6',
    'Chief of Rehabilitation': '#06b6d4',
    'General Physiotherapist': '#10b981',
    'Market Analyst': '#ec4899',
    'Bull Researcher': '#22c55e',
    'Bear Researcher': '#ef4444',
};

const AGENT_ICONS: Record<string, string> = {
    'Diagnosis Doctor': '🩺',
    'Chief of Rehabilitation': '👨‍⚕️',
    'General Physiotherapist': '🏋️',
    'Market Analyst': '📊',
    'Bull Researcher': '📈',
    'Bear Researcher': '📉',
};

interface Observation {
    description: string;
    evidence: string;
}

interface IndividualReport {
    agent_name: string;
    patient: string;
    session: string;
    participated: string;
    context_messages: number;
    observations: Observation[];
    source_file: string;
}

/* ─── Single Agent Message Bubble ─── */
function AgentMessageBubble({
    report,
    index,
    visible,
}: {
    report: IndividualReport;
    index: number;
    visible: boolean;
}) {
    const color = AGENT_COLORS[report.agent_name] || '#6366f1';
    const icon = AGENT_ICONS[report.agent_name] || '🤖';

    return (
        <div
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                marginLeft: index % 2 === 0 ? 0 : 40,
                marginRight: index % 2 === 0 ? 40 : 0,
            }}
        >
            {/* Agent avatar + name header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        boxShadow: `0 4px 12px ${color}40`,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        {report.agent_name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        POIROT Analysis Agent • {report.context_messages} messages reviewed
                    </div>
                </div>
                {/* Turn indicator */}
                <div
                    style={{
                        marginLeft: 'auto',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: color,
                        background: `${color}14`,
                        padding: '4px 12px',
                        borderRadius: 12,
                        border: `1.5px solid ${color}30`,
                    }}
                >
                    Turn {index + 1}
                </div>
            </div>

            {/* Message bubble */}
            <div
                style={{
                    background: 'var(--surface)',
                    border: `2px solid ${color}25`,
                    borderRadius: '4px 16px 16px 16px',
                    padding: '20px 24px',
                    position: 'relative',
                    boxShadow: `0 2px 12px ${color}10`,
                }}
            >
                {/* Intro text */}
                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    margin: '0 0 16px 0',
                    fontStyle: 'italic',
                }}>
                    &ldquo;After independently reviewing the {report.agent_name === 'General Physiotherapist'
                        ? 'sensor feedback data and therapy execution'
                        : report.agent_name === 'Chief of Rehabilitation'
                            ? 'clinical decision-making process and agent interactions'
                            : 'diagnostic assessment and treatment protocol'
                    }, I have identified the following anomalies:&rdquo;
                </p>

                {/* Observations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {report.observations.map((obs, oi) => (
                        <div
                            key={oi}
                            style={{
                                padding: '16px 18px',
                                borderRadius: 'var(--radius-md)',
                                background: `${color}08`,
                                border: `1px solid ${color}18`,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    color: 'white',
                                    background: color,
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                    flexShrink: 0,
                                    marginTop: 2,
                                }}>
                                    OBS {oi + 1}
                                </span>
                                <p style={{
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    margin: 0,
                                    lineHeight: 1.5,
                                }}>
                                    {obs.description}
                                </p>
                            </div>
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: 8,
                                background: 'var(--surface-alt)',
                                borderLeft: `3px solid ${color}60`,
                                marginTop: 8,
                            }}>
                                <p style={{
                                    fontSize: '0.88rem',
                                    color: 'var(--text-secondary)',
                                    margin: 0,
                                    lineHeight: 1.6,
                                }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>Evidence: </strong>
                                    {obs.evidence}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {report.observations.length === 0 && (
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                        No anomalies detected during independent review.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ─── Vertical connector between messages ─── */
function TurnConnector({ visible }: { visible: boolean }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4px 0',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease',
        }}>
            <div style={{
                width: 2,
                height: 32,
                background: 'linear-gradient(to bottom, var(--border), transparent)',
            }} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT — PhaseIndividualAnalysis
   ═══════════════════════════════════════════════════════ */
export default function PhaseIndividualAnalysis({
    reports,
    system,
}: {
    reports: IndividualReport[];
    system: string;
}) {
    const [activeTab, setActiveTab] = useState(0);

    if (!reports || reports.length === 0) {
        return (
            <div className="card" style={{ padding: 24 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                    No individual analysis data available for this test case.
                </p>
            </div>
        );
    }

    const totalObservations = reports.reduce((sum, r) => sum + r.observations.length, 0);
    const activeReport = reports[activeTab];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header */}
            <div
                className="card"
                style={{
                    padding: '28px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
                <img src="/logo.png" alt="POIROT" style={{ width: 64, height: 64 }} />
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, marginBottom: 8 }}>
                        <span className="gradient-text">Phase 2 — Individual Analysis</span>
                    </h3>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                        Each POIROT agent independently reviewed the {system} execution logs and identified anomalous behaviors.
                        Select an agent below to view their analysis.
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
                {reports.map((report, i) => {
                    const color = AGENT_COLORS[report.agent_name] || '#6366f1';
                    const icon = AGENT_ICONS[report.agent_name] || '🤖';
                    const isActive = i === activeTab;

                    return (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            style={{
                                flex: 1,
                                padding: '14px 16px',
                                border: 'none',
                                borderRight: i < reports.length - 1 ? '1px solid var(--border)' : 'none',
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
                                {report.agent_name}
                            </span>
                            <span style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                            }}>
                                {report.observations.length} observation{report.observations.length !== 1 ? 's' : ''}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Active Agent Analysis */}
            <div className="card" style={{ padding: 28 }}>
                {/* Agent header */}
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
                        background: `linear-gradient(135deg, ${AGENT_COLORS[activeReport.agent_name] || '#6366f1'}, ${(AGENT_COLORS[activeReport.agent_name] || '#6366f1')}cc)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        boxShadow: `0 4px 12px ${(AGENT_COLORS[activeReport.agent_name] || '#6366f1')}40`,
                    }}>
                        {AGENT_ICONS[activeReport.agent_name] || '🤖'}
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            margin: 0,
                            color: AGENT_COLORS[activeReport.agent_name] || '#6366f1',
                        }}>
                            {activeReport.agent_name}&apos;s Individual Analysis
                        </h3>
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                        }}>
                            Session {activeReport.session} • {activeReport.context_messages} messages reviewed • {activeReport.participated === 'True' ? 'Participated' : 'Non-participant'}
                        </p>
                    </div>
                </div>

                {/* Intro text */}
                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    margin: '0 0 24px 0',
                    fontStyle: 'italic',
                    padding: '16px 20px',
                    background: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${AGENT_COLORS[activeReport.agent_name] || '#6366f1'}`,
                }}>
                    &ldquo;After independently reviewing the {activeReport.agent_name === 'General Physiotherapist'
                        ? 'sensor feedback data and therapy execution'
                        : activeReport.agent_name === 'Chief of Rehabilitation'
                            ? 'clinical decision-making process and agent interactions'
                            : 'diagnostic assessment and treatment protocol'
                    }, I have identified the following anomalies:&rdquo;
                </p>

                {/* Observations */}
                {activeReport.observations.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {activeReport.observations.map((obs, oi) => {
                            const color = AGENT_COLORS[activeReport.agent_name] || '#6366f1';
                            return (
                                <div
                                    key={oi}
                                    style={{
                                        padding: '20px 24px',
                                        borderRadius: 'var(--radius-md)',
                                        background: `${color}08`,
                                        border: `1.5px solid ${color}18`,
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            color: 'white',
                                            background: color,
                                            padding: '4px 10px',
                                            borderRadius: 6,
                                            flexShrink: 0,
                                            marginTop: 2,
                                        }}>
                                            OBS {oi + 1}
                                        </span>
                                        <p style={{
                                            fontSize: '0.98rem',
                                            fontWeight: 700,
                                            color: 'var(--text-primary)',
                                            margin: 0,
                                            lineHeight: 1.5,
                                        }}>
                                            {obs.description}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: 8,
                                        background: 'var(--surface)',
                                        borderLeft: `3px solid ${color}60`,
                                        marginTop: 12,
                                    }}>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            margin: 0,
                                            lineHeight: 1.6,
                                        }}>
                                            <strong style={{ color: 'var(--text-primary)' }}>Evidence: </strong>
                                            {obs.evidence}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{
                        padding: '32px',
                        textAlign: 'center',
                        background: 'var(--surface-alt)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed var(--border)',
                    }}>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            lineHeight: 1.6,
                        }}>
                            ✅ No anomalies detected during independent review.
                            <br />
                            <span style={{ fontSize: '0.85rem' }}>
                                This agent found the execution to be within expected safe parameters.
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
