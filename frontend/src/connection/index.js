"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// export const creatorAddress = "0xF2E7E2f51D7C9eEa9B0313C2eCa12f8e43bd1855";
export const SEPOLIA_ID = 11155111;

const Sepolia = {
  chainId: SEPOLIA_ID,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
};

const metadata = {
  name: "Badger for Shardeum",
  description: "No code token creation",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [Sepolia],
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  enableAnalytics: false, // Optional - defaults
  themeVariables: {
    "--w3m-accent": "#006AFF",
    "--w3m-border-radius-master": "",
    "--w3m-font-size-master": "16",
  },
});

export function Web3Modal({ children }) {
  return children;
}