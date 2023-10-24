import { BOARD_STYLES } from "../components/board/names";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ExampleUI: NextPage = () => {
  const { address } = useAccount();

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "ToTScavenger",
    functionName: "tbaList",
    args: [address],
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

  return (
    <>
      <MetaHeader
        title="Example UI | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="ml-6" data-theme="exampleUi">
        <div className="flex">
          <div>
            <h2 className="mt-4 text-3xl">Board</h2>
            <p>{address}</p>
            <p className="mt-0">{tbaAddress}</p>
            <button
              className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => roll()}
            >
              Roll
            </button>
            {isClaim && (
              <button
                className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                onClick={() => claimCandy()}
                disabled={claimLoading}
              >
                {claimLoading ? "Claim" : "Claimming..."}
              </button>
            )}
            <div className="relative mt-10" style={{ width: "450px", height: "600px" }}>
              {gridData &&
                gridData.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "w-20 h-20 border border-gray-300 font-bold bg-white" + " " + BOARD_STYLES[index] || "grid-1"
                    }
                  >
                    {item.id.toString()}
                    {item.typeGrid === "house" && <p className="building">House</p>}
                    {you?.toString() === item.id.toString() && <p className="my-0">You</p>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExampleUI;
