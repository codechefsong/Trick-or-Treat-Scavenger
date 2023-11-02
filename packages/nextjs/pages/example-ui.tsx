import Image from "next/image";
import { BOARD_STYLES } from "../components/board/names";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const ExampleUI: NextPage = () => {
  const { address } = useAccount();

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "ToTScavenger",
    functionName: "tbaList",
    args: [address],
  });

  const { data: candys } = useScaffoldContractRead({
    contractName: "CandyToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  const { data: you } = useScaffoldContractRead({
    contractName: "ToTScavenger",
    functionName: "bucketPosititon",
    args: [tbaAddress],
  });

  const { data: gridData } = useScaffoldContractRead({
    contractName: "ToTScavenger",
    functionName: "getGrid",
  });

  const { data: isClaim } = useScaffoldContractRead({
    contractName: "ToTScavenger",
    functionName: "isClaim",
    args: [tbaAddress],
  });

  const { data: isStop } = useScaffoldContractRead({
    contractName: "ToTScavenger",
    functionName: "isStop",
    args: [tbaAddress],
  });

  const { writeAsync: roll } = useScaffoldContractWrite({
    contractName: "ToTScavenger",
    functionName: "moveBucket",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: claimCandy, isLoading: claimLoading } = useScaffoldContractWrite({
    contractName: "ToTScavenger",
    functionName: "claimCandy",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: hireTheft, isLoading: hireLoading } = useScaffoldContractWrite({
    contractName: "ToTScavenger",
    functionName: "hireTheft",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: payTheft, isLoading: payLoading } = useScaffoldContractWrite({
    contractName: "ToTScavenger",
    functionName: "payTheft",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: goToStart, isLoading: startLoading } = useScaffoldContractWrite({
    contractName: "ToTScavenger",
    functionName: "goToStart",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "ToTScavenger",
    eventName: "RollResult",
    listener: (data: any) => {
      console.log(data[0].args);
      notification.success(`You roll ${data[0].args.num.toString()}`);
    },
  });

  return (
    <>
      <MetaHeader title="Game" description="Game created with 🏗 Scaffold-ETH 2, showcasing some of its features.">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div data-theme="exampleUi">
        <div className="bg-zinc-800">
          <div className="ml-6">
            <div className="flex flex-col items-center text-white">
              <h2 className="mt-4 text-3xl">Board</h2>
              <p>TBA Address</p>
              <Address address={tbaAddress} />
              <p>{formatEther(candys || 0n)} Candys</p>
              {you?.toString() !== "14" && (
                <button
                  className="py-2 px-16 mb-1 mt-3 mr-3 bg-orange-400 rounded baseline hover:bg-orange-300 disabled:opacity-50"
                  onClick={() => roll()}
                >
                  Roll
                </button>
              )}
              {you?.toString() === "14" && (
                <button
                  className="py-2 px-16 mb-1 mt-3 mr-3 bg-orange-400 rounded baseline hover:bg-orange-300 disabled:opacity-50"
                  onClick={() => goToStart()}
                  disabled={startLoading}
                >
                  {!startLoading ? "Go to Start" : "Moving..."}
                </button>
              )}
              {isClaim && (
                <button
                  className="py-2 px-16 mb-1 mt-3 mr-3 bg-orange-400 rounded baseline hover:bg-orange-300 disabled:opacity-50"
                  onClick={() => claimCandy()}
                  disabled={claimLoading}
                >
                  {!claimLoading ? "Claim" : "Claimming..."}
                </button>
              )}
              {isStop && (
                <button
                  className="py-2 px-16 mb-1 mt-3 mr-3 bg-orange-400 rounded baseline hover:bg-orange-300 disabled:opacity-50"
                  onClick={() => payTheft()}
                  disabled={payLoading}
                >
                  {!payLoading ? "Pay" : "Paying..."}
                </button>
              )}
              <button
                className="py-2 px-16 mb-1 mt-3 mr-3 bg-orange-400 rounded baseline hover:bg-orange-300 disabled:opacity-50"
                onClick={() => hireTheft()}
                disabled={hireLoading}
              >
                {!hireLoading ? "Hire" : "Hiring..."}
              </button>
            </div>
            <div className="relative ml-5" style={{ width: "450px", height: "600px", marginTop: "-100px" }}>
              {gridData &&
                gridData.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "w-20 h-20 border border-gray-300 font-bold bg-white" + " " + BOARD_STYLES[index] || "grid-1"
                    }
                  >
                    {item.id.toString()}
                    {item.typeGrid.toString() === "1" && (
                      <Image className="house" src="/assets/house.png" width={70} height={70} alt="House" />
                    )}
                    {item.typeGrid.toString() === "9" && (
                      <Image className="thief" src="/assets/thief.png" width={50} height={50} alt="Thief" />
                    )}
                    {you?.toString() === item.id.toString() && (
                      <Image
                        className="mb-3"
                        src="/assets/pumpkinbasket.png"
                        width={50}
                        height={50}
                        alt="Pumpkin Basket"
                      />
                    )}
                  </div>
                ))}
              <Image className="portal1" src="/assets/portal.png" width={60} height={60} alt="Portal" />
              <Image className="portal2" src="/assets/portal.png" width={60} height={60} alt="Portal" />
              <Image className="wizard" src="/assets/wizard.png" width={60} height={60} alt="Wizard" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExampleUI;
