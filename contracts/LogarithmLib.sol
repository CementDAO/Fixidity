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
     * 1/maxFixedMul() deviation at fixedE()**2, but diverges to 10x 
     * deviation at maxNewFixed().
     * Test ln(0) fails
     * Test ln(-fixed1()) fails
     * Test ln(fixed1()) returns 0
     * Test ln(fixedE()) returns fixed1()
     * Test ln(fixedE()*fixedE()) returns ln(fixedE())+ln(fixedE())
     * Test ln(maxInt256) returns 176752531042786059920093411119162458112
     * Test ln(1) returns -82
     */
    function ln(int256 value) public pure returns (int256) {
        assert(value >= 0);
        int256 v = value;
        int256 r = 0;
        while(v <= FixidityLib.fixed1() / 10) {
            v = v * 10;
            r -= fixed_ln_10();
        }
        while(v >= 10 * FixidityLib.fixed1()) {
            v = v / 10;
            r += fixed_ln_10();
        }
        while(v < FixidityLib.fixed1()) {
            v = FixidityLib.multiply(v, FixidityLib.fixedE());
            r -= FixidityLib.fixed1();
        }
        while(v > FixidityLib.fixedE()) {
            v = FixidityLib.divide(v, FixidityLib.fixedE());
            r += FixidityLib.fixed1();
        }
        if(v == FixidityLib.fixed1()) {
            return r;
        }
        if(v == FixidityLib.fixedE()) {
            return FixidityLib.fixed1() + r;
        }

        v = v - 3 * FixidityLib.fixed1() / 2;
        r = r + fixed_ln_1_5();
        int256 m = FixidityLib.fixed1() * v / (v + 3 * FixidityLib.fixed1());
        r = r + 2 * m;
        int256 m_2 = m * m / FixidityLib.fixed1();
        uint8 i = 3;
        while(true) {
            m = m * m_2 / FixidityLib.fixed1();
            r = r + 2 * m / int256(i);
            i += 2;
            if(i >= 3 + 2 * FixidityLib.digits()) break;
        }
        return r;
    }

    /**
     * @dev log_b(x). The base needs to be in fixed point representation.
     * Tests covered by ln(x) and divide(a,b)
     */
    function log_b(int256 b, int256 x) public pure returns (int256) {
        return FixidityLib.divide(ln(x), ln(b));
    }
}
