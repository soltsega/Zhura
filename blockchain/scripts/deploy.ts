import { ethers } from "hardhat";

async function main() {
  console.log("🗳️  Deploying Zhura smart contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // 1. Deploy ElectionContract
  const ElectionContract = await ethers.getContractFactory("ElectionContract");
  const election = await ElectionContract.deploy();
  await election.waitForDeployment();
  const electionAddr = await election.getAddress();
  console.log("✅ ElectionContract deployed to:", electionAddr);

  // 2. Deploy VotingContract
  const VotingContract = await ethers.getContractFactory("VotingContract");
  const voting = await VotingContract.deploy();
  await voting.waitForDeployment();
  const votingAddr = await voting.getAddress();
  console.log("✅ VotingContract deployed to:", votingAddr);

  // 3. Deploy GovernanceContract (4 required quorum out of 5 validators)
  const GovernanceContract = await ethers.getContractFactory("GovernanceContract");
  const governance = await GovernanceContract.deploy(4);
  await governance.waitForDeployment();
  const governanceAddr = await governance.getAddress();
  console.log("✅ GovernanceContract deployed to:", governanceAddr);

  console.log("\n📋 Contract Addresses:");
  console.log("  Election:", electionAddr);
  console.log("  Voting:", votingAddr);
  console.log("  Governance:", governanceAddr);

  console.log("\n🎉 Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
