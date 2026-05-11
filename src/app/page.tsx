import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* ─── Hero Section ─── */}
      <section className="hero container">
        <img src="/logo.png" alt="POIROT Logo" className="hero-logo" style={{ width: 160, height: 160, marginBottom: 8 }} />
        <h1 className="gradient-text" style={{ fontSize: '3.2rem', marginTop: 0 }}>POIROT Protocol</h1>
        <p className="hero-subtitle" style={{ fontSize: '1.3rem' }}>
          Peer-Oriented Identification &amp; Resolution of Operational Threats
        </p>
        <p style={{ maxWidth: 700, margin: '16px auto 20px', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          A consensus-based framework for detecting and attributing errors in multi-agent AI systems
          through collaborative peer interrogation and weighted voting.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
          <a href="#demos" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              🎬 See Live Demos
            </button>
          </a>
          <button className="btn btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            📄 Preprint (arXiv)
          </button>
          <a href="https://github.com/11inaki11/POIROT" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              📦 POIROT Library
            </button>
          </a>
          <a href="https://github.com/11inaki11/blame" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              📊 BLAME Benchmark
            </button>
          </a>
        </div>
      </section>

      {/* ─── What is POIROT ─── */}
      <section className="container" style={{ padding: '60px 24px' }}>
        <div className="card" style={{ padding: '48px', background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)', border: '2px solid #fbbf24' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 24, color: '#92400e' }}>
            🎯 What is POIROT?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, color: '#78350f' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12 }}>The Problem</h3>
              <p style={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                Multi-agent AI systems are increasingly deployed in critical domains — healthcare, finance, autonomous systems —
                but detecting and attributing errors across distributed agents remains an open problem. Traditional debugging
                approaches fail when agents have partial observability and faults propagate silently through agent interactions.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12 }}>The Solution</h3>
              <p style={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                Rather than relying on an external judge, POIROT turns the system's <strong>own agents into investigators</strong>.
                Each agent already understands its role and what it observed — making them the best-placed experts to
                reason about what went wrong. Through structured peer interrogation and weighted consensus voting,
                this collective knowledge consistently outperforms single-LLM baselines by up to <strong>+26 percentage points</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works: 5 Phases ─── */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>
        <h2 className="section-heading" style={{ fontSize: '2.4rem', marginBottom: 40, textAlign: 'center' }}>
          🔬 How POIROT Works: 5-Phase Protocol
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Phase 1 */}
          <div className="protocol-phase-card" style={{
            display: 'flex', gap: 32, padding: 40, background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)', border: '2px solid #ec4899', position: 'relative',
            boxShadow: '0 4px 20px rgba(236, 72, 153, 0.15)'
          }}>
            <div className="phase-number" style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-pink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 900, color: 'white', flexShrink: 0
            }}>1</div>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: '#ec4899' }}>
                Phase 1: Error Vector Space Construction
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7, fontSize: '1.05rem' }}>
                The POIROT Agent analyzes the multi-agent system description to identify all potential error locations
                and constructs an <strong>N-dimensional error vector space</strong>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
                <div className="card" style={{ padding: 16, background: 'var(--bg-secondary)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>INPUT</div>
                  <ul style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
                    <li>System architecture description</li>
                    <li>Agent roles and responsibilities</li>
                  </ul>
                </div>
                <div className="card" style={{ padding: 16, background: 'var(--bg-secondary)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>OUTPUT</div>
                  <ul style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
                    <li>Error dimension labels</li>
                    <li>Binary vector representation [0,1,0,...]</li>
                    <li>Component descriptions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="protocol-phase-card" style={{
            display: 'flex', gap: 32, padding: 40, background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)', border: '2px solid #8b5cf6',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)'
          }}>
            <div className="phase-number" style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 900, color: 'white', flexShrink: 0
            }}>2</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: '#8b5cf6' }}>
                Phase 2: Individual Analysis
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7, fontSize: '1.05rem' }}>
                Each agent independently analyzes the session execution logs from their own perspective.
                Agents only see messages they <strong>participated in</strong>, preventing hallucination and ensuring
                evidence-based observations.
              </p>
              <div style={{
                padding: 24, background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                borderRadius: 12, marginTop: 20, border: '1px solid #c4b5fd'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, color: '#6b21a8' }}>🔍 KEY FEATURES</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>Message Filtering:</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Agents see only their own messages, preventing confabulation
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>JSON Output:</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Structured anomaly reports with evidence citations
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>Transparency:</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Agents acknowledge when they see nothing wrong
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>Non-Participants:</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Agents not in session can still join Phase 2
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="protocol-phase-card" style={{
            display: 'flex', gap: 32, padding: 40, background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)', border: '2px solid #06b6d4',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.15)'
          }}>
            <div className="phase-number" style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 900, color: 'white', flexShrink: 0
            }}>3</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: '#06b6d4' }}>
                Phase 3: Peer Consultation Protocol
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Agents receive each other's Phase 2 reports and, in turns, can <strong>interrogate their peers</strong> —
                asking follow-up questions, requesting clarifications, or challenging observations. This structured
                dialogue lets agents cross-reference their partial views of the session. Once the consultation
                concludes, each agent produces its <strong>final fault attribution decision</strong> with a full justification.
              </p>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="protocol-phase-card" style={{
            display: 'flex', gap: 32, padding: 40, background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)', border: '2px solid #10b981',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
          }}>
            <div className="phase-number" style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 900, color: 'white', flexShrink: 0
            }}>4</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: '#10b981' }}>
                Phase 4: Weighted Voting with Hamming Distance
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7, fontSize: '1.05rem' }}>
                Agent votes are weighted based on their <strong>proximity to the suspected error location</strong> using
                Hamming distance in the error vector space. Agents voting for themselves receive maximum weight; votes
                far from their position receive lower weight.
              </p>
              <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', marginTop: 20, border: '1px solid #10b981' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, color: '#065f46' }}>📊 VOTING FORMULA</div>
                <div style={{
                  fontFamily: 'monospace', fontSize: '0.9rem', background: '#fff',
                  padding: 20, borderRadius: 8, color: '#064e3b', lineHeight: 1.9,
                  border: '1px solid #34d399'
                }}>
                  <strong>Hamming Similarity:</strong><br/>
                  similarity = 1 - (hamming_distance / N_dimensions)<br/><br/>

                  <strong>Vote Weight:</strong><br/>
                  weight = baseline + 0.5 × similarity<br/><br/>

                  <strong>Example:</strong><br/>
                  • Agent voting for self: weight ≈ 0.75 (high confidence)<br/>
                  • Agent voting nearby: weight ≈ 0.58 (medium)<br/>
                  • Agent voting far: weight ≈ 0.42 (low)<br/><br/>

                  <strong>Final Consensus:</strong><br/>
                  consensus[i] = sum(vote[i] × weight) / sum(weights)
                </div>
              </div>
            </div>
          </div>

          {/* Phase 5 */}
          <div className="protocol-phase-card" style={{
            display: 'flex', gap: 32, padding: 40, background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)', border: '2px solid #fb923c',
            boxShadow: '0 4px 20px rgba(251, 146, 60, 0.15)'
          }}>
            <div className="phase-number" style={{
              width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #fb923c, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 900, color: 'white', flexShrink: 0
            }}>5</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: '#f59e0b' }}>
                Phase 5: Fault Localization
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Once all weighted votes are aggregated, POIROT identifies the <strong>most probable fault location</strong>:
                the component or set of components with the highest consensus score across the error vector space.
                The result is a ranked attribution — indicating not just where the failure likely originated,
                but with what degree of collective confidence.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── BLAME Benchmark ─── */}
      <section className="container" style={{ padding: '0 24px 80px' }}>
        <div className="card" style={{
          padding: '48px',
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          border: '2px solid #7c3aed',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '8rem', opacity: 0.05 }}>🔬</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: '#7c3aed', marginBottom: 8 }}>
                OUR EVALUATION BENCHMARK
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 16, color: '#4c1d95' }}>
                📐 BLAME
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#5b21b6', lineHeight: 1.7, marginBottom: 0 }}>
                <strong>Benchmark for Localizing Agent Malfunctions Effectively</strong> — the open evaluation suite
                we developed to validate POIROT across two distinct multi-agent domains. BLAME provides structured
                fault injection scenarios, ground truth attribution vectors, and standardized metrics for benchmarking
                agent debugging protocols.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 260 }}>
              <div style={{
                padding: '20px 24px', background: 'white', borderRadius: 12,
                border: '1px solid #c4b5fd', boxShadow: '0 2px 8px rgba(124,58,237,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>🏥</span>
                  <strong style={{ color: '#4c1d95', fontSize: '1rem' }}>CORTEX</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6d28d9', lineHeight: 1.6 }}>
                  Medical rehabilitation · 7 dimensions · 15 fault scenarios · 3 agents
                </div>
              </div>
              <div style={{
                padding: '20px 24px', background: 'white', borderRadius: 12,
                border: '1px solid #c4b5fd', boxShadow: '0 2px 8px rgba(124,58,237,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>💹</span>
                  <strong style={{ color: '#4c1d95', fontSize: '1rem' }}>TradingAgents</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6d28d9', lineHeight: 1.6 }}>
                  Algorithmic trading · 15 dimensions · 6 fault scenarios · 12 agents
                </div>
              </div>
              <a
                href="https://github.com/11inaki11/blame"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button className="btn btn-primary" style={{
                  width: '100%', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  fontSize: '0.95rem', padding: '12px 24px'
                }}>
                  📊 View BLAME on GitHub →
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Results ─── */}
      <section className="container" style={{ padding: '0 24px 80px' }}>
        <h2 className="section-heading" style={{ fontSize: '2.4rem', marginBottom: 48, textAlign: 'center' }}>
          📈 Validation Results
        </h2>

        {/* Who & When highlight card */}
        <div className="card" style={{
          padding: 48, background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '2px solid #0ea5e9', position: 'relative', overflow: 'hidden', marginBottom: 32
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '8rem', opacity: 0.05 }}>⏱️</div>
          <div style={{ marginBottom: 8, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: '#0284c7' }}>
            OPEN BENCHMARK
          </div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8, color: '#0c4a6e' }}>
            ⏱️ Who &amp; When Benchmark
          </h3>
          <p style={{ color: '#075985', fontSize: '1rem', lineHeight: 1.7, maxWidth: 680, marginBottom: 32 }}>
            An open multi-agent benchmark evaluating fault attribution on dynamic, real-world conversational tasks —
            identifying <em>which agent</em> made an error and <em>at what point</em>. POIROT achieves <strong>42% overall accuracy</strong> on
            126 heterogeneous cases, with perfect attribution on single-agent scenarios and strong performance as pipeline complexity grows.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { value: '42%', label: 'Overall accuracy', note: '53 / 126 correct' },
              { value: '100%', label: 'Single-agent tasks', note: '4/4 — perfect attribution' },
              { value: '67%', label: '4-agent tasks', note: '6/9 correct' },
              { value: '126', label: 'Total cases', note: 'Across task categories' },
            ].map(({ value, label, note }) => (
              <div key={value}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0284c7', marginBottom: 6 }}>{value}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#075985' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: '#7dd3fc', marginTop: 4 }}>{note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BLAME results: CORTEX + TradingAgents side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* CORTEX */}
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: '1.4rem' }}>🏥</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                BLAME · CORTEX — POIROT vs. Baseline
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { model: 'Gemini 2.5 Pro',   poirot: 45, baseline: 28, color: '#185FA5' },
                { model: 'DeepSeek Reasoner', poirot: 43, baseline: 17, color: '#993556' },
                { model: 'GPT-oss 120B',      poirot: 32, baseline: 31, color: '#10b981' },
                { model: 'GPT-oss 20B',       poirot: 20, baseline: 14, color: '#8b5cf6' },
              ].map(({ model, poirot, baseline, color }) => (
                <div key={model}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {model}
                  </div>
                  {/* Baseline row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: 52, flexShrink: 0 }}>Baseline</span>
                    <div style={{ flex: 1, height: 7, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ width: `${baseline}%`, height: '100%', background: '#94a3b8', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', width: 28, textAlign: 'right', flexShrink: 0 }}>{baseline}%</span>
                  </div>
                  {/* POIROT row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color, width: 52, flexShrink: 0 }}>POIROT</span>
                    <div style={{ flex: 1, height: 7, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ width: `${poirot}%`, height: '100%', background: color, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color, width: 28, textAlign: 'right', flexShrink: 0 }}>{poirot}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TradingAgents */}
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: '1.4rem' }}>💹</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                BLAME · TradingAgents — POIROT vs. Baseline
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { model: 'Gemini 2.5 Pro',   poirot: null, baseline: null, color: '#185FA5' },
                { model: 'DeepSeek Reasoner', poirot: null, baseline: null, color: '#993556' },
                { model: 'GPT-oss 120B',      poirot: null, baseline: null, color: '#10b981' },
                { model: 'GPT-oss 20B',       poirot: null, baseline: null, color: '#8b5cf6' },
              ].map(({ model, color }) => (
                <div key={model}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {model}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: 52, flexShrink: 0 }}>Baseline</span>
                    <div style={{ flex: 1, height: 7, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(90deg,#e2e8f0 0,#e2e8f0 6px,transparent 6px,transparent 12px)', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', width: 28, textAlign: 'right', flexShrink: 0 }}>—</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color, width: 52, flexShrink: 0 }}>POIROT</span>
                    <div style={{ flex: 1, height: 7, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ width: '100%', height: '100%', background: `repeating-linear-gradient(90deg,${color}33 0,${color}33 6px,transparent 6px,transparent 12px)`, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color, width: 28, textAlign: 'right', flexShrink: 0 }}>—</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 20, padding: '10px 14px', background: '#fef9c3',
              borderRadius: 8, fontSize: '0.78rem', color: '#854d0e', border: '1px solid #fde68a'
            }}>
              ⏳ Results in progress — data being collected across models
            </div>
          </div>

        </div>
      </section>

      {/* ─── Live Demonstrations ─── */}
      <section id="demos" className="container" style={{ padding: '0 24px 80px' }}>
        <h2 className="section-heading" style={{ fontSize: '2.4rem', marginBottom: 16, textAlign: 'center' }}>
          🎬 Live Demonstrations
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: 800, margin: '0 auto 48px', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Explore real POIROT analyses across two multi-agent systems from the BLAME benchmark. Each case shows
          the complete 5-phase protocol with actual error injection, agent deliberation, and consensus voting.
        </p>

        <div className="scenario-grid">
          {/* CORTEX */}
          <Link href="/demo/cortex">
            <div className="scenario-card cortex">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-pink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                }}>🏥</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>CORTEX</h3>
                  <div className="scenario-domain">Medical Robotics — Exoskeleton Rehabilitation</div>
                </div>
              </div>
              <p className="scenario-desc">
                A multi-agent system of medical specialists evaluates pediatric cerebral palsy rehabilitation
                with the Discover2Walk exoskeleton. Explore cases ranging from single-agent errors to
                simultaneous five-component failures — and watch POIROT build consensus attribution.
              </p>
              <div className="scenario-stats">
                <span className="stat"><strong>7</strong> dimensions</span>
                <span className="stat"><strong>3</strong> specialist agents</span>
                <span className="stat"><strong>4</strong> selectable cases</span>
              </div>
              <div style={{
                marginTop: 20, padding: 12, background: '#fce7f3', borderRadius: 8,
                fontSize: '0.8rem', color: '#9f1239', fontWeight: 600
              }}>
                💉 Errors: Doctor-X · Sensor-X · Parent-X · Multi-fault
              </div>
              <div className="scenario-arrow">→</div>
            </div>
          </Link>

          {/* TradingAgents */}
          <Link href="/demo/trading">
            <div className="scenario-card trading">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-cyan)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                }}>💹</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>TradingAgents</h3>
                  <div className="scenario-domain">Financial Markets — Algorithmic Trading</div>
                </div>
              </div>
              <p className="scenario-desc">
                A 12-agent financial pipeline spanning data ingestion, research, risk deliberation, and execution.
                Each session operates near the LLM context limit — making fault attribution across the pipeline
                a uniquely demanding challenge.
              </p>
              <div className="scenario-stats">
                <span className="stat"><strong>15</strong> dimensions</span>
                <span className="stat"><strong>12</strong> specialist agents</span>
                <span className="stat"><strong>4</strong> selectable cases</span>
              </div>
              <div style={{
                marginTop: 20, padding: 12, background: '#cffafe', borderRadius: 8,
                fontSize: '0.8rem', color: '#0e7490', fontWeight: 600
              }}>
                💉 Errors: Inverted Reality · Hallucinated Scandal · Amnesiac Judge
              </div>
              <div className="scenario-arrow">→</div>
            </div>
          </Link>
        </div>
      </section>

    </main>
  );
}
