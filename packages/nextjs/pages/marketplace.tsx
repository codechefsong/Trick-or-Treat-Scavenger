import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/generated/deployedContracts";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const CHAIN_ID = 31337;

const Marketplace: NextPage = () => {
  const { address } = useAccount();

  const [selectedNFT, setSelectNFT] = useState("-1");

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "ToTScavenger",
    functionName: "tbaList",
    args: [address],
  });

  const { data: nfts } = useScaffoldContractRead({
    contractName: "BucketNFT",
    functionName: "getMyNFTs",
    args: [address],
  });

  const { writeAsync: mintNFT } = useScaffoldContractWrite({
    contractName: "BucketNFT",
    functionName: "mint",
    args: [address, "URL"],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: createAccount } = useScaffoldContractWrite({
    contractName: "ToTScavenger",
    functionName: "createTokenBoundAccount",
    args: [
      deployedContracts[CHAIN_ID][0].contracts.ERC6551Account.address,
      BigInt("1"),
      deployedContracts[CHAIN_ID][0].contracts.BucketNFT.address,
      BigInt(selectedNFT),
      BigInt("1"),
      "0x",
    ],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <>
      <MetaHeader
        title="Marketplace"
        description="Marketplace created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>

      <div className="flex items-center flex-col flex-grow pt-7">
        <div className="px-5">
          <h1 className="text-center mb-5">
            <span className="block text-3xl mb-2">Select your Pumpkin Buckets</span>
          </h1>

          <Address address={tbaAddress} />

          <div className="flex mt-3">
            {nfts?.map((n, index) => (
              <div
                key={index}
                className="w-16 h-20 border border-gray-30 flex items-center justify-center font-bold mr-2 mb-2 cursor-pointer"
                style={{ background: selectedNFT === n.toString() ? "#00cc99" : "white" }}
                onClick={() => setSelectNFT(n.toString())}
              >
                <Image className="" src="/assets/pumpkinbasket.png" width={50} height={50} alt="Pumpkin Basket" />
              </div>
            ))}
          </div>

          <button
            className="py-2 px-16 mb-10 mt-3 bg-orange-400 rounded baseline hover:bg-orange-300 disabled:opacity-50"
            onClick={() => createAccount()}
          >
            Create Token Bound Account
          </button>
          <h1 className="text-center mb-10">
            <span className="block text-2xl mb-2">Buy a Pumpkin Bucket</span>
          </h1>

          <div className="flex flex-col items-center">
            <Image className="mb-3" src="/assets/pumpkinbasket.png" width={100} height={100} alt="Pumpkin Basket" />
            <button
              className="py-2 px-16 mb-1 mt-3 bg-orange-400 rounded baseline hover:bg-orange-300 disabled:opacity-50"
              onClick={() => mintNFT()}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;
