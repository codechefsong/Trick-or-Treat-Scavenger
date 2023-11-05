import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 bg-zinc-800 text-white">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold"> Trick or Treat Scavenger</span>
          </h1>
          <Image className="ml-8" alt="Game" width={500} height={350} src="/assets/game.png" />
          <p className="text-center text-lg">A Halloween NFT board game</p>
          <div className="flex justify-center mb-2">
            <Link
              href="/example-ui"
              passHref
              className=" py-2 px-16 mb-1 mt-3 bg-orange-500 rounded baseline hover:bg-orange-400 disabled:opacity-50"
            >
              Play
            </Link>
          </div>
        </div>

        <div className="flex-grow bg-orange-500 w-full mt-16 px-8 py-12">
          <div className="text-center">
            <h2 className="mt-3 text-4xl">How to play?</h2>
          </div>
          <div className="flex justify-center">
            <ul className="list-disc" style={{ width: "600px" }}>
              <li>Player can roll a four-sided dice to move</li>
              <li>If you land on a house space, you can mint 10 candies as ERC20 tokens</li>
              <li>If you land on a thief space, you have to pay the thief with candies</li>
              <li>You can hire a thief to steal other players&apos; candies.</li>
            </ul>
          </div>
          <p className="text-3xl text-center">Requirements</p>
          <div className="flex justify-center">
            <ul className="list-disc" style={{ width: "600px" }}>
              <li>To play, you must own a Pumpkin Buckets NFT to play</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
