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
  mapping(address => bool) public isClaim;
  mapping(address => bool) public isStop;

  struct Box {
    uint256 id;
    uint256 typeGrid;
    uint256 numberOfPlayers;
    address owner;
  }

  event RollResult(address player, uint256 num);

  constructor(address _owner, address _registryAddress, address _candyAddress) {
    owner = _owner;
    registry = ERC6551Registry(_registryAddress);
    candy = CandyToken(_candyAddress);

    for (uint256 id = 0; id < 15; id++) {
      if (id == 5 || id == 6 || id == 7 || id == 9 || id == 10) grid.push(Box(id, 1, 0, address(0)));
      else grid.push(Box(id, 0, 0, address(0)));
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
    address tbaAddress = tbaList[msg.sender];
    uint256 randomNumber = uint256(keccak256(abi.encode(block.timestamp, msg.sender, tbaAddress))) % 3;
    bucketPosititon[tbaAddress] += randomNumber + 1;

    if (bucketPosititon[tbaAddress] == 5 || bucketPosititon[tbaAddress] == 6 || bucketPosititon[tbaAddress] == 7 || bucketPosititon[tbaAddress] == 9 || bucketPosititon[tbaAddress] == 10) {
      isClaim[tbaAddress] = true;
    }
    else if (bucketPosititon[tbaAddress] >= 14) {
      bucketPosititon[tbaAddress] = 0;
    }
    else if (grid[bucketPosititon[tbaAddress]].typeGrid == 9 && grid[bucketPosititon[tbaAddress]].owner != tbaAddress) {
      isStop[tbaAddress] = true;
    }

    emit RollResult(tbaAddress, randomNumber);
  }

  function claimCandy() public {
    address tbaAddress = tbaList[msg.sender];
    require(bucketPosititon[tbaAddress] == 5 || bucketPosititon[tbaAddress] == 6 || bucketPosititon[tbaAddress] == 7 || bucketPosititon[tbaAddress] == 9 || bucketPosititon[tbaAddress] == 10, "You cannot claim candy");
    require(isClaim[tbaAddress], "You already claim candy");

    candy.mint(tbaAddress, 10 * 10 ** 18);
    isClaim[tbaAddress] = false;
  }

  function hireTheft() public {
    address tbaAddress = tbaList[msg.sender];
    Box storage currentSpot = grid[bucketPosititon[tbaAddress]];

    require(currentSpot.typeGrid == 0, "You cannot hire in this spot");

    currentSpot.typeGrid = 9;
  }

  function payTheft() public {
    address tbaAddress = tbaList[msg.sender];
    Box storage currentSpot = grid[bucketPosititon[tbaAddress]];

    currentSpot.typeGrid = 0;
    currentSpot.owner = address(0);
    isStop[tbaAddress] = false;
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