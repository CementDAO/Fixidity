pragma solidity ^0.5.0;

/**
 * @dev This library provides fixed point arithmetic. All operations are done
 * with int256 and the operands must have been created with any of the newFrom*
 * functions, which shift the comma digits() to the right and check for limits.
 * When using this library be sure of using max_fixed() as the upper limit for
 * creation of fixed point numbers. Use max_fixed_mul(), max_fixed_div() and
 * max_fixed_add() if you want to be certain that those operations don't 
 * overflow.
 */

library FixidityLib {

    /**
     * @dev Number of positions that the comma is shifted to the right.
     */
    function digits() public pure returns(uint8) {
        return 36;
    }
    
    /**
     * @dev This is 1 in the fixed point units used in this library.
     * Hardcoded to 36 digits.
     */
    function fixed_1() public pure returns(int256) {
        return 1000000000000000000000000000000000000;
    }

    /**
     * @dev This is e in the fixed point units used in this library.
     * Hardcoded to 36 digits.
     */
    function fixed_e() public pure returns(int256) {
        return 2718281828459045235360287471352662498;
    }

    /**
     * @dev This is pi in the fixed point units used in this library.
     * Hardcoded to 36 digits.
     */
    function fixed_pi() public pure returns(int256) {
        return 3141592653589793238462643383279502884;
    }

    /**
     * @dev fixed_exp_10
     * Hardcoded to 36 digits.
     */
    function fixed_exp_10() public pure returns(int256) {
        return 22026465794806716516957900645284244000000;
    }

    /**
     * @dev Maximum value that can be represented in an int256
     * Hardcoded to 36 digits.
     */
    function max_int256() public pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282019728792003956564819967;
    }

    /**
     * @dev Maximum value that can be converted to fixed point. Optimize for
     * deployment.
     */
    function max_fixed() public pure returns(int256) {
        return max_int256() / fixed_1();
    }

    /**
     * @dev Maximum value that can be safely used as a multiplication operator.
     * Hardcoded to 36 digits.
     */
    function max_fixed_mul() public pure returns(int256) {
        return 240615969168004500000; // sqrt(max_fixed())
    }

    /**
     * @dev Maximum value that can be safely used as a dividend operator.
     */
    function max_fixed_div() public pure returns(int256) {
        return max_fixed() / fixed_1(); // Depends on reciprocal()
    }

    /**
     * @dev Maximum value that can be safely used as an addition operator.
     */
    function max_fixed_add() public pure returns(int256) {
        return max_fixed() / 2;
    }

    /**
     * @dev Converts an int256 to fixed point units, equivalent to multiplying
     * by 10^digits().
     */
    function newFromInt256(int256 x)
        public
        pure
        returns (int256)
    {
        assert(x < max_fixed()); // Cannot process numbers above 57896044618658097711785492504343953926633.
        return multiply(x, fixed_1());
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
        assert(numerator < max_fixed());
        assert(denominator < max_fixed());
        int256 convertedNumerator = newFromInt256(numerator);
        int256 convertedDenominator = newFromInt256(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Converts an int256 to the closest higher multiple of 10^digits().
     * TODO: Not sure.
     */
    function round(int256 v) public pure returns (int256) {
        return round_off(v);
    }

    /**
     * @dev Returns the integer part of a fixed point number.
     */
    function integer(int256 v) public pure returns (int256) {
        return (v / fixed_1()) * fixed_1(); // Can't overflow
    }


    /**
     * @dev Returns the fractional part of a fixed point number.
     */
    function fractional(int256 v) public pure returns (int256) {
        return v - (v / fixed_1()) * fixed_1(); // Can't overflow
    }


    /**
     * @dev Converts to positive if negative
     */
    function abs(int256 x) public pure returns (int256) {
        if(x < 0) return -x;
        else return x;
    }
    
    /**
     * @dev a*b. If any of the operators is higher than max_fixed_mul() it 
     * might overflow.
     */
    function multiply(int256 a, int256 b) public pure returns (int256) {
        if(a == 0 || b == 0) return 0;
        if(b == fixed_1()) return a;
        if(a == fixed_1()) return b;

        // Separate into integer and fractional parts
        // a = a1 + a2, b = b1 + b2
        int256 a1 = integer(a) / fixed_1();
        int256 a2 = fractional(a);
        int256 b1 = integer(b) / fixed_1();
        int256 b2 = fractional(b);
        
        // (a1 + a2) * (b1 + b2) = (a1 * b1) + (a1 * b2) + (a2 * b1) + (a2 * b2)
        int256 a1b1 = a1 * b1;
        if (a1 != 0) assert(a1b1 / a1 == b1); // Overflow a1b1
        
        // Only a1b1 needs to be multiplied back by fixed_1
        int256 fixed_a1b1 = a1b1 * fixed_1();
        if (a1b1 != 0) assert(fixed_a1b1 / a1b1 == fixed_1()); // Overflow a1b1 * fixed_1

        int256 a2b1 = a2 * b1;
        if (a2 != 0) assert(a2b1 / a2 == b1); // Overflow a2b1

        int256 a1b2 = a1 * b2;
        if (a1 != 0) assert(a1b2 / a1 == b2); // Overflow a1b2

        int256 a2b2 = a2 * b2;
        if (a2 != 0) assert(a2b2 / a2 == b2); // Overflow a2b2

        //int256 result = fixed_1() * x1 * y1 + x1 * y2 + x2 * y1 + x2 * y2 / fixed_1();
        int256 result = add(a1b1, a2b1); // Add checks for overflow
        result = add(result, a1b2); // Add checks for overflow
        result = add(result, a2b2); // Add checks for overflow
        return result;
    }
    
    /**
     * @dev 1/a
     */
    function reciprocal(int256 a) public pure returns (int256) {
        return fixed_1() / a; // Can't overflow
    }

    /**
     * @dev a/b. If the dividend is higher than max_fixed_div() it 
     * might overflow.
     */
    function divide(int256 a, int256 b) public pure returns (int256) {
        if(b == fixed_1()) return a;
        assert(b != 0);
        return multiply(a, reciprocal(b));
    }

    /**
     * @dev a+b. If any operator is higher than max_fixed_add() it 
     * might overflow.
     */
    function add(int256 a, int256 b) public pure returns (int256) {
        int256 t = a + b;
        assert(t - a == b);
        return t;
    }

    /**
     * @dev a-b.
     */
    function subtract(int256 a, int256 b) public pure returns (int256) {
        int256 t = a - b;
        assert(t + a == b);
        return t;
    }

    /**
     * @dev If v is closer to ceiling(v) than to floor(v) then return ceiling(v). Should be round_up()
     */
    function round_off(int256 v) public pure returns (int256) {
        int8 sign = 1;
        if(v < 0) {
            sign = -1;
            v = abs(v);
        }
        if(v % fixed_1() >= fixed_1() / 2) v = v + fixed_1() - v % fixed_1();
        return v * sign;
    }
}
