# Zhuranet — Trust Infrastructure for Digital Elections & Governance

**"Trust in Every Vote."**

Zhuranet is an enterprise **Governance-as-a-Service (GaaS)** platform designed to transform elections and institutional decision-making from opaque processes participants are expected to blindly trust into transparent, independently auditable systems whose outcomes are mathematically verifiable.

---

## 🌐 Live Platform & Mentor Evaluation

| Resource | Live Link | Access Type |
| :--- | :--- | :--- |
| **Live Web Platform** | **[https://zhuranet.onrender.com](https://zhuranet.onrender.com)** | Unified Production Deployment |
| **Interactive API Documentation** | **[https://zhuranet.onrender.com/api/docs](https://zhuranet.onrender.com/api/docs)** | OpenAPI / Swagger Interface |
| **Platform Health Check** | **[https://zhuranet.onrender.com/api/health](https://zhuranet.onrender.com/api/health)** | Live Telemetry & System Status |

> [!WARNING]
> ### ⚠️ Note for Mentor & Evaluators (Cloud Sandbox Limitations):
> This live preview is hosted on **Render's Free Tier**:
> - **Idle Cold-Starts**: Free cloud containers automatically spin down after 15 minutes of inactivity. If the service is accessed while asleep, the initial request will experience a **30 to 45 second wake-up delay** while the container provisions memory and connects to the database.
> - **Service Constraints**: In this shared cloud tier, background blockchain node RPC connections and distributed telemetry services operate in simulated sandbox mode. Certain real-time ledger sync functions or heavy background processes may experience intermittent latency or limited availability.
> - **Full Local Evaluation**: For an instant, full-fidelity evaluation with zero cloud cold-starts, running locally via Docker Compose (`docker compose up --build`) is also provided.

---

### 🔑 Test Accounts for Evaluation

The platform includes pre-seeded institutional credentials representing the primary stakeholder roles:

| Stakeholder Role | Email | Password | Responsibilities & Capabilities |
| :--- | :--- | :--- | :--- |
| **Election Administrator** | `admin@zhura.demo` | `demo123` | Complete election lifecycle management, candidate registration, voter verification, live CSV audit generation |
| **Independent Validator** | `validator@zhura.demo` | `demo123` | Multi-party governance consensus, proposal review, weighted voting, campaign expenditure verification |
| **Authorized Voter** | `voter@zhura.demo` | `demo123` | Digital voting booth access, ballot casting, and cryptographic receipt verification |

---

## 🏛️ The Problem: The Fragility of Centralized Trust

Traditional democratic and institutional elections depend almost entirely on centralized authorities. Even when elections are conducted with integrity, structural vulnerabilities create persistent challenges:

- **Lack of Independent Auditing**: Observers and stakeholders are typically presented with final aggregated totals rather than cryptographic proof of individual ballot inclusion.
- **Unverified Administrative Changes**: Critical parameters—such as voter roll eligibility, candidate qualification, and voting deadlines—are vulnerable to unilateral administrative modification without multi-stakeholder approval.
- **Opaque Expenditure**: Election logistics and campaign financing frequently lack real-time accountability, obscuring financial influence and fund misallocation.
- **Pervasive Public Distrust**: Because conventional processes cannot be independently verified from outside the organizing authority, contested outcomes frequently lead to institutional paralysis and cynicism.

---

## 💡 The Zhuranet Solution

Zhuranet replaces blind trust with **cryptographic verification and distributed oversight**, creating a shared, tamper-evident audit infrastructure applicable to:

- **National, Regional, and Municipal Elections**
- **Commercial Bank & Corporate Board of Directors Elections**
- **Shareholder Annual General Meetings (AGMs)**
- **University Governance & Student Union Elections**
- **Cooperative & Professional Association Leadership Elections**
- **Civic Referendums & Organizational Policy Deliberation**

---

## ⚙️ Core Platform Pillars

### 1. Multi-Stakeholder Validator Consensus
Critical election actions do not rely on a single administrator. System governance proposals—such as candidate qualification, rule changes, and campaign budget authorizations—require multi-party cryptographic approval from independent validator organizations (e.g., civil society organizations, audit firms, and neutral observers) before taking effect.

### 2. Verifiable Secret Ballot Protocol
Voter identity authentication is decoupled from ballot submission. When an authenticated voter submits a ballot:
- The vote is recorded with mathematical integrity proofs.
- The voter receives a unique cryptographic ballot reference and transaction receipt.
- Voters can independently confirm that their ballot was recorded in the tally without exposing who they voted for.

### 3. Transparent Campaign & Logistics Accounting
All operational expenditures (logistics, public notices, observer stipends, and materials) are categorized and published in an open ledger. Administrators and auditors can inspect line-item details and generate instant CSV audit exports directly from the platform.

### 4. Immutable Audit Ledger
Every high-impact state change—from election creation to vote casting and validator approvals—generates an immutable audit event recording the actor, prior state, new state, cryptographic hash, and timestamp.

---

## 🖥️ Dedicated Stakeholder Workspaces

- **Administrative Console**: Comprehensive dashboard tracking live voter turnout percentages, vote distributions across candidates, budget burn rates, and active governance proposals.
- **Independent Validator Portal**: Specialized queue where accredited civil society organizations inspect pending policy proposals, submit weighted approvals or rejections, and attach explanatory findings.
- **Digital Voting Booth**: Accessible, distraction-free ballot interface supporting multiple electoral systems (Single Transferable Vote, First-Past-the-Post, and Referendums) with instantaneous receipt generation.
- **Public Governance Telemetry Portal**: Citizen-facing transparency portal allowing observers and the public to review election rules, candidate platforms, and audit records in real time.

---

## 🚀 Running Locally (Full-Fidelity Stack)

To run the complete platform locally with live database and simulated blockchain nodes:

### Quick Start with Docker

```bash
docker compose up --build
```

Once started, the services are available at:
- **Web Application**: `http://localhost:5173`
- **FastAPI Backend**: `http://localhost:8000`
- **Interactive API Documentation**: `http://localhost:8000/api/docs`

---

## 📄 License & Evaluation Notice

Zhuranet is developed as a Governance-as-a-Service trust infrastructure model. All demonstration data and identities are simulated for platform evaluation.
