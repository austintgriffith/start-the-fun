"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { FunEvents } from "~~/components/fun-events/FunEvents";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const { address: connectedAddress } = useAccount();

  // Only proceed with queries since we have the gameId
  const { data: gameInfo } = useScaffoldReadContract({
    contractName: "StartTheFun",
    functionName: "getGameInfo",
    args: [gameId],
  });

  const { data: timeLeft } = useScaffoldReadContract({
    contractName: "StartTheFun",
    functionName: "timeLeft",
    args: [gameId],
  });

  const { data: isStaked } = useScaffoldReadContract({
    contractName: "StartTheFun",
    functionName: "games",
    args: gameId && connectedAddress ? [gameId, connectedAddress] : undefined,
  });

  const { writeContractAsync: writeStartTheFunAsync } = useScaffoldWriteContract({
    contractName: "StartTheFun",
  });

  if (!gameInfo) {
    return <div>Loading...</div>;
  }

  const [whereTheFunIs, price, totalRequired, deadline, totalStaked, started, withdrawable] = gameInfo;
  const priceBigInt = price ? BigInt(price.toString()) : BigInt(0);

  const handleStake = async () => {
    try {
      await writeStartTheFunAsync({
        functionName: "stake",
        args: [gameId],
        value: priceBigInt,
      });
    } catch (error) {
      console.error("Error staking:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await writeStartTheFunAsync({
        functionName: "withdraw",
        args: [gameId],
      });
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  const handleStart = async () => {
    try {
      await writeStartTheFunAsync({
        functionName: "start",
        args: [gameId],
      });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">
            {timeLeft?.toString() || "0"} seconds left to stake {formatEther(priceBigInt)} ETH
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {/* Progress Card */}
          <div className="bg-base-100 border-base-300 border shadow-md rounded-3xl p-6">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Progress</div>
                {totalStaked && totalRequired ? (
                  <>
                    <div
                      className={`stat-value ${
                        (Number(totalStaked) / Number(totalRequired)) * 100 < 10
                          ? "text-error"
                          : (Number(totalStaked) / Number(totalRequired)) * 100 >= 100
                            ? "text-success"
                            : "text-warning"
                      }`}
                    >
                      {((Number(totalStaked) / Number(totalRequired)) * 100).toFixed(1)}%
                    </div>
                    <div className="stat-desc">
                      {formatEther(totalStaked)} / {formatEther(totalRequired)} ETH
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-value text-error">0%</div>
                    <div className="stat-desc">0 / 0 ETH</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Time Remaining Card */}
          <div className="bg-base-100 border-base-300 border shadow-md rounded-3xl p-6">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">{timeLeft && timeLeft > 0 ? "Round Ends In" : "Round Status"}</div>
                <div className="stat-value">
                  {timeLeft && timeLeft > 0
                    ? `${timeLeft.toString()} seconds`
                    : totalStaked && totalRequired && Number(totalStaked) >= Number(totalRequired)
                      ? "Ready for fun"
                      : "Still not enough for fun"}
                </div>
              </div>
            </div>
          </div>

          {/* User Status Card */}
          <div className="bg-base-100 border-base-300 border shadow-md rounded-3xl p-6">
            {isStaked ? (
              <h2 className="text-2xl font-bold mb-4">You are staked!</h2>
            ) : (
              <div className="stats shadow">
                <button className="btn btn-primary" onClick={handleStake}>
                  Stake {formatEther(priceBigInt)} ETH
                </button>
              </div>
            )}
          </div>

          {/* Staking Actions Card */}
          <div className="bg-base-100 border-base-300 border shadow-md rounded-3xl p-6">
            <div className="flex flex-col gap-4">
              {withdrawable ? (
                <h2 className="text-2xl font-bold mb-4">
                  (Staking failed{" "}
                  <button className="btn btn-primary" onClick={handleWithdraw}>
                    WITHDRAW
                  </button>
                  )
                </h2>
              ) : started ? (
                <h2 className="text-2xl font-bold mb-4">
                  Fun started at <Address address={whereTheFunIs} />!
                </h2>
              ) : (
                totalStaked >= totalRequired && (
                  <button className="btn btn-primary" onClick={handleStart}>
                    START
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full mt-8 px-6 max-w-4xl text-center text-lg">
        <h2 className="text-2xl font-bold mb-4">
          {withdrawable
            ? "the fun could have happened at"
            : timeLeft && timeLeft > 0
              ? "the fun could happen at"
              : "the fun is happening at"}
        </h2>
      </div>
      <div className="flex items-center justify-center w-full mt-8 px-6 max-w-4xl text-center text-lg">
        <Address address={whereTheFunIs} />
      </div>

      <div className="w-full mt-8 px-6 max-w-4xl">
        <FunEvents gameId={gameId} />
      </div>
    </div>
  );
}
