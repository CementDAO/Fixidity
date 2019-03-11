pragma solidity ^0.5.0;

import "../LogarithmLib.sol";

/**
 * @dev 
 */

contract LogarithmLibMock {

    function fixedE() public pure returns(int256) {
        return LogarithmLib.fixedE();
    }

    function fixedLn1_5() public pure returns(int256) {
        return LogarithmLib.fixedLn1_5();
    }

    function fixedLn10() public pure returns(int256) {
        return LogarithmLib.fixedLn10();
    }

    function ln(int256 value) public pure returns (int256) {
        return LogarithmLib.ln(value);
    }

    function log_b(int256 b, int256 x) public pure returns (int256) {
        return LogarithmLib.log_b(b, x);
    }
}
