pragma solidity ^0.5.0;

import "./FixidityLib.sol";

library LogarithmLib {

    int256 constant public fixed_log_e_1_5 =     405465108108164381978013115464349137;    
    int256 constant public fixed_log_e_10 =     2302585092994045684017991454684364208;

    function log_e(int256 value) public pure returns (int256) {
        assert(value > 0);
        int256 v = value;
        int256 r = 0;
        while(v <= FixidityLib.fixed_1() / 10) {
            v = v * 10;
            r -= fixed_log_e_10;
        }
        while(v >= 10 * FixidityLib.fixed_1()) {
            v = v / 10;
            r += fixed_log_e_10;
        }
        while(v < FixidityLib.fixed_1()) {
            v = FixidityLib.multiply(v, FixidityLib.fixed_e());
            r -= FixidityLib.fixed_1();
        }
        while(v > FixidityLib.fixed_e()) {
            v = FixidityLib.divide(v, FixidityLib.fixed_e());
            r += FixidityLib.fixed_1();
        }
        if(v == FixidityLib.fixed_1()) {
            return r;
        }
        if(v == FixidityLib.fixed_e()) {
            return FixidityLib.fixed_1() + r;
        }

        v = v - 3 * FixidityLib.fixed_1() / 2;
        r = r + fixed_log_e_1_5;
        int256 m = FixidityLib.fixed_1() * v / (v + 3 * FixidityLib.fixed_1());
        r = r + 2 * m;
        int256 m_2 = m * m / FixidityLib.fixed_1();
        uint8 i = 3;
        while(true) {
            m = m * m_2 / FixidityLib.fixed_1();
            r = r + 2 * m / int256(i);
            i += 2;
            if(i >= 3 + 2 * FixidityLib.digits()) break;
        }
        return r;
    }

    function log_any(int256 base, int256 v) public pure returns (int256) {
        return FixidityLib.divide(log_e(v), log_e(base));
    }
}
