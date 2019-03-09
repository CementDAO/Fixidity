const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - divide', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;
    // eslint-disable-next-line camelcase
    let max_fixed_div;
    // eslint-disable-next-line camelcase
    let max_int256;
    // eslint-disable-next-line camelcase
    let mul_precision;
    
    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        max_fixed_div = new BigNumber(await fixidityLibMock.max_fixed_div());
        // eslint-disable-next-line camelcase
        max_int256 = new BigNumber(await fixidityLibMock.max_int256());
        // eslint-disable-next-line camelcase
        mul_precision = new BigNumber(await fixidityLibMock.mul_precision());
    });

    /*
     * Test divide(fixed_1(),0) fails
     * Test divide(fixed_1(),max_fixed_div()) returns max_int256 // Probably not to the last digits
     * Test divide(fixed_1(),max_fixed_div()+1) fails // Maybe it will need to be +fixed_1()
     * Test divide(max_fixed_div(),max_fixed_div()) returns fixed_1()
     */

    describe('divide', () => {
        it('divide(fixed_1(),fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    fixed_1.toString(10),
                    fixed_1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed_1,
            );
        });
        it('divide(fixed_1(),2*fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    fixed_1.toString(10),
                    fixed_1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed_1.div(2).dp(0, 1),
            );
        });
        itShouldThrow('divide(fixed_1(),0)', async () => {
            await fixidityLibMock.divide(
                fixed_1.toString(10),
                0,
            );
        }, 'revert');
        it('divide(max_fixed_div(),1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    max_fixed_div.toString(10),
                    1,
                ),
            );
            result.should.be.bignumber.equal(
                max_fixed_div.multipliedBy(fixed_1),
            );
        });
        itShouldThrow('divide(max_fixed_div()+1,1)', async () => {
            await fixidityLibMock.divide(
                max_fixed_div.plus(1).toString(10),
                1,
            );
        }, 'revert');
        it('divide(max_fixed_div(),max_fixed_div())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    max_fixed_div.toString(10),
                    max_fixed_div.toString(10),
                ),
            ).div(mul_precision).dp(0, 0);
            result.should.be.bignumber.equal(
                fixed_1.div(mul_precision).dp(0, 0),
            );
        });
    });
});
