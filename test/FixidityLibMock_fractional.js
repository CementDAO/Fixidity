const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - fractional', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
    });

    describe('fractional', () => {
        it('fractional(0)', async () => {
            const result = new BigNumber(await fixidityLibMock.fractional(0));
            result.should.be.bignumber.equal(0);
        });
        it('fractional(fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed_1.toString(10)),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fractional(fixed_1()-1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed_1.minus(1).toString(10)),
            );
            result.should.be.bignumber.equal(new BigNumber(10).pow(36).minus(1));
        });
        it('fractional(-fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed_1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fractional(-fixed_1()+1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed_1.multipliedBy(-1).plus(1).toString(10)),
            );
            result.should.be.bignumber.equal(new BigNumber(10).pow(36).minus(1).multipliedBy(-1));
        });
    });
});
