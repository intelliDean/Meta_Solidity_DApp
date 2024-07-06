"use client";
import { getOrganizationTokenContract, getVestingContract, getVestingFactoryContract } from "@/constants/contracts";
import { getProvider } from "@/constants/providers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/M4NspQG5Ubp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  const { isConnected, address } = useWeb3ModalAccount();

  const { walletProvider } = useWeb3ModalProvider();
  const [tokenAddress, setTokenAddress] = useState("");
  const [vestingAddress, setVestingAddress] = useState("");

  const [roles, setRoles] = useState("");
  const [amounts, setAmounts] = useState("");
  const [vestingPeriods, setVestingPeriods] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [stakeSelectedRoles, setStakeSelectedRoles] = useState("");
  const [inputedAddress, setInputedAddress] = useState("");
  const [whitelistSelectedRoles, setWhitelistSelectedRoles] = useState("");

  const readWriteProvider = getProvider(walletProvider);

  const vestingFactory = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;
    const vestingContract = getVestingFactoryContract(signer);

    // Parsing the inputs from the form
    const rolesArray = roles.split(",").map((role) => role.trim());
    const amountsArray = amounts
      .split(",")
      .map((amount) => ethers.parseEther(amount.trim()));
    const vestingPeriodsArray = vestingPeriods
      .split(",")
      .map((period) => parseInt(period.trim(), 10));
    const totalSupply = ethers.parseEther(initialSupply.trim());

    try {
      const transaction = await vestingContract.createVestingInstance(
        rolesArray,
        amountsArray,
        vestingPeriodsArray,
        tokenName,
        tokenSymbol,
        totalSupply
      );
      await transaction.wait();

      // Fetch the most recent token and vesting contract addresses
      const tokenContracts = await vestingContract.getTokenContracts();
      const vestingContracts = await vestingContract.getVestingContracts();

      const latestTokenAddress = tokenContracts[tokenContracts.length - 1];
      const latestVestingAddress =
        vestingContracts[vestingContracts.length - 1];

      console.log("tokenAddress", latestTokenAddress);
      console.log("vestingAddress", latestVestingAddress);

      setTokenAddress(latestTokenAddress);
      setVestingAddress(latestVestingAddress);

      alert(
        `Token and vesting contracts created successfully! Token Address: ${latestTokenAddress}, Vesting Address: ${latestVestingAddress}`
      );
    } catch (error) {
      console.log("Error handling vestingFactory:", error.message);
      // replaced toast with alert for displaying error
      alert(`Error handling vestingFactory: ${error.message}`);
      throw error;
    }
  };

  const register = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;

    const tokenContract = getOrganizationTokenContract(signer, tokenAddress);
    const vestingContract = getVestingContract(signer, vestingAddress);
    try {
      const { amount, releaseTime } = await vestingContract.vestingSchedules(
        stakeSelectedRoles
      );
      console.log("Amount:", amount);
      console.log("selectedRoles:", stakeSelectedRoles);
      const approve = await tokenContract.approve(vestingAddress, amount);
      const approval = await approve.wait();

      console.log(approval);
      alert("Approval Successful");
      if (approval.status === 1) {
        const tx = await vestingContract.registerStakeholder(
          stakeSelectedRoles
        );
        const receipt = await tx.wait();

        console.log(receipt);
        alert("Stake Registered");
      } else {
        console.log("Approval Failed");
        alert("Approval Failed");
      }
    } catch (error) {
      console.log("Error handling register:", error.message);
      alert(`Error handling register: ${error.message}`);
      throw error;
    }
  };

  const whiteList = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;

    const vestingContract = getVestingContract(signer, vestingAddress);
    try {
      const tx = await vestingContract.whitelistAddress(
        whitelistSelectedRoles,
        inputedAddress
      );
      const receipt = await tx.wait();

      console.log("Whitelisted:", inputedAddress);
      console.log(receipt);
      alert("Address Whitelisted");
    } catch (error) {
      console.log("Error handling whiteList:", error.message);
      alert(`Error handling whiteList: ${error.message}`);
      throw error;
    }
  };

  const withdraw = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;

    const vestingContract = getVestingContract(signer, vestingAddress);
    try {
      const tx = await vestingContract.releaseTokens();
      const receipt = await tx.wait();

      console.log(receipt);
      alert("Stake Withdrawn");
    } catch (error) {
      console.log("Error handling Withdraw:", error.message);
      alert(`Error handling Withdraw: ${error.message}`);
      throw error;
    }
  };

  const ownerWithdraw = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;

    const vestingContract = getVestingContract(signer, vestingAddress);
    try {
      const tx = await vestingContract.withdrawRemainingTokens();
      const receipt = await tx.wait();

      console.log(receipt);
      alert("Contract Drained");
    } catch (error) {
      console.log("Error handling Withdraw:", error.message);
      alert(`Error handling Withdraw: ${error.message}`);
      throw error;
    }
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Admin Factory Contract</h1>
          </div>
          <div>
            <w3m-button />
          </div>
        </div>
      </header>
      {isConnected ? (
        <main className="container mx-auto my-12 px-4 sm:px-6 lg:px-8">
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="roles"
                  >
                    Roles
                  </label>
                  <input
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="roles"
                    name="roles"
                    placeholder="community, investor, pre-sale buyer, team"
                    type="text"
                    value={roles}
                    onChange={(e) => setRoles(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="amounts"
                  >
                    Amounts
                  </label>
                  <input
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="amounts"
                    name="amounts"
                    placeholder="1000, 500, 250"
                    type="text"
                    value={amounts}
                    onChange={(e) => setAmounts(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="vestingPeriods"
                  >
                    Vesting Periods
                  </label>
                  <input
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="vestingPeriods"
                    name="vestingPeriods"
                    placeholder="12, 6, 3"
                    type="text"
                    value={vestingPeriods}
                    onChange={(e) => setVestingPeriods(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="tokenName"
                  >
                    Token Name
                  </label>
                  <input
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="tokenName"
                    name="tokenName"
                    placeholder="My Token"
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="tokenSymbol"
                  >
                    Token Symbol
                  </label>
                  <input
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="tokenSymbol"
                    name="tokenSymbol"
                    placeholder="MTK"
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="initialSupply"
                  >
                    Total Supply
                  </label>
                  <input
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="initialSupply"
                    name="initialSupply"
                    placeholder="1000000"
                    type="number"
                    value={initialSupply}
                    onChange={(e) => setInitialSupply(e.target.value)}
                  />
                </div>
              </form>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
                  onClick={vestingFactory}
                >
                  Create Organization Contract
                </button>
              </div>
            </div>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">User Registration</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <form className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="role"
                  >
                    User Role
                  </label>
                  <select
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="role"
                    name="role"
                    value={stakeSelectedRoles}
                    onChange={(e) => setStakeSelectedRoles(e.target.value)}
                  >
                    <option value="">Select a role</option>
                    <option value="community">Community</option>
                    <option value="investor">Investor</option>
                    <option value="pre-sale buyer">Pre-Sale Buyer</option>
                    <option value="team">Team</option>
                  </select>
                </div>
              </form>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
                  onClick={register}
                >
                  Stake
                </button>
              </div>
            </div>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Whitelist Stakeholder</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="role"
                  >
                    Role
                  </label>
                  <select
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="role"
                    name="role"
                    value={whitelistSelectedRoles}
                    onChange={(e) => setWhitelistSelectedRoles(e.target.value)}
                  >
                    <option value="">Select a role</option>
                    <option value="community">Community</option>
                    <option value="investor">Investor</option>
                    <option value="pre-sale buyer">Pre-Sale Buyer</option>
                    <option value="team">Team</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block font-medium text-gray-700 mb-2"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <input
                    className="border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    id="address"
                    name="address"
                    placeholder="0x123456789..."
                    type="text"
                    value={inputedAddress}
                    onChange={(e) => setInputedAddress(e.target.value)}
                  />
                </div>
              </form>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
                  onClick={whiteList}
                >
                  Whitelist
                </button>
              </div>
            </div>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">User Withdrawal</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-end">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
                  onClick={withdraw}
                >
                  Remove Stake
                </button>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Owner Withdrawal</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-end">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
                  onClick={ownerWithdraw}
                >
                  Drain Contract
                </button>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="container mx-auto my-12 px-4 sm:px-6 lg:px-8">
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Connect to a Wallet</h2>
              <p className="text-gray-700 mb-4">
                To use this application, you need to connect to a wallet.
              </p>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
