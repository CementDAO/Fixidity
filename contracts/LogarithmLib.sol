pragma solidity ^0.5.0;

import "./FixidityLib.sol";


/**
 * @title LogarithmLib
 * @author Gadi Guy, Alberto Cuesta Canada
 * @notice This library extends FixidityLib with logarithm operations.
 */
library LogarithmLib {

    /**
     * @notice This is e in the fixed point units used in this library.
     * @dev 27182818284590452353602874713526624977572470936999595749669676277240766303535/fixed1()
     * Hardcoded to 24 digits.
     */
    function fixedE() internal pure returns(int256) {
        return 2718281828459045235360287;
    }

    /**
     * @notice ln(1.5), hardcoded with the comma 24 positions to the right.
     */
    // solium-disable-next-line mixedcase
    function fixedLn1_5() internal pure returns(int256) {
        return 405465108108164381978013;
    }

    /**
     * @notice ln(10), hardcoded with the comma 24 positions to the right.
     */
    function fixedLn10() internal pure returns(int256) {
        return 2302585092994045684017991;
    }

    /**
     * @notice ln(x)
     * This function has a 1/50 deviation close to ln(-1),
     * 1/maxFixedMul() deviation at fixedE()**2, but diverges to 10x
     * deviation at maxNewFixed().
     * @dev
     * Test ln(0) fails
     * Test ln(-fixed1()) fails
     * Test ln(fixed1()) returns 0
     * Test ln(fixedE()) returns fixed1()
     * Test ln(fixedE()*fixedE()) returns ln(fixedE())+ln(fixedE())
     * Test ln(maxInt256) returns 176752531042786059920093411119162458112
     * Test ln(1) returns -82
     */
    function ln(int256 value) internal pure returns (int256) {
        require(value > 0);
        int256 v = value;
        int256 r = 0;
        while (v <= FixidityLib.fixed1() / 10) {
            v = v * 10;
            r -= fixedLn10();
        }
        while (v >= 10 * FixidityLib.fixed1()) {
            v = v / 10;
            r += fixedLn10();
        }
        while (v < FixidityLib.fixed1()) {
            v = FixidityLib.multiply(v, fixedE());
            r -= FixidityLib.fixed1();
        }
        while (v > fixedE()) {
            v = FixidityLib.divide(v, fixedE());
            r += FixidityLib.fixed1();
        }
        if (v == FixidityLib.fixed1()) {
            return r;
        }
        if (v == fixedE()) {
            return FixidityLib.fixed1() + r;
        }

        v = v - 3 * FixidityLib.fixed1() / 2;
        r = r + fixedLn1_5();
        int256 m = FixidityLib.fixed1() * v / (v + 3 * FixidityLib.fixed1());
        r = r + 2 * m;
        // solium-disable-next-line mixedcase
        int256 m_2 = m * m / FixidityLib.fixed1();
        uint8 i = 3;
        while (true) {
            m = m * m_2 / FixidityLib.fixed1();
            r = r + 2 * m / int256(i);
            i += 2;
            if (i >= 3 + 2 * FixidityLib.digits()) break;
        }
        return r;
    }

    /**
     * @notice log_b(x).
     * *param int256 b Base in fixed point representation.
     * @dev Tests covered by ln(x) and divide(a,b)
     */
    // solium-disable-next-line mixedcase
    function log_b(int256 b, int256 x) internal pure returns (int256) {
        if (b == FixidityLib.fixed1()*10)
            return FixidityLib.divide(ln(x), fixedLn10());
        return FixidityLib.divide(ln(x), ln(b));
    }
}
