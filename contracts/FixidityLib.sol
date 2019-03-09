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
     * @dev The amount of decimals lost on each multiplication operand.
     * Test mul_precision() equals sqrt(fixed_1)
     * Hardcoded to 36 digits.
     */
    function mul_precision() public pure returns(int256) {
        return 1000000000000000000;
    }

    /**
     * @dev This is e in the fixed point units used in this library.
     * 27182818284590452353602874713526624977572470936999595749669676277240766303535/fixed_1()
     * Hardcoded to 36 digits.
     */
    function fixed_e() public pure returns(int256) {
        return 2718281828459045235360287471352662498;
    }

    /**
     * @dev Maximum value that can be represented in an int256
     * Test max_int256() equals 2^255 -1
     * Hardcoded to 36 digits.
     */
    function max_int256() public pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282019728792003956564819967;
    }

    /**
     * @dev Minimum value that can be represented in an int256
     * Test min_int256 equals (2^255) * (-1)
     * Hardcoded to 36 digits.
     */
    function min_int256() public pure returns(int256) {
        return -57896044618658097711785492504343953926634992332820282019728792003956564819968;
    }


    /**
     * @dev Maximum value that can be converted to fixed point. Optimize for
     * deployment. 
     * Test max_fixed_new() equals max_int256() / fixed_1()
     * Hardcoded to 36 digits.
     */
    function max_fixed_new() public pure returns(int256) {
        return 57896044618658097711785492504343953926634;
    }

    /**
     * @dev Maximum value that can be converted to fixed point. Optimize for
     * deployment. 
     * Test min_fixed_new() equals -(max_int256()) / fixed_1()
     * Hardcoded to 36 digits.
     */
    function min_fixed_new() public pure returns(int256) {
        return -57896044618658097711785492504343953926634;
    }

    /**
     * @dev Maximum value that can be safely used as an addition operator.
     * Test max_fixed_add() equals max_int256()-1 / 2
     * Test add(max_fixed_add(),max_fixed_add()) equals max_fixed_add() + max_fixed_add()
     * Test add(max_fixed_add()+1,max_fixed_add()) throws 
     * Test add(-max_fixed_add(),-max_fixed_add()) equals -max_fixed_add() - max_fixed_add()
     * Test add(-max_fixed_add(),-max_fixed_add()-1) throws 
     * Hardcoded to 36 digits.
     */
    function max_fixed_add() public pure returns(int256) {
        return 28948022309329048855892746252171976963317496166410141009864396001978282409983;
    }

    /**
     * @dev Maximum negative value that can be safely in a subtraction.
     * Test max_fixed_sub() equals min_int256() / 2
     * Hardcoded to 36 digits.
     */
    function max_fixed_sub() public pure returns(int256) {
        return -28948022309329048855892746252171976963317496166410141009864396001978282409984;
    }

    /**
     * @dev Maximum value that can be safely used as a multiplication operator.
     * Calculated as sqrt(max_fixed_new())*fixed_1(). Be careful with your sqrt() implementation
     * Test multiply(max_fixed_mul(),max_fixed_mul()) equals max_fixed_mul() * max_fixed_mul()
     * Test multiply(max_fixed_mul(),max_fixed_mul()+1) throws 
     * Test multiply(-max_fixed_mul(),max_fixed_mul()) equals -max_fixed_mul() * max_fixed_mul()
     * Test multiply(-max_fixed_mul(),max_fixed_mul()+1) throws 
     * Hardcoded to 36 digits.
     */
    function max_fixed_mul() public pure returns(int256) {
        return 240615969168004511545000000000000000000000000000000000000;
    }

    /**
     * @dev Maximum value that can be safely used as a dividend().
     * divide(max_fixed_div,newFixedFraction(1,fixed_1())) = max_int256().
     * Test max_fixed_div() equals max_int256()/fixed_1()
     * Test divide(max_fixed_div(),multiply(mul_precision(),mul_precision())) = max_fixed_div()*(10^digits())
     * Test divide(max_fixed_div()+1,multiply(mul_precision(),mul_precision())) throws
     * Hardcoded to 36 digits.
     */
    function max_fixed_div() public pure returns(int256) {
        return 57896044618658097711785492504343953926634;
    }

    /**
     * @dev Converts an int256 to fixed point units, equivalent to multiplying
     * by 10^digits().
     * Test newFixed(0) returns 0
     * Test newFixed(1) returns fixed_1()
     * Test newFixed(max_fixed_new()) returns max_fixed_new() * fixed_1()
     * Test newFixed(max_fixed_new()+1) fails
     */
    function newFixed(int256 x)
        public
        pure
        returns (int256)
    {
        assert(x <= max_fixed_new());
        assert(x >= min_fixed_new());
        return x * fixed_1();
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
        return x / fixed_1();
    }

    /**
     * @dev Converts an int256 which is already in some fixed point 
     * representation to a different fixed precision representation.
     * Both the origin and destination precisions must be 38 or less digits.
     * Origin values with a precision higher than the destination precision
     * will be truncated accordingly.
     * Test convertFixed(1,0,0) returns 1;
     * Test convertFixed(1,1,1) returns 1;
     * Test convertFixed(1,1,0) returns 0;
     * Test convertFixed(1,0,1) returns 10;
     * Test convertFixed(10,1,0) returns 1;
     * Test convertFixed(10,0,1) returns 100;
     * Test convertFixed(100,1,0) returns 10;
     * Test convertFixed(100,0,1) returns 1000;
     * Test convertFixed(1000,2,0) returns 10;
     * Test convertFixed(1000,0,2) returns 100000;
     * Test convertFixed(1000,2,1) returns 100;
     * Test convertFixed(1000,1,2) returns 10000;
     * Test convertFixed(max_int256,1,0) returns max_int256/10;
     * Test convertFixed(max_int256,0,1) throws
     * Test convertFixed(max_int256,38,0) returns max_int256/(10**38);
     * Test convertFixed(1,0,38) returns 10**38;
     * Test convertFixed(max_int256,39,0) throws
     * Test convertFixed(1,0,39) throws
     */
    function convertFixed(int256 x, uint8 _originDigits, uint8 _destinationDigits)
        public
        pure
        returns (int256)
    {
        assert(_originDigits <= 38 && _destinationDigits <= 38);
        
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
            assert(x <= max_fixed_new()/uint128(10)**uint128(decimalDifference));
            assert(x >= min_fixed_new()/uint128(10)**uint128(decimalDifference));
            return x*(uint128(10)**uint128(decimalDifference));
        }
        // _originDigits == digits()) 
        return x;
    }


    /**
     * @dev Converts an int256 which is already in some fixed point 
     * representation to that of this library. The _originDigits parameter is the
     * precision of x. Values with a precision higher than FixidityLib.digits()
     * will be truncated accordingly.
     */
    function newFixed(int256 x, uint8 _originDigits)
        public
        pure
        returns (int256)
    {
        return convertFixed(x, _originDigits, digits());
    }

    /**
     * @dev Converts an int256 in the fixed point representation of this 
     * library to a different representation. The _destinationDigits parameter is the
     * precision of the output x. Values with a precision below than 
     * FixidityLib.digits() will be truncated accordingly.
     */
    function fromFixed(int256 x, uint8 _destinationDigits)
        public
        pure
        returns (int256)
    {
        return convertFixed(x, digits(), _destinationDigits);
    }

    /**
     * @dev Converts two int256 representing a fraction to fixed point units,
     * equivalent to multiplying dividend and divisor by 10^digits().
     * Test newFixedFraction(max_fixed_div()+1,1) fails
     * Test newFixedFraction(1,max_fixed_div()+1) fails
     * Test newFixedFraction(1,0) fails     
     * Test newFixedFraction(0,1) returns 0
     * Test newFixedFraction(1,1) returns fixed_1()
     * Test newFixedFraction(max_fixed_div(),1) returns max_fixed_div()*fixed_1()
     * Test newFixedFraction(1,fixed_1()) returns 1
     * Test newFixedFraction(1,fixed_1()-1) returns 0
     */
    function newFixedFraction(
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
        int256 convertedNumerator = newFixed(numerator);
        int256 convertedDenominator = newFixed(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Returns the integer part of a fixed point number.
     * Test integer(0) returns 0
     * Test integer(fixed_1()) returns fixed_1()
     * Test integer(newFixed(max_fixed_new())) returns max_fixed_new()*fixed_1()
     * Test integer(-fixed_1()) returns -fixed_1()
     * Test integer(newFixed(-max_fixed_new())) returns -max_fixed_new()*fixed_1()
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
     * @dev Converts to positive if negative.
     * x == -x is not true only for max_int256, but abs(max_int256) == max_int256
     * Test abs(0) returns 0
     * Test abs(fixed_1()) returns -fixed_1()
     * Test abs(-fixed_1()) returns fixed_1()
     * Test abs(newFixed(max_fixed_new())) returns max_fixed_new()*fixed_1()
     * Test abs(newFixed(min_fixed_new())) returns -min_fixed_new()*fixed_1()
     */
    function abs(int256 x) public pure returns (int256) {
        if(x < 0) return -x;
        else return x;
    }

    /**
     * @dev a+b. If any operator is higher than max_fixed_add() it 
     * might overflow.
     * In solidity max_int256 + 1 = min_int256 and viceversa.
     * Test add(max_fixed_add(),max_fixed_add()) returns max_int256()-1
     * Test add(max_fixed_add()+1,max_fixed_add()+1) fails
     * Test add(-max_fixed_sub(),-max_fixed_sub()) returns min_int256()
     * Test add(-max_fixed_sub()-1,-max_fixed_sub()-1) fails
     * Test add(max_int256(),max_int256()) fails
     * Test add(min_int256(),min_int256()) fails
     */
    function add(int256 a, int256 b) public pure returns (int256) {
        int256 t = a + b;
        if(a > 0 && b > 0) assert(t > a && t > b);
        if(a < 0 && b < 0) assert(t < a && t < b);
        return t;
    }

    /**
     * @dev a-b. You can use add(a,-b) instead. Tests covered by add(a,b)
     */
    function subtract(int256 a, int256 b) public pure returns (int256) {
        return add(a,-b);
    }

    /**
     * @dev a*b. If any of the operators is higher than max_fixed_mul() it 
     * might overflow.
     * Test multiply(0,0) returns 0
     * Test multiply(max_fixed_mul(),0) returns 0
     * Test multiply(0,max_fixed_mul()) returns 0
     * Test multiply(max_fixed_mul(),fixed_1()) returns max_fixed_mul()
     * Test multiply(fixed_1(),max_fixed_mul()) returns max_fixed_mul()
     * Test all combinations of (2,-2), (2, 2.5), (2, -2.5) and (0.5, -0.5)
     * Test multiply(fixed_1()/mul_precision(),fixed_1()*mul_precision())
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
        
        // a1b1 needs to be multiplied back by fixed_1
        int256 fixed_a1b1 = a1b1 * fixed_1();
        if (a1b1 != 0) assert(fixed_a1b1 / a1b1 == fixed_1()); // Overflow a1b1 * fixed_1
        a1b1 = fixed_a1b1;

        int256 a2b1 = a2 * b1;
        if (a2 != 0) assert(a2b1 / a2 == b1); // Overflow a2b1

        int256 a1b2 = a1 * b2;
        if (a1 != 0) assert(a1b2 / a1 == b2); // Overflow a1b2

        a2 = a2 / mul_precision();
        b2 = b2 / mul_precision();
        int256 a2b2 = a2 * b2;
        if (a2 != 0) assert(a2b2 / a2 == b2); // Overflow a2b2

        // result = fixed_1() * x1 * y1 + x1 * y2 + x2 * y1 + x2 * y2 / fixed_1();
        int256 result = a1b1;
        result = add(result, a2b1); // Add checks for overflow
        result = add(result, a1b2); // Add checks for overflow
        result = add(result, a2b2); // Add checks for overflow
        return result;
    }
    
    /**
     * @dev 1/x
     * Test reciprocal(0) fails
     * Test reciprocal(fixed_1()) returns fixed_1()
     * Test reciprocal(fixed_1()*fixed_1()) returns 1 // Testing how the fractional is truncated
     * Test reciprocal(2*fixed_1()*fixed_1()) returns 0 // Testing how the fractional is truncated
     */
    function reciprocal(int256 x) public pure returns (int256) {
        assert(x != 0);
        return (fixed_1()*fixed_1()) / x; // Can't overflow
    }

    /**
     * @dev a/b. If the dividend is higher than max_fixed_div() it 
     * might overflow. You can use multiply(a,reciprocal(b)) instead.
     * There is a loss of precision on division for the lower mul_precision() decimals.
     * Test divide(fixed_1(),0) fails
     * Test divide(max_fixed_div(),1) = max_fixed_div()*(10^digits())
     * Test divide(max_fixed_div()+1,1) throws
     * Test divide(max_fixed_div(),max_fixed_div()) returns fixed_1()
     */
    function divide(int256 a, int256 b) public pure returns (int256) {
        if(b == fixed_1()) return a;
        assert(b != 0);
        return multiply(a, reciprocal(b));
    }
}
