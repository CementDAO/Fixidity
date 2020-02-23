const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');
const { itShouldThrow } = require('./utils');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - toUint', () => {
    let fixidityLibMock;
    let fixed1;
    let maxNewFixed;
    let minNewFixed;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        maxNewFixed = new BigNumber(await fixidityLibMock.maxNewFixed());
        minNewFixed = new BigNumber(await fixidityLibMock.minNewFixed());
    });

    describe('toUint', () => {
        it('toUint(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toUint(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('toUint(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toUint(1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('toUint(fixed1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toUint(fixed1.toString(10)),
            );
            result.should.be.bignumber.equal(1);
        });
        it('toUint(maxNewFixed()*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toUint(fixed1.multipliedBy(maxNewFixed).toString(10)),
            );
            result.should.be.bignumber.equal(maxNewFixed);
        });
        it('toUint(-1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toUint(0),
            );
            result.should.be.bignumber.equal(0);
        });
        itShouldThrow('toUint(-1)*fixed1()', async () => {
            await fixidityLibMock.toUint(fixed1.multipliedBy(-1).toString(10));
        }, 'Cannot cast negative signed integer to unsigned integer.');
    });
});
