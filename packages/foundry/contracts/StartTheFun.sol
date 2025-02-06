// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Remove debugging import for production
// import "forge-std/console.sol";

// Consider using OpenZeppelin's Ownable for access control
// import "@openzeppelin/contracts/access/Ownable.sol";

// Add this interface before the YourContract
interface IFunContract {
    function startTheFun(address[] calldata participants) external payable;
}

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract StartTheFun {
    event Staked(bytes32 indexed gameId, address indexed user, uint256 amount);
    event Unstaked(bytes32 indexed gameId, address indexed user, uint256 amount);
    event GameCreated(bytes32 indexed gameId, address indexed creator, address indexed whereTheFunIs);

    struct Game {
        address whereTheFunIs;
        uint256 price;
        uint256 totalRequired;
        uint256 deadline;
        uint256 totalStaked;
        bool started;
        bool withdrawable;
        address[] stakedAddresses;
        mapping(address => bool) isStaked;
    }

    mapping(bytes32 => Game) public games;

    function createGame(
        address _whereTheFunIs,
        uint256 _price,
        uint256 _totalRequired,
        uint256 _deadlineInSecondsFromNow
    ) external returns (bytes32) {
        require(_whereTheFunIs != address(0), "Invalid fun address");
        require(_price > 0, "Price must be greater than 0");
        require(_totalRequired >= _price, "Total required must be at least the price");
        
        // Generate a random gameId based on previous block hash, creator address, and contract address
        bytes32 gameId = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                msg.sender,
                address(this)
            )
        );
        require(games[gameId].whereTheFunIs == address(0), "Game already exists");
        Game storage newGame = games[gameId];
        
        newGame.whereTheFunIs = _whereTheFunIs;
        newGame.price = _price;
        newGame.totalRequired = _totalRequired;
        newGame.deadline = block.timestamp + _deadlineInSecondsFromNow;
        newGame.started = false;
        newGame.withdrawable = false;
        
        emit GameCreated(gameId, msg.sender, _whereTheFunIs);
        return gameId;
    }

    function timeLeft(bytes32 gameId) public view returns (uint256) {
        Game storage game = games[gameId];
        if(block.timestamp >= game.deadline) {
            return 0;
        }
        return game.deadline - block.timestamp;
    }
    
    function stake(bytes32 gameId) public payable {
        Game storage game = games[gameId];
        require(!game.started, "Game already started");
        require(msg.value == game.price, "Please send the price exactly");
        require(!game.isStaked[msg.sender], "Address already staked");

        game.totalStaked += msg.value;
        game.stakedAddresses.push(msg.sender);
        game.isStaked[msg.sender] = true;
        emit Staked(gameId, msg.sender, msg.value);
    }

    function unstake(bytes32 gameId) public {
        Game storage game = games[gameId];
        require(block.timestamp >= game.deadline, "Deadline has not passed");
        require(game.isStaked[msg.sender], "Address not staked");

        game.totalStaked -= game.price;
        game.isStaked[msg.sender] = false;

        for (uint i = 0; i < game.stakedAddresses.length; i++) {
            if (game.stakedAddresses[i] == msg.sender) {
                game.stakedAddresses[i] = game.stakedAddresses[game.stakedAddresses.length - 1];
                game.stakedAddresses.pop();
                break;
            }
        }

        emit Unstaked(gameId, msg.sender, game.price);
        payable(msg.sender).transfer(game.price);
    }

    function withdraw(bytes32 gameId) public {
        Game storage game = games[gameId];
        require(game.withdrawable, "Withdrawal is not allowed yet");
        require(game.isStaked[msg.sender], "You are not staked");
        game.isStaked[msg.sender] = false;
        payable(msg.sender).transfer(address(this).balance);
    }

    function start(bytes32 gameId) public {
        Game storage game = games[gameId];
        require(game.whereTheFunIs != address(0), "Where the fun is is not set");
        require(block.timestamp >= game.deadline, "Deadline has not passed");
        require(!game.started, "Already started");
        game.started = true;

        if(game.totalStaked >= game.totalRequired) {
            IFunContract funContract = IFunContract(game.whereTheFunIs);
            funContract.startTheFun{value: game.totalStaked}(game.stakedAddresses);
        } else {
            game.withdrawable = true;
        }
    }

    // Helper functions
    function getStakedAddresses(bytes32 gameId) external view returns (address[] memory) {
        return games[gameId].stakedAddresses;
    }
    
    function getStakedCount(bytes32 gameId) external view returns (uint256) {
        return games[gameId].stakedAddresses.length;
    }

    function getGameInfo(bytes32 gameId) external view returns (
        address whereTheFunIs,
        uint256 price,
        uint256 totalRequired,
        uint256 deadline,
        uint256 totalStaked,
        bool started,
        bool withdrawable
    ) {
        Game storage game = games[gameId];
        return (
            game.whereTheFunIs,
            game.price,
            game.totalRequired,
            game.deadline,
            game.totalStaked,
            game.started,
            game.withdrawable
        );
    }
}