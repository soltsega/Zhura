# Zihura

**Trust in Every Vote.**

Zihura is a prototype governance and election platform. It brings together an election management interface, a FastAPI service, a relational database, and Solidity contracts for local development. The project is intended for demonstration and development with simulated data.

> **Prototype notice:** This software is not certified or suitable for conducting real elections. Do not use real voter information. The demo uses mock data and can run with a simulated blockchain; it does not provide production-grade ballot secrecy or identity verification.

## What’s included

- **Web app** — React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, and Lucide icons. Includes administrator, validator, voter, and public-facing demo screens.
- **API** — FastAPI with SQLAlchemy models and endpoints for authentication, elections, candidates, voters, votes, proposals, expenses, and audit records.
- **Data store** — SQLite is the API’s default configuration; Docker Compose starts PostgreSQL for a containerized setup.
- **Smart contracts** — Solidity contracts and a Hardhat local development node.
- **Demo behavior** — The frontend currently uses local mock data. Its screens are not wired to the backend API.

## Repository layout

```text
.
├── backend/             # FastAPI service, models, and API
├── blockchain/          # Solidity contracts, Hardhat scripts, and tests
├── doc/                 # Product description and scope notes
├── frontend/            # React + TypeScript web app
├── docker-compose.yml   # PostgreSQL, API, web app, and local chain
└── serve.js             # Serves the built frontend on port 4181
```

## Run locally

### Frontend only

Requires Node.js and npm. From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Useful frontend commands (run from `frontend/`):

```bash
npm run build       # Type-check and create a production build in dist/
npm run preview     # Preview the production build
npm run lint        # Run Oxlint
```

### Backend API

Requires Python 3.12 or newer. From the repository root:

```bash
cd backend
python -m venv .venv
# Activate the environment:
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux:        source .venv/bin/activate
python -m pip install -r requirements.txt
```

The backend reads configuration from environment variables (the settings are defined in `backend/app/config.py`). To use the included example configuration, copy `backend/.env.example` to `backend/.env` and adjust values for your environment. The example uses PostgreSQL; for a simple local run, set `DATABASE_URL=sqlite:///./zihura.db` instead.

Start the service from `backend/`:

```bash
uvicorn app.main:app --reload --port 8000
```

The API is at [http://localhost:8000](http://localhost:8000), interactive docs at [http://localhost:8000/api/docs](http://localhost:8000/api/docs), and health check at [http://localhost:8000/api/health](http://localhost:8000/api/health).

### Docker Compose

Requires Docker Compose. From the repository root:

```bash
docker compose up --build
```

This starts PostgreSQL on port `5432`, the API on `8000`, the Vite frontend on `5173`, and a Hardhat node on `8545`. Stop the services with `docker compose down`. Compose uses a named PostgreSQL volume, so database data persists across restarts; remove that volume separately if you intend to discard it.

### Local blockchain

Requires Node.js and npm. In a terminal, start the local Hardhat node:

```bash
cd blockchain
npm install
npm run node
```

In a second terminal, deploy the contracts to that node:

```bash
cd blockchain
npm run deploy:local
```

The node listens on `http://127.0.0.1:8545`. The backend example configuration sets `USE_MOCK_BLOCKCHAIN=true`; set it to `false` when configuring the backend to use the local RPC node. Contract deployment and backend integration may require additional configuration for a particular workflow.

## Configuration

Backend settings are supplied through environment variables and documented by `backend/.env.example` and `backend/app/config.py`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLAlchemy database connection string. Defaults to a local SQLite database. |
| `SECRET_KEY` | Secret used by the API authentication implementation. Set a strong private value outside a local demo. |
| `USE_MOCK_BLOCKCHAIN` | Enables the simulated blockchain service when `true`. |
| `BLOCKCHAIN_RPC_URL` | RPC endpoint used for local blockchain configuration. |
| `CORS_ORIGINS` | JSON list of allowed browser origins. |

Do not commit real secrets or `.env` files.

## Development notes

- Frontend scripts and dependencies are declared in `frontend/package.json`.
- Backend dependencies are pinned in `backend/requirements.txt`.
- Smart contract scripts and commands are declared in `blockchain/package.json`.
- GitHub Actions runs frontend lint/build, a backend Python syntax check, and blockchain compile/tests on pushes and pull requests. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
- Additional product and prototype scope notes are in [`doc/CAPABILITIES_AND_LIMITATIONS.md`](doc/CAPABILITIES_AND_LIMITATIONS.md) and [`doc/description.md`](doc/description.md).
- `serve.js` serves the built frontend from `frontend/dist` on port `4181`; create that build first with `npm run build` in `frontend/`.

## Security and scope

The included records, identities, election flows, validator decisions, and blockchain behavior are for demonstration. The prototype does not integrate with government identity systems, does not deploy to a public blockchain, and does not implement production-grade zero-knowledge proofs or a complete anonymous voting protocol. Review the capability and limitation notes before adapting the project for another use.
