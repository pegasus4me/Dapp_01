import { ethers } from "hardhat";

const tokenAddress:string ="0xAF162873B327C33213D76e0228647b0e2CA9E473"
async function main() {
  
  // DEPLOY TOKEN -----
  // const reward = await ethers.deployContract("RewardToken");
  // await reward.waitForDeployment();
  // console.log(`token deployed at ${reward.target}`);
  

  setTimeout(async() => {
    const Staker = await ethers.deployContract("StackingV1", [tokenAddress]);
    console.log(`staking contract deployed at ${Staker.target}`)
  },1100)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Reward Token Address = 0xAF162873B327C33213D76e0228647b0e2CA9E473
// Staking Contract Address = 0x2957e5D4C9DE8F1DA7f3Fd74803c9D231d86D704