// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StackingV1 {
    IERC20 public rewardsToken;

    uint64 rewardRate;
    address owner;
    event Staked(address _staker, uint256 _amount);
    event Unstaked(address _staker, uint256 _amount);

    constructor(address _rewardsToken) {
        owner = msg.sender;
        rewardsToken = IERC20(_rewardsToken);
    }

    mapping(address => uint256) public stakedbalance;
    mapping(address => uint256) public stakeSnapshot;
    mapping(address => uint256) public withdrawSnapShot;
    mapping(address => uint256) public rewardBalance;

    // function OnlyOwner() internal view returns(string memory) {
    //     if (msg.sender != owner) revert("not the owner of the contract");
    // }

    function stake(uint256 _amount) external payable {
        require(_amount > 0, "amount must be higher than zero");
        require(
            address(msg.sender).balance >= _amount,
            "amount higher than your balance"
        );
        address payable _to = payable(address(this));
        // if staker has eth staked in the contract he can call the withdraw function
        (bool sent, bytes memory data) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        stakedbalance[msg.sender] += _amount;
        stakeSnapshot[msg.sender] = block.timestamp;

        emit Staked(msg.sender, _amount);
    }



    function checkStakedBalance() external view returns(uint256) {
        return stakedbalance[msg.sender]; 
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "amount must be higher than zero");
        require(
            stakedbalance[msg.sender] >= _amount,
            "cannot withraw more than you have"
        );

        // mise a jour balance user sur le contract
        stakedbalance[msg.sender] -= _amount;
        // snapshot withdraw calculate rewards en +
        withdrawSnapShot[msg.sender] = block.timestamp;
        // transfer tokens from contract => user wallet
        address payable _to = payable(address(msg.sender));
        (bool sent, bytes memory data) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        // emit event
        emit Unstaked(msg.sender, _amount);
    }
    
    function calculateRewards() internal returns (uint256) {
        // calc les rewards du staker en function de la size stacké et la durée;
        rewardRate = uint64(0.03 * 100) / 100;

        uint256 startStake = stakeSnapshot[msg.sender];
        uint256 withdrawSnap = withdrawSnapShot[msg.sender];

        require(withdrawSnap >= startStake, "Invalid withdrawal snapshot");
        // calculer la durée pendant la quelle les tokens on eté stackés start ------------------------------- end
        uint256 duration = withdrawSnap - startStake;

        // calculer les recompenses
        uint256 rewardsEarned = duration * rewardRate;
        rewardBalance[msg.sender] = rewardsEarned;
        return rewardsEarned;
    }

    function claimRewardsEarned() external payable{
        calculateRewards();
        uint256 rewardsEarned = rewardBalance[msg.sender];
        require(rewardsEarned > 0, "no rewards earned");
        rewardsToken.transfer(msg.sender, rewardsEarned);

        rewardBalance[msg.sender] -= rewardsEarned;
        withdrawSnapShot[msg.sender] = 0;
    }

    function checkRewardsEarned() public view returns (uint256) {
        return rewardBalance[msg.sender];
    }

    // function setRewardsDuration() external {
    //     OnlyOwner();
    // }

    receive() external payable {}
}
