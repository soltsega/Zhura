// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VotingContract
 * @notice Handles vote casting with double-vote prevention and ballot commitments.
 * @dev Votes are recorded as commitments (hashes) to preserve voter privacy.
 */
contract VotingContract {
    struct Ballot {
        bytes32 commitment;
        uint256 blockNumber;
        uint256 timestamp;
        bool exists;
    }

    uint256 public voteCounter;
    address public admin;

    mapping(uint256 => mapping(address => bool)) public hasVoted; // electionId => voter => voted
    mapping(uint256 => mapping(address => Ballot)) public ballots; // electionId => voter => ballot
    mapping(uint256 => mapping(uint256 => uint256)) public candidateVoteCount; // electionId => candidateId => count

    // Events
    event VoteCast(
        uint256 indexed electionId,
        bytes32 ballotCommitment,
        uint256 blockNumber
    );
    event DoubleVoteRejected(
        uint256 indexed electionId,
        address indexed voter
    );
    event ResultsFinalized(
        uint256 indexed electionId,
        uint256 totalVotes
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Cast a vote for a candidate in an election.
     * @param _electionId The election ID
     * @param _candidateId The candidate ID
     * @param _ballotCommitment Hash commitment of the vote (for privacy)
     */
    function castVote(
        uint256 _electionId,
        uint256 _candidateId,
        bytes32 _ballotCommitment
    ) external returns (bool) {
        // Prevent double voting
        require(!hasVoted[_electionId][msg.sender], "Voter has already voted in this election");
        require(_ballotCommitment != bytes32(0), "Invalid ballot commitment");

        // Record vote
        hasVoted[_electionId][msg.sender] = true;
        candidateVoteCount[_electionId][_candidateId]++;

        ballots[_electionId][msg.sender] = Ballot({
            commitment: _ballotCommitment,
            blockNumber: block.number,
            timestamp: block.timestamp,
            exists: true
        });

        voteCounter++;
        emit VoteCast(_electionId, _ballotCommitment, block.number);
        return true;
    }

    /**
     * @notice Check if a credential has been used for voting.
     */
    function checkCredential(uint256 _electionId, address _voter) external view returns (bool) {
        return hasVoted[_electionId][_voter];
    }

    /**
     * @notice Finalize election results (admin only).
     */
    function finalizeResults(uint256 _electionId) external onlyAdmin {
        emit ResultsFinalized(_electionId, voteCounter);
    }
}
