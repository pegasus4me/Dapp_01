import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv"
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks : {
    arbitrumSepolia : {
      url : process.env.RPC,
      accounts : [`0x${process.env.PRIVATE}`]
    }
  }
};

export default config;
