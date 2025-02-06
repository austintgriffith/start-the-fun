// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployStartTheFun } from "./DeployStartTheFun.s.sol";
import { DeploySomeFunContract } from "./DeploySomeFunContract.s.sol";
/**
 * @notice Main deployment script for all contracts
 * @dev Run this when you want to deploy multiple contracts at once
 *
 * Example: yarn deploy # runs this script(without`--file` flag)
 */
contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        // Deploys all your contracts sequentially
        // Add new deployments here when needed

        DeploySomeFunContract someFunContract = new DeploySomeFunContract();
        address deployedSomeFunContract = someFunContract.run();

        DeployStartTheFun deployStartTheFun = new DeployStartTheFun();
        deployStartTheFun.run();
    }
}
