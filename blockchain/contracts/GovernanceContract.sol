// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GovernanceContract
 * @notice Manages governance proposals with validator quorum voting.
 * @dev Key feature: the election authority CANNOT execute protected changes
 *      without sufficient validator approvals.
 */
contract GovernanceContract {
    struct Proposal {
        uint256 id;
        uint256 electionId;
        string title;
        string proposalType;
        uint8 status; // 0=Pending, 1=Approved, 2=Rejected, 3=Executed, 4=Expired
        uint256 requiredQuorum;
        uint256 totalValidators;
        uint256 approveCount;
        uint256 rejectCount;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    struct ValidatorVote {
        uint8 vote; // 0=Abstain, 1=Approve, 2=Reject
        uint256 timestamp;
        bool hasVoted;
    }

    uint256 public proposalCounter;
    address public admin;

    // Validator registry
    address[] public validators;
    mapping(address => bool) public isValidator;
    uint256 public requiredQuorum;

    // Proposals
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => ValidatorVote)) public validatorVotes;

    // Events
    event ProposalCreated(uint256 indexed id, uint256 indexed electionId, string title);
    event ProposalApproved(uint256 indexed id, uint256 approvals);
    event ProposalRejected(uint256 indexed id, uint256 approvals);
    event ProposalExecuted(uint256 indexed id);
    event ValidatorVoted(uint256 indexed proposalId, address indexed validator, uint8 vote);
    event GovernanceAttackBlocked(uint256 indexed electionId, address indexed attemptedBy);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyValidator() {
        require(isValidator[msg.sender], "Not a registered validator");
        _;
    }

    modifier onlyAdminOrValidator() {
        require(msg.sender == admin || isValidator[msg.sender], "Not authorized");
        _;
    }

    constructor(uint256 _requiredQuorum) {
        admin = msg.sender;
        requiredQuorum = _requiredQuorum; // Default: 4
    }

    function addValidator(address _validator) external onlyAdmin {
        require(!isValidator[_validator], "Already a validator");
        isValidator[_validator] = true;
        validators.push(_validator);
    }

    /**
     * @notice Create a governance proposal.
     */
    function createProposal(
        uint256 _electionId,
        string memory _title,
        string memory _proposalType
    ) external onlyAdminOrValidator returns (uint256) {
        proposalCounter++;
        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            electionId: _electionId,
            title: _title,
            proposalType: _proposalType,
            status: 0, // Pending
            requiredQuorum: requiredQuorum,
            totalValidators: validators.length,
            approveCount: 0,
            rejectCount: 0,
            createdAt: block.timestamp,
            resolvedAt: 0
        });
        emit ProposalCreated(proposalCounter, _electionId, _title);
        return proposalCounter;
    }

    /**
     * @notice Validator votes on a proposal. Checks quorum automatically.
     */
    function voteOnProposal(
        uint256 _proposalId,
        uint8 _vote // 1=Approve, 2=Reject
    ) external onlyValidator {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == 0, "Proposal not pending");
        require(!validatorVotes[_proposalId][msg.sender].hasVoted, "Already voted");

        require(_vote == 1 || _vote == 2, "Invalid vote");

        validatorVotes[_proposalId][msg.sender] = ValidatorVote({
            vote: _vote,
            timestamp: block.timestamp,
            hasVoted: true
        });

        if (_vote == 1) {
            proposal.approveCount++;
        } else {
            proposal.rejectCount++;
        }

        emit ValidatorVoted(_proposalId, msg.sender, _vote);

        // Check quorum
        _checkQuorum(_proposalId);
    }

    /**
     * @notice Check if quorum has been reached and update proposal status.
     * @dev This is the core governance logic — the smart contract determines the outcome,
     *      not the frontend.
     */
    function _checkQuorum(uint256 _proposalId) internal {
        Proposal storage proposal = proposals[_proposalId];

        if (proposal.approveCount >= proposal.requiredQuorum) {
            proposal.status = 1; // Approved
            proposal.resolvedAt = block.timestamp;
            emit ProposalApproved(_proposalId, proposal.approveCount);
        } else if (proposal.rejectCount > (proposal.totalValidators - proposal.requiredQuorum)) {
            proposal.status = 2; // Rejected
            proposal.resolvedAt = block.timestamp;
            emit ProposalRejected(_proposalId, proposal.rejectCount);
        }
    }

    /**
     * @notice Execute an approved proposal.
     */
    function executeProposal(uint256 _proposalId) external onlyAdmin {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == 1, "Proposal not approved");
        proposal.status = 3; // Executed
        emit ProposalExecuted(_proposalId);
    }

    /**
     * @notice Attempt a direct rule change without governance.
     * @dev This should be blocked — the contract prevents unauthorized modifications.
     */
    function attemptDirectRuleChange(
        uint256 _electionId,
        string memory _rule
    ) external {
        // Only admin can attempt this
        require(msg.sender == admin, "Only admin");
        // This always fails — demonstrating that governance protects the rules
        emit GovernanceAttackBlocked(_electionId, msg.sender);
        revert("Unauthorized governance modification. Required: validator approvals. Current: 0");
    }

    function getValidatorCount() external view returns (uint256) {
        return validators.length;
    }

    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
}
