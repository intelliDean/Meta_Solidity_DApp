import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const roles = ["community", "investor", "team"];
const amounts = [ethers.parseUnits("1000", 18), ethers.parseUnits("2000", 18), ethers.parseUnits("3000", 18)];
const vestingPeriods = [365 * 24 * 60 * 60, 730 * 24 * 60 * 60]; // in seconds
const tokenName = "MyToken";
const tokenSymbol = "MTK";
const totalSupply = ethers.parseUnits("1000000", 18);

const VestingFactoryModule = buildModule("VestingFactoryModule", (m) => {
  // const totalSupply = m.getParameter("totalSupply", TOTAL_SUPPLY);

  const vestingFactory = m.contract("VestingFactory");

  return { vestingFactory };
});

export default VestingFactoryModule;
