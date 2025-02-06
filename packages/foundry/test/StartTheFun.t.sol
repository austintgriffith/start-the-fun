// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/StartTheFun.sol";

contract StartTheFunTest is Test {
    StartTheFun public startTheFun;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = vm.addr(1);
        user1 = vm.addr(2);
        user2 = vm.addr(3);
        
        // Initialize with 0.01 ETH stake amount and 10 seconds lockup
        startTheFun = new StartTheFun(owner, 0.01 ether, 0.03 ether, 10 seconds);
        
        // Fund test users
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
    }

    function testStakeWithinLimits() public {
        vm.startPrank(user1);
        startTheFun.stake{value: 0.01 ether}();
        assertTrue(startTheFun.isStaked(user1));
        assertEq(startTheFun.totalStaked(), 0.01 ether);
        vm.stopPrank();
    }

    function testStakeBelowMinimum() public {
        vm.startPrank(user1);
        vm.expectRevert("Please send the price exactly.");
        startTheFun.stake{value: 0.005 ether}();
        vm.stopPrank();
    }

    function testStakeAboveMaximum() public {
        vm.startPrank(user1);
        vm.expectRevert("Please send the price exactly.");
        startTheFun.stake{value: 0.035 ether}();
        vm.stopPrank();
    }

    function testUnstakeBeforeDeadline() public {
        vm.startPrank(user1);
        startTheFun.stake{value: 0.01 ether}();
        
        vm.expectRevert("Deadline has not passed.");
        startTheFun.unstake();
        vm.stopPrank();
    }

    function testUnstakeAfterDeadline() public {
        vm.startPrank(user1);
        startTheFun.stake{value: 0.01 ether}();
        
        // Fast forward past deadline
        vm.warp(block.timestamp + 11 seconds);
        
        uint256 balanceBefore = user1.balance;
        startTheFun.unstake();
        assertEq(user1.balance, balanceBefore + 0.01 ether);
        assertFalse(startTheFun.isStaked(user1));
        vm.stopPrank();
    }

    function testMultipleUsersStaking() public {
        // User 1 stakes
        vm.prank(user1);
        startTheFun.stake{value: 0.01 ether}();
        
        // User 2 stakes
        vm.prank(user2);
        startTheFun.stake{value: 0.01 ether}();
        
        assertTrue(startTheFun.isStaked(user1));
        assertTrue(startTheFun.isStaked(user2));
        assertEq(startTheFun.totalStaked(), 0.02 ether);
        assertEq(address(startTheFun).balance, 0.02 ether);
    }
} 