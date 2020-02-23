const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - toFixed', () => {
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

    describe('toFixed', () => {
        it('toFixed(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toFixed(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('toFixed(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toFixed(1),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        it('toFixed(maxNewFixed())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toFixed(maxNewFixed.toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(maxNewFixed));
        });
        itShouldThrow(
            'toFixed(maxNewFixed()+1)',
            async () => {
                await fixidityLibMock
                    .toFixed(maxNewFixed.plus(1).toString(10));
            },
            'revert',
        );
        it('toFixed(-1)', async () => {
            const result = new BigNumber(await fixidityLibMock.toFixed(-1));
            result.should.be.bignumber.equal(fixed1.multipliedBy(-1));
        });
        it('toFixed(minNewFixed())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toFixed(minNewFixed.toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(minNewFixed));
        });
        itShouldThrow(
            'toFixed(minNewFixed()-1)',
            async () => {
                await fixidityLibMock
                    .toFixed(minNewFixed.minus(1).toString(10));
            },
            'revert',
        );
    });
});
