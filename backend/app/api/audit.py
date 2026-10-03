"""Audit Trail API — blockchain-backed audit records and blockchain status."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.audit import AuditRecord
from app.schemas.audit import AuditRecordResponse, AuditListResponse, BlockchainStatus
from app.services.blockchain import get_blockchain_service

router = APIRouter(prefix="/api", tags=["audit"])


@router.get("/audit", response_model=AuditListResponse)
def list_audit_records(
    election_id: int = None,
    event_type: str = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """List audit trail records."""
    query = db.query(AuditRecord)
    if election_id:
        query = query.filter(AuditRecord.election_id == election_id)
    if event_type:
        query = query.filter(AuditRecord.event_type == event_type)
    total = query.count()
    records = query.order_by(AuditRecord.timestamp.desc()).offset(skip).limit(limit).all()
    latest_block = db.query(AuditRecord.block_number).order_by(AuditRecord.block_number.desc()).first()
    return AuditListResponse(
        records=records,
        total=total,
        latest_block=latest_block[0] if latest_block else 0,
    )


@router.get("/audit/{record_id}", response_model=AuditRecordResponse)
def get_audit_record(record_id: int, db: Session = Depends(get_db)):
    """Get a specific audit record with full details."""
    record = db.query(AuditRecord).filter(AuditRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Audit record not found")
    return record


@router.get("/blockchain/status", response_model=BlockchainStatus)
def get_blockchain_status():
    """Get blockchain network status."""
    blockchain = get_blockchain_service()
    status = blockchain.get_chain_status()
    return BlockchainStatus(**status)
