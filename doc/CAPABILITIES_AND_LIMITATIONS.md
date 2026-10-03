# ዝሁራ (VeriVote) — Platform Capabilities & Limitations Guide

**VeriVote** is a **Governance-as-a-Service (GaaS)** trust infrastructure designed to enable organizations, banks, corporations, universities, NGOs, and civic entities to conduct secure, transparent, and independently auditable elections.

This document outlines the operational capabilities (**what the platform CAN do**) and current scope boundaries (**what the platform CANNOT do**).

---

## 1. What This Platform CAN Do (Capabilities & Features)

### A. Role-Based Governance Workflows
1. **Election Administrator Console**:
   - Create and configure elections, set voting dates, seats, eligibility criteria, and candidate rosters.
   - Monitor real-time voter turnout, live vote streams, line-item budget expenditures, and validator network health.
   - Submit governance rule-change proposals requiring independent validator approval.

2. **Independent CSO Validator Network (5 Nodes)**:
   - Features 5 simulated Civil Society Organization (CSO) nodes (*Addis Transparency Org, Ethio Civic Network, Good Governance Org, Justice & Fairness Org, Peace & Democracy Org*).
   - Validators inspect, comment on, and vote **Approve** or **Reject** on governance proposals.
   - Enforces a **4 of 5 (80%) Supermajority Quorum** before any administrative rule modification is committed.

3. **Voter Experience & Cryptographic Receipts**:
   - Clean 3-step voting workflow: `1. Verify Credential ID` → `2. Candidate Selection` → `3. Review & Submit`.
   - Generates an immutable, verifiable cryptographic ballot reference code (e.g., `VR-8F29A1B4`) for every cast vote.
   - Displays receipt verification details with copy-to-clipboard functionality.

4. **Public Transparency & Open Audit Portal**:
   - Open-access guest portal requiring no login.
   - Real-time election turnout metrics, candidate standings, validator decision logs, and line-item budget breakdowns.
   - **Ballot Lookup Tool**: Allows voters and observers to enter any ballot reference ID to verify block height inclusion and transaction timestamp without exposing candidate selection.

### B. Security & Smart Contract Safeguards
1. **Quorum Protection & Governance Attack Simulator**:
   - Interactive security test demonstrating real-time rejection (`TRANSACTION REJECTED: Required 4/5 approvals, current 0/5`) when an administrator attempts to directly modify election rules without validator quorum consensus.

2. **Double-Voting Prevention**:
   - Enforces single-vote constraints per credential ID (`VTR-0001` through `VTR-0050`).
   - Interactive test trigger demonstrating immediate smart contract rejection if a voter credential attempts to submit a secondary ballot.

3. **Financial & Budget Transparency**:
   - Line-item budget tracking (Polling Workers, Observers, Logistics, Equipment, Administration, Training) displayed through interactive donut charts and financial ledgers.

4. **Seamless Role Switching**:
   - Topbar header and login screen features 1-click role switcher buttons to test the system as an Administrator, CSO Validator, Voter, or Public Guest without re-logging.

---

## 2. What This Platform CANNOT Do (Scope & Prototype Limitations)

### A. Real Identity & Government System Integration
1. **No Real Ethiopian National ID (Fayda) Integration**:
   - Uses generated dummy credential IDs (e.g., `VTR-0001`).
   - Does **NOT** integrate with real Ethiopian National ID APIs, biometric scanners, or government databases.
2. **No Storage of Real Personally Identifiable Information (PII)**:
   - Does **NOT** store real names, phone numbers, National ID numbers, or biometric data.

### B. Blockchain & Network Infrastructure
1. **No Live Public Mainnet Deployment**:
   - Operates on a local Hardhat development node or simulated in-memory ledger (`USE_MOCK_BLOCKCHAIN=true`).
   - Does **NOT** deploy to Ethereum Mainnet, Polygon, or public web3 networks.
2. **No Web3 Wallet (MetaMask) Prerequisite**:
   - Users do **NOT** need crypto wallets, seed phrases, or gas tokens (ETH/MATIC) to cast votes or validate proposals.

### C. Cryptographic & Legal Boundaries
1. **No Production-Grade Zero-Knowledge (ZK) Proofs**:
   - Generates simulated Zero-Knowledge cryptographic ballot references for prototype demonstration.
   - Does **NOT** run full ZK-SNARK / ZK-STARK circuit proof compilation.
2. **No Legal Statutory Binding**:
   - Designed as a technology prototype / demonstration platform; does **NOT** constitute legally certified national election software out-of-the-box.
3. **No Physical In-Person Hardware Interface**:
   - Does **NOT** interface with physical Direct Recording Electronic (DRE) voting machines, paper ballot scanners, or biometric thumbprint hardware.

---

## 3. Architecture Summary

| Layer | Technologies Used | Status |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts | Fully Functional |
| **Backend API** | Python, FastAPI, SQLAlchemy, Pydantic | Fully Functional (`http://localhost:8000`) |
| **Database** | SQLite / PostgreSQL | Active (`zihura.db`) |
| **Blockchain** | Solidity, Hardhat, Ethers.js | Local Dev Node / Mock |

---

*Document compiled for Zhura / VeriVote Platform Architecture & Operational Scope.*
