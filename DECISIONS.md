# Architectural & Engineering Decisions — SIFT

### 1. Presentation Strategy vs. Rejected Alternatives
* **Decision:** Built an interactive telemetry and threat-hunting simulation (`billing 500 spike` and `CVE sweep`) with raw log evidence and confidence tags using pure React state.
* **Alternative Rejected:** Static screenshots or pre-rendered GIFs.
* **Reasoning:** Static visuals fail to demonstrate state-handling capabilities. An interactive terminal satisfies the "3-second rule" by proving product utility immediately.

### 2. Trade-offs Under Time Constraints
* **Focus:** Prioritized a high-contrast dark developer theme and pure CSS responsive styling over adding third-party UI libraries (e.g., Tailwind, Shadcn).
* **What I'd add with more time:** Live Web Worker integration for client-side regex parsing and automated Playwright end-to-end regression tests.

### 3. AI Tool Utilization & Integrity
* **Where AI was used:** Assisted in structuring mock syslog entries and verifying regex matching patterns.
* **Personal verification:** Manually authored component logic, implemented the `$ whoami` terminal easter egg, and ensured zero fake testimonials or logos were used.