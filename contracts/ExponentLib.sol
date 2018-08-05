pragma solidity ^0.4.24;

import "./FixidityLib.sol";
import "./LogarithmLib.sol";

library ExponentLib {

    using FixidityLib for FixidityLib.Fixidity;
    using LogarithmLib for FixidityLib.Fixidity;

    function power_e(FixidityLib.Fixidity storage fixidity, int256 x) public view returns (int256) {
        assert(x < 172 * fixidity.fixed_1);
    	int256 r = fixidity.fixed_1;
        while(x >= 10 * fixidity.fixed_1) {
            x -= 10 * fixidity.fixed_1;
            r = fixidity.multiply(r, fixidity.fixed_exp_10);
        }
        if(x == fixidity.fixed_1) {
            return fixidity.multiply(r, fixidity.fixed_e);
        } else if(x == 0) {
            return r;
        }
        int256 tr = 100 * fixidity.fixed_1;
        int256 d = tr;
        for(uint8 i = 1; i <= 2 * fixidity.digits; i++) {
            d = (d * x) / (fixidity.fixed_1 * i);
            tr += d;
        }
    	return fixidity.trunc_digits(fixidity.multiply(tr, r), 2);
    }

    function power_any(FixidityLib.Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
        return power_e(fixidity, fixidity.multiply(fixidity.log_e(a), b));
    }

    function root_any(FixidityLib.Fixidity storage fixidity, int256 a, int256 b) public view returns (int256) {
        return power_any(fixidity, a, fixidity.reciprocal(b));
    }

    function root_n(FixidityLib.Fixidity storage fixidity, int256 a, uint8 n) public view returns (int256) {
        return power_e(fixidity, fixidity.divide(fixidity.log_e(a), fixidity.fixed_1 * n));
    }
}
