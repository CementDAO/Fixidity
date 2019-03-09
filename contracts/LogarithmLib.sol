pragma solidity ^0.5.0;

import "./FixidityLib.sol";

library LogarithmLib {

    /**
     * @dev ln(1.5), hardcoded with the comma 36 positions to the right.
     */
    function fixed_ln_1_5() public pure returns(int256) {
        return 405465108108164381978013115464349137;
    }

    /**
     * @dev ln(10), hardcoded with the comma 36 positions to the right.
     */
    function fixed_ln_10() public pure returns(int256) {
        return 2302585092994045684017991454684364208;
    }

    /**
     * @dev ln(x)
     * README: This function has a 1/50 deviation close to ln(-1), 
     * 1/max_fixed_mul() deviation at fixed_e()**2, but diverges to 10x 
     * deviation at max_fixed_new().
     * Test ln(0) fails
     * Test ln(-fixed_1()) fails
     * Test ln(fixed_1()) returns 0
     * Test ln(fixed_e()) returns fixed_1()
     * Test ln(fixed_e()*fixed_e()) returns ln(fixed_e())+ln(fixed_e())
     * Test ln(max_int256) returns 176752531042786059920093411119162458112
     * Test ln(1) returns -82
     */
    function ln(int256 value) public pure returns (int256) {
        assert(value >= 0);
        int256 v = value;
        int256 r = 0;
        while(v <= FixidityLib.fixed_1() / 10) {
            v = v * 10;
            r -= fixed_ln_10();
        }
        while(v >= 10 * FixidityLib.fixed_1()) {
            v = v / 10;
            r += fixed_ln_10();
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
        r = r + fixed_ln_1_5();
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

    /**
     * @dev log_b(x).
     * Tests covered by ln(x) and divide(a,b)
     */
    function log_b(int256 b, int256 x) public pure returns (int256) {
        return FixidityLib.divide(ln(x), ln(b));
    }
}
