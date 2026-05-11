'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentVote {
    agent_name: string;
    voted_location: number[];
    vote_weight: number;
    hazard_vector: string;
}

interface PhaseConsensusVotingProps {
    votingData: any;
    agentVotes: AgentVote[];
    labels: string[];
    gtVector: number[];
}

const AGENT_COLORS: Record<string, string> = {
    'Diagnosis Doctor': '#ec4899',
    'Chief of Rehabilitation': '#8b5cf6',
    'General Physiotherapist': '#06b6d4',
    'Market Analyst': '#10b981',
    'Bull Researcher': '#f59e0b',
    'Bear Researcher': '#ef4444',
    'News Analyst': '#a855f7',
    'Fundamentals Analyst': '#14b8a6',
    'Social Media Analyst': '#f97316',
    'Risk Manager': '#6366f1',
    'Technical Analyst': '#84cc16',
};

// Improved radar chart coordinate calculation
const getRadarPoint = (value: number, index: number, total: number, radius: number, center: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = value * radius;
    return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
    };
};

export default function PhaseConsensusVoting({ votingData, agentVotes, labels, gtVector }: PhaseConsensusVotingProps) {
    const [animationStep, setAnimationStep] = useState(0);
    const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
    const [showGroundTruth, setShowGroundTruth] = useState(true);
    const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
    const [isHoveringPanel, setIsHoveringPanel] = useState(false);

    // Calculate consensus scores (raw weighted sums from votingData)
    let rawScores: number[] = [];
    if (Array.isArray(votingData?.dimension_scores)) {
        rawScores = votingData.dimension_scores;
    } else if (agentVotes.length > 0) {
        const numDimensions = agentVotes[0].voted_location.length;
        rawScores = Array(numDimensions).fill(0);
        const totalWeight = agentVotes.reduce((sum, v) => sum + v.vote_weight, 0);
        for (let i = 0; i < numDimensions; i++) {
            const weightedSum = agentVotes.reduce(
                (sum, vote) => sum + (vote.voted_location[i] * vote.vote_weight), 0
            );
            rawScores[i] = totalWeight > 0 ? weightedSum / totalWeight : 0;
        }
    }

    // Normalize scores to [0, 1] range for radar chart visualization
    const maxScore = Math.max(...rawScores, 1);
    const consensusScores = rawScores.map(s => s / maxScore);

    // Use the actual predicted vector from votingData if available
    const predictedBinary: number[] = (() => {
        const gtComp = votingData?.ground_truth_comparison;
        if (Array.isArray(gtComp?.predicted_vector)) return gtComp.predicted_vector.map(Number);
        // Fallback: use winning_location from votingData
        if (Array.isArray(votingData?.winning_location?.vector)) return votingData.winning_location.vector.map(Number);
        // Last fallback: threshold normalized scores at 0.5
        return consensusScores.map(s => s > 0.5 ? 1 : 0);
    })();

    const isCorrect = votingData?.ground_truth_comparison?.is_correct === true
        || JSON.stringify(predictedBinary) === JSON.stringify(gtVector);

    // Calculate metrics
    const truePositives = predictedBinary.reduce((sum, val, i) => sum + (val === 1 && gtVector[i] === 1 ? 1 : 0), 0 as number);
    const falsePositives = predictedBinary.reduce((sum, val, i) => sum + (val === 1 && gtVector[i] === 0 ? 1 : 0), 0 as number);
    const falseNegatives = predictedBinary.reduce((sum, val, i) => sum + (val === 0 && gtVector[i] === 1 ? 1 : 0), 0 as number);
    const precision = truePositives + falsePositives > 0 ? truePositives / (truePositives + falsePositives) : 0;
    const recall = truePositives + falseNegatives > 0 ? truePositives / (truePositives + falseNegatives) : 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    // Auto-advance animation - 9 seconds per step
    // PAUSE when hovering over the legend/info panel
    useEffect(() => {
        if (animationStep < 4) {
            const isHovering = hoveredAgent !== null || isHoveringPanel;
            if (!isHovering) {
                const timer = setTimeout(() => {
                    setAnimationStep(animationStep + 1);
                }, 9000);
                return () => clearTimeout(timer);
            }
        }
    }, [animationStep, hoveredAgent, isHoveringPanel]);

    const toggleAgent = (agentName: string) => {
        const newSelected = new Set(selectedAgents);
        if (newSelected.has(agentName)) {
            newSelected.delete(agentName);
        } else {
            newSelected.add(agentName);
        }
        setSelectedAgents(newSelected);
    };

    const RadarChart = () => {
        const size = 700;
        const center = size / 2;
        const radius = size * 0.32;
        const numAxes = labels.length;

        // Generate path for a vector
        const generatePath = (vector: number[]) => {
            const points = vector.map((val, i) => getRadarPoint(val, i, numAxes, radius, center));
            return points.map(p => `${p.x},${p.y}`).join(' ');
        };

        // Determine which vectors to show based on animation step
        let visibleVectors: { name: string; vector: number[]; color: string; opacity: number }[] = [];

        if (animationStep === 1) {
            // In step 1, show selected agents OR all if none selected
            const agentsToShow = selectedAgents.size > 0
                ? agentVotes.filter(vote => selectedAgents.has(vote.agent_name))
                : agentVotes;

            visibleVectors = agentsToShow.map((vote, idx) => ({
                name: vote.agent_name,
                vector: vote.voted_location,
                color: AGENT_COLORS[vote.agent_name] || '#94a3b8',
                opacity: 0.6,
            }));
        } else if (animationStep === 2) {
            // In step 2, show selected agents OR all if none selected
            const agentsToShow = selectedAgents.size > 0
                ? agentVotes.filter(vote => selectedAgents.has(vote.agent_name))
                : agentVotes;

            visibleVectors = agentsToShow.map((vote) => ({
                name: vote.agent_name,
                vector: vote.voted_location.map(v => v * vote.vote_weight),
                color: AGENT_COLORS[vote.agent_name] || '#94a3b8',
                opacity: 0.4,
            }));
        } else if (animationStep >= 3) {
            visibleVectors = [
                {
                    name: 'Consensus',
                    vector: consensusScores,
                    color: '#6366f1',
                    opacity: 1,
                }
            ];
            selectedAgents.forEach(agentName => {
                const vote = agentVotes.find(v => v.agent_name === agentName);
                if (vote) {
                    visibleVectors.push({
                        name: agentName,
                        vector: vote.voted_location,
                        color: AGENT_COLORS[agentName] || '#94a3b8',
                        opacity: 0.3,
                    });
                }
            });
        }

        return (
            <svg width="100%" height="auto" viewBox={`0 0 ${size} ${size}`} style={{ background: 'transparent', maxWidth: size }}>
                {/* Grid circles */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, idx) => (
                    <circle
                        key={idx}
                        cx={center}
                        cy={center}
                        r={radius * level}
                        fill="none"
                        stroke="rgba(100, 116, 139, 0.2)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {labels.map((label, i) => {
                    const axisEnd = getRadarPoint(1, i, numAxes, radius, center);
                    const labelPos = getRadarPoint(1.15, i, numAxes, radius, center);

                    return (
                        <g key={i}>
                            {/* Axis line */}
                            <line
                                x1={center}
                                y1={center}
                                x2={axisEnd.x}
                                y2={axisEnd.y}
                                stroke="rgba(100, 116, 139, 0.3)"
                                strokeWidth={2}
                            />
                            {/* Label */}
                            <text
                                x={labelPos.x}
                                y={labelPos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#64748b"
                                fontSize={11}
                                fontWeight={700}
                                style={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    pointerEvents: 'none'
                                }}
                            >
                                {label.replace(/_/g, ' ').substring(0, 20)}
                            </text>
                        </g>
                    );
                })}

                {/* Ground Truth (if enabled) — only shown at Result step (4) */}
                {showGroundTruth && animationStep >= 4 && (
                    <>
                        <motion.path
                            d={`M ${generatePath(gtVector)} Z`}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeDasharray="10 5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            style={{ pointerEvents: 'none' }}
                        />
                        {/* Distinct markers at GT=1 axes so GT is always visible even when overlapping predicted */}
                        {gtVector.map((val, i) => {
                            if (val !== 1) return null;
                            const pos = getRadarPoint(1.12, i, numAxes, radius, center);
                            return (
                                <motion.circle
                                    key={`gt-marker-${i}`}
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={10}
                                    fill="#10b981"
                                    stroke="white"
                                    strokeWidth={2.5}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 0.9 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                    style={{ pointerEvents: 'none' }}
                                />
                            );
                        })}
                    </>
                )}

                {/* Agent vectors */}
                <AnimatePresence mode="sync">
                    {visibleVectors.map((vec, idx) => {
                        const isConsensus = vec.name === 'Consensus';
                        const isHovered = hoveredAgent === vec.name;
                        return (
                            <g key={vec.name}>
                                <motion.path
                                    d={`M ${generatePath(vec.vector)} Z`}
                                    fill={isConsensus ? 'rgba(99, 102, 241, 0.15)' : vec.color}
                                    stroke={vec.color}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: isHovered ? 1 : vec.opacity,
                                        strokeWidth: isHovered ? 6 : (isConsensus ? 5 : 3),
                                        fillOpacity: isHovered ? 0.4 : (isConsensus ? 0.15 : 0.15)
                                    }}
                                    transition={{
                                        pathLength: { duration: 1.2, delay: animationStep === 1 ? idx * 0.3 : 0, ease: 'easeInOut' },
                                        opacity: { duration: 0.3 },
                                        strokeWidth: { duration: 0.3 },
                                        fillOpacity: { duration: 0.3 }
                                    }}
                                    style={{ pointerEvents: 'none' }}
                                />
                                {/* Points on axes */}
                                {vec.vector.map((val, i) => {
                                    const point = getRadarPoint(val, i, numAxes, radius, center);
                                    return (
                                        <motion.circle
                                            key={i}
                                            cx={point.x}
                                            cy={point.y}
                                            r={isConsensus ? 7 : 5}
                                            fill={vec.color}
                                            stroke="#fff"
                                            strokeWidth="2"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{
                                                scale: { duration: 0.5, delay: animationStep === 1 ? idx * 0.3 + 0.5 : 0.3 },
                                                opacity: { duration: 0.5, delay: animationStep === 1 ? idx * 0.3 + 0.5 : 0.3 },
                                            }}
                                            style={{ pointerEvents: 'none' }}
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}
                </AnimatePresence>

            </svg>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '60px 0',
            background: 'var(--background)',
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: 50 }}
                >
                    <h1 className="gradient-text" style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: 16 }}>
                        Phase 3 — Weighted Consensus Voting
                    </h1>
                    <p style={{
                        fontSize: '1.05rem',
                        color: 'var(--text-secondary)',
                        maxWidth: 800,
                        margin: '0 auto',
                        lineHeight: 1.7
                    }}>
                        Watch how individual agent votes are weighted by Hamming distance, combined, and transformed into
                        a unified consensus prediction.
                    </p>
                </motion.div>

                {/* Progress Timeline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 12,
                        padding: '28px 32px',
                        maxWidth: 1100,
                        margin: '0 auto 50px'
                    }}
                >
                    {['Introduction', 'Individual Votes', 'Weighted Votes', 'Consensus', 'Result'].map((step, idx) => (
                        <React.Fragment key={idx}>
                            <motion.div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setAnimationStep(idx)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        background: animationStep >= idx
                                            ? 'var(--gradient-brand)'
                                            : 'var(--surface-alt)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        fontWeight: 800,
                                        color: animationStep >= idx ? 'white' : 'var(--text-muted)',
                                        border: animationStep === idx ? '3px solid var(--purple)' : 'none',
                                        boxShadow: animationStep === idx ? 'var(--shadow-lg)' : 'none'
                                    }}
                                    animate={{
                                        scale: animationStep === idx ? [1, 1.1, 1] : 1,
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: animationStep === idx ? Infinity : 0,
                                        repeatType: 'reverse'
                                    }}
                                >
                                    {idx + 1}
                                </motion.div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: animationStep >= idx ? 'var(--text-primary)' : 'var(--text-muted)',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {step}
                                </div>
                            </motion.div>
                            {idx < 4 && (
                                <motion.div
                                    style={{
                                        width: 60,
                                        height: 3,
                                        background: 'var(--border)',
                                        borderRadius: 3,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <motion.div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'var(--gradient-brand)',
                                            transformOrigin: 'left'
                                        }}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: animationStep > idx ? 1 : 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </motion.div>
                            )}
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* Main Content Area */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 1fr',
                    gap: 40,
                    alignItems: 'start',
                    margin: '0 auto',
                    maxWidth: 1400
                }}>
                    {/* Left: Radar Chart */}
                    <motion.div
                        className="card"
                        style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                            borderRadius: 24,
                            padding: 40,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <RadarChart />

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: 32, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {animationStep >= 3 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 24, height: 4, background: '#6366f1', borderRadius: 2 }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Consensus</span>
                                </div>
                            )}
                            {animationStep >= 4 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        cursor: 'pointer',
                                        opacity: showGroundTruth ? 1 : 0.5,
                                        transition: 'opacity 0.3s'
                                    }}
                                    onClick={() => setShowGroundTruth(!showGroundTruth)}
                                >
                                    <div style={{ width: 24, height: 4, background: '#10b981', borderRadius: 2, borderTop: '4px dashed #10b981' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Ground Truth</span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Info Panel */}
                    <motion.div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 24,
                            maxWidth: '100%'
                        }}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onMouseEnter={() => setIsHoveringPanel(true)}
                        onMouseLeave={() => setIsHoveringPanel(false)}
                    >
                        <AnimatePresence mode="wait">
                            {/* Step 0: Introduction */}
                            {animationStep === 0 && (
                                <motion.div
                                    key="step-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="card"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(236, 72, 153, 0.1))',
                                        border: '2px solid var(--pink)',
                                        borderRadius: 20,
                                        padding: 32
                                    }}
                                >
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--pink)' }}>
                                        🎯 Hamming Distance Voting
                                    </h3>
                                    <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                                        Agent votes are weighted based on their <strong>proximity</strong> to the suspected error location
                                        in the N-dimensional error space.
                                    </p>
                                    <div className="card" style={{
                                        background: 'var(--surface)',
                                        padding: 20,
                                        borderRadius: 12,
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.8
                                    }}>
                                        <div style={{ color: 'var(--teal)' }}>similarity = 1 - (hamming_distance / N)</div>
                                        <div style={{ color: 'var(--cyan)' }}>weight = baseline + 0.5 × similarity</div>
                                        <div style={{ color: 'var(--pink)' }}>consensus[i] = Σ(vote[i] × weight) / Σ(weights)</div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 1: Individual Votes */}
                            {animationStep === 1 && (
                                <motion.div
                                    key="step-1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="card"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.1))',
                                        border: '2px solid var(--purple)',
                                        borderRadius: 20,
                                        padding: 32
                                    }}
                                >
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--purple)' }}>
                                        📊 Individual Agent Votes
                                    </h3>
                                    <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                                        Each agent independently identifies which dimensions contain errors.
                                        Click to toggle agents on/off.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {agentVotes.map((vote, idx) => (
                                            <motion.div
                                                key={vote.agent_name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.3 }}
                                                onClick={() => toggleAgent(vote.agent_name)}
                                                onMouseEnter={() => setHoveredAgent(vote.agent_name)}
                                                onMouseLeave={() => setHoveredAgent(null)}
                                                whileTap={{ scale: 0.98 }}
                                                className="card"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                    padding: 12,
                                                    background: selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)
                                                        ? `${AGENT_COLORS[vote.agent_name] || '#94a3b8'}10`
                                                        : 'var(--surface)',
                                                    border: `2px solid ${hoveredAgent === vote.agent_name
                                                        ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                        : selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)
                                                            ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                            : 'var(--border)'}`,
                                                    cursor: 'pointer',
                                                    opacity: selectedAgents.size === 0 || selectedAgents.has(vote.agent_name) ? 1 : 0.5,
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                    boxShadow: hoveredAgent === vote.agent_name
                                                        ? `0 0 0 3px ${AGENT_COLORS[vote.agent_name] || '#94a3b8'}40`
                                                        : 'none'
                                                }}
                                            >
                                                <div style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 4,
                                                    background: selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)
                                                        ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                        : 'var(--surface-alt)',
                                                    border: `2px solid ${AGENT_COLORS[vote.agent_name] || '#94a3b8'}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.7rem',
                                                    color: 'white',
                                                    flexShrink: 0
                                                }}>
                                                    {(selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)) && '✓'}
                                                </div>
                                                <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600 }}>
                                                    {vote.agent_name}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    {vote.voted_location.filter(v => v === 1).length} errors detected
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Weighted Votes */}
                            {animationStep === 2 && (
                                <motion.div
                                    key="step-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="card"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(6, 182, 212, 0.1))',
                                        border: '2px solid var(--cyan)',
                                        borderRadius: 20,
                                        padding: 32
                                    }}
                                >
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--cyan)' }}>
                                        ⚖️ Applying Vote Weights
                                    </h3>
                                    <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                                        Votes are now scaled by their weights. Click to toggle agents on/off.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {agentVotes.map((vote, idx) => (
                                            <motion.div
                                                key={vote.agent_name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.2 }}
                                                onClick={() => toggleAgent(vote.agent_name)}
                                                onMouseEnter={() => setHoveredAgent(vote.agent_name)}
                                                onMouseLeave={() => setHoveredAgent(null)}
                                                whileTap={{ scale: 0.98 }}
                                                className="card"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                    padding: 12,
                                                    background: selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)
                                                        ? `${AGENT_COLORS[vote.agent_name] || '#94a3b8'}10`
                                                        : 'var(--surface)',
                                                    border: `2px solid ${hoveredAgent === vote.agent_name
                                                        ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                        : selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)
                                                            ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                            : 'var(--border)'}`,
                                                    cursor: 'pointer',
                                                    opacity: selectedAgents.size === 0 || selectedAgents.has(vote.agent_name) ? 1 : 0.5,
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                    boxShadow: hoveredAgent === vote.agent_name
                                                        ? `0 0 0 3px ${AGENT_COLORS[vote.agent_name] || '#94a3b8'}40`
                                                        : 'none'
                                                }}
                                            >
                                                <div style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 4,
                                                    background: selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)
                                                        ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                        : 'var(--surface-alt)',
                                                    border: `2px solid ${AGENT_COLORS[vote.agent_name] || '#94a3b8'}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.7rem',
                                                    color: 'white',
                                                    flexShrink: 0
                                                }}>
                                                    {(selectedAgents.size === 0 || selectedAgents.has(vote.agent_name)) && '✓'}
                                                </div>
                                                <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600 }}>
                                                    {vote.agent_name}
                                                </div>
                                                <div className="badge" style={{
                                                    background: `${AGENT_COLORS[vote.agent_name] || '#94a3b8'}20`,
                                                    color: AGENT_COLORS[vote.agent_name] || '#94a3b8',
                                                    border: `1px solid ${AGENT_COLORS[vote.agent_name] || '#94a3b8'}`
                                                }}>
                                                    w: {vote.vote_weight.toFixed(3)}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Consensus */}
                            {animationStep === 3 && (
                                <motion.div
                                    key="step-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="card"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1))',
                                        border: '2px solid var(--teal)',
                                        borderRadius: 20,
                                        padding: 32
                                    }}
                                >
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--teal)' }}>
                                        ✨ Global Consensus Formed
                                    </h3>
                                    <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                                        Weighted votes are combined into a unified prediction. The indigo polygon shows
                                        the final consensus vector. Select agents below to compare.
                                    </p>

                                    {/* Agent Toggles */}
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
                                            Compare with individual votes:
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {agentVotes.map(vote => (
                                                <motion.div
                                                    key={vote.agent_name}
                                                    onClick={() => toggleAgent(vote.agent_name)}
                                                    onMouseEnter={() => setHoveredAgent(vote.agent_name)}
                                                    onMouseLeave={() => setHoveredAgent(null)}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="card"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 12,
                                                        padding: 10,
                                                        background: selectedAgents.has(vote.agent_name)
                                                            ? `${AGENT_COLORS[vote.agent_name] || '#94a3b8'}10`
                                                            : 'var(--surface)',
                                                        border: `2px solid ${hoveredAgent === vote.agent_name
                                                            ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                            : selectedAgents.has(vote.agent_name)
                                                                ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                                : 'var(--border)'}`,
                                                        cursor: 'pointer',
                                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                                        boxShadow: hoveredAgent === vote.agent_name
                                                            ? `0 0 0 3px ${AGENT_COLORS[vote.agent_name] || '#94a3b8'}40`
                                                            : 'none'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 4,
                                                        background: selectedAgents.has(vote.agent_name)
                                                            ? (AGENT_COLORS[vote.agent_name] || '#94a3b8')
                                                            : 'var(--surface-alt)',
                                                        border: `2px solid ${AGENT_COLORS[vote.agent_name] || '#94a3b8'}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.7rem',
                                                        color: 'white'
                                                    }}>
                                                        {selectedAgents.has(vote.agent_name) && '✓'}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, flex: 1 }}>
                                                        {vote.agent_name}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Consensus Vector Display */}
                                    <div className="card" style={{
                                        padding: 16,
                                        border: '2px solid var(--teal)'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--teal)' }}>
                                            PREDICTED ERROR VECTOR
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {predictedBinary.map((val, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 6,
                                                        background: val ? 'var(--teal)' : 'var(--surface-alt)',
                                                        color: val ? 'white' : 'var(--text-muted)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 800,
                                                        fontSize: '0.9rem',
                                                        border: val ? '2px solid var(--teal)' : '1px solid var(--border)'
                                                    }}
                                                >
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Result */}
                            {animationStep === 4 && (
                                <motion.div
                                    key="step-4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="card"
                                    style={{
                                        background: isCorrect
                                            ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.1))'
                                            : 'linear-gradient(135deg, rgba(185, 28, 28, 0.1), rgba(239, 68, 68, 0.1))',
                                        border: isCorrect ? '3px solid var(--teal)' : '3px solid #ef4444',
                                        borderRadius: 20,
                                        padding: 40,
                                        textAlign: 'center'
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            background: isCorrect ? 'var(--teal)' : '#ef4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '3rem',
                                            margin: '0 auto 24px',
                                            boxShadow: isCorrect
                                                ? '0 0 40px rgba(16, 185, 129, 0.4)'
                                                : '0 0 40px rgba(239, 68, 68, 0.4)'
                                        }}
                                    >
                                        {isCorrect ? '✓' : '✗'}
                                    </motion.div>

                                    <h2 style={{
                                        fontSize: '2rem',
                                        fontWeight: 900,
                                        marginBottom: 12,
                                        color: isCorrect ? 'var(--teal)' : '#ef4444'
                                    }}>
                                        {isCorrect ? 'HAZARD IDENTIFIED' : 'DIAGNOSIS FAILED'}
                                    </h2>

                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
                                        {isCorrect
                                            ? 'The weighted consensus correctly matches the ground truth error profile.'
                                            : 'The system failed to identify all hazard dimensions. Review agent votes for discrepancies.'}
                                    </p>

                                    {/* Metrics */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr',
                                        gap: 16,
                                        marginTop: 24
                                    }}>
                                        <div className="card" style={{ padding: 20 }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--teal)' }}>
                                                {(precision * 100).toFixed(0)}%
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                Precision
                                            </div>
                                        </div>
                                        <div className="card" style={{ padding: 20 }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--cyan)' }}>
                                                {(recall * 100).toFixed(0)}%
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                Recall
                                            </div>
                                        </div>
                                        <div className="card" style={{ padding: 20 }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--purple)' }}>
                                                {(f1Score * 100).toFixed(0)}%
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                F1 Score
                                            </div>
                                        </div>
                                    </div>

                                    {/* Replay Button */}
                                    <motion.button
                                        className="btn btn-primary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setAnimationStep(0)}
                                        style={{ marginTop: 32 }}
                                    >
                                        ↻ Replay Animation
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
