pragma solidity ^0.5.0;

library FixidityLib {

    uint8 constant public initial_digits = 36;
    int256 constant public fixed_e =            2718281828459045235360287471352662498;
    int256 constant public fixed_pi =           3141592653589793238462643383279502884;
    int256 constant public fixed_exp_10 =   22026465794806716516957900645284244000000;
    int256 constant public max_int256 =     57896044618658097711785492504343953926633;

    struct Fixidity 
    {
        uint8 digits;
        int256 fixed_1;
        int256 fixed_e;
        int256 fixed_pi;
        int256 fixed_exp_10;
    }

    function init(Fixidity storage fixidity, uint8 digits) public {
        assert(digits <= 36);
        fixidity.digits = digits;
        fixidity.fixed_1 = int256(uint256(10) ** uint256(digits));
        int256 t = int256(uint256(10) ** uint256(initial_digits - digits));
        fixidity.fixed_e = fixed_e / t;
        fixidity.fixed_pi = fixed_pi / t;
        fixidity.fixed_exp_10 = fixed_exp_10 / t;
    }

    /**
     * @dev Converts an int256 to fixidity units, equivalent to multiplying
     * by 10^6.
     */
    function newFromInt256(Fixidity storage fixidity, int256 x)
        public
        view
        returns (int256)
    {
        assert(x < max_int256); // Cannot process numbers above 57896044618658097711785492504343953926633.
        return multiply(fixidity, x,fixidity.fixed_1);
    }

    /**
     * @dev Converts an uint256 to fixidity units, equivalent to multiplying
     * by 10^6.
     */
    function newFromUint256(Fixidity storage fixidity, uint256 x)
        public
        view
        returns (int256)
    {
        assert(x < uint256(max_int256)); // Cannot process numbers above 57896044618658097711785492504343953926633.
        return multiply(fixidity, int256(x),fixidity.fixed_1);
    }

    /**
     * @dev Converts two int256 representing a fraction to fixidity units, 
     * equivalent to multiplying by 10^6.
     */
    function newFromInt256Fraction(
        Fixidity storage fixidity, 
        int256 numerator, 
        int256 denominator
        )
        public
        view
        returns (int256)
    {
        assert(numerator < max_int256);   // Cannot process numbers above 57896044618658097711785492504343953926633.
        assert(denominator < max_int256); // Cannot process numbers above 57896044618658097711785492504343953926633.
        int256 convertedNumerator = newFromInt256(fixidity, numerator);
        int256 convertedDenominator = newFromInt256(fixidity, denominator);
        return divide(fixidity, convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Converts two uint256 representing a fraction to fixidity units, 
     * equivalent to multiplying by 10^6.
     */
    function newFromUint256Fraction(
        Fixidity storage fixidity, 
        uint256 numerator, 
        uint256 denominator
        )
        public
        view
        returns (int256)
    {
        assert(numerator < uint256(max_int256));   // Cannot process numbers above 57896044618658097711785492504343953926633.
        assert(denominator < uint256(max_int256)); // Cannot process numbers above 57896044618658097711785492504343953926633.
        int256 convertedNumerator = newFromUint256(fixidity, numerator);
        int256 convertedDenominator = newFromUint256(fixidity, denominator);
        return divide(fixidity, convertedNumerator, convertedDenominator);
    }

    /**
     * @dev Converts an int256 to the closest multiple of 10^36.
     */
    function round(Fixidity storage fixidity, int256 v) public view returns (int256) {
        return round_off(fixidity, v, fixidity.digits);
    }

    /**
     * @dev Converts an int256 to the greatest multiple of 10^36 less than or equal to.
     */
    function floor(Fixidity storage fixidity, int256 v) public view returns (int256) {
        return (v / fixidity.fixed_1) * fixidity.fixed_1;
    }

    /**
     * @dev Converts to positive if negative
     */
    function abs(Fixidity storage  /*fixidity*/, int256 x) public pure returns (int256) {
        if(x < 0) return -x;
        else return x;
    }
    
    /**
     * @dev a*b
     */
    function multiply(Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
        if(a == 0 || b == 0) return 0;
        if(b == fixidity.fixed_1) return a;
        if(a == fixidity.fixed_1) return b;

        int256 x1 = a / fixidity.fixed_1;
        int256 x2 = a - fixidity.fixed_1 * x1;
        int256 y1 = b / fixidity.fixed_1;
        int256 y2 = b - fixidity.fixed_1 * y1;
        int256 result = fixidity.fixed_1 * x1 * y1 + x1 * y2 + x2 * y1 + x2 * y2 / fixidity.fixed_1;
        
        if(abs(fixidity, a) < fixidity.fixed_1) assert(result < b); // these can never overflow, really
        if(abs(fixidity, b) < fixidity.fixed_1) assert(result < a); // these can never overflow, really
        if(abs(fixidity, a) > fixidity.fixed_1 && abs(fixidity, b) > fixidity.fixed_1) // Can this overflow twice?
            assert(result > fixidity.fixed_1 && result > fixidity.fixed_1);
        return result;
    }

    /**
     * @dev a/b
     */
    function divide(Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
        if(b == fixidity.fixed_1) return a;
        assert(b != 0);
        return multiply(fixidity, a, reciprocal(fixidity, b));
    }

    /**
     * @dev a+b
     */
    function add(Fixidity storage /*fixidity*/, int256 a, int256 b) public pure returns (int256) {
        int256 t = a + b;
        assert(t - a == b);
        return t;
    }

    /**
     * @dev a-b
     */
    function subtract(Fixidity storage /*fixidity*/, int256 a, int256 b) public pure returns (int256) {
        int256 t = a - b;
        assert(t + a == b);
        return t;
    }

    /**
     * @dev 1/a
     */
    function reciprocal(Fixidity storage fixidity, int256 a) public view returns (int256) {
        return round_off(fixidity, 10 * fixidity.fixed_1 * fixidity.fixed_1 / a, 1) / 10;
    }

    function round_off(Fixidity storage /*fixidity*/, int256 v, uint8 digits) public pure returns (int256) {
        int256 t = int256(uint256(10) ** uint256(digits));
        int8 sign = 1;
        if(v < 0) {
            sign = -1;
            v = 0 - v;
        }
        if(v % t >= t / 2) v = v + t - v % t;
        return v * sign;
    }

    function round_to(Fixidity storage fixidity, int256 v, uint8 digits) public view returns (int256) {
        assert(digits < fixidity.digits);
        return round_off(fixidity, v, fixidity.digits - digits);
    }

    function trunc_digits(Fixidity storage fixidity, int256 v, uint8 digits) public pure returns (int256) {
        if(digits <= 0) return v;
        return round_off(fixidity, v, digits)
            / int256(uint256(10) ** uint256(digits));
    }
}
