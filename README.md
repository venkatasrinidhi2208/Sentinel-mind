# SentinelMind — Autonomous SRE & Incident Remediation Agent

[![CI/CD Pipeline](https://github.com/sentinel-mind/sentinel-mind/actions/workflows/ci.yml/badge.svg)](https://github.com/sentinel-mind/sentinel-mind/actions)
[![Hindsight Memory Engine](https://img.shields.io/badge/Hindsight-Memory_Engine_v1.0-blueviolet)](https://hindsight.vectorize.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Built for **HackwithHyderabad 3.0** — Demonstrating autonomous incident remediation powered by persistent memory integration.

---

## 🎯 Problem Statement

In modern cloud microservices architectures, production outages (e.g., database deadlock, Redis OOM buffer overflow, API latency spikes, webhooks gateway timeouts) are repetitive and expensive. When production breaks at 2 AM:
- On-call Site Reliability Engineers (SREs) waste 30 to 60 minutes rediscovering root causes that were already resolved weeks or months ago.
- Tribal knowledge is lost when post-mortems sit unindexed in Notion, Slack, or Jira.
- Generic LLM chatbots fail because they provide vague, stateless advice (*"check your server logs and restart your app"*).

**SentinelMind** solves this problem by giving AI SRE agents persistent memory powered by **Vectorize Hindsight**.

---

## 💡 Solution Architecture

SentinelMind acts as an autonomous on-call co-pilot. When a microservice health check fails or an alert is triggered:
1. **Telemetry & Log Capture**: Ingests error signatures, stack traces, and system metrics.
2. **Hindsight Memory Recall**: Queries historical incident memory (`retain` / `recall`) to find matching past incident footprints and verified runbooks.
3. **Multi-Stage AI Orchestration**: Analyzes current context alongside recalled past solutions to generate confidence-scored, evidence-backed remediation plans.
4. **Automated / One-Click Remediation**: Safely executes verified fix commands (e.g., terminating idle database backends, purging unlinked cache keys) and restores service health.
5. **Memory Retention**: Retains newly resolved incident post-mortems in Hindsight memory for continuous organizational learning.

---

## 👥 Team & Contribution Summary

This project was developed collaboratively by a 4-member engineering team with distinct domain ownership across dedicated Git branches:

| Team Member | Role & Ownership | Primary Responsibilities | Branch |
| :--- | :--- | :--- | :--- |
| **Sri** | **Backend & Core Architecture** | Server setup, REST API routes, controllers, data models (`Incident`, `Microservice`, `MemoryRecord`), in-memory data repositories, chaos trigger service, and backend unit tests. | [`sri`](file:///C:/Users/TOTA%20VENKATASRINIDHI/.gemini/antigravity/scratch/sentinel-mind) |
| **Shreyas** | **Frontend & UX** | Responsive application shell, live service health dashboard, chaos engineering control panel, diagnostic terminal, Hindsight memory recall timeline, and before-vs-after comparison view. | [`shreyas`](file:///C:/Users/TOTA%20VENKATASRINIDHI/.gemini/antigravity/scratch/sentinel-mind) |
| **Gowri** | **AI Engine & API Integration** | LLM provider abstraction (Groq / Gemini / OpenAI / Mock), Vectorize Hindsight memory SDK client (`retain` & `recall`), multi-stage AI orchestrator pipeline, and JSON schema validator. | [`gowri`](file:///C:/Users/TOTA%20VENKATASRINIDHI/.gemini/antigravity/scratch/sentinel-mind) |
| **Aashrith** | **Security, Testing & DevOps** | Security headers, rate limiting middleware, input sanitization, API key authentication, audit logging, unified test runner (Unit, AI, Integration, E2E), CI/CD pipeline, and security review. | [`aashrith`](file:///C:/Users/TOTA%20VENKATASRINIDHI/.gemini/antigravity/scratch/sentinel-mind) |

---

## 🏛️ System Architecture Diagram

```
                    SENTINEL-MIND ARCHITECTURE
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       Shreyas Frontend                 Sri Backend API
   (Live Dashboard & Chaos)          (Routes & Controllers)
               │                               │
               └───────────────┬───────────────┘
                               ▼
                        Gowri AI Engine
              ┌────────────────┴────────────────┐
              ▼                                 ▼
    Hindsight Memory Bank              LLM Provider Layer
    (Vectorize Retain/Recall)          (Groq / Gemini / Mock)
              │                                 │
              └────────────────┬────────────────┘
                               ▼
                      Aashrith Security
                 (Rate Limiter, Auth & Audit)
                               │
                               ▼
                      Production Execution
```

---

## ✨ Key Features

- ⚡ **Chaos Engineering Injection Panel**: One-click simulation of production outages (PostgreSQL Pool Exhaustion, Redis OOM, Payment 504 Timeout, Auth API Latency).
- 🧠 **Hindsight Memory Recall Timeline**: Displays historical memory matches, confidence scores, and past verified resolution runbooks.
- 🔄 **Before vs. After Comparison Mode**: Easily toggle between a **Stateless Generic LLM** (vague advice) and **SentinelMind Hindsight Memory** (exact root cause + verified fix).
- 🛠️ **Multi-Stage AI Pipeline**: Input Sanitization ➔ Context Construction ➔ Hindsight Recall ➔ LLM Inference ➔ Response Validation ➔ Confidence Scoring.
- 🛡️ **Enterprise Security & Audit Trail**: Strict Security Headers (CSP, HSTS), Rate Limiting, Input Sanitization, API Key verification, and Audit Event Logging.

---

## 🛠️ Tech Stack & External APIs

- **Runtime**: Node.js v24+, TypeScript 5+
- **Backend Framework**: Express.js
- **AI & Memory Integration**:
  - **Vectorize Hindsight Memory API** (`hindsight.vectorize.io`) — Persistent Memory Retention & Semantic Recall.
  - **Groq API** (`qwen/qwen3-32b` / `openai/gpt-oss-120b`) / **Google Gemini API** — Fast LLM Inference.
  - **Mock Intelligence Provider** — Guaranteed 100% offline fallback test reliability.
- **Frontend**: Responsive HTML5, Custom CSS3, Vanilla JS ES6+ (Fira Code & Inter typography).
- **Testing**: Unified Custom Test Runner (`ts-node tests/runner.ts`) running Unit, AI Schema, Integration, and E2E workflow tests.
- **DevOps**: GitHub Actions (`.github/workflows/ci.yml`).

---

## 🔑 Environment Variables (`.env.example`)

```env
# Application Configuration
PORT=3000
NODE_ENV=development

# Security & Authentication
API_KEY_SECRET=sentinel-mind-secure-dev-key
CORS_ORIGIN=*

# AI & LLM Provider Configuration
GROQ_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
DEFAULT_AI_PROVIDER=mock

# Vectorize Hindsight Memory Configuration
HINDSIGHT_API_KEY=
HINDSIGHT_TENANT_ID=sentinel-mind-sre-tenant
USE_LOCAL_HINDSIGHT_FALLBACK=true
```

---

## 🚀 Installation & Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sentinel-mind/sentinel-mind.git
   cd sentinel-mind
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm start
   ```

5. **Access Application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## 🧪 Testing Instructions

Run the complete unified test suite:
```bash
npm test
```

Test output includes:
- ✅ Backend Service Unit Tests (Sri)
- ✅ AI Layer & Hindsight Recall Tests (Gowri)
- ✅ API Integration Tests (Aashrith)
- ✅ End-to-End Workflow Tests (Aashrith)

To verify TypeScript build & linting:
```bash
npm run build
npm run lint
```

---

## 🔒 Security Audit Review

Prior to integration into `main`, Aashrith conducted the following security review:
- [x] No API keys or secrets committed to Git repository (`.gitignore` configured).
- [x] Input sanitization middleware active against XSS and prompt injection.
- [x] Security headers enforced (`X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `CSP`).
- [x] Rate limiting enabled (120 requests/min per IP).
- [x] Sensitive parameters excluded from audit logs and API responses.

---

## 🌿 Branch Structure

```
main
├── sri
├── shreyas
├── gowri
└── aashrith
```

- **`main`**: Production-ready integrated codebase.
- **`sri`**: Backend REST architecture, models, and incident services.
- **`shreyas`**: Frontend dashboard, UI components, and diagnostic terminal.
- **`gowri`**: AI engine, LLM abstraction, and Vectorize Hindsight memory integration.
- **`aashrith`**: Security middleware, rate limiting, unified tests, and CI/CD workflow.
