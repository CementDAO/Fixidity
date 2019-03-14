const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - divide', () => {
    let fixidityLibMock;
    let fixed1;
    let maxFixedDiv;
    let maxFixedDivisor;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        maxFixedDiv = new BigNumber(await fixidityLibMock.maxFixedDiv());
        maxFixedDivisor = new BigNumber(await fixidityLibMock.maxFixedDivisor());
    });

    /*
     * Test divide(fixed1(),0) fails
     * Test divide(fixed1(),maxFixedDiv()) returns maxInt256 // Probably not to the last digits
     * Test divide(fixed1(),maxFixedDiv()+1) fails // Maybe it will need to be +fixed1()
     * Test divide(maxFixedDiv(),maxFixedDiv()) returns fixed1()
     */

    describe('divide', () => {
        it('divide(fixed1(),fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    fixed1.toString(10),
                    fixed1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed1,
            );
        });
        it('divide(fixed1(),2*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    fixed1.toString(10),
                    fixed1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed1.div(2).dp(0, 1),
            );
        });
        itShouldThrow('divide(fixed1(),0)', async () => {
            await fixidityLibMock.divide(
                fixed1.toString(10),
                0,
            );
        }, 'revert');
        it('divide(maxFixedDiv(),1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    maxFixedDiv.toString(10),
                    1,
                ),
            );
            result.should.be.bignumber.equal(
                maxFixedDiv.multipliedBy(fixed1),
            );
        });
        it('divide(10**38,10**38)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    new BigNumber(10).pow(38).toString(10),
                    new BigNumber(10).pow(38).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        it('divide(maxFixedDivisor(),maxFixedDivisor())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    maxFixedDivisor.toString(10),
                    maxFixedDivisor.toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        itShouldThrow('divide(10*maxFixedDivisor(),10*maxFixedDivisor()', async () => {
            await fixidityLibMock.divide(
                maxFixedDivisor.multipliedBy(10).toString(10),
                maxFixedDivisor.multipliedBy(10).toString(10),
            );
        }, 'revert');
        itShouldThrow('divide(maxFixedDiv()+1,1)', async () => {
            await fixidityLibMock.divide(
                maxFixedDiv.plus(1).toString(10),
                1,
            );
        }, 'revert');
    });
});
