import { ethers } from "ethers";
import organizationTokenABI from "./organizationTokenABI.json";
import vestingABI from "./vestingABI.json";
import vestingFactoryABI from "./vestingFactoryABI.json";

export const getOrganizationTokenContract = (
  providerOrSigner,
  organizationTokenAddress
) =>
  new ethers.Contract(
    organizationTokenAddress,
    organizationTokenABI,
    providerOrSigner
  );

export const getVestingContract = (providerOrSigner, vestingAddress) =>
  new ethers.Contract(vestingAddress, vestingABI, providerOrSigner);

export const getVestingFactoryContract = (providerOrSigner) =>
  new ethers.Contract(
    process.env.NEXT_PUBLIC_VESTING_FACTORY_CONTRACT,
    vestingFactoryABI,
    providerOrSigner
  );