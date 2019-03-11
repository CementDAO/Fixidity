pragma solidity ^0.5.0;

import "../FixidityLib.sol";

/**
 * @dev 
 */

contract FixidityLibMock {

    /**
     * @dev Number of positions that the comma is shifted to the right.
     */
    function digits() public pure returns(uint8) {
        return FixidityLib.digits();
    }
    
    /**
     * @dev This is 1 in the fixed point units used in this library.
     * 10^digits()
     * Hardcoded to 24 digits.
     */
    function fixed1() public pure returns(int256) {
        return FixidityLib.fixed1();
    }

    /**
     * @dev The amount of decimals lost on each multiplication operand.
     * Test mulPrecision() equals sqrt(fixed1)
     * Hardcoded to 24 digits.
     */
    function mulPrecision() public pure returns(int256) {
        return FixidityLib.mulPrecision();
    }

    /**
     * @dev Maximum value that can be represented in an int256
     * 2^256 / 2 -1
     * Hardcoded to 24 digits.
     */
    function maxInt256() public pure returns(int256) {
        return FixidityLib.maxInt256();
    }

    /**
     * @dev Minimum value that can be represented in an int256
     * -1 * ((2^256 / 2)-2)
     * Hardcoded to 24 digits.
     */
    function minInt256() public pure returns(int256) {
        return FixidityLib.minInt256();
    }

    /**
     * @dev Maximum value that can be converted to fixed point. Optimize for
     * deployment. 
     * maxInt256() / fixed1()
     * Hardcoded to 24 digits.
     */
    function maxNewFixed() public pure returns(int256) {
        return FixidityLib.maxNewFixed();
    }

    /**
     * @dev Maximum value that can be converted to fixed point. Optimize for
     * deployment. 
     * -(maxInt256()-1) / fixed1()
     * Hardcoded to 24 digits.
     */
    function minNewFixed() public pure returns(int256) {
        return FixidityLib.minNewFixed();
    }

    /**
     * @dev Maximum value that can be safely used as a multiplication operator.
     * sqrt(maxNewFixed())
     * Hardcoded to 24 digits.
     */
    function maxFixedMul() public pure returns(int256) {
        return FixidityLib.maxFixedMul();
    }

    /**
     * @dev Maximum value that can be safely used as a dividend.
     * divide(maxFixedDiv,newFixedFraction(1,fixed1())) = maxInt256().
     * maxInt256()/fixed1()
     * Hardcoded to 24 digits.
     */
    function maxFixedDiv() public pure returns(int256) {
        return FixidityLib.maxFixedDiv();
    }

    /**
     * @dev Maximum value that can be safely used as a divisor.
     * Hardcoded to 24 digits.
     */
    function maxFixedDivisor() public pure returns(int256) {
        return FixidityLib.maxFixedDivisor();
    }

    /**
     * @dev Maximum value that can be safely used as an addition operator.
     * maxInt256() / 2
     * Hardcoded to 24 digits.
     */
    function maxFixedAdd() public pure returns(int256) {
        return FixidityLib.maxFixedAdd();
    }

    /**
     * @dev Maximum negative value that can be safely in a subtraction.
     * Test maxFixedSub() equals minInt256() / 2
     * Hardcoded to 24 digits.
     */
    function maxFixedSub() public pure returns(int256) {
        return FixidityLib.maxFixedSub();
    }

    /**
     * @dev Converts an int256 to fixed point units, equivalent to multiplying
     * by 10^digits().
     */
    function newFixed(int256 x)
        public
        pure
        returns (int256)
    {
        return FixidityLib.newFixed(x);
    }

    /**
     * @dev Converts an int256 in the fixed point representation of this 
     * library to a non decimal. All decimal digits will be truncated.
     */
    function fromFixed(int256 x)
        public
        pure
        returns (int256)
    {
        return FixidityLib.fromFixed(x);
    }

    /**
     * @dev Converts an int256 which is already in some fixed point 
     * representation to a different fixed precision representation.
     * Both the origin and destination precisions must be 38 or less digits.
     * Origin values with a precision higher than the destination precision
     * will be truncated accordingly.
     */
    function convertFixed(int256 x, uint8 _originDigits, uint8 _destinationDigits)
        public
        pure
        returns (int256)
    {
        return FixidityLib.convertFixed(x, _originDigits, _destinationDigits);
    }
    /**
     * @dev Converts two int256 representing a fraction to fixed point units,
     * equivalent to multiplying dividend and divisor by 10^digits().
     */
    function newFixedFraction(
        int256 numerator, 
        int256 denominator
        )
        public
        pure
        returns (int256)
    {
        return FixidityLib.newFixedFraction(numerator, denominator);
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
     * @dev a*b. If any of the operators is higher than maxFixedMul() it 
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
     * @dev a/b. If the dividend is higher than maxFixedDiv() it 
     * might overflow.
     */
    function divide(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.divide(a, b);
    }

    /**
     * @dev a+b. If any operator is higher than maxFixedAdd() it 
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
