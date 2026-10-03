// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ElectionContract
 * @notice Manages election lifecycle: creation, opening, closing, and candidate registration.
 * @dev Part of the Zihura governance infrastructure.
 */
contract ElectionContract {
    struct Election {
        uint256 id;
        string name;
        string electionType;
        uint256 startDate;
        uint256 endDate;
        uint8 status; // 0=Draft, 1=Scheduled, 2=Live, 3=Completed, 4=Suspended
        uint256 totalVoters;
        uint256 votesCast;
        address createdBy;
    }

    struct Candidate {
        uint256 id;
        uint256 electionId;
        string name;
        string position;
        bool isActive;
        uint256 votesReceived;
    }

    uint256 public electionCounter;
    uint256 public candidateCounter;
    address public admin;

    mapping(uint256 => Election) public elections;
    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => uint256[]) public electionCandidates;

    // Events
    event ElectionCreated(uint256 indexed id, string name, address indexed createdBy);
    event ElectionOpened(uint256 indexed id, uint256 timestamp);
    event ElectionClosed(uint256 indexed id, uint256 timestamp);
    event CandidateRegistered(uint256 indexed electionId, uint256 indexed candidateId, string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createElection(
        string memory _name,
        string memory _electionType,
        uint256 _startDate,
        uint256 _endDate
    ) external onlyAdmin returns (uint256) {
        electionCounter++;
        elections[electionCounter] = Election({
            id: electionCounter,
            name: _name,
            electionType: _electionType,
            startDate: _startDate,
            endDate: _endDate,
            status: 0,
            totalVoters: 0,
            votesCast: 0,
            createdBy: msg.sender
        });
        emit ElectionCreated(electionCounter, _name, msg.sender);
        return electionCounter;
    }

    function openElection(uint256 _electionId) external onlyAdmin {
        Election storage election = elections[_electionId];
        require(election.status == 1, "Election must be scheduled to open");
        election.status = 2;
        emit ElectionOpened(_electionId, block.timestamp);
    }

    function closeElection(uint256 _electionId) external onlyAdmin {
        Election storage election = elections[_electionId];
        require(election.status == 2, "Election must be live to close");
        election.status = 3;
        emit ElectionClosed(_electionId, block.timestamp);
    }

    function registerCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _position
    ) external onlyAdmin returns (uint256) {
        require(elections[_electionId].status == 0, "Can only register candidates in draft");
        candidateCounter++;
        candidates[candidateCounter] = Candidate({
            id: candidateCounter,
            electionId: _electionId,
            name: _name,
            position: _position,
            isActive: true,
            votesReceived: 0
        });
        electionCandidates[_electionId].push(candidateCounter);
        emit CandidateRegistered(_electionId, candidateCounter, _name);
        return candidateCounter;
    }
}
