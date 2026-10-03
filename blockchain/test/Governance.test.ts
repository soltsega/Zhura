import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("GovernanceContract", function () {
  let governance: Contract;
  let deployer: HardhatEthersSigner;
  let validator1: HardhatEthersSigner;
  let validator2: HardhatEthersSigner;
  let validator3: HardhatEthersSigner;
  let validator4: HardhatEthersSigner;
  let validator5: HardhatEthersSigner;

  beforeEach(async function () {
    [deployer, validator1, validator2, validator3, validator4, validator5] = await ethers.getSigners();

    const Governance = await ethers.getContractFactory("GovernanceContract");
    governance = await Governance.deploy(4); // 4 out of 5 required

    // Add 5 validators
    for (const v of [validator1, validator2, validator3, validator4, validator5]) {
      await governance.addValidator(v.address);
    }
  });

  it("should create a proposal", async function () {
    const tx = await governance.createProposal(1, "Extend voting period", "extend_voting_period");
    await expect(tx).to.emit(governance, "ProposalCreated");
    expect(await governance.proposalCounter()).to.equal(1);
  });

  it("should approve proposal when quorum is reached (4/5)", async function () {
    await governance.createProposal(1, "Extend closing time", "extend");

    // 4 validators approve
    for (const v of [validator1, validator2, validator3, validator4]) {
      await governance.connect(v).voteOnProposal(1, 1); // 1 = Approve
    }

    const proposal = await governance.getProposal(1);
    expect(proposal.status).to.equal(1); // Approved
  });

  it("should reject proposal when too many rejections", async function () {
    await governance.createProposal(1, "Reduce quorum", "change_config");

    // Only 2 approve, 3 reject
    await governance.connect(validator1).voteOnProposal(1, 1);
    await governance.connect(validator2).voteOnProposal(1, 1);
    await governance.connect(validator3).voteOnProposal(1, 2); // Reject
    await governance.connect(validator4).voteOnProposal(1, 2); // Reject
    await governance.connect(validator5).voteOnProposal(1, 2); // Reject

    const proposal = await governance.getProposal(1);
    expect(proposal.status).to.equal(2); // Rejected
  });

  it("should prevent double voting", async function () {
    await governance.createProposal(1, "Test", "test");
    await governance.connect(validator1).voteOnProposal(1, 1);

    await expect(
      governance.connect(validator1).voteOnProposal(1, 1)
    ).to.be.revertedWith("Already voted");
  });

  it("should block unauthorized governance attack", async function () {
    await expect(
      governance.attemptDirectRuleChange(1, "change rules")
    ).to.be.revertedWith("Unauthorized governance modification");
  });

  it("should only allow validators to vote", async function () {
    await governance.createProposal(1, "Test", "test");
    const [, , , , , nonValidator] = await ethers.getSigners();

    await expect(
      governance.connect(nonValidator).voteOnProposal(1, 1)
    ).to.be.revertedWith("Not a registered validator");
  });
});
