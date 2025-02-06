// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/StartTheFun.sol";

contract DeployStartTheFun is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        new StartTheFun();
    }
} 