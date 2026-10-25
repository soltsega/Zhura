"""Comprehensive integration and security tests for Zhuranet API."""

import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.user import User, UserRole
from app.models.election import Election, ElectionStatus, ElectionType, VotingMethod
from app.models.candidate import Candidate
from app.models.voter import Voter, VoterStatus
from app.models.validator import Validator
from app.models.proposal import Proposal, ProposalStatus, ProposalType
from app.services.auth import get_password_hash, create_access_token

# Test database in SQLite memory
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database schema for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()

    # Seed core roles
    admin = User(
        email="admin@zhura.demo",
        hashed_password=get_password_hash("demo123"),
        full_name="Election Administrator",
        role=UserRole.ADMIN,
    )
    validator_user = User(
        email="validator@zhura.demo",
        hashed_password=get_password_hash("demo123"),
        full_name="Addis Transparency Organization",
        role=UserRole.VALIDATOR,
        validator_id=1,
    )
    voter_user = User(
        email="voter@zhura.demo",
        hashed_password=get_password_hash("demo123"),
        full_name="Demo Voter",
        role=UserRole.VOTER,
        voter_id=1,
    )
    session.add_all([admin, validator_user, voter_user])

    # Seed validators
    v1 = Validator(id=1, name="Addis Transparency Organization", abbreviation="ATO", is_active=True)
    v2 = Validator(id=2, name="Ethio Civic Network", abbreviation="ECN", is_active=True)
    session.add_all([v1, v2])

    # Seed election
    election = Election(
        id=1,
        name="Annual Board Election 2026",
        election_type=ElectionType.BANK_BOARD,
        status=ElectionStatus.LIVE,
        description="Live board election",
        start_date=datetime.utcnow() - timedelta(days=1),
        end_date=datetime.utcnow() + timedelta(days=7),
        voting_method=VotingMethod.RANKED_CHOICE,
        number_of_seats=3,
        total_voters=100,
        votes_cast=0,
    )
    election2 = Election(
        id=2,
        name="Civic Referendum 2026",
        election_type=ElectionType.REFERENDUM,
        status=ElectionStatus.LIVE,
        description="Live referendum",
        start_date=datetime.utcnow() - timedelta(days=1),
        end_date=datetime.utcnow() + timedelta(days=7),
        voting_method=VotingMethod.FIRST_PAST_POST,
        number_of_seats=1,
        total_voters=50,
        votes_cast=0,
    )
    session.add_all([election, election2])

    # Seed candidates
    c1 = Candidate(id=1, election_id=1, name="Dr. Almaz Bekele", position="Chair", organization="Independent")
    c2 = Candidate(id=2, election_id=1, name="Eng. Dawit Haile", position="Vice Chair", organization="Independent")
    c3 = Candidate(id=3, election_id=2, name="Option A: Approve", position="Measure", organization="Referendum")
    session.add_all([c1, c2, c3])

    # Seed voters
    voter_active = Voter(
        id=1,
        voter_id="VTR-0001",
        election_id=1,
        name="Abebe Bikila",
        email="voter1@zhura.demo",
        status=VoterStatus.ELIGIBLE,
        has_voted=False,
    )
    voter_suspended = Voter(
        id=2,
        voter_id="VTR-0002",
        election_id=1,
        name="Suspended Voter",
        email="suspended@zhura.demo",
        status=VoterStatus.SUSPENDED,
        has_voted=False,
    )
    voter_election2 = Voter(
        id=3,
        voter_id="VTR-0003",
        election_id=2,
        name="Election 2 Voter",
        email="voter3@zhura.demo",
        status=VoterStatus.ELIGIBLE,
        has_voted=False,
    )
    session.add_all([voter_active, voter_suspended, voter_election2])

    session.commit()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Override database dependency to use in-memory SQLite."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def auth_header(user_id: int, role: str) -> dict:
    """Generate JWT authorization header for tests."""
    token = create_access_token(data={"user_id": user_id, "role": role})
    return {"Authorization": f"Bearer {token}"}


# ──────────────────────────────────────────────
# 1. BLOCKCHAIN & TELEMETRY TESTS
# ──────────────────────────────────────────────
def test_blockchain_status_zhuranet(client):
    """Verify blockchain status endpoint returns network_name as Zhuranet."""
    response = client.get("/api/blockchain/status")
    assert response.status_code == 200
    data = response.json()
    assert data["network_name"] == "Zhuranet"
    assert data["chain_id"] == 31337
    assert data["network_status"] == "healthy"
    assert data["validators_online"] == 5


def test_health_check(client):
    """Verify health endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# ──────────────────────────────────────────────
# 2. PUBLIC PORTAL & READS (NO AUTH REQUIRED)
# ──────────────────────────────────────────────
def test_public_elections_and_candidates_list(client):
    """Citizens can view elections and candidate rosters without authentication."""
    e_res = client.get("/api/elections")
    assert e_res.status_code == 200
    assert len(e_res.json()["elections"]) >= 2

    c_res = client.get("/api/candidates?election_id=1")
    assert c_res.status_code == 200
    assert len(c_res.json()["candidates"]) == 2


# ──────────────────────────────────────────────
# 3. VOTER ELIGIBILITY & DOUBLE-VOTE TESTS
# ──────────────────────────────────────────────
def test_cast_vote_success(client):
    """Eligible voter can cast a ballot in their registered election."""
    payload = {
        "election_id": 1,
        "candidate_id": 1,
        "voter_id": "VTR-0001",
    }
    response = client.post("/api/votes", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["ballot_reference"].startswith("VR-")
    assert data["ballot_commitment"] is not None
    assert data["transaction_hash"].startswith("0x")


def test_double_vote_rejection(client):
    """Voter cannot vote twice in the same election (409 Conflict)."""
    payload = {
        "election_id": 1,
        "candidate_id": 1,
        "voter_id": "VTR-0001",
    }
    # First vote
    r1 = client.post("/api/votes", json=payload)
    assert r1.status_code == 201

    # Second vote attempt
    r2 = client.post("/api/votes", json=payload)
    assert r2.status_code == 409
    detail = r2.json()["detail"]
    assert detail["success"] is False
    assert "already been used" in detail["message"]
    assert detail["existing_ballot_reference"] == r1.json()["ballot_reference"]


def test_suspended_voter_rejection(client):
    """Suspended voter is forbidden from voting (403 Forbidden)."""
    payload = {
        "election_id": 1,
        "candidate_id": 1,
        "voter_id": "VTR-0002",
    }
    response = client.post("/api/votes", json=payload)
    assert response.status_code == 403
    assert "not eligible to vote" in response.json()["detail"]


def test_cross_election_voter_rejection(client):
    """Voter cannot vote in an election they are not registered for (403 Forbidden)."""
    payload = {
        "election_id": 1,
        "candidate_id": 1,
        "voter_id": "VTR-0003",  # Registered for election 2, not election 1
    }
    response = client.post("/api/votes", json=payload)
    assert response.status_code == 403
    assert "not registered for this election" in response.json()["detail"]


def test_voter_can_vote_in_separate_elections(client):
    """Voting in one election does not block eligible voting in a separate election."""
    # Voter 1 votes in election 1
    r1 = client.post("/api/votes", json={"election_id": 1, "candidate_id": 1, "voter_id": "VTR-0001"})
    assert r1.status_code == 201

    # Voter 3 votes in election 2
    r2 = client.post("/api/votes", json={"election_id": 2, "candidate_id": 3, "voter_id": "VTR-0003"})
    assert r2.status_code == 201


def test_authenticated_voter_cannot_spoof_other_voter(client):
    """Authenticated voter user cannot cast ballot under someone else's voter ID."""
    headers = auth_header(user_id=3, role="voter")  # Linked to voter_id=1 ("VTR-0001")
    payload = {
        "election_id": 1,
        "candidate_id": 1,
        "voter_id": "VTR-0002",  # Attempting to vote as VTR-0002
    }
    response = client.post("/api/votes", json=payload, headers=headers)
    assert response.status_code == 403
    assert "different voter identity" in response.json()["detail"]


# ──────────────────────────────────────────────
# 4. GOVERNANCE PROPOSALS & VALIDATOR QUORUM TESTS
# ──────────────────────────────────────────────
def test_proposal_creation_unauthenticated_fails(client):
    """Anonymous user cannot create proposals (401 Unauthorized)."""
    payload = {
        "election_id": 1,
        "title": "Extend Voting Hours",
        "description": "Extend voting by 2 hours",
        "proposal_type": "update_protocol",
    }
    response = client.post("/api/proposals", json=payload)
    assert response.status_code == 401


def test_proposal_creation_voter_forbidden(client):
    """Voter role cannot create proposals (403 Forbidden)."""
    headers = auth_header(user_id=3, role="voter")
    payload = {
        "election_id": 1,
        "title": "Extend Voting Hours",
        "description": "Extend voting by 2 hours",
        "proposal_type": "update_protocol",
    }
    response = client.post("/api/proposals", json=payload, headers=headers)
    assert response.status_code == 403


def test_proposal_creation_and_validator_vote_flow(client):
    """Admin creates proposal, and validator node votes with quorum check."""
    admin_headers = auth_header(user_id=1, role="admin")
    validator_headers = auth_header(user_id=2, role="validator")  # Assigned validator_id=1

    # 1. Admin creates proposal
    p_payload = {
        "election_id": 1,
        "title": "Recalibrate Quorum Threshold",
        "description": "Adjust quorum requirement",
        "proposal_type": "update_protocol",
    }
    p_res = client.post("/api/proposals", json=p_payload, headers=admin_headers)
    assert p_res.status_code == 201
    proposal_id = p_res.json()["id"]

    # 2. Validator votes approve
    v_payload = {
        "validator_id": 1,
        "vote": "approve",
        "comment": "Approved after civic review",
    }
    v_res = client.post(f"/api/proposals/{proposal_id}/vote", json=v_payload, headers=validator_headers)
    assert v_res.status_code == 200
    assert v_res.json()["approve_count"] == 1

    # 3. Validator cannot vote twice on the same proposal
    v_res_dup = client.post(f"/api/proposals/{proposal_id}/vote", json=v_payload, headers=validator_headers)
    assert v_res_dup.status_code == 400
    assert "already voted" in v_res_dup.json()["detail"]


def test_validator_cannot_spoof_another_validator(client):
    """Validator user 2 (assigned validator_id=1) cannot vote as validator node 2."""
    validator_headers = auth_header(user_id=2, role="validator")  # assigned validator_id=1
    admin_headers = auth_header(user_id=1, role="admin")

    # Create proposal
    p_res = client.post(
        "/api/proposals",
        json={"election_id": 1, "title": "Audit Rule Update", "description": "Test", "proposal_type": "update_protocol"},
        headers=admin_headers,
    )
    proposal_id = p_res.json()["id"]

    # Attempt to vote as validator_id 2
    spoof_payload = {
        "validator_id": 2,
        "vote": "approve",
        "comment": "Spoofed vote attempt",
    }
    response = client.post(f"/api/proposals/{proposal_id}/vote", json=spoof_payload, headers=validator_headers)
    assert response.status_code == 403
    assert "cannot submit votes for another validator node" in response.json()["detail"]


# ──────────────────────────────────────────────
# 5. ADMIN RESTRICTED MANAGEMENT TESTS
# ──────────────────────────────────────────────
def test_admin_voter_management_auth_enforced(client):
    """Unauthenticated or voter role cannot view or create voter rolls."""
    # Unauthenticated
    assert client.get("/api/voters").status_code == 401

    # Voter role
    voter_headers = auth_header(user_id=3, role="voter")
    assert client.get("/api/voters", headers=voter_headers).status_code == 403

    # Admin role succeeds
    admin_headers = auth_header(user_id=1, role="admin")
    res = client.get("/api/voters", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["total"] >= 3
