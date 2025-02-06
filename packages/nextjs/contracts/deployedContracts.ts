/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    SomeFunContract: {
      address: "0x6379ebd504941f50d5bfde9348b37593bd29c835",
      abi: [
        {
          type: "function",
          name: "startTheFun",
          inputs: [
            {
              name: "participants",
              type: "address[]",
              internalType: "address[]",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "event",
          name: "Fun",
          inputs: [
            {
              name: "winner",
              type: "address",
              indexed: false,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1738810567.json",
      deploymentScript: "Deploy.s.sol",
    },
    StartTheFun: {
      address: "0x5b3120d0da5fdcba7aef87a9c3c64829c1c0d76b",
      abi: [
        {
          type: "function",
          name: "createGame",
          inputs: [
            {
              name: "_whereTheFunIs",
              type: "address",
              internalType: "address",
            },
            {
              name: "_price",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "_totalRequired",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "_deadlineInSecondsFromNow",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "games",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "whereTheFunIs",
              type: "address",
              internalType: "address",
            },
            {
              name: "price",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "totalRequired",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "totalStaked",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "started",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "withdrawable",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getGameInfo",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "whereTheFunIs",
              type: "address",
              internalType: "address",
            },
            {
              name: "price",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "totalRequired",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "totalStaked",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "started",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "withdrawable",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getStakedAddresses",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address[]",
              internalType: "address[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getStakedCount",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "stake",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "start",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "timeLeft",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "unstake",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "withdraw",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "GameCreated",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "creator",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "whereTheFunIs",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "Staked",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "Unstaked",
          inputs: [
            {
              name: "gameId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1738810567.json",
      deploymentScript: "Deploy.s.sol",
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
