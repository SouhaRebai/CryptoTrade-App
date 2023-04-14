//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract Transactions {
    uint256 transactionsCount;
    event Transfer(address sender, address receiver, uint amount, string message,
     uint256 timestamp, string keyword); //a function that we will emit later on 

    struct TransferStruct{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }
    //define a struct that will store all the transactions 
    TransferStruct[] transactions;

    //add transaction to the blockchain
    function addTransaction(address payable receiver, uint amount, 
    string memory message, string memory keyword) public{
        transactionsCount +=1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));
        //make the actual transaction
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);

    }

    function getAllTransactions() public view returns (TransferStruct[] memory){

    } 

    function getTransactionsCount() public view returns(uint256 ){
        return transactionsCount;
    }


}