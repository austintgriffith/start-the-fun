import { useState } from "react";
import { formatEther } from "viem";
import { Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

export const FunEvents = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { targetNetwork } = useTargetNetwork();

  const {
    data: funEvents,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "SomeFunContract",
    eventName: "Fun",
    fromBlock: 0n,
    watch: true,
    blockData: true,
  });

  if (isLoadingEvents) {
    return <div className="text-center">Loading events...</div>;
  }

  if (errorReadingEvents) {
    return <div className="text-center text-error">Error loading events</div>;
  }

  if (!funEvents || funEvents.length === 0) {
    return <div className="text-center">No fun events found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fun Events History</h2>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${viewMode === "table" ? "btn-active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <TableCellsIcon className="h-4 w-4" />
          </button>
          <button
            className={`btn btn-sm ${viewMode === "grid" ? "btn-active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Squares2X2Icon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Block Number</th>
                <th>Winner</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {funEvents.map((event, index) => (
                <tr key={index} className="hover">
                  <td>{event.blockNumber.toString()}</td>
                  <td>
                    <Address address={event.args.winner} />
                  </td>
                  <td>
                    {formatEther(event.args.amount)} {targetNetwork.nativeCurrency.symbol}
                  </td>
                  <td>
                    {event.blockData ? new Date(Number(event.blockData.timestamp) * 1000).toLocaleString() : "Unknown"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {funEvents.map((event, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Winner!</h3>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-sm opacity-50">Address:</span>
                    <Address address={event.args.winner} />
                  </div>
                  <div>
                    <span className="text-sm opacity-50">Amount:</span>
                    <p className="font-bold">
                      {formatEther(event.args.amount)} {targetNetwork.nativeCurrency.symbol}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm opacity-50">Block:</span>
                    <p>{event.blockNumber.toString()}</p>
                  </div>
                  <div>
                    <span className="text-sm opacity-50">Time:</span>
                    <p>
                      {event.blockData
                        ? new Date(Number(event.blockData.timestamp) * 1000).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
