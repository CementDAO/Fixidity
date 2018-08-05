pragma solidity ^0.4.24;

import "./FixidityLib.sol";

library LogarithmLib {

    using FixidityLib for FixidityLib.Fixidity;

    uint8 constant public longer_digits = 36;
    int256 constant public longer_fixed_log_e_1_5 =     405465108108164381978013115464349137;    
    int256 constant public longer_fixed_1 =            1000000000000000000000000000000000000;    
    int256 constant public longer_fixed_log_e_10 =     2302585092994045684017991454684364208;

    function log_e(FixidityLib.Fixidity storage fixidity, int256 v) public view returns (int256) {
        assert(v > 0);
        int256 r = 0;
        uint8 extra_digits = longer_digits - fixidity.digits;
        int256 t = int256(uint256(10) ** uint256(extra_digits));
        while(v <= fixidity.fixed_1 / 10) {
            v = v * 10;
            r -= longer_fixed_log_e_10;
        }
        while(v >= 10 * fixidity.fixed_1) {
            v = v / 10;
            r += longer_fixed_log_e_10;
        }
        while(v < fixidity.fixed_1) {
            v = fixidity.multiply(v, fixidity.fixed_e);
            r -= longer_fixed_1;
        }
        while(v > fixidity.fixed_e) {
            v = fixidity.divide(v, fixidity.fixed_e);
            r += longer_fixed_1;
        }
        if(v == fixidity.fixed_1) {
            return FixidityLib.round_off(fixidity, r, extra_digits) / t;
        }
        if(v == fixidity.fixed_e) {
            return fixidity.fixed_1 + FixidityLib.round_off(fixidity, r, extra_digits) / t;
        }
        v *= t;
        v = v - 3 * longer_fixed_1 / 2;
        r = r + longer_fixed_log_e_1_5;
        int256 m = longer_fixed_1 * v / (v + 3 * longer_fixed_1);
        r = r + 2 * m;
        int256 m_2 = m * m / longer_fixed_1;
        uint8 i = 3;
        while(true) {
            m = m * m_2 / longer_fixed_1;
            r = r + 2 * m / int256(i);
            i += 2;
            if(i >= 3 + 2 * fixidity.digits) break;
        }
        return FixidityLib.round_off(fixidity, r, extra_digits) / t;
    }

    function log_any(FixidityLib.Fixidity storage fixidity, int256 base, int256 v) public view returns (int256) {
        return fixidity.divide(log_e(fixidity, v), log_e(fixidity, base));
    }
}
