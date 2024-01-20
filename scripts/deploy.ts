import { ethers } from "hardhat";

async function main() {
  const reward = await ethers.deployContract("Reward");
  await reward.waitForDeployment();
  console.log(`token deployed at ${reward.target}`);
  
  setTimeout(async() => {
    const Staker = await ethers.deployContract("Staker", [reward.target]);
    console.log(`staking contract deployed at ${Staker.target}`)
  },1100)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
