pragma solidity ^0.4.24;

import "./FixidityLib.sol";

library Logarithm {

    using FixidityLib for FixidityLib.Fixidity;

    function log_e(Fixidity fixidity, int256 v) public pure returns (int256) {
        assert(v > 0);
        int256 r = 0;

        while(v < fixidity.fixed_1) {
            v = fixidity.safe_multiply(v, fixidity.fixed_e);
            r--;
        }
        while(v > fixidity_e) {
            v = fixidity.divide_and_round(v, fixidity.fixed_e);
            r++;
        }

        if(v == fixidity.fixed_1) return r;
        if(v == 2 * fixidity.fixed_1) return r + fixidity.fixed_log_e_2;

        v = v - 3 * fixidity.fixed_1 / 2;
        r = r + fixidity.fixed_log_e_1_5;

        int256 m = fixidity.divide_and_round(fixidity.fixed_1 * v, v + 3 * fixidity.fixed_1);
        r += 2 * m;
        int256 m_2 = (m * m) / fixidity.fixed_1;
        for(uint8 i = 3; i <= 2 * fixidity.digits + 3; i += 2) {
            m = fixidity.safe_multiply(m, m_2);
            r += fixidity.divide_and_round(2 * m, fixidity_1 * i);
        }

        return r;
    }

    function log_base(Fixidity fixidity, int256 base, int256 v) public pure returns (int256) {
        return log_e(v) / log_e(base, fixidity.e);
    }
}
