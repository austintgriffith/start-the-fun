// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract SomeFunContract {
    event Fun(address winner, uint256 amount);

    function startTheFun(address[] calldata participants) external payable{
        // Get the previous block hash
        bytes32 previousBlockHash = blockhash(block.number - 1);

        // Generate a random index
        uint256 randomIndex = uint256(previousBlockHash) % participants.length;

        // Get the random participant
        address payable winner = payable(participants[randomIndex]);

        uint256 amountToSend = address(this).balance;
        
        // Transfer the entire balance to the winner using call
        (bool success, ) = winner.call{value: amountToSend}("");
        require(success, "Transfer failed");

        emit Fun(winner, amountToSend);

        
    }
}