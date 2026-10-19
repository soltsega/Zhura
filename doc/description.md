Yes. If you are going to give this to a coding model such as **Freebuff** and ask it to generate the prototype, you should give it a **complete product specification**, not just "build a blockchain voting website."

Here is a copy-paste-ready prompt. I have designed it so the model understands the **business purpose, UI, architecture, roles, workflows, and demo requirements**.

# Build Specification: Zhura

## 1. Product Name

**Zhura — Trust Infrastructure for Digital Elections & Governance**

Tagline:

**"Trust in Every Vote."**

---

# 2. Product Vision

Build a professional, startup-quality web application called **Zhura**.

Zhura is a **Governance-as-a-Service (GaaS)** platform that enables organizations to conduct secure, transparent, and independently auditable elections and governance processes.

The initial use case is election management, but the platform must be designed to support:

* National and local elections
* Corporate board elections
* Bank shareholder/board elections
* University elections
* Cooperative elections
* Professional association elections
* NGO elections
* Referendums
* Organizational decision-making

The platform should NOT look like a university project or a simple voting application.

It should look like a **professional technology startup/SaaS product** that could eventually be sold to governments, corporations, banks, universities, and other organizations.

The key value proposition is:

> **Zhura transforms elections from a process participants are expected to trust into a process whose critical records and decisions can be independently verified.**

---

# 3. Core Problem

Traditional elections depend heavily on centralized institutions and administrative processes.

There can be concerns around:

* Lack of transparency
* Administrative errors
* Insider manipulation
* Individual coercion
* Corruption
* Poor auditability
* Difficulty independently verifying rule changes
* Difficulty tracking election expenditure
* Difficulty reconciling records
* Public distrust even when an election may have been conducted fairly

Zhura addresses this by creating a **shared, tamper-evident audit infrastructure**.

The election authority can administer the election, but critical governance actions are independently validated by authorized validator organizations.

---

# 4. Important Design Principle

This is a **prototype/demo**, not a production national-election system.

Use simulated data.

Do NOT integrate with real Ethiopian National ID systems.

Do NOT store real personal information.

Do NOT claim that a simple hash provides production-grade anonymous voting.

Do NOT expose individual voter identities or individual ballot choices publicly.

The prototype should demonstrate the architecture and business concept.

---

# 5. Main User Roles

Implement four roles.

## Role 1 — Election Administrator

The administrator represents the organization conducting the election.

Capabilities:

* Create elections
* Edit election configuration before activation
* Add candidates
* Manage voters
* Configure election dates
* Manage polling centers
* Create governance proposals
* Record election expenditures
* Monitor election activity
* View validator activity
* View audit trail
* Finalize election
* Publish results

---

## Role 2 — Validator / CSO

Validators represent independent organizations.

Capabilities:

* View assigned elections
* Review governance proposals
* Approve proposals
* Reject proposals
* Add comments
* View validator network
* View blockchain/audit records
* View election rules
* View proposal history

For the prototype create five simulated validators:

1. Addis Transparency Organization
2. Ethio Civic Network
3. Good Governance Organization
4. Justice & Fairness Organization
5. Peace & Democracy Organization

Use fictional organizations for the prototype.

---

## Role 3 — Voter

Capabilities:

* Log in
* View eligible elections
* View candidates
* View candidate information
* Cast a vote
* Review vote before submission
* Receive confirmation
* View personal voting status

The voter must NOT be able to see how other individuals voted.

The public must not be able to link a voter identity to a candidate.

---

## Role 4 — Public / Guest

No login required.

The public can access the transparency portal and see:

* Election status
* Number of registered voters
* Votes cast
* Turnout
* Candidates
* Public results after publication
* Governance proposals
* Validator decisions
* Election expenditure summaries
* Audit trail
* Blockchain status

Sensitive voter information must never be displayed.

---

# 6. Technology Stack

Use the following stack unless there is a strong technical reason not to.

## Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* Recharts
* Lucide React icons

Use a modern SaaS dashboard design.

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy

## Database

* PostgreSQL

## Blockchain

Use an Ethereum-compatible local development blockchain.

Use:

* Solidity
* Hardhat
* ethers.js

The blockchain should run locally during development.

Do not deploy to mainnet.

---

# 7. Project Structure

Create a clean monorepo:

```text
zhura/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── data/
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── blockchain/
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.ts
│
├── docker-compose.yml
└── README.md
```

Keep frontend, backend, database, and blockchain logically separated.

---

# 8. UI/UX Requirements

The application should look like a premium enterprise SaaS product.

Use:

* Dark navy sidebar
* White/light main content area
* Rounded cards
* Soft shadows
* Clean typography
* Professional spacing
* Subtle borders
* Green for success
* Red for rejection/errors
* Orange for pending actions
* Blue/purple for information
* Responsive layout
* Desktop-first design with mobile responsiveness

The visual style should communicate:

**Security + Trust + Transparency + Enterprise**

Do NOT make it look like a cryptocurrency website.

Do NOT use excessive blockchain/crypto imagery.

Do NOT use a generic template without adapting it to Zhura.

---

# 9. Administrator Dashboard

Create a dashboard similar to a professional enterprise election-management platform.

Sidebar:

```text
Zhura
Trust in Every Vote

Dashboard
Elections
Voters
Candidates
Governance
Expenses
Reports
Audit Trail
Settings
```

Quick actions:

```text
Create Election
Add Voter
New Proposal
Record Expense
```

Dashboard header:

```text
Welcome back, Admin User

Here's what's happening with ABC Bank Board Election 2026.
```

Display separate cards for:

### Card 1 — Election Overview

Show:

```text
ABC Bank Board Election 2026

Status: LIVE

500 Total Voters
372 Votes Cast
74.4% Turnout
4 Days Remaining
5/5 Validators Online
```

Button:

`View Full Overview`

---

### Card 2 — Voting Progress

Show a circular progress chart:

```text
74.4%

Turnout

372 Votes Cast
500 Total Voters
```

Button:

`View Voting Details`

---

### Card 3 — Results Summary

Show horizontal candidate bars:

```text
Candidate A     132    35.5%
Candidate B     119    32.0%
Candidate C      83    22.3%
Candidate D      25     6.7%
Candidate E      13     3.5%
```

Button:

`View Full Results`

---

### Card 4 — Governance & Proposals

Show:

```text
7 Total Proposals
6 Approved
1 Rejected
0 Pending
```

Latest proposal:

```text
#0042 Extend Election Closing Time

Status: APPROVED

Required quorum: 4/5
Approved: 4/5
```

Button:

`View All Proposals`

---

### Card 5 — Expenditure Summary

Show:

```text
7.84M ETB
Total Spent
```

Use a donut chart with:

```text
Polling Workers
Observers
Logistics
Equipment
Administration
Training
```

Button:

`View Expense Details`

---

### Card 6 — Validator Network

Show:

```text
5/5
Active Validators

4
Quorum Required

Healthy
Network Status
```

List validators with Online badges.

Button:

`View Network Details`

---

### Card 7 — Audit Trail

Show:

```text
18,342
Total Records on Chain

Latest Block
#18,342
```

Button:

`View Audit Trail`

---

### Card 8 — Recent Activity

Display:

```text
Rule change proposal #0042 approved
Voting center 012 reported results
Expense recorded: Transportation
New voter registered
```

Show timestamps.

---

### Card 9 — Quick Actions

Display four action tiles:

```text
Create Election
Add Voter
New Proposal
Record Expense
```

---

# 10. Election Management

Create an Elections page.

Show election cards/table containing:

* Election name
* Election type
* Status
* Start date
* End date
* Registered voters
* Votes cast
* Turnout
* Validators
* Actions

Statuses:

* Draft
* Scheduled
* Live
* Completed
* Suspended

Allow administrator to create a new election.

Form fields:

```text
Election Name
Election Type
Description
Start Date
End Date
Number of Seats
Voting Method
Eligibility Rules
```

---

# 11. Candidate Management

Create a Candidates page.

Each candidate card should show:

* Candidate name
* Position
* Short biography
* Qualifications
* Organization
* Status

Allow admin to add/edit/remove candidates before the election starts.

---

# 12. Voter Management

Create a Voters page.

Show:

```text
Voter ID
Registration Status
Eligibility
Voting Status
Registration Date
```

Example:

```text
VTR-0001
Eligible
Not Voted
```

After voting:

```text
VTR-0001
Eligible
Voted
```

Do not expose the candidate selected by that voter.

Include:

* Search
* Filter
* Add voter
* Import voters
* Eligibility status
* Voting status

For the prototype, use generated dummy voters.

---

# 13. Voting Interface

Create a clean voter-facing voting experience.

The workflow should have three steps:

```text
1. Verify Identity
        ↓
2. Select Candidate
        ↓
3. Review & Confirm
```

Example:

```text
ABC Bank Board Election 2026

Select your candidates

Candidate A
Candidate B
Candidate C
Candidate D
Candidate E
```

Allow the voter to select according to the election rules.

Before submitting:

```text
Review Your Vote

You have selected:
Candidate B

[Back] [Confirm Vote]
```

After confirmation:

```text
✓ Vote Successfully Recorded

Your ballot has been securely recorded.

Ballot Reference:
VR-8F29A1...

Your identity is not publicly linked to your ballot.

[Return to Dashboard]
```

---

# 14. Double Voting Protection

If a voter attempts to vote twice:

Display:

```text
Vote Already Recorded

This voting credential has already been used for this election.

Your second ballot was not accepted.
```

The backend must enforce this.

Do not rely only on frontend validation.

---

# 15. Governance System

This is one of the most important features.

Create a Governance page.

The election authority can create proposals such as:

```text
Extend voting period
Suspend polling center
Add polling center
Change election configuration
Activate emergency procedure
Update election protocol
```

Each proposal should contain:

```text
Proposal ID
Title
Description
Proposed By
Created At
Current Status
Required Quorum
Validator Votes
```

---

# 16. Validator Governance Workflow

Example proposal:

```text
Proposal #0042

Extend Election Closing Time

Current:
18:00

Proposed:
20:00

Reason:
Technical disruption at multiple centers.

Required Approval:
4 of 5 validators
```

Validator dashboard should show:

```text
Validator Votes

Addis Transparency Organization      APPROVE
Ethio Civic Network                  APPROVE
Good Governance Organization         APPROVE
Justice & Fairness Organization      APPROVE
Peace & Democracy Organization       REJECT
```

Then show:

```text
4 / 5 APPROVED

QUORUM REACHED

Proposal Accepted
```

The smart contract should determine whether quorum has been reached.

Do not hardcode the final decision only in the frontend.

---

# 17. Governance Attack Demonstration

Create a demonstration of unauthorized modification.

Suppose the administrator tries to directly modify an election rule without validator approval.

Display:

```text
TRANSACTION REJECTED

Unauthorized governance modification.

Required:
4/5 validator approvals

Current:
0/5

The election authority can propose changes,
but cannot unilaterally execute protected changes.
```

This is a key demonstration of Zhura's value proposition.

---

# 18. Expenditure Management

Create an Expenses page.

Categories:

```text
Polling Workers
Observers
Logistics
Equipment
Training
Administration
Transportation
Other
```

Example:

```text
Polling Workers       2,500,000 ETB
Observers               850,000 ETB
Logistics             1,200,000 ETB
Equipment             3,400,000 ETB
Administration          450,000 ETB
Training                600,000 ETB
```

Show:

* Total budget
* Total spent
* Remaining budget
* Spending by category
* Spending over time
* Individual expense records

Each expense should have:

```text
Expense ID
Category
Amount
Description
Authorized By
Timestamp
Document Hash
Status
```

The actual supporting document can remain off-chain.

Store a cryptographic hash of the document.

---

# 19. Blockchain Audit Trail

Create a dedicated Audit Trail page.

Display blockchain events as a professional table:

```text
Block
Transaction
Event
Actor
Timestamp
Status
```

Example:

```text
#18342
0x8f3...a21
Rule Change Approved
CSO Validator
2 mins ago
Verified
```

Clicking an event should open details:

```text
Transaction Hash
Block Number
Timestamp
Event Type
Actor
Previous State
New State
Validator Approvals
Smart Contract
```

Add a visual chain/history representation.

---

# 20. Public Transparency Portal

Create a separate public-facing interface.

It should look more like a modern public information website than an admin dashboard.

Header:

```text
Zhura

Elections
Results
Governance
Audit
About
Help

[Live Election]
```

Hero section:

```text
ABC Bank Board Election 2026

Transparent. Verifiable. Trusted by All.

Election Status:
LIVE
```

Display:

```text
500
Registered Voters

372
Votes Cast

74.4%
Turnout

5
Independent Validators
```

Tabs:

```text
Results
Governance
Expenses
Audit Trail
Election Information
```

The public should be able to independently inspect election information.

---

# 21. Results Page

Display results using clean charts.

Example:

```text
Candidate A     132     35.5%
Candidate B     119     32.0%
Candidate C      83     22.3%
Candidate D      25      6.7%
Candidate E      13      3.5%
```

Include:

* Total votes
* Turnout
* Invalid ballots
* Finalization status
* Timestamp
* Verification status

Add:

```text
✓ Results Verified
```

only after the simulated finalization process has completed.

---

# 22. Security Model

The prototype should demonstrate the following principles:

### Identity privacy

Never store raw national IDs on-chain.

For the prototype, use:

```text
Dummy Voter ID
        ↓
Credential
        ↓
Hash / commitment
        ↓
Blockchain
```

Use simulated credentials.

### Double voting

A voting credential can only be used once.

### Access control

Implement role-based access control:

```text
ADMIN
VALIDATOR
VOTER
PUBLIC
```

### Governance control

Protected election rules require validator quorum.

### Auditability

Critical events generate blockchain/audit records.

---

# 23. Smart Contracts

Create three contracts.

## ElectionContract

Responsible for:

```text
createElection
openElection
closeElection
registerCandidate
```

## VotingContract

Responsible for:

```text
castVote
checkCredential
preventDoubleVote
finalizeResults
```

## GovernanceContract

Responsible for:

```text
createProposal
voteOnProposal
checkQuorum
executeProposal
```

Use a configurable validator count.

For five validators:

```text
Total validators = 5
Required quorum = 4
```

The quorum calculation should be implemented logically rather than manually deciding the result in the UI.

---

# 24. Blockchain Data

Do not put sensitive personal information on-chain.

The blockchain should contain things such as:

```text
Election ID
Election state
Governance proposals
Validator approvals
Event hashes
Ballot commitments
Expense document hashes
Result finalization records
Timestamps
```

Sensitive information should remain off-chain.

---

# 25. Backend API

Create REST endpoints such as:

```text
POST   /api/elections
GET    /api/elections
GET    /api/elections/{id}

POST   /api/candidates
GET    /api/candidates

POST   /api/voters
GET    /api/voters

POST   /api/votes
GET    /api/votes/status

POST   /api/proposals
GET    /api/proposals
POST   /api/proposals/{id}/vote

POST   /api/expenses
GET    /api/expenses

GET    /api/audit
GET    /api/blockchain/status
```

Use Pydantic validation.

Implement proper error handling.

---

# 26. Demo Data

The application must work immediately after startup with seeded data.

Create a demo election:

```text
ABC Bank Board Election 2026
```

Use:

```text
500 voters
5 candidates
5 validators
7 governance proposals
1 rejected proposal
6 approved proposals
18,342 simulated blockchain records
7.84M ETB expenditure
```

Candidates:

```text
Candidate A
Candidate B
Candidate C
Candidate D
Candidate E
```

Do not use real people's names.

---

# 27. Demo Accounts

Create easy demo accounts.

Administrator:

```text
admin@zhura.demo
password: demo123
```

Validator:

```text
validator@zhura.demo
password: demo123
```

Voter:

```text
voter@zhura.demo
password: demo123
```

Public users do not require authentication.

Clearly label these as DEMO accounts.

---

# 28. Main Demo Scenario

The application must support this complete demonstration:

### Step 1

Administrator logs in.

### Step 2

Administrator opens:

```text
ABC Bank Board Election 2026
```

### Step 3

Show:

```text
500 voters
372 votes
74.4% turnout
5 validators
```

### Step 4

A voter logs in and casts a vote.

### Step 5

The system generates a ballot commitment and records the event.

### Step 6

The voter tries to vote again.

The system rejects the second vote.

### Step 7

Administrator creates:

```text
Extend election closing time
18:00 → 20:00
```

### Step 8

Validator dashboard displays the proposal.

### Step 9

Four of five validators approve.

### Step 10

The smart contract determines that quorum has been reached.

### Step 11

The proposal becomes:

```text
APPROVED
```

### Step 12

The audit trail shows the governance transaction.

### Step 13

Administrator attempts an unauthorized rule change.

The smart contract rejects it.

### Step 14

Open the public transparency portal.

Show:

* Election statistics
* Governance decision
* Expenditure
* Audit trail
* Validator status

This should be the primary startup demonstration.

---

# 29. Business Model

Zhura is not intended to be a philanthropic project.

Position it as a commercial technology company.

Business model:

## Governance-as-a-Service

Organizations pay for elections and governance events.

Possible pricing model:

```text
Basic
Small organizational elections

Professional
Universities / cooperatives / associations

Enterprise
Banks / corporations / large organizations

Government
Large-scale elections / referendums
```

Revenue can come from:

* Election setup fees
* Per-election fees
* Per-voter fees
* Enterprise subscriptions
* Validator infrastructure
* Security services
* Audit services
* Custom integrations
* Long-term support and maintenance

Do not hardcode pricing unless necessary.

---

# 30. Product Expansion

The system must be designed so "Election" is an abstract concept.

Future products:

```text
National Elections
Local Elections
Referendums
Bank Board Elections
Corporate Shareholder Elections
University Elections
Cooperative Elections
Professional Association Elections
NGO Elections
```

The platform should therefore use configurable election types.

---

# 31. Landing Page

Create a professional landing page for Zhura.

Hero:

```text
Trust in Every Vote.

Secure, transparent, independently auditable
elections and governance infrastructure.

[Request a Demo]
[Explore Platform]
```

Sections:

### Problem

```text
Elections require trust.
Governance requires accountability.
Records require independent verification.
```

### Solution

Explain Zhura.

### How It Works

```text
1. Create
2. Verify
3. Vote
4. Validate
5. Audit
```

### Features

Cards:

```text
Secure Voting
Independent Validation
Governance Automation
Transparent Expenditure
Immutable Audit Trail
Privacy-Preserving Identity
```

### Use Cases

```text
Governments
Banks
Corporations
Universities
Cooperatives
Associations
```

### Call to Action

```text
Build elections people can verify.

[Request a Demo]
```

---

# 32. Important UI Rule

Use **separate cards** for major dashboard modules.

Do not combine everything into one giant card.

The dashboard should visually resemble a modern enterprise SaaS platform.

Major cards:

1. Election Overview
2. Voting Progress
3. Results Summary
4. Governance & Proposals
5. Expenditure Summary
6. Validator Network
7. Audit Trail
8. Recent Activity
9. Quick Actions

Each card must have:

* clear title
* icon
* key information
* status indicator
* appropriate visualization
* action button

---

# 33. Responsive Design

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

On mobile, collapse the sidebar into a hamburger menu.

Cards should stack vertically.

Tables should become horizontally scrollable or responsive.

---

# 34. Code Quality

Write production-style code even though this is a prototype.

Requirements:

* TypeScript
* Reusable React components
* Reusable cards
* Reusable tables
* Reusable buttons
* API service layer
* Environment variables
* Clear naming
* Error handling
* Loading states
* Empty states
* Form validation
* Authentication
* Role-based authorization

Do not put everything in one React component.

Do not hardcode the entire application into one file.

---

# 35. Important Prototype Constraint

If the real blockchain integration becomes too complex, implement the application so that the UI and backend remain fully functional using a blockchain service abstraction.

For example:

```text
BlockchainService
       │
       ├── LocalBlockchainService
       │
       └── MockBlockchainService
```

This allows the demo to work reliably while keeping the architecture ready for a real blockchain.

However, implement at least a working local smart-contract demonstration for:

* governance proposal
* validator vote
* quorum
* protected rule execution

---

# 36. Final Goal

The finished application should feel like a **real startup product**, not a school assignment.

A person seeing the demo should immediately understand:

1. What problem Zhura solves.
2. Who pays for it.
3. Why blockchain is being used.
4. How independent validators increase trust.
5. How governance decisions are protected.
6. How voter privacy is considered.
7. How election expenditure becomes auditable.
8. How the product can expand beyond national elections.

The core message should be:

> **Zhura does not sell blockchain. Zhura sells verifiable governance.**

Build the UI first with realistic demo data, then connect the backend and blockchain functionality.

Prioritize a polished, coherent, fully navigable demo over implementing every possible production feature.

### One important recommendation

When you give this to the coding model, **don't ask it to generate the entire project in one shot**. These models often produce a huge amount of code that looks impressive but is poorly connected.

Give it the specification above, then tell it:

> **“First build only the frontend UI with mock data. Do not implement the backend or blockchain yet. Make every page navigable and polished. After I approve the UI, we will implement the backend.”**

Then we'll do the backend and blockchain separately.

That approach will give you a **much better startup demo** in the time you have.
