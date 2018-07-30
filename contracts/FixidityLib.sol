pragma solidity ^0.4.24;

library FixidityLib {

    uint8 constant initial_digits = 36;
    int256 constant fixed_log_e_10 =     2302585092994045684017991454684364208;
    int256 constant fixed_log_e_2 =       693147180559945309417232121458176568;
    int256 constant fixed_log_e_1_5 =     405465108108164381978013115464349137;
    int256 constant fixed_e =            2718281828459045235360287471352662498;
    int256 constant fixed_pi =           3141592653589793238462643383279502884;

	struct {
		uint8 digits = initial_digits;
		int256 fixed_1 = 10 ** initial_digits;
		int256 fixed_log_e_10 = fixed_log_e_10;
		int256 fixed_log_e_2 = fixed_log_e_2;
		int256 fixed_log_e_1_5 = fixed_log_e_1_5;
		int256 fixed_e = fixed_e;
        int256 fixed_pi = fixed_pi;

	} Fixidity;

    function init(Fixidity fixidity, uint8 digits) {
        assert(digits > 0 && digits < 36);
        fixidity.digits = digits;
        fixidity.fixed_1 = 10 ** digits;
        int256 t = 10 ** (initial_digits - digits);
        fixidity.fixed_log_e_10 = divide_and_round(fixed_log_e_10, t);
        fixidity.fixed_log_e_2 = divide_and_round(fixed_log_e_2, t);
        fixidity.fixed_log_e_1_5 = divide_and_round(fixed_log_e_1_5, t);
        fixidity.fixed_e = divide_and_round(fixed_e, t);
        fixidity.fixed_pi = divide_and_round(fixed_pi, t);            
    }

    function safe_multiply(Fixidity fixidity, int256 a, int256 b) public pure returns (int256) {
        int256 t = a * b / fixidity.fixed_1;
        assert(fixidity.fixed_1 * t / a == b);
        return t;
    }

    function divide_and_round(Fixidity fixidity, int256 a, int256 b) public pure returns (int256) {
        assert(b != 0);
        a = safe_multiply(fixidity, a, fixidity.fixed_1 * 10);
        a = a / b;
        int256 t = a % 10;
        if(b >= 0) {
            if(t >= 5) {
                a = safe_add(a, 10 - t);
            }
        } else {
            if(t <= 5) {
                a = safe_sub(a, 10 + t);
            }
        }
        return a / 10;
    }

    function safe_add(Fixidity fixidity, int256 a, int256 b) public pure returns (int256) {
    	int256 t = a + b;
    	assert(t - a == b);
    	return t;
    }

    function safe_sub(Fixidity fixidity, int256 a, int256 b) public pure returns (int256) {
    	int256 t = a - b;
    	assert(t + a == b);
    	return t;
    }

    function reciprocal(Fixidity fixidity, int256 a) public pure returns (int256) {
        return divide_and_round(fixidity.fixed_1, a);
    }
}
