import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "dashboard" | "sources"
  const [activeScenario, setActiveScenario] = useState("billing");
  const [cliInput, setCliInput] = useState("");
  const [eggUnlocked, setEggUnlocked] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [queryLogs, setQueryLogs] = useState({
    spl: "",
    analysis: "",
    logs: []
  });

  // Terminal Easter Egg Handler
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (cliInput.trim().toLowerCase() === "whoami") {
      setEggUnlocked(true);
    }
  };

  // Natural Language SIEM Query Parser
  const handleRunCustomQuery = (e) => {
    e.preventDefault();
    const q = customQuery.trim().toLowerCase();
    if (!q) return;

    let generatedSPL = "";
    let analysis = "";
    let logs = [];

    if (q.includes("auth") || q.includes("fail") || q.includes("login") || q.includes("password")) {
      generatedSPL = `index=auth_logs action="failure" | stats count by src_ip, user | where count > 3`;
      analysis = "Detected brute-force credential stuffing attempt across 4 user accounts from IP 192.168.1.45.";
      logs = [
        { time: "04:18:10", src: "auth-svc", level: "WARN", msg: "Failed password for user 'admin' from 192.168.1.45 port 54210" },
        { time: "04:18:12", src: "auth-svc", level: "WARN", msg: "Failed password for user 'root' from 192.168.1.45 port 54212" },
        { time: "04:18:15", src: "auth-svc", level: "ERROR", msg: "Account lockout triggered for 'admin' (threshold: 3 attempts exceeded)" },
        { time: "04:18:16", src: "edge-waf", level: "INFO", msg: "IP 192.168.1.45 added to automated 15-minute rate-limit blocklist" },
      ];
    } else if (q.includes("scan") || q.includes("port") || q.includes("cve") || q.includes("probe")) {
      generatedSPL = `index=edge_waf signature="cve-*" OR event_type="port_sweep" | table _time, src_ip, dest_port, signature`;
      analysis = "Inbound reconnaissance scan detected targeting unpatched internal services on edge ports 8080 and 8443.";
      logs = [
        { time: "04:16:02", src: "edge-waf", level: "MATCH", msg: "103.41.22.14 -> Port 8080 SYN probe [sig:recon-nmap-sweep]" },
        { time: "04:16:04", src: "edge-waf", level: "MATCH", msg: "103.41.22.14 -> Port 8443 SYN probe [sig:cve-2024-1086-probe]" },
        { time: "04:16:05", src: "firewall-01", level: "INFO", msg: "TCP RST drop packet dispatched; host protected" },
      ];
    } else if (q.includes("ddos") || q.includes("spike") || q.includes("traffic") || q.includes("500")) {
      generatedSPL = `index=nginx_ingress status>=500 | timechart span=1m count by host`;
      analysis = "Upstream connection pool exhaustion on billing-api cluster causing HTTP 504 gateway timeouts.";
      logs = [
        { time: "04:14:00", src: "ingress-nginx", level: "WARN", msg: "Active connections spike: 12,400 concurrent req/sec" },
        { time: "04:14:02", src: "billing-api", level: "ERROR", msg: "504 Gateway Timeout: DB connection queue full (depth=500)" },
        { time: "04:14:05", src: "k8s-autoscale", level: "INFO", msg: "HPA triggered: scaling billing-api pods from 4 -> 12" },
      ];
    } else {
      generatedSPL = `index=* "${customQuery}" | head 5`;
      analysis = `Search completed for query "${customQuery}". All events normalized and verified against cluster telemetry.`;
      logs = [
        { time: "04:19:00", src: "cluster-gateway", level: "INFO", msg: `Indexed raw matches for string: "${customQuery}"` },
        { time: "04:19:02", src: "syslog-02", level: "INFO", msg: "Status: 200 OK — zero unhandled error traces found" },
      ];
    }

    setQueryLogs({ spl: generatedSPL, analysis, logs });
  };

  return (
    <div className="page-wrapper">
      {/* Navigation Header */}
      <div className="container">
        <nav className="navbar">
          <div className="brand-group" onClick={() => setCurrentView("home")} style={{ cursor: "pointer" }}>
            <span className="brand-glyph">▚</span>
            <span className="brand-title">SIFT</span>
            <span className="tagline-chip">// natural‑language SIEM</span>
          </div>

          <div className="nav-links">
            <button 
              className={`nav-btn ${currentView === "home" ? "nav-active" : ""}`}
              onClick={() => setCurrentView("home")}
            >
              Overview
            </button>
            <button 
              className={`nav-btn ${currentView === "dashboard" ? "nav-active" : ""}`}
              onClick={() => setCurrentView("dashboard")}
            >
              Live Threat Console
            </button>
            <button 
              className={`nav-btn ${currentView === "sources" ? "nav-active" : ""}`}
              onClick={() => setCurrentView("sources")}
            >
              Log Sources
            </button>
          </div>
        </nav>
      </div>

      {/* VIEW 1: HOME LANDING */}
      {currentView === "home" && (
        <>
          <section className="container hero">
            <h1 className="hero-h1">
              Stop writing SPL.<br />
              <span>Start asking questions.</span>
            </h1>
            <p className="hero-p">
              Sift turns your SIEM into something you can talk to. Plain‑English threat hunting,
              backed by every raw log line it read to get there — nothing hidden, nothing hallucinated.
            </p>
            <div className="hero-actions">
              <button onClick={() => setCurrentView("dashboard")} className="btn-primary">
                Open Live Threat Console →
              </button>
              <button onClick={() => setCurrentView("sources")} className="btn-secondary">
                View Connected Sources
              </button>
            </div>
            <p className="sub-note">No credit card. Connects to your existing log sources in minutes.</p>
          </section>

          {/* Interactive Preview Console */}
          <section className="container demo-section">
            <div className="terminal-window">
              <div className="terminal-topbar">
                <div className="terminal-dots">
                  <div className="tdot tdot-r"></div>
                  <div className="tdot tdot-y"></div>
                  <div className="tdot tdot-g"></div>
                  <span className="terminal-label">sift — prod‑logs</span>
                </div>
                <div className="tab-selector">
                  <button 
                    onClick={() => setActiveScenario("billing")} 
                    className={`tab-pill ${activeScenario === "billing" ? "active" : ""}`}
                  >
                    billing 500 spike
                  </button>
                  <button 
                    onClick={() => setActiveScenario("cve")} 
                    className={`tab-pill ${activeScenario === "cve" ? "active" : ""}`}
                  >
                    CVE-2024-1086 sweep
                  </button>
                </div>
              </div>

              <div className="terminal-content">
                {activeScenario === "billing" ? (
                  <>
                    <div className="log-stream">
                      <div className="log-line"><span className="log-time">03:14:02</span><span className="log-src">billing-api</span><span className="log-warn">WARN</span><span className="log-msg">pool.acquire timeout after 5000ms</span></div>
                      <div className="log-line"><span className="log-time">03:14:02</span><span className="log-src">billing-api</span><span className="log-err">ERROR</span><span className="log-msg">500 /v1/charges — upstream refused</span></div>
                      <div className="log-line"><span className="log-time">03:10:47</span><span className="log-src">secrets-mgr</span><span className="log-info">INFO</span><span className="log-msg">rotated db credential billing/prod (v14)</span></div>
                    </div>
                    <div className="sift-response-card">
                      <div className="sift-badge-row">
                        <span className="sift-name">Sift</span>
                        <span className="conf-pill">high confidence</span>
                      </div>
                      <p className="sift-analysis">The 500s started <strong>3m17s</strong> after secrets‑mgr rotated the billing DB credential — the connection pool never picked up the new secret.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="log-stream">
                      <div className="log-line prompt-line"><span>&gt; did anything hit us for CVE-2024-1086 last night?</span></div>
                      <div className="log-line"><span className="log-time">02:11:14</span><span className="log-src">edge-waf</span><span className="log-warn">MATCH</span><span className="log-msg">103.41.22.14 -&gt; /netfilter probe [sig:cve-2024-1086]</span></div>
                    </div>
                    <div className="sift-response-card">
                      <div className="sift-badge-row">
                        <span className="sift-name">Sift</span>
                        <span className="conf-pill">medium confidence</span>
                      </div>
                      <p className="sift-analysis">Three requests from <strong>103.41.22.0/24</strong> probed the kernel netfilter path between 02:11–02:47 UTC.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Pillars */}
          <section className="container pillars-section">
            <div className="grid-3">
              <div className="pillar-card">
                <div className="pillar-kicker">ASK</div>
                <h3 className="pillar-title">Plain-English queries</h3>
                <p className="pillar-desc">Type the question you'd ask a teammate. Sift handles SPL/KQL translation automatically.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-kicker">INGEST</div>
                <h3 className="pillar-title">Source-agnostic</h3>
                <p className="pillar-desc">Splunk, Microsoft Sentinel, Elastic, raw syslog, or CSV files.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-kicker">CITE</div>
                <h3 className="pillar-title">Answers with receipts</h3>
                <p className="pillar-desc">Every response links back to the exact raw log line and timestamp.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* VIEW 2: LIVE THREAT CONSOLE */}
      {currentView === "dashboard" && (
        <section className="container dashboard-view">
          <div className="view-header">
            <h2>Live Threat Investigation Console</h2>
            <p>Query raw production streams using conversational English.</p>
          </div>

          <form onSubmit={handleRunCustomQuery} className="query-box">
            <input 
              type="text" 
              placeholder="Try: 'Show failed logins', 'Detect port scan', or 'Check 500 spike'..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="query-input"
            />
            <button type="submit" className="btn-primary">Execute Query</button>
          </form>

          {/* Prompt Suggestions */}
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#7d8590" }}>Quick Queries:</span>
            {["Show failed logins", "Detect port scan on edge", "Check 500 error spike"].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setCustomQuery(suggestion)}
                style={{
                  background: "#161b22",
                  border: "1px solid #30363d",
                  color: "#58a6ff",
                  fontSize: "11px",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontFamily: "monospace"
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Results Display */}
          <div className="terminal-window" style={{ marginTop: "20px" }}>
            <div className="terminal-topbar">
              <span className="terminal-label">Investigation Output & Evidence Stream</span>
              <span className="conf-pill">Telemetry: Live</span>
            </div>

            <div className="terminal-content">
              {queryLogs.analysis ? (
                <>
                  <div style={{ background: "#010409", border: "1px solid #21262d", padding: "10px", borderRadius: "6px", marginBottom: "14px", fontFamily: "monospace", fontSize: "12px" }}>
                    <span style={{ color: "#7d8590" }}>// Auto-Generated SIEM Query (SPL):</span>
                    <p style={{ color: "#38bdf8", marginTop: "4px" }}>{queryLogs.spl}</p>
                  </div>

                  <div className="sift-response-card" style={{ marginBottom: "14px" }}>
                    <div className="sift-badge-row">
                      <span className="sift-name">Sift Intelligence</span>
                      <span className="conf-pill">Root Cause Isolated</span>
                    </div>
                    <p className="sift-analysis">{queryLogs.analysis}</p>
                  </div>

                  <span style={{ fontSize: "11px", color: "#7d8590", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Raw Supporting Logs
                  </span>
                  <div className="log-stream" style={{ marginTop: "6px" }}>
                    {queryLogs.logs.map((log, idx) => (
                      <div key={idx} className="log-line">
                        <span className="log-time">{log.time}</span>
                        <span className="log-src">{log.src}</span>
                        <span className={log.level === "ERROR" ? "log-err" : log.level === "WARN" ? "log-warn" : "log-info"}>{log.level}</span>
                        <span className="log-msg">{log.msg}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="log-stream">
                  <div className="log-line">
                    <span className="log-time">Live</span>
                    <span className="log-src">syslog-01</span>
                    <span className="log-info">INFO</span>
                    <span className="log-msg">Ingesting 1.4k events/sec from cluster us-east-2. Type a query above to investigate.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* VIEW 3: LOG SOURCES & TOPOLOGY */}
      {currentView === "sources" && (
        <section className="container sources-view">
          <div className="view-header">
            <h2>Configured Ingestion Endpoints</h2>
            <p>Direct SIEM connectors with zero local agent overhead.</p>
          </div>

          <div className="grid-3" style={{ marginTop: "24px" }}>
            <div className="pillar-card">
              <div className="pillar-kicker">CONNECTOR</div>
              <h3 className="pillar-title">Splunk Cloud Cluster</h3>
              <p className="pillar-desc">Status: <span style={{ color: "#3fb950" }}>Connected (12ms latency)</span></p>
              <p className="sub-note">Ingesting index: prod-k8s-cluster</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-kicker">CONNECTOR</div>
              <h3 className="pillar-title">AWS CloudWatch & WAF</h3>
              <p className="pillar-desc">Status: <span style={{ color: "#3fb950" }}>Connected (4ms latency)</span></p>
              <p className="sub-note">Ingesting edge-waf-stream</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-kicker">CONNECTOR</div>
              <h3 className="pillar-title">Elasticsearch Cluster</h3>
              <p className="pillar-desc">Status: <span style={{ color: "#3fb950" }}>Connected (18ms latency)</span></p>
              <p className="sub-note">Ingesting auth-service logs</p>
            </div>
          </div>
        </section>
      )}

      {/* Terminal Easter Egg Form */}
      <section className="honest-section">
        <div className="container">
          <h3 className="honest-h3">Built by security engineers who got tired of memorizing query syntax.</h3>
          <p className="honest-p">We don't have customer logos to show you yet — so we're not going to make any up.</p>

          <form onSubmit={handleTerminalSubmit} className="terminal-interactive">
            <div className="interactive-row">
              <span className="prompt-dollar">$</span>
              <input 
                type="text" 
                placeholder="type 'whoami' and press Enter..." 
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
              />
            </div>
            {eggUnlocked && (
              <div className="easter-reveal">
                <div className="easter-granted">ACCESS GRANTED — you found it.</div>
                <div className="easter-note">// there's no prize. just the satisfaction. — the Sift team</div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>▚ SIFT &bull; Ask your logs. Not your query language.</p>
      </footer>
    </div>
  );
}