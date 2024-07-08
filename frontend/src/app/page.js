"use client";
import { getVestingFactoryContract } from "@/constants/contracts";
import { getProvider } from "@/constants/providers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useState } from "react";
import { ethers } from "ethers";

export default function Component() {
    const { isConnected, address } = useWeb3ModalAccount();
    console.log(`Connected Address: ${address}`);
    const { walletProvider } = useWeb3ModalProvider();
    const [roles, setRoles] = useState("");
    const [amounts, setAmounts] = useState("");
    const [vestingPeriods, setVestingPeriods] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [indexOne, setIndexOne] = useState("");
    const [indexTwo, setIndexTwo] = useState("");
    const [indexThree, setIndexThree] = useState("");
    const [role, setRole] = useState("");
    const [stakeholderAddress, setStakeholderAddress] = useState("");
    const [balAddress, setBalAddress] = useState("");
    const [claimAddress, setClaimAddress] = useState("");
    const readWriteProvider = getProvider(walletProvider);

    const checkProvider = () => {
        if (!readWriteProvider) {
            alert("Provider not available");
            return false;
        }
        return true;
    };

    const vestingFactory = async () => {
        if (!checkProvider()) return;

        const signer = await readWriteProvider.getSigner();
        const vestingFactoryContract = getVestingFactoryContract(signer);

        const rolesArray = roles.split(",").map((r) => r.trim());
        const amountsArray = amounts.split(",").map((amount) =>
            ethers.parseEther(amount.trim()));
        const vestingPeriodsArray = vestingPeriods.split(",").map((period) =>
            parseInt(period.trim(), 10));

        try {
            const createVestingTx = await vestingFactoryContract.createVestingInstance(
                rolesArray,
                amountsArray,
                vestingPeriodsArray,
                tokenName,
                tokenSymbol
            );

            const receipt = await createVestingTx.wait();
            console.log(receipt);
            alert("A new Vesting Contract is deployed successfully");
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const whitelistAddress = async () => {
        if (!checkProvider()) return;

        const signer = await readWriteProvider.getSigner();
        const vestingFactoryContract = getVestingFactoryContract(signer);

        try {
            const index = parseInt(indexOne, 10);
            if (isNaN(index)) {
                throw new Error("Invalid index value");
            }

            if (typeof role !== "string" || !role.trim()) {
                throw new Error("Role must be a non-empty string");
            }

            if (!ethers.isAddress(stakeholderAddress)) {
                throw new Error("Invalid Ethereum address");
            }

            // Estimate gas before sending the transaction
            const gasEstimate = await vestingFactoryContract.estimateGas.whitelistAddress(
                index,
                role,
                stakeholderAddress
            );
            console.log(`Gas estimate: ${gasEstimate.toString()}`);

            // Send the transaction with the gas limit
            const whitelistTx = await vestingFactoryContract.whitelistAddress(
                index,
                role,
                stakeholderAddress,
                { gasLimit: gasEstimate }
            );
            const receipt = await whitelistTx.wait();

            console.log(receipt);
            alert("Address whitelisted successfully");
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const stakeholderClaimBenefit = async () => {
        if (!checkProvider()) return;

        const signer = await readWriteProvider.getSigner();
        const vestingFactoryContract = getVestingFactoryContract(signer);

        try {
            const claimTx = await vestingFactoryContract.stakeholderClaimBenefit(
                parseInt(indexTwo, 10),
                claimAddress
            );
            await claimTx.wait();
            alert("Benefit claimed successfully");
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const balanceOf = async () => {
        if (!checkProvider()) return;

        const signer = await readWriteProvider.getSigner();
        const vestingFactoryContract = getVestingFactoryContract(signer);

        try {
            const balance = await vestingFactoryContract.balanceOf(
                parseInt(indexThree, 10),
                balAddress
            );
            alert(`Balance: ${ethers.formatEther(balance)}`);
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <>
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-black">Vesting Factory Contract</h1>
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
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="roles">
                                        Stakeholder
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="roles"
                                        name="roles"
                                        placeholder="Investor, Manager, Engineer"
                                        type="text"
                                        value={roles}
                                        onChange={(e) => setRoles(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="amounts">
                                        Amounts
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="amounts"
                                        name="amounts"
                                        placeholder="1000, 500, 250"
                                        type="text"
                                        value={amounts}
                                        onChange={(e) => setAmounts(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="vestingPeriods">
                                        Vesting Periods
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="vestingPeriods"
                                        name="vestingPeriods"
                                        placeholder="12, 6, 3"
                                        type="text"
                                        value={vestingPeriods}
                                        onChange={(e) => setVestingPeriods(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="tokenName">
                                        Token Name
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="tokenName"
                                        name="tokenName"
                                        placeholder="My Token"
                                        type="text"
                                        value={tokenName}
                                        onChange={(e) => setTokenName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="tokenSymbol">
                                        Token Symbol
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="tokenSymbol"
                                        name="tokenSymbol"
                                        placeholder="MTK"
                                        type="text"
                                        value={tokenSymbol}
                                        onChange={(e) => setTokenSymbol(e.target.value)}
                                    />
                                </div>
                            </form>
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-md"
                                    onClick={vestingFactory}
                                >
                                    Create Vesting
                                </button>
                            </div>
                        </div>
                    </section>
                    <section className="mb-12">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="indexOne">
                                        Index
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="indexOne"
                                        name="indexOne"
                                        placeholder="0"
                                        type="text"
                                        value={indexOne}
                                        onChange={(e) => setIndexOne(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="role">
                                        Role
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="role"
                                        name="role"
                                        placeholder="Investor"
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="stakeholderAddress">
                                        Stakeholder Address
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="stakeholderAddress"
                                        name="stakeholderAddress"
                                        placeholder="0xabc123..."
                                        type="text"
                                        value={stakeholderAddress}
                                        onChange={(e) => setStakeholderAddress(e.target.value)}
                                    />
                                </div>
                            </form>
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-md"
                                    onClick={whitelistAddress}
                                >
                                    Whitelist Address
                                </button>
                            </div>
                        </div>
                    </section>
                    <section className="mb-12">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="indexTwo">
                                        Index
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="indexTwo"
                                        name="indexTwo"
                                        placeholder="0"
                                        type="text"
                                        value={indexTwo}
                                        onChange={(e) => setIndexTwo(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="claimAddress">
                                        Claim Address
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="claimAddress"
                                        name="claimAddress"
                                        placeholder="0xabc123..."
                                        type="text"
                                        value={claimAddress}
                                        onChange={(e) => setClaimAddress(e.target.value)}
                                    />
                                </div>
                            </form>
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-md"
                                    onClick={stakeholderClaimBenefit}
                                >
                                    Claim Benefit
                                </button>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="indexThree">
                                        Index
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="indexThree"
                                        name="indexThree"
                                        placeholder="0"
                                        type="text"
                                        value={indexThree}
                                        onChange={(e) => setIndexThree(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 mb-2" htmlFor="balAddress">
                                        Balance Address
                                    </label>
                                    <input
                                        className="border-gray-300 text-gray-600 rounded-md shadow-sm
                                        focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50 w-full h-9"
                                        id="balAddress"
                                        name="balAddress"
                                        placeholder="0xabc123..."
                                        type="text"
                                        value={balAddress}
                                        onChange={(e) => setBalAddress(e.target.value)}
                                    />
                                </div>
                            </form>
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-md"
                                    onClick={balanceOf}
                                >
                                    Check Balance
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <main className="container mx-auto my-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-center text-gray-500">Please connect your wallet to use the application.</p>
                    </div>
                </main>
            )}
        </>
    );
}
