pragma solidity ^0.5.0;

library FixidityLib {

    /**
     * @dev digits
     */
    function digits() public pure returns(uint8) {
        return 36;
    }
    
    /**
     * @dev finex_1
     */
    function fixed_1() public pure returns(int256) {
        return 1000000000000000000000000000000000000;
    }

    /**
     * @dev fixed_e
     */
    function fixed_e() public pure returns(int256) {
        return 2718281828459045235360287471352662498;
    }

    /**
     * @dev fixed_pi
     */
    function fixed_pi() public pure returns(int256) {
        return 3141592653589793238462643383279502884;
    }

    /**
     * @dev fixed_exp_10
     */
    function fixed_exp_10() public pure returns(int256) {
        return 22026465794806716516957900645284244000000;
    }

    /**
     * @dev masx_int256
     */
    function max_int256() public pure returns(int256) {
        return 57896044618658097711785492504343953926633;
    }

    /**
     * @dev Converts an int256 to fixidity units, equivalent to multiplying
     * by 10^6.
     */
    function newFromInt256(int256 x)
        public
        pure
        returns (int256)
    {
        assert(x < max_int256()); // Cannot process numbers above 57896044618658097711785492504343953926633.
        return multiply(x, fixed_1());
    }

    /**
     * @dev Converts an uint256 to fixidity units, equivalent to multiplying
     * by 10^6.
     */
    function newFromUint256(uint256 x)
        public
        pure
        returns (int256)
    {
        assert(x < uint256(max_int256())); // Cannot process numbers above 57896044618658097711785492504343953926633.
        return multiply(int256(x), fixed_1());
    }

    /**
     * @dev Converts two int256 representing a fraction to fixidity units, 
     * equivalent to multiplying by 10^6.
     */
    function newFromInt256Fraction(
        int256 numerator, 
        int256 denominator
        )
        public
        pure
        returns (int256)
    {
        assert(numerator < max_int256());   // Cannot process numbers above 57896044618658097711785492504343953926633.
        assert(denominator < max_int256()); // Cannot process numbers above 57896044618658097711785492504343953926633.
        int256 convertedNumerator = newFromInt256(numerator);
        int256 convertedDenominator = newFromInt256(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Converts two uint256 representing a fraction to fixidity units, 
     * equivalent to multiplying by 10^6.
     */
    function newFromUint256Fraction(
        uint256 numerator, 
        uint256 denominator
        )
        public
        pure
        returns (int256)
    {
        assert(numerator < uint256(max_int256()));   // Cannot process numbers above 57896044618658097711785492504343953926633.
        assert(denominator < uint256(max_int256())); // Cannot process numbers above 57896044618658097711785492504343953926633.
        int256 convertedNumerator = newFromUint256(numerator);
        int256 convertedDenominator = newFromUint256(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Converts an int256 to the closest multiple of 10^36.
     */
    function round(int256 v) public pure returns (int256) {
        return round_off(v);
    }

    /**
     * @dev Converts an int256 to the greatest multiple of 10^36 less than or equal to.
     */
    function floor(int256 v) public pure returns (int256) {
        return (v / fixed_1()) * fixed_1();
    }

    /**
     * @dev Converts to positive if negative
     */
    function abs(int256 x) public pure returns (int256) {
        if(x < 0) return -x;
        else return x;
    }
    
    /**
     * @dev a*b
     */
    function multiply(int256 a, int256 b) public pure returns (int256) {
        if(a == 0 || b == 0) return 0;
        if(b == fixed_1()) return a;
        if(a == fixed_1()) return b;

        // Separate into integer and decimal parts
        // a = a1 + a2, b = b1 + b2
        int256 a1 = a / fixed_1();
        int256 a2 = a % fixed_1();
        int256 b1 = b / fixed_1();
        int256 b2 = b % fixed_1();
        
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
     * @dev a/b
     */
    function divide(int256 a, int256 b) public pure returns (int256) {
        if(b == fixed_1()) return a;
        assert(b != 0);
        return multiply(a, reciprocal(b));
    }

    /**
     * @dev a+b
     */
    function add(int256 a, int256 b) public pure returns (int256) {
        int256 t = a + b;
        assert(t - a == b);
        return t;
    }

    /**
     * @dev a-b
     */
    function subtract(int256 a, int256 b) public pure returns (int256) {
        int256 t = a - b;
        assert(t + a == b);
        return t;
    }

    /**
     * @dev 1/a
     * TODO: Don't understand this one.
     */
    function reciprocal(int256 a) public pure returns (int256) {
        return round_off(10 * fixed_1() * fixed_1() / a) / 10;
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
