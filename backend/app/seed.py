"""Database seeding script — populates initial data for Zhuranet platform.

Run with: python -m app.seed
"""

import random
import hashlib
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.models.election import Election, ElectionStatus, ElectionType, VotingMethod
from app.models.candidate import Candidate
from app.models.voter import Voter, VoterStatus
from app.models.validator import Validator
from app.models.proposal import Proposal, ProposalVote, ProposalStatus, ProposalType, ValidatorVote
from app.models.vote import Vote
from app.models.expense import Expense, ExpenseCategory, ExpenseStatus
from app.models.audit import AuditRecord, AuditEventType
from app.services.auth import get_password_hash
from app.services.blockchain import MockBlockchainService


def seed_database():
    """Seed the database with comprehensive demo data."""
    init_db()
    db = SessionLocal()
    blockchain = MockBlockchainService()

    print("[SEED] Seeding Zhuranet database...")

    # Check if already seeded
    if db.query(User).count() > 0:
        print("[INFO] Database already seeded. Skipping.")
        db.close()
        return

    # ──────────────────────────────────────────────
    # 1. USERS
    # ──────────────────────────────────────────────
    users = [
        User(
            email="admin@zhura.demo",
            hashed_password=get_password_hash("demo123"),
            full_name="Election Administrator",
            role=UserRole.ADMIN,
        ),
        User(
            email="validator@zhura.demo",
            hashed_password=get_password_hash("demo123"),
            full_name="Addis Transparency Organization",
            role=UserRole.VALIDATOR,
            validator_id=1,
        ),
        User(
            email="voter@zhura.demo",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo Voter",
            role=UserRole.VOTER,
            voter_id=1,
        ),
    ]
    db.add_all(users)
    db.flush()
    print("  [OK] 3 initial users created")

    # ──────────────────────────────────────────────
    # 2. VALIDATORS
    # ──────────────────────────────────────────────
    validator_data = [
        ("Addis Transparency Organization", "ATO", "Independent civic organization focused on government transparency"),
        ("Ethio Civic Network", "ECN", "Network of civic organizations promoting democratic governance"),
        ("Good Governance Organization", "GGO", "Non-profit organization promoting good governance practices"),
        ("Justice & Fairness Organization", "JFO", "Organization dedicated to electoral justice and fairness"),
        ("Peace & Democracy Organization", "PDO", "Organization promoting peaceful democratic processes"),
    ]
    validators = []
    for name, abbr, desc in validator_data:
        v = Validator(name=name, abbreviation=abbr, description=desc, is_active=True, is_online=True)
        db.add(v)
        validators.append(v)
    db.flush()
    print("  [OK] 5 validators created")

    # ──────────────────────────────────────────────
    # 3. ELECTION
    # ──────────────────────────────────────────────
    election = Election(
        name="ABC Bank Board Election 2026",
        election_type=ElectionType.BANK_BOARD,
        description="Board of Directors election for ABC Bank. 500 eligible shareholders will vote for 5 candidates competing for board positions.",
        status=ElectionStatus.LIVE,
        start_date=datetime(2026, 8, 28),
        end_date=datetime(2026, 9, 5),
        number_of_seats=5,
        voting_method=VotingMethod.FIRST_PAST_POST,
        eligibility_rules="Shareholders with minimum 100 shares. One vote per share class.",
        total_voters=500,
        votes_cast=372,
    )
    db.add(election)
    db.flush()
    print("  [OK] Election created: ABC Bank Board Election 2026")

    # ──────────────────────────────────────────────
    # 4. CANDIDATES
    # ──────────────────────────────────────────────
    candidate_data = [
        ("Candidate A", "Board Chair", "ABC Financial Group", "15+ years in banking and finance. Former CFO at National Bank.", "MBA Finance, CPA, Certified Bank Examiner"),
        ("Candidate B", "Board Member", "Ethio Business Solutions", "10 years in corporate governance. Active board member at multiple organizations.", "MBA, Corporate Governance Certificate"),
        ("Candidate C", "Board Member", "Horn of Africa Consulting", "8 years in risk management and compliance. Expert in banking regulation.", "MS Risk Management, FRM Certification"),
        ("Candidate D", "Board Member", "Greenfield Capital", "5 years in fintech and digital banking. Advocate for innovation in banking.", "MSc Computer Science, FinTech Certificate"),
        ("Candidate E", "Board Member", "Community Development Partners", "12 years in community banking. Champion for financial inclusion.", "MA Economics, Social Enterprise Certificate"),
    ]
    candidates = []
    vote_counts = [132, 119, 83, 25, 13]
    for i, (name, pos, org, bio, quals) in enumerate(candidate_data):
        c = Candidate(
            election_id=election.id,
            name=name,
            position=pos,
            organization=org,
            biography=bio,
            qualifications=quals,
            is_active=True,
            votes_received=vote_counts[i],
            vote_percentage=round((vote_counts[i] / 372) * 100, 1),
        )
        db.add(c)
        candidates.append(c)
    db.flush()
    print("  [OK] 5 candidates created")

    # ──────────────────────────────────────────────
    # 5. VOTERS (500)
    # ──────────────────────────────────────────────
    regions = ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Sidama", "Dire Dawa"]
    polling_centers = [f"Center-{i:03d}" for i in range(1, 51)]
    voters = []
    for i in range(1, 501):
        has_voted = i <= 372  # First 372 voters have voted
        v = Voter(
            voter_id=f"VTR-{i:04d}",
            election_id=election.id,
            name=f"Voter {i:04d}",
            email=f"voter{i}@example.com",
            phone=f"+25191{i:07d}",
            region=random.choice(regions),
            polling_center=random.choice(polling_centers),
            status=VoterStatus.ELIGIBLE,
            has_voted=has_voted,
            credential_hash=hashlib.sha256(f"voter{i}:credential".encode()).hexdigest(),
            voted_at=datetime(2026, 8, 29) + timedelta(hours=random.randint(0, 72)) if has_voted else None,
        )
        db.add(v)
        voters.append(v)
    db.flush()
    print("  [OK] 500 voters created (372 voted)")

    # ──────────────────────────────────────────────
    # 6. PROPOSALS (7 total: 6 approved, 1 rejected)
    # ──────────────────────────────────────────────
    proposal_data = [
        ("Extend Election Closing Time", ProposalType.EXTEND_VOTING_PERIOD, "18:00", "20:00", "Technical disruption at multiple centers", ProposalStatus.APPROVED, 4),
        ("Suspend Polling Center 012", ProposalType.SUSPEND_POLLING_CENTER, "Active", "Suspended", "Safety concerns at polling center", ProposalStatus.APPROVED, 4),
        ("Add Emergency Polling Center", ProposalType.ADD_POLLING_CENTER, "N/A", "Center-051", "High demand in Addis Ababa region", ProposalStatus.APPROVED, 4),
        ("Update Verification Protocol", ProposalType.UPDATE_PROTOCOL, "Standard ID check", "Biometric + ID", "Enhanced security measures", ProposalStatus.APPROVED, 4),
        ("Extend Voter Registration", ProposalType.CHANGE_ELECTION_CONFIG, "Aug 25", "Aug 27", "Late registration requests", ProposalStatus.APPROVED, 4),
        ("Activate Emergency Procedure", ProposalType.EMERGENCY_PROCEDURE, "Normal", "Emergency", "Infrastructure issues in Amhara region", ProposalStatus.APPROVED, 4),
        ("Reduce Required Quorum", ProposalType.CHANGE_ELECTION_CONFIG, "4/5", "3/5", "Accessibility improvement — REJECTED for security", ProposalStatus.REJECTED, 4),
    ]
    proposals = []
    for i, (title, ptype, prev, prop, reason, pstatus, quorum) in enumerate(proposal_data):
        tx_result = blockchain.record_event(
            event_type="proposal_created",
            data={"title": title},
            actor="Election Administrator",
            election_id=election.id,
        )
        # Set approve/reject counts based on status
        if pstatus == ProposalStatus.APPROVED:
            ac, rc = 4, 1
        else:
            ac, rc = 2, 3

        p = Proposal(
            proposal_number=f"#{i+1:04d}",
            election_id=election.id,
            title=title,
            description=f"Proposal to {title.lower()} for the ABC Bank Board Election 2026.",
            proposal_type=ptype,
            proposed_by="Election Administrator",
            status=pstatus,
            required_quorum=quorum,
            total_validators=5,
            approve_count=ac,
            reject_count=rc,
            previous_value=prev,
            proposed_value=prop,
            reason=reason,
            transaction_hash=tx_result["transaction_hash"],
            block_number=tx_result["block_number"],
            resolved_at=datetime(2026, 8, 29) + timedelta(days=i),
        )
        db.add(p)
        proposals.append(p)
    db.flush()
    print("  [OK] 7 proposals created")

    # ──────────────────────────────────────────────
    # 7. PROPOSAL VOTES
    # ──────────────────────────────────────────────
    for p in proposals:
        for vi, validator in enumerate(validators):
            if p.status == ProposalStatus.APPROVED:
                # All but PDO approve the approved ones
                vote = ValidatorVote.REJECT if vi == 4 else ValidatorVote.APPROVE
            else:
                # Rejected proposal: only 2 approve
                vote = ValidatorVote.APPROVE if vi < 2 else ValidatorVote.REJECT

            pv = ProposalVote(
                proposal_id=p.id,
                validator_id=validator.id,
                vote=vote,
                comment=f"{'Approved' if vote == ValidatorVote.APPROVE else 'Rejected'} based on organizational assessment.",
            )
            db.add(pv)
    db.flush()
    print("  [OK] Proposal votes recorded")

    # ──────────────────────────────────────────────
    # 8. EXPENSES (7.84M ETB total)
    # ──────────────────────────────────────────────
    expense_data = [
        (ExpenseCategory.POLLING_WORKERS, 2_500_000, "Payment for 5,000 polling workers across 50 centers"),
        (ExpenseCategory.OBSERVERS, 850_000, "Independent observer organizations"),
        (ExpenseCategory.LOGISTICS, 1_200_000, "Transportation and logistics for election materials"),
        (ExpenseCategory.EQUIPMENT, 3_400_000, "Voting booths, ballot boxes, and security equipment"),
        (ExpenseCategory.TRAINING, 600_000, "Training programs for polling staff"),
        (ExpenseCategory.ADMINISTRATION, 450_000, "Administrative overhead and coordination"),
    ]
    expenses = []
    for cat, amount, desc in expense_data:
        e = Expense(
            expense_id=f"EXP-{len(expenses)+1:05d}",
            election_id=election.id,
            category=cat,
            amount=amount,
            description=desc,
            authorized_by="Election Administrator",
            document_hash=hashlib.sha256(f"doc:{cat}:{amount}".encode()).hexdigest(),
            status=ExpenseStatus.APPROVED,
        )
        db.add(e)
        expenses.append(e)
    db.flush()
    print("  [OK] 6 expense records created (7.84M ETB total)")

    # ──────────────────────────────────────────────
    # 9. AUDIT RECORDS (simulated blockchain history)
    # ──────────────────────────────────────────────
    event_types = [
        AuditEventType.ELECTION_CREATED,
        AuditEventType.CANDIDATE_REGISTERED,
        AuditEventType.VOTE_CAST,
        AuditEventType.PROPOSAL_CREATED,
        AuditEventType.PROPOSAL_APPROVED,
        AuditEventType.EXPENSE_RECORDED,
        AuditEventType.ELECTION_OPENED,
    ]
    audit_records = []
    for i in range(50):  # Create 50 sample audit records (not 18k for seeding)
        etype = random.choice(event_types)
        tx_result = blockchain.record_event(
            event_type=etype.value,
            data={"record_index": i},
            actor=random.choice(["Election Administrator", "Addis Transparency Organization", "Ethio Civic Network"]),
            election_id=election.id,
        )
        ar = AuditRecord(
            block_number=tx_result["block_number"],
            transaction_hash=tx_result["transaction_hash"],
            event_type=etype,
            actor=tx_result["actor"],
            election_id=election.id,
            previous_state=f"Previous state for event {i}",
            new_state=f"New state for {etype.value}",
            details=f"Audit record #{i+1}",
            validator_approvals="4/5",
            smart_contract="ElectionContract",
            status="verified",
        )
        db.add(ar)
        audit_records.append(ar)
    db.flush()
    print("  [OK] 50 audit records created (chain history initialized)")

    db.commit()
    db.close()

    print("\n[SUCCESS] Database seeded successfully!")
    print("   Demo accounts:")
    print("     admin@zhura.demo / demo123")
    print("     validator@zhura.demo / demo123")
    print("     voter@zhura.demo / demo123")


if __name__ == "__main__":
    seed_database()
