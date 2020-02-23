pragma solidity ^0.5.0;


/**
 * @title FixidityLib
 * @author Gadi Guy, Alberto Cuesta Canada
 * @notice This library provides fixed point arithmetic with protection against
 * overflow.
 * All operations are done with int256 and the operands must have been created
 * with any of the newFrom* functions, which shift the comma digits() to the
 * right and check for limits.
 * When using this library be sure of using maxNewFixed() as the upper limit for
 * creation of fixed point numbers. Use maxFixedMul(), maxFixedDiv() and
 * maxFixedAdd() if you want to be certain that those operations don't
 * overflow.
 */
library FixidityLib {

    /** CONSTANTS */

    /**
     * @notice Number of positions that the comma is shifted to the right.
     */
    function digits() internal pure returns(uint8) {
        return 24;
    }

    /**
     * @notice This is 1 in the fixed point units used in this library.
     * @dev Hardcoded to 24 digits.
     */
    function fixed1() internal pure returns(int256) {
        return 1000000000000000000000000;
    }

    /**
     * @notice The amount of decimals lost on each multiplication operand.
     * Hardcoded to 24 digits.
     */
    function mulPrecision() internal pure returns(int256) {
        return 1000000000000;
    }

    /**
     * @notice Maximum value that can be represented in an int256
     * @dev Hardcoded to 24 digits.
     */
    function maxInt256() internal pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282019728792003956564819967;
    }

    /**
     * @notice Minimum value that can be represented in an int256
     * @dev Hardcoded to 24 digits.
     */
    function minInt256() internal pure returns(int256) {
        return -57896044618658097711785492504343953926634992332820282019728792003956564819968;
    }

    /**
     * @notice Maximum value that can be converted to fixed point. Optimize for
     * @dev Hardcoded to 24 digits.
     */
    function maxNewFixed() internal pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282;
    }

    /**
     * @notice Minimum value that can be converted to fixed point. Optimize for
     * deployment.
     * @dev Hardcoded to 24 digits.
     */
    function minNewFixed() internal pure returns(int256) {
        return -57896044618658097711785492504343953926634992332820282;
    }

    /**
     * @notice Maximum value that can be safely used as an addition operator.
     * @dev Hardcoded to 24 digits.
     */
    function maxFixedAdd() internal pure returns(int256) {
        return 28948022309329048855892746252171976963317496166410141009864396001978282409983;
    }

    /**
     * @notice Maximum negative value that can be safely in a subtraction.
     * @dev Hardcoded to 24 digits.
     */
    function maxFixedSub() internal pure returns(int256) {
        return -28948022309329048855892746252171976963317496166410141009864396001978282409984;
    }

    /**
     * @notice Maximum value that can be safely used as a multiplication operator.
     * @dev Calculated as sqrt(maxInt256()*fixed1()).
     * Be careful with your sqrt() implementation. I couldn't find a calculator
     * that would give the exact square root of maxInt256*fixed1 so this number
     * is below the real number by no more than 3*10**28. It is safe to use as
     * a limit for your multiplications, although powers of two of numbers over
     * this value might still work.
     * Hardcoded to 24 digits.
     */
    function maxFixedMul() internal pure returns(int256) {
        return 240615969168004511545033772477625056927114980741063;
    }

    /**
     * @notice Maximum value that can be safely used as a dividend.
     * @dev Hardcoded to 24 digits.
     */
    function maxFixedDiv() internal pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282;
    }

    /**
     * @notice Maximum value that can be safely used as a divisor.
     * @dev Hardcoded to 24 digits.
     */
    function maxFixedDivisor() internal pure returns(int256) {
        return 1000000000000000000000000000000000000000000000000;
    }

    /** CONVERSIONS */

    /**
     * @notice Converts an int256 which is already in some fixed point
     * representation to a different fixed precision representation.
     * Both the origin and destination precisions must be 38 or less digits.
     * Origin values with a precision higher than the destination precision
     * will be truncated accordingly.
     */
    function convertFixed(int256 x, uint8 _originDigits, uint8 _destinationDigits)
        internal
        pure
        returns (int256)
    {
        require(_originDigits <= 38 && _destinationDigits <= 38, "Too many digits.");

        uint8 decimalDifference;
        if ( _originDigits > _destinationDigits ){
            decimalDifference = _originDigits - _destinationDigits;
            return x/(uint128(10)**uint128(decimalDifference));
        }
        else if ( _originDigits < _destinationDigits ){
            decimalDifference = _destinationDigits - _originDigits;
            // Cast uint8 -> uint128 is safe
            // Exponentiation is safe:
            //     _originDigits and _destinationDigits limited to 38 or less
            //     decimalDifference = abs(_destinationDigits - _originDigits)
            //     decimalDifference < 38
            //     10**38 < 2**128-1
            require(x <= maxInt256()/uint128(10)**uint128(decimalDifference));
            require(x >= minInt256()/uint128(10)**uint128(decimalDifference));
            return x*(uint128(10)**uint128(decimalDifference));
        }
        // _originDigits == digits())
        return x;
    }

    /**
     * @notice Safe casting from int256 to uint256
     * @param x int256 to cast
     * @return casted uint256
     */
    function safeIntToUint(int256 x) internal pure returns(uint256) {
        require(
            x >= 0,
            "Cannot cast negative signed integer to unsigned integer."
        );
        return uint256(x);
    }

    /**
     * @notice Safe casting from uint256 to int256
     * @param x uint256 to cast
     * @return casted int256
     */
    function safeUintToInt(uint256 x) internal pure returns(int256) {
        require(
            x <= safeIntToUint(maxInt256()),
            "Cannot cast overflowing unsigned integer to signed integer."
        );
        return int256(x);
    }

    /// @dev Create a Fixidity fixed point number with `digits()` decimal numbers from an fixed point integer created elsewhere.
    function toFixed(int256 x, uint8 _originDigits) internal pure returns (int256) {
        return convertFixed(x, _originDigits, digits());
    }

    /// @dev Create a Fixidity fixed point number with `digits()` decimal numbers from an fixed point unsigned integer created elsewhere.
    /// ERC20Detailed tokens are in a fixed point representation of `decimals()` decimal numbers.
    /// When working with wei amounts, use `fixedFromUint(amount, token.decimals())`.
    /// To create decimal numbers, like for example 2.345, you would call `fixedFromUint(2345, 3)`.
    function toFixed(uint256 x, uint8 _originDigits) internal pure returns (int256) {
        return toFixed(safeUintToInt(x), _originDigits);
    }

    /// @dev Create a Fixidity fixed point number with `digits()` decimal numbers from an integer.
    function toFixed(int256 x) internal pure returns (int256) {
        return toFixed(x, 0);
    }

    /// @dev Create a Fixidity fixed point number with `digits()` decimal numbers from an unsigned integer.
    function toFixed(uint256 x) internal pure returns (int256) {
        return toFixed(x, 0);
    }

    /// @dev Convert a Fixidity fixed point number to an integer, truncating decimal numbers less significative than `_destinationDigits` and then removing the comma.
    function toInt(int256 x, uint8 _destinationDigits) internal pure returns (int256) {
        return convertFixed(x, digits(), _destinationDigits);
    }

    /// @dev Convert a Fixidity fixed point number to an unsigned integer, truncating decimal numbers less significative than `_destinationDigits` and then removing the comma.
    /// ERC20Detailed tokens are in a fixed point representation of `decimals()` decimal numbers.
    /// When working with wei amounts, use `uintFromFixed(amount, token.decimals())`.
    function toUint(int256 x, uint8 _destinationDigits) internal pure returns (uint256) {
        return safeIntToUint(toInt(x, _destinationDigits));
    }

    /// @dev Convert a Fixidity fixed point number to an integer, truncating all decimal numbers
    function toInt(int256 x) internal pure returns (int256) {
        return toInt(x, 0);
    }

    /// @dev Convert a Fixidity fixed point number to an unsigned integer, truncating all decimal numbers
    function toUint(int256 x) internal pure returns (uint256) {
        return toUint(x, 0);
    }

    /** MATH */

    /**
     * @notice Returns the integer part of a fixed point number.
     */
    function integer(int256 x) internal pure returns (int256) {
        return (x / fixed1()) * fixed1(); // Can't overflow
    }

    /**
     * @notice Returns the fractional part of a fixed point number.
     * In the case of a negative number the fractional is also negative.
     */
    function fractional(int256 x) internal pure returns (int256) {
        return x - (x / fixed1()) * fixed1(); // Can't overflow
    }

    /**
     * @notice Returns the negative of a fixed point number.
     * Due to int256 having one more negative number than positive numbers
     * negative(minInt256) reverts.
     */
    function negative(int256 x) internal pure returns (int256) {
        require(x > minInt256());
        return -x;
    }

    /**
     * @notice Converts to positive if negative.
     */
    function abs(int256 x) internal pure returns (int256) {
        if (x >= 0) {
            return x;
        } else {
            return negative(x);
        }
    }

    /**
     * @notice x+y. If any operator is higher than maxFixedAdd() it
     * might overflow.
     * In solidity maxInt256 + 1 = minInt256 and viceversa.
     */
    function add(int256 x, int256 y) internal pure returns (int256) {
        int256 z = x + y;
        if (x > 0 && y > 0) require(z > x && z > y);
        if (x < 0 && y < 0) require(z < x && z < y);
        return z;
    }

    /**
     * @notice x-y. You can use add(x,-y) instead.
     */
    function subtract(int256 x, int256 y) internal pure returns (int256) {
        return add(x,negative(y));
    }

    /**
     * @notice x*y. If any of the operators is higher than maxFixedMul() it
     * might overflow.
     */
    function multiply(int256 x, int256 y) internal pure returns (int256) {
        if (x == 0 || y == 0) return 0;
        if (y == fixed1()) return x;
        if (x == fixed1()) return y;

        // Separate into integer and fractional parts
        // x = x1 + x2, y = y1 + y2
        int256 x1 = integer(x) / fixed1();
        int256 x2 = fractional(x);
        int256 y1 = integer(y) / fixed1();
        int256 y2 = fractional(y);

        // (x1 + x2) * (y1 + y2) = (x1 * y1) + (x1 * y2) + (x2 * y1) + (x2 * y2)
        int256 x1y1 = x1 * y1;
        if (x1 != 0) require(x1y1 / x1 == y1); // Overflow x1y1

        // x1y1 needs to be multiplied back by fixed1
        // solium-disable-next-line mixedcase
        int256 fixed_x1y1 = x1y1 * fixed1();
        if (x1y1 != 0) require(fixed_x1y1 / x1y1 == fixed1()); // Overflow x1y1 * fixed1
        x1y1 = fixed_x1y1;

        int256 x2y1 = x2 * y1;
        if (x2 != 0) require(x2y1 / x2 == y1); // Overflow x2y1

        int256 x1y2 = x1 * y2;
        if (x1 != 0) require(x1y2 / x1 == y2); // Overflow x1y2

        x2 = x2 / mulPrecision();
        y2 = y2 / mulPrecision();
        int256 x2y2 = x2 * y2;
        if (x2 != 0) require(x2y2 / x2 == y2); // Overflow x2y2

        // result = fixed1() * x1 * y1 + x1 * y2 + x2 * y1 + x2 * y2 / fixed1();
        int256 result = x1y1;
        result = add(result, x2y1); // Add checks for overflow
        result = add(result, x1y2); // Add checks for overflow
        result = add(result, x2y2); // Add checks for overflow
        return result;
    }

    /**
     * @notice 1/x
     */
    function reciprocal(int256 x) internal pure returns (int256) {
        require(x != 0);
        return (fixed1()*fixed1()) / x; // Can't overflow
    }

    /**
     * @notice x/y. If the dividend is higher than maxFixedDiv() it
     * might overflow. You can use multiply(x,reciprocal(y)) instead.
     * There is a loss of precision on division for the lower mulPrecision() decimals.
     */
    function divide(int256 x, int256 y) internal pure returns (int256) {
        if (y == fixed1()) return x;
        require(y != 0);
        require(y <= maxFixedDivisor());
        return multiply(x, reciprocal(y));
    }

    /** OBSOLETE FUNCTIONS - LEFT FOR BACKWARDS COMPATIBILITY */

    /**
     * @notice Converts two int256 representing a fraction to fixed point units,
     * equivalent to multiplying dividend and divisor by 10^digits().
     */
    function newFixedFraction(
        int256 numerator,
        int256 denominator
        )
        internal
        pure
        returns (int256)
    {
        require(numerator <= maxNewFixed());
        require(denominator <= maxNewFixed());
        require(denominator != 0);
        int256 convertedNumerator = newFixed(numerator);
        int256 convertedDenominator = newFixed(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    /**
     * @notice Converts an int256 to fixed point units, equivalent to multiplying
     * by 10^digits().
     */
    function newFixed(int256 x) internal pure returns (int256) {
        return newFixed(x, 0);
    }

        /**
     * @notice Converts an int256 which is already in some fixed point
     * representation to that of this library. The _originDigits parameter is the
     * precision of x. Values with a precision higher than FixidityLib.digits()
     * will be truncated accordingly.
     */
    function newFixed(int256 x, uint8 _originDigits)
        internal
        pure
        returns (int256)
    {
        return toFixed(x, _originDigits);
    }

    /**
     * @notice Converts an int256 in the fixed point representation of this
     * library to a different representation. The _destinationDigits parameter is the
     * precision of the output x. Values with a precision below than
     * FixidityLib.digits() will be truncated accordingly.
     */
    function fromFixed(int256 x, uint8 _destinationDigits)
        internal
        pure
        returns (int256)
    {
        return toInt(x, _destinationDigits);
    }

    /**
     * @notice Converts an int256 in the fixed point representation of this
     * library to a non decimal. All decimal digits will be truncated.
     */
    function fromFixed(int256 x)
        internal
        pure
        returns (int256)
    {
        return toInt(x, 0);
    }
}
