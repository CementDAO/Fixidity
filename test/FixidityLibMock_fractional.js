const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - fractional', () => {
    let fixidityLibMock;
    let fixed1;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
    });

    describe('fractional', () => {
        it('fractional(0)', async () => {
            const result = new BigNumber(await fixidityLibMock.fractional(0));
            result.should.be.bignumber.equal(0);
        });
        it('fractional(fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed1.toString(10)),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fractional(-fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fractional(fixed1()-1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed1.minus(1).toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.minus(1).toString(10));
        });
        it('fractional(-fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fractional(-fixed1()+1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fractional(fixed1.multipliedBy(-1).plus(1).toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-1).plus(1).toString(10));
        });
    });
});
