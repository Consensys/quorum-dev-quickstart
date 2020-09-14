pragma solidity ^0.6.0;

/**
 * @dev Counter contract for demo purposes
 *
 */
contract Counter {
    uint256 counter;

    event Incremented(address from, uint256 by);

    /**
    * @dev increment counter of `value`
    */
    function increment(uint256 value) public {
        counter += value;
        emit Incremented(msg.sender, value);
    }
}
