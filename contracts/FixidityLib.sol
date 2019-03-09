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
     * 10^digits()
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
     * 2^256 / 2 -1
     * Hardcoded to 36 digits.
     */
    function max_int256() public pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282019728792003956564819967;
    }

    /**
     * @dev Maximum value that can be converted to fixed point. Optimize for
     * deployment. 
     * max_int256() / fixed_1()
     * Hardcoded to 36 digits.
     */
    function max_fixed() public pure returns(int256) {
        return 57896044618658097711785492504343953926634;
    }

    /**
     * @dev Maximum value that can be safely used as a multiplication operator.
     * sqrt(max_fixed())
     * Hardcoded to 36 digits.
     */
    function max_fixed_mul() public pure returns(int256) {
        return 240615969168004500000;
    }

    /**
     * @dev Maximum value that can be safely used as a dividend operator.
     * Defined by the reciprocal() implementation. max_int256() / fixed_1()
     * Hardcoded to 36 digits.
     */
    function max_fixed_div() public pure returns(int256) {
        return 57896044618658097711785492504343953926634;
    }

    /**
     * @dev Maximum value that can be safely used as an addition operator.
     * max_int256() / 2
     * Hardcoded to 36 digits.
     */
    function max_fixed_add() public pure returns(int256) {
        return 28948022309329048855892746252171976963317496166410141009864396001978282409983;
    }

    /**
     * @dev Converts an int256 to fixed point units, equivalent to multiplying
     * by 10^digits().
     * Test x = 0 returns 0
     * Test x = 1 returns fixed_1()
     * Test x = max_fixed() returns max_fixed() * fixed_1()
     * Test x = max_fixed()+1 fails
     */
    function newFromInt256(int256 x)
        public
        pure
        returns (int256)
    {
        assert(x < max_fixed()); // Cannot process numbers above 57896044618658097711785492504343953926633.
        return x * fixed_1();
    }

    /**
     * @dev Converts two int256 representing a fraction to fixed point units,
     * equivalent to multiplying dividend and divisor by 10^digits().
     * Test n = 0 returns 0
     * Test d = 0 fails
     * Test n = 1, d = 1 returns fixed_1()
     * Test n = max_fixed_div(), d = 1 returns max_fixed_div()
     * Test n = max_fixed_div()+1, d = 1 fails
     * Test n = 1, d = fixed_1() returns 1
     * Test n = 1, d = fixed_1()-1 returns 0
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
        assert(denominator != 0);
        int256 convertedNumerator = newFromInt256(numerator);
        int256 convertedDenominator = newFromInt256(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Returns the integer part of a fixed point number.
     * Test x = 0 returns 0
     * Test x = newFromInt256(max_fixed()) returns max_fixed()*fixed_1()
     */
    function integer(int256 x) public pure returns (int256) {
        return (x / fixed_1()) * fixed_1(); // Can't overflow
    }


    /**
     * @dev Returns the fractional part of a fixed point number.
     * Test x = 0 returns 0
     * Test x = fixed_1() returns 0
     * Test x = fixed_1()-1 returns 10^36-1
     */
    function fractional(int256 x) public pure returns (int256) {
        return x - (x / fixed_1()) * fixed_1(); // Can't overflow
    }


    /**
     * @dev Converts to positive if negative
     * Test x = 0 returns 0
     * Test x = fixed_1() returns -fixed_1()
     * Test x = -fixed_1() returns fixed_1()
     * Test x = newFromInt256(max_fixed) returns -max_fixed()
     * Test x = newFromInt256(-max_fixed) returns max_fixed()
     */
    function abs(int256 x) public pure returns (int256) {
        if(x < 0) return -x;
        else return x;
    }

    /**
     * @dev a+b. If any operator is higher than max_fixed_add() it 
     * might overflow.
     * Test a = 0, b = 0 returns 0
     * Test a = max_fixed_add(), b = 0 returns max_fixed_add()
     * Test a = 0, b = max_fixed_add() returns max_fixed_add()
     * Test a = max_fixed_add, b = max_fixed_add() returns max_fixed()
     * Test a = max_fixed_add + 1, b = max_fixed_add() fails
     */
    function add(int256 a, int256 b) public pure returns (int256) {
        int256 t = a + b;
        assert(t - a == b);
        return t;
    }

    /**
     * @dev a-b.
     * Test a = 0, b = 0 returns 0
     * Test a = max_fixed_add(), b = 0 returns max_fixed_add()
     * Test a = 0, b = max_fixed_add() returns -max_fixed_add()
     * Test a = max_fixed_add, b = max_fixed_add() returns 0
     * Test a = -max_fixed_add, b = -max_fixed_add() returns 0
     * Test a = -max_fixed_add, b = max_fixed_add() returns -max_fixed()
     * Test a = -max_fixed_add - 1, b = -max_fixed_add() fails
     */
    function subtract(int256 a, int256 b) public pure returns (int256) {
        int256 t = a - b;
        assert(t + b == a);
        return t;
    }

    /**
     * @dev a*b. If any of the operators is higher than max_fixed_mul() it 
     * might overflow.
     * Test a = 0, b = 0 returns 0
     * Test a = max_fixed_mul(), b = 0 returns 0
     * Test a = max_fixed_mul(), b = fixed_1() returns max_fixed_mul()
     * Test a = 0, b = max_fixed_mul() returns 0
     * Test a = fixed_1(), b = max_fixed_mul() returns max_fixed_mul()
     * Test a = max_fixed_mul(), b = max_fixed_mul() returns max_int256()
     * Test a = max_fixed_mul()-1, b = max_fixed_mul() equals a = max_fixed_mul(), b = max_fixed_mul()-1
     * Test a = max_fixed_mul()+1, b = max_fixed_mul() fails
     * Test a = max_fixed_mul(), b = max_fixed_mul()+1 fails
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
     * @dev 1/x
     * Test x = 0 fails
     * Test x = fixed_1() returns fixed_1()
     * Test x = fixed_1()*2 returns fixed_1()/2
     * Test x = fixed_1()*fixed_1() returns 0
     */
    function reciprocal(int256 x) public pure returns (int256) {
        assert(x != 0);
        return fixed_1() / x; // Can't overflow
    }

    /**
     * @dev a/b. If the dividend is higher than max_fixed_div() it 
     * might overflow.
     * Test a = fixed_1(), b = 0 fails
     * Test a = 0, b = fixed_1() returns 0
     * Test a = fixed_1(), b = fixed_1() returns fixed_1()
     * Test a = max_fixed_div(), b = fixed_1() returns max_fixed_div()
     * Test a = fixed_1(), b = max_fixed_div() returns max_fixed_div()
     * Test a = max_fixed_div(), b = max_fixed_div() returns fixed_1()
     * Test a = max_fixed_div()-1, b = max_fixed_div() equals a = max_fixed_div(), b = max_fixed_div()-1
     */
    function divide(int256 a, int256 b) public pure returns (int256) {
        if(b == fixed_1()) return a;
        assert(b != 0);
        return multiply(a, reciprocal(b));
    }
}
