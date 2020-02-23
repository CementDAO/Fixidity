pragma solidity ^0.5.0;
import "../FixidityLib.sol";


contract FixidityLibMock {

    function digits() public pure returns(uint8) {
        return FixidityLib.digits();
    }

    function fixed1() public pure returns(int256) {
        return FixidityLib.fixed1();
    }

    function mulPrecision() public pure returns(int256) {
        return FixidityLib.mulPrecision();
    }

    function maxInt256() public pure returns(int256) {
        return FixidityLib.maxInt256();
    }

    function minInt256() public pure returns(int256) {
        return FixidityLib.minInt256();
    }

    function maxNewFixed() public pure returns(int256) {
        return FixidityLib.maxNewFixed();
    }

    function minNewFixed() public pure returns(int256) {
        return FixidityLib.minNewFixed();
    }

    function maxFixedMul() public pure returns(int256) {
        return FixidityLib.maxFixedMul();
    }

    function maxFixedDiv() public pure returns(int256) {
        return FixidityLib.maxFixedDiv();
    }

    function maxFixedDivisor() public pure returns(int256) {
        return FixidityLib.maxFixedDivisor();
    }

    function maxFixedAdd() public pure returns(int256) {
        return FixidityLib.maxFixedAdd();
    }

    function maxFixedSub() public pure returns(int256) {
        return FixidityLib.maxFixedSub();
    }

    function newFixed(int256 x)
        public
        pure
        returns (int256)
    {
        return FixidityLib.newFixed(x);
    }

    function fromFixed(int256 x)
        public
        pure
        returns (int256)
    {
        return FixidityLib.fromFixed(x);
    }

    function convertFixed(int256 x, uint8 _originDigits, uint8 _destinationDigits)
        public
        pure
        returns (int256)
    {
        return FixidityLib.convertFixed(x, _originDigits, _destinationDigits);
    }

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

    function integer(int256 v) public pure returns (int256) {
        return FixidityLib.integer(v);
    }

    function fractional(int256 v) public pure returns (int256) {
        return FixidityLib.fractional(v);
    }

    function negative(int256 x) public pure returns (int256) {
        return FixidityLib.negative(x);
    }

    function abs(int256 x) public pure returns (int256) {
        return FixidityLib.abs(x);
    }

    function multiply(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.multiply(a, b);
    }

    function reciprocal(int256 a) public pure returns (int256) {
        return FixidityLib.reciprocal(a);
    }

    function divide(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.divide(a, b);
    }

    function add(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.add(a, b);
    }

    function subtract(int256 a, int256 b) public pure returns (int256) {
        return FixidityLib.subtract(a, b);
    }
}
