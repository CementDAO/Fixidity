const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');
const { itShouldThrow } = require('./utils');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();

contract('FixidityLibMock - safeCast', () => {
    let fixidityLibMock;
    let fixed1;
    let maxNewFixed;
    let minNewFixed;
    let maxInt256;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        maxNewFixed = new BigNumber(await fixidityLibMock.maxNewFixed());
        minNewFixed = new BigNumber(await fixidityLibMock.minNewFixed());
        maxInt256 = new BigNumber(await fixidityLibMock.maxInt256());
    });

    describe('safeIntToUint', () => {
        it('safeIntToUint(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.safeIntToUint(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('safeIntToUint(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.safeIntToUint(1),
            );
            result.should.be.bignumber.equal(1);
        });
        itShouldThrow('safeIntToUint(-1)', async () => {
            await fixidityLibMock.safeIntToUint(-1);
        }, 'Cannot cast negative signed integer to unsigned integer.');
    });

    describe('safeUintToInt', () => {
        it('safeUintToInt(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.safeUintToInt(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('safeUintToInt(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.safeUintToInt(1),
            );
            result.should.be.bignumber.equal(1);
        });
        
        itShouldThrow('maxInt+1()', async () => {
            await fixidityLibMock.safeUintToInt(maxInt256.plus(1).toString(10));
        }, 'Cannot cast overflowing unsigned integer to signed integer.');
    });
});
