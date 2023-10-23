//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ERC6551Registry.sol";
import "./CandyToken.sol";

contract ToTScavenger {
  // State Variables
  ERC6551Registry public registry;
  CandyToken public candy;

  address public immutable owner;
  Box[] public grid;
  mapping(address => address) public tbaList;
  mapping(address => uint256) public bucketPosititon;

  struct Box {
    uint256 id;
    string typeGrid;
    uint256 numberOfPlayers;
  }

  event RollResult(address player, uint256 num);

  constructor(address _owner, address _registryAddress, address _candyAddress) {
    owner = _owner;
    registry = ERC6551Registry(_registryAddress);
    candy = CandyToken(_candyAddress);

    for (uint256 id = 0; id < 14; id++) {
      grid.push(Box(id, "empty", 0));
    }
  }

  function getGrid() public view returns (Box[] memory){
    return grid;
  }

  function createTokenBoundAccount(
    address _implementation,
    uint256 _chainId,
    address _tokenContract,
    uint256 _tokenId,
    uint256 _salt,
    bytes calldata _initData
  ) external {
    address newTBA = registry.createAccount(_implementation, _chainId, _tokenContract, _tokenId, _salt, _initData);
    tbaList[msg.sender] = newTBA;
  }

  function moveBucket() public {
    uint256 randomNumber = uint256(keccak256(abi.encode(block.timestamp, msg.sender))) % 3;
    bucketPosititon[msg.sender] += randomNumber + 1;

    if (bucketPosititon[msg.sender] >= 14) {
      bucketPosititon[msg.sender] = 0;
    }

    emit RollResult(msg.sender, randomNumber);
  }

  // Modifier: used to define a set of rules that must be met before or after a function is executed
  // Check the withdraw() function
  modifier isOwner() {
    // msg.sender: predefined variable that represents address of the account that called the current function
    require(msg.sender == owner, "Not the Owner");
    _;
  }

  /**
   * Function that allows the owner to withdraw all the Ether in the contract
   * The function can only be called by the owner of the contract as defined by the isOwner modifier
   */
  function withdraw() public isOwner {
    (bool success, ) = owner.call{ value: address(this).balance }("");
    require(success, "Failed to send Ether");
  }

  /**
   * Function that allows the contract to receive ETH
   */
  receive() external payable {}
}