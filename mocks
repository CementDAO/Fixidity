pragma solidity ^0.5.0;

import "../fixidity/FixidityLib.sol";

/**
 * @dev 
 */

contract FixidityLibMock {

    /**
     * @dev Converts an int256 to fixed point units, equivalent to multiplying
     * by 10^digits().
     */
    function newFromInt256(int256 x)
        public
        pure
        returns (int256)
    {
        return FixidityLib.newFromInt256(x);
    }

    /**
     * @dev Converts two int256 representing a fraction to fixed point units,
     * equivalent to multiplying dividend and divisor by 10^digits().
     */
    function newFromInt256Fraction(
        int256 numerator, 
        int256 denominator
        )
        public
        pure
        returns (int256)
    {
        return FixidityLib.newFromInt256Fraction(numerator, denominator);
    }

    /**
     * @dev Returns the integer part of a fixed point number.
     */
    function integer(int256 v) public pure returns (int256) {
        return FixidityLib.integer(v);
    }


    /**
     * @dev Returns the fractional part of a fixed point number.
     */
    function fractional(int256 v) public pure returns (int256) {
        return FixidityLib.fractional(v);
    }


    /**
     * @dev Converts to positive if negative
     */
    function abs(int256 x) public pure returns (int256) {
        return FixidityLib.abs(x);
    }
    
    /**
     * @dev a*b. If any of the operators is higher than max_fixed_mul() it 
     * might overflow.
     */
    function multiply(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.multiply(a, b);
    }
    
    /**
     * @dev 1/a
     */
    function reciprocal(int256 a) public pure returns (int256) {
        return FixidityLib.reciprocal(a);
    }

    /**
     * @dev a/b. If the dividend is higher than max_fixed_div() it 
     * might overflow.
     */
    function divide(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.divide(a, b);
    }

    /**
     * @dev a+b. If any operator is higher than max_fixed_add() it 
     * might overflow.
     */
    function add(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.add(a, b);
    }

    /**
     * @dev a-b.
     */
    function subtract(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.subtract(a, b);
    }
}
