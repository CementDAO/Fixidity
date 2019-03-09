pragma solidity ^0.5.0;

/**
 * @dev This library provides fixed point arithmetic. All operations are done
 * with int256 and the operands must have been created with any of the newFrom*
 * functions, which shift the comma digits() to the right and check for limits.
 * When using this library be sure of using max_fixed_new() as the upper limit for
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
     * Test fixed_1() equals 10^digits()
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
     * Test max_int256() equals 2^256 / 2 -1
     * Hardcoded to 36 digits.
     */
    function max_int256() public pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282019728792003956564819967;
    }

    /**
     * @dev Minimum value that can be represented in an int256
     * Test min_int256 equals -1 * ((2^256 / 2)-2)
     * Hardcoded to 36 digits.
     */
    function min_int256() public pure returns(int256) {
        return -57896044618658097711785492504343953926634992332820282019728792003956564819966;
    }


    /**
     * @dev Maximum value that can be converted to fixed point. Optimize for
     * deployment. 
     * Test max_fixed_new() equals max_int256() / fixed_1()
     * Hardcoded to 36 digits.
     * TODO: Rename to max_fixed_new()
     */
    function max_fixed_new() public pure returns(int256) {
        return 57896044618658097711785492504343953926634;
    }

    /**
     * @dev Maximum value that can be safely used as a multiplication operator.
     * Test max_fixed_add equals sqrt(max_fixed_new())
     * Hardcoded to 36 digits.
     */
    function max_fixed_mul() public pure returns(int256) {
        return 240615969168004500000;
    }

    /**
     * @dev Maximum value that can be safely used as a dividend.
     * divide(max_fixed_div,newFromInt256Fraction(1,fixed_1())) = max_int256().
     * Test max_fixed_div() equals max_int256()/fixed_1()
     * Hardcoded to 36 digits.
     */
    function max_fixed_div() public pure returns(int256) {
        return 57896044618658097711785492504343953926634;
    }

    /**
     * @dev Maximum value that can be safely used as an addition operator.
     * Test max_fixed_add() equals max_int256() / 2
     * Hardcoded to 36 digits.
     */
    function max_fixed_add() public pure returns(int256) {
        return 28948022309329048855892746252171976963317496166410141009864396001978282409983;
    }

    /**
     * @dev Converts an int256 to fixed point units, equivalent to multiplying
     * by 10^digits().
     * Test newFromInt256(0) returns 0
     * Test newFromInt256(1) returns fixed_1()
     * Test newFromInt256(max_fixed_new()) returns max_fixed_new() * fixed_1()
     * Test newFromInt256(max_fixed_new()+1) fails
     */
    function newFromInt256(int256 x)
        public
        pure
        returns (int256)
    {
        assert(x <= max_fixed_new()); // Cannot process numbers above 57896044618658097711785492504343953926633.
        return x * fixed_1();
    }

    /**
     * @dev Converts two int256 representing a fraction to fixed point units,
     * equivalent to multiplying dividend and divisor by 10^digits().
     * Test newFromInt256Fraction(max_fixed_div()+1,1) fails
     * Test newFromInt256Fraction(1,max_fixed_div()+1) fails
     * Test newFromInt256Fraction(1,0) fails     
     * Test newFromInt256Fraction(0,1) returns 0
     * Test newFromInt256Fraction(1,1) returns fixed_1()
     * Test newFromInt256Fraction(max_fixed_div(),1) returns max_fixed_div()
     * Test newFromInt256Fraction(1,fixed_1()) returns 1
     * Test newFromInt256Fraction(1,fixed_1()-1) returns 0
     */
    function newFromInt256Fraction(
        int256 numerator, 
        int256 denominator
        )
        public
        pure
        returns (int256)
    {
        assert(numerator <= max_fixed_new());
        assert(denominator <= max_fixed_new());
        assert(denominator != 0);
        int256 convertedNumerator = newFromInt256(numerator);
        int256 convertedDenominator = newFromInt256(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Returns the integer part of a fixed point number.
     * Test integer(0) returns 0
     * Test integer(fixed_1()) returns fixed_1()
     * Test integer(newFromInt256(max_fixed_new())) returns max_fixed_new()*fixed_1()
     * Test integer(-fixed_1()) returns -fixed_1()
     * Test integer(newFromInt256(-max_fixed_new())) returns -max_fixed_new()*fixed_1()
     */
    function integer(int256 x) public pure returns (int256) {
        return (x / fixed_1()) * fixed_1(); // Can't overflow
    }


    /**
     * @dev Returns the fractional part of a fixed point number. 
     * In the case of a negative number the fractional is also negative.
     * Test fractional(0) returns 0
     * Test fractional(fixed_1()) returns 0
     * Test fractional(fixed_1()-1) returns 10^36-1
     * Test fractional(-fixed_1()) returns 0
     * Test fractional(-fixed_1()+1) returns -10^36-1
     */
    function fractional(int256 x) public pure returns (int256) {
        return x - (x / fixed_1()) * fixed_1(); // Can't overflow
    }


    /**
     * @dev Converts to positive if negative
     * Test abs(0) returns 0
     * Test abs(fixed_1()) returns -fixed_1()
     * Test abs(-fixed_1()) returns fixed_1()
     * Test abs(newFromInt256(max_fixed_new())) returns -max_fixed_new()*fixed_1()
     * Test abs(newFromInt256(-max_fixed_new())) returns max_fixed_new()*fixed_1()
     */
    function abs(int256 x) public pure returns (int256) {
        if(x < 0) return -x;
        else return x;
    }

    /**
     * @dev a+b. If any operator is higher than max_fixed_add() it 
     * might overflow.
     * Test add(0,0) returns 0
     * Test add(max_fixed_add(),0) returns max_fixed_add()
     * Test add(0,max_fixed_add()) returns max_fixed_add()
     * Test add(max_fixed_add-1,max_fixed_add()) returns max_int256()-1
     * Test add(max_fixed_add,max_fixed_add()-1) returns max_int256()-1
     * Test add(max_fixed_add,max_fixed_add()) returns max_int256()
     * Test add(max_fixed_add + 1,max_fixed_add()) fails
     * Test add(-max_fixed_add(),0) returns -max_fixed_add()
     * Test add(0,-max_fixed_add()) returns -max_fixed_add()
     * Test add(-max_fixed_add,max_fixed_add()) returns 0
     * Test add(max_fixed_add,-max_fixed_add()) returns 0
     * Test add(-max_fixed_add,-max_fixed_add()+1) returns 1-max_int256
     * Test add(-max_fixed_add,-max_fixed_add()) fails
     */
    function add(int256 a, int256 b) public pure returns (int256) {
        int256 t = a + b;
        assert(t - a == b);
        return t;
    }

    /**
     * @dev a-b. You can use add(a,-b) instead.
     */
    function subtract(int256 a, int256 b) public pure returns (int256) {
        return add(a,-b);
    }

    /**
     * @dev a*b. If any of the operators is higher than max_fixed_mul() it 
     * might overflow.
     * Test multiply(0,0) returns 0
     * Test multiply(max_fixed_mul(),0) returns 0
     * Test multiply(max_fixed_mul(),fixed_1()) returns max_fixed_mul()
     * Test multiply(0,max_fixed_mul()) returns 0
     * Test multiply(fixed_1(),max_fixed_mul()) returns max_fixed_mul()
     * Test multiply(fixed_e(),fixed_e()) returns fixed_e()*fixed_e()
     * Test multiply(-fixed_e(),fixed_e()) returns -fixed_e()*fixed_e()
     * Test multiply(fixed_e(),-fixed_e()) returns -fixed_e()*fixed_e()
     * Test multiply(-fixed_e(),-fixed_e()) returns fixed_e()*fixed_e()
     * Test multiply(max_fixed_mul()-1,max_fixed_mul()) equals multiply(max_fixed_mul(),max_fixed_mul()-1)
     * Test multiply(max_fixed_mul(),max_fixed_mul()) returns max_int256() // Probably not to the last digits
     * Test multiply(max_fixed_mul()+1,max_fixed_mul()) fails // Maybe it will need to be +fixed_1() to fail
     * Test multiply(max_fixed_mul(),max_fixed_mul()+1) fails // Maybe it will need to be +fixed_1() to fail
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
     * Test reciprocal(0) fails
     * Test reciprocal(fixed_1()) returns fixed_1()
     * Test reciprocal(fixed_1()*2) returns fixed_1()/2
     * Test reciprocal(fixed_e()) returns fixed_1()/fixed_e() // Maybe not because of different precisions
     * Test reciprocal(fixed_1()*fixed_1()) returns 1 // Testing how the fractional is truncated
     * Test reciprocal(2*fixed_1()*fixed_1()) returns 0 // Testing how the fractional is truncated
     */
    function reciprocal(int256 x) public pure returns (int256) {
        assert(x != 0);
        return fixed_1() / x; // Can't overflow
    }

    /**
     * @dev a/b. If the dividend is higher than max_fixed_div() it 
     * might overflow. You can use multiply(a,reciprocal(b)) instead.
     * Test divide(fixed_1(),0) fails
     * Test divide(0,fixed_1()) returns 0
     * Test divide(fixed_1(),fixed_1()) returns fixed_1()
     * Test divide(max_fixed_div(),fixed_1()) returns max_fixed_div()
     * Test divide(fixed_1(),max_fixed_div()) returns max_int256 // Probably not to the last digits
     * Test divide(fixed_1(),max_fixed_div()+1) fails // Maybe it will need to be +fixed_1()
     * Test divide(max_fixed_div(),max_fixed_div()) returns fixed_1()
     */
    function divide(int256 a, int256 b) public pure returns (int256) {
        if(b == fixed_1()) return a;
        assert(b != 0);
        return multiply(a, reciprocal(b));
    }
}
