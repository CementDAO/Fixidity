pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

library FixidityLib {

    uint8 constant public initial_digits = 36;
    int256 constant public fixed_log_e_10 =     2302585092994045684017991454684364208;
    int256 constant public fixed_log_e_2 =       693147180559945309417232121458176568;
    int256 constant public fixed_log_e_1_5 =     405465108108164381978013115464349137;
    int256 constant public fixed_log_2_1_5 =     584962500721156181453738943947816509;
    int256 constant public fixed_log_10_5 =      698970004336018804786261105275506973;    
    int256 constant public fixed_e =            2718281828459045235360287471352662498;
    int256 constant public fixed_pi =           3141592653589793238462643383279502884;

	struct Fixidity {
		uint8 digits;
		int256 fixed_1;
		int256 fixed_log_e_10;
		int256 fixed_log_e_2;
		int256 fixed_log_e_1_5;
        int256 fixed_log_2_1_5;
		int256 fixed_e;
        int256 fixed_pi;
	}

    function init(Fixidity storage fixidity, uint8 digits) public {
        assert(digits < 36);
        fixidity.digits = digits;
        fixidity.fixed_1 = int256(uint256(10) ** uint256(digits));
        int256 t = int256(uint256(10) ** uint256(initial_digits - digits));
        fixidity.fixed_log_e_10 = fixed_log_e_10 / t;
        fixidity.fixed_log_e_2 = fixed_log_e_2 / t;
        fixidity.fixed_log_e_1_5 = fixed_log_e_1_5 / t;
        fixidity.fixed_log_2_1_5 = fixed_log_2_1_5 / t;
        fixidity.fixed_e = fixed_e / t;
        fixidity.fixed_pi = fixed_pi / t;
    }

    function multiply(Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
        if(b == fixidity.fixed_1) return a;
        int256 t = (a * b) / fixidity.fixed_1;
        //assert(fixidity.fixed_1 * t / a == b);           FUBAR
        return t;
    }

    function divide(Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
        if(b == fixidity.fixed_1) return a;
        assert(b != 0);

        // TODO: round to the nearest even number as per 
        // https://en.wikipedia.org/wiki/IEEE_754_revision#Rounding_algorithms

        return (fixidity.fixed_1 * a) / b;
    }

    function add(Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
    	int256 t = a + b;
        assert(t - a == b);
    	return t;
    }

    function subtract(Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
    	int256 t = a - b;
    	assert(t + a == b);
    	return t;
    }

    function reciprocal(Fixidity storage fixidity, int256 a) public view returns (int256) {
        return divide(fixidity, fixidity.fixed_1, a);
    }

    function round_off(Fixidity storage fixidity, int256 v, uint8 digits)  public view returns (int256) {
        int256 t = int256(uint256(10) ** uint256(digits));
        int8 sign = 1;
        if(v < 0) {
            sign = -1;
            v = 0 - v;
        }
        if(v % t >= t / 2) v = v + t - v % t;
        return v * sign;
    }

    function round_to(Fixidity storage fixidity, int256 v, uint8 digits)  public view returns (int256) {
        assert(digits < fixidity.digits);
        return round_off(fixidity, v, fixidity.digits - digits);
    }
}
