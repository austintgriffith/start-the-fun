"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const { data: deployedFunContract } = useDeployedContractInfo({ contractName: "StartTheFun" });

  const [formData, setFormData] = useState({
    whereTheFunIs: "",
    price: "0.1",
    totalRequired: "0.3",
    deadline: "2",
  });

  useEffect(() => {
    if (deployedFunContract?.address) {
      setFormData(prev => ({
        ...prev,
        whereTheFunIs: deployedFunContract.address,
      }));
    }
  }, [deployedFunContract?.address]);

  const { writeContractAsync: writeStartTheFun } = useScaffoldWriteContract("StartTheFun");

  const {
    data: gameCreatedEvents,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "StartTheFun",
    eventName: "GameCreated",
    fromBlock: BigInt(0),
    watch: true,
    filters: { creator: connectedAddress },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tx = await writeStartTheFun({
        functionName: "createGame",
        args: [
          formData.whereTheFunIs,
          parseEther(formData.price),
          parseEther(formData.totalRequired),
          BigInt(Number(formData.deadline) * 60), // Convert minutes to seconds
        ],
      });
    } catch (e) {
      console.error("Error creating game:", e);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Create New Game</span>
        </h1>

        {gameCreatedEvents && gameCreatedEvents.length > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Created Games</h2>
            <div className="space-y-2">
              {gameCreatedEvents.map(event => (
                <div key={event.args.gameId.toString()} className="card bg-base-200 p-4">
                  <div className="flex justify-between items-center">
                    <span>Game #{event.args.gameId.toString()}</span>
                    <a href={`/${event.args.gameId.toString()}`} className="btn btn-sm btn-primary">
                      View Game
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Where The Fun Is (address)</span>
              </label>
              <AddressInput
                value={formData.whereTheFunIs}
                onChange={value => setFormData(prev => ({ ...prev, whereTheFunIs: value }))}
                placeholder="0x..."
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Price (ETH)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Total Required (ETH)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.totalRequired}
                onChange={e => setFormData(prev => ({ ...prev, totalRequired: e.target.value }))}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Deadline (minutes)</span>
              </label>
              <input
                type="number"
                value={formData.deadline}
                onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="input input-bordered"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Create Game
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
