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

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        max_fixed_div = new BigNumber(await fixidityLibMock.max_fixed_div());
        // eslint-disable-next-line camelcase
        max_int256 = new BigNumber(await fixidityLibMock.max_int256());
    });

    describe('divide', () => {
        itShouldThrow('divide(fixed_1(),0)', async () => {
            await fixidityLibMock.divide(
                fixed_1.toString(10),
                0,
            );
        });
        it('divide(0,fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    0,
                    fixed_1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                0,
            );
        });
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
        it('divide(max_fixed_div(),fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    max_fixed_div.toString(10),
                    fixed_1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                max_fixed_div,
            );
        });
        it('divide(fixed_1(),max_fixed_div())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    fixed_1.toString(10),
                    max_fixed_div.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                max_int256,
            );
        });
        itShouldThrow('divide(fixed_1(),max_fixed_div()+1)', async () => {
            await fixidityLibMock.divide(
                fixed_1.toString(10),
                max_fixed_div.plus(1).toString(10),
            );
        });
        it('divide(max_fixed_div(),max_fixed_div())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.divide(
                    max_fixed_div.toString(10),
                    max_fixed_div.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed_1,
            );
        });
    });
});
