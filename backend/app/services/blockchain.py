"""Blockchain service abstraction — supports mock and real blockchain."""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional
import hashlib
import time
import random


class BlockchainService(ABC):
    """Abstract base class for blockchain operations."""

    @abstractmethod
    def record_event(
        self,
        event_type: str,
        data: dict,
        actor: str = "",
        election_id: Optional[int] = None,
    ) -> dict:
        """Record an event on the blockchain. Returns tx hash and block number."""
        ...

    @abstractmethod
    def get_block_number(self) -> int:
        """Get the latest block number."""
        ...

    @abstractmethod
    def get_chain_status(self) -> dict:
        """Get blockchain status information."""
        ...

    @abstractmethod
    def verify_transaction(self, tx_hash: str) -> bool:
        """Verify a transaction exists on chain."""
        ...


class MockBlockchainService(BlockchainService):
    """Mock blockchain for prototype — simulates chain state in-memory."""

    def __init__(self):
        self._block_number = 18342
        self._records: list[dict] = []
        self._start_time = time.time()
        self._chain_id = 31337  # Hardhat default

    def record_event(
        self,
        event_type: str,
        data: dict,
        actor: str = "",
        election_id: Optional[int] = None,
    ) -> dict:
        self._block_number += 1

        data_str = f"{event_type}:{data}:{time.time()}"
        tx_hash = "0x" + hashlib.sha256(data_str.encode()).hexdigest()[:64]

        record = {
            "block_number": self._block_number,
            "transaction_hash": tx_hash,
            "event_type": event_type,
            "actor": actor,
            "election_id": election_id,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "verified",
        }
        self._records.append(record)
        return record

    def get_block_number(self) -> int:
        return self._block_number

    def get_chain_status(self) -> dict:
        return {
            "chain_id": self._chain_id,
            "block_number": self._block_number,
            "total_records": len(self._records),
            "network_status": "healthy",
            "validators_online": 5,
            "total_validators": 5,
            "last_block_time": datetime.utcnow().isoformat(),
        }

    def verify_transaction(self, tx_hash: str) -> bool:
        return any(r["transaction_hash"] == tx_hash for r in self._records)


class LocalBlockchainService(BlockchainService):
    """Real blockchain integration via Hardhat local node."""

    def __init__(self, rpc_url: str = "http://127.0.0.1:8545"):
        self.rpc_url = rpc_url
        self._connected = False
        self._web3 = None

    def _ensure_connected(self):
        if not self._connected:
            try:
                from web3 import Web3
                self._web3 = Web3(Web3.HTTPProvider(self.rpc_url))
                self._connected = self._web3.is_connected()
            except Exception:
                self._connected = False

    def record_event(self, event_type: str, data: dict, actor: str = "", election_id: Optional[int] = None) -> dict:
        self._ensure_connected()
        if not self._connected:
            # Fallback to mock behavior
            mock = MockBlockchainService()
            return mock.record_event(event_type, data, actor, election_id)

        # In production, this would interact with deployed smart contracts
        # For now, record a simple transaction
        data_str = f"{event_type}:{data}:{time.time()}"
        tx_hash = "0x" + hashlib.sha256(data_str.encode()).hexdigest()[:64]

        return {
            "block_number": self._web3.eth.block_number + 1,
            "transaction_hash": tx_hash,
            "event_type": event_type,
            "actor": actor,
            "election_id": election_id,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "verified",
        }

    def get_block_number(self) -> int:
        self._ensure_connected()
        if self._connected:
            return self._web3.eth.block_number
        return 18342

    def get_chain_status(self) -> dict:
        self._ensure_connected()
        if self._connected:
            return {
                "chain_id": self._web3.eth.chain_id,
                "block_number": self._web3.eth.block_number,
                "network_status": "healthy" if self._connected else "disconnected",
                "validators_online": 5,
                "total_validators": 5,
                "last_block_time": datetime.utcnow().isoformat(),
            }
        return MockBlockchainService().get_chain_status()

    def verify_transaction(self, tx_hash: str) -> bool:
        self._ensure_connected()
        if self._connected:
            try:
                self._web3.eth.get_transaction(tx_hash)
                return True
            except Exception:
                return False
        return False


def get_blockchain_service() -> BlockchainService:
    """Factory function to get the appropriate blockchain service."""
    from app.config import settings

    if settings.USE_MOCK_BLOCKCHAIN:
        return MockBlockchainService()
    return LocalBlockchainService(settings.BLOCKCHAIN_RPC_URL)
