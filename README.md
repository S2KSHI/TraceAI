# ▚ SIFT — Natural-Language SIEM

> An intuitive, natural-language threat investigation and log correlation platform. Ask questions in plain English; SIFT translates intent into executable SIEM queries (SPL/KQL) backed by raw log evidence citations.

---

## 🚀 Live Demo & Deployment

* **Live URL:** [https://trace-ai-zeta.vercel.app/]
* **Repository:** https://github.com/S2KSHI/TraceAI

---

## 🛠 Key Features

1. **Interactive Threat Investigation Console:** Type natural-language queries (e.g., *"Show failed logins"* or *"Detect port scan"*) to generate native SPL queries, root-cause syntheses, and raw supporting log streams.
2. **Interactive Telemetry Switcher:** Toggle between real-world incident scenarios (*Billing 500 Spike* vs. *CVE-2024-1086 Sweep*) to inspect raw syslog streams alongside high/medium-confidence citations.
3. **Direct SIEM Connectors:** Ingestion topology monitoring latency and health metrics across Splunk, AWS CloudWatch, and Elasticsearch.
4. **Interactive CLI Easter Egg:** Embedded client-side command verification in the footer terminal.

---

## 🏗 Tech Stack & Architecture

* **Frontend:** React 18, Vite
* **Styling:** Custom Modular CSS (Zero third-party CSS dependencies)
* **State Management:** Pure React State Machine (Sub-millisecond view transitions)
* **Icons & Rendering:** Native SVG & CSS-based design

---

## 💻 Local Setup & Installation

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/S2KSHI/TraceAI.git](https://github.com/S2KSHI/TraceAI.git)
   cd TraceAI
