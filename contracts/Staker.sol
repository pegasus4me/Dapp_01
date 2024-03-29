// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IMintRewards.sol";

// Reward Token Address = 0xAF162873B327C33213D76e0228647b0e2CA9E473
// Staking Contract Address = 0x2957e5D4C9DE8F1DA7f3Fd74803c9D231d86D704

contract StackingV1 {
    
    IRewardToken public rewardsToken;

    uint256 rewardRate;
    address owner;
    event Staked(address _staker, uint256 _amount);
    event Unstaked(address _staker, uint256 _amount);
    event Deposit(address indexed sender, uint256 amount);
    constructor(address _rewardsToken) {
        owner = msg.sender;
        rewardsToken = IRewardToken(_rewardsToken);
    }
    mapping(address => uint256) public balances;
    mapping(address => uint256) public stakedbalance;
    mapping(address => uint256) public stakeSnapshot;
    mapping(address => uint256) public withdrawSnapShot;
    mapping(address => uint256) public rewardBalance;

    // function OnlyOwner() internal view returns(string memory) {
    //     if (msg.sender != owner) revert("not the owner of the contract");
    // }


   function stake() external payable {
        require(msg.value > 0, "amount must be higher than zero");
        require(
            address(msg.sender).balance >= msg.value,
            "amount higher than your balance"
        );
    
        balances[msg.sender] += msg.value;
        

        stakedbalance[msg.sender] += msg.value;
        stakeSnapshot[msg.sender] = block.timestamp;

        emit Staked(msg.sender, msg.value);
    }

    function calculateRewards() internal returns (uint256) {
        // calc les rewards du staker en function de la size stacké et la durée;

        rewardRate = 1 ether;
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
        // snapshot withdraw 
        withdrawSnapShot[msg.sender] = block.timestamp;
        // transfer tokens from contract => user wallet
        address payable _to = payable(address(msg.sender));
        (bool sent, bytes memory data) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        // emit event
        emit Unstaked(msg.sender, _amount);
        
        // Update rewardBalance[msg.sender] by adding any additional rewards earned since last withdrawal
        uint256 additionalRewards = calculateRewards();
        rewardBalance[msg.sender] += additionalRewards;
    }

    function claimRewardsEarned() external payable{
        uint256 totalR = calculateRewards();
        require(totalR > 0, "no rewards earned");
        // mint rewards to the caller of this function 
        rewardsToken.mintRewards(msg.sender, totalR);

        rewardBalance[msg.sender] -= totalR;
        withdrawSnapShot[msg.sender] = 0;
    }

    function checkRewardsEarned() public view returns (uint256) {
        return rewardBalance[msg.sender];
    }

    // function setRewardsDuration() external {
    //     OnlyOwner();
    // }
    
    function checkBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
