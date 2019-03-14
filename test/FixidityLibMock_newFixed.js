const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFixed', () => {
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

    describe('newFixed', () => {
        it('newFixed(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixed(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('newFixed(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixed(1),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        it('newFixed(maxNewFixed())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixed(maxNewFixed.toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(maxNewFixed));
        });
        itShouldThrow(
            'newFixed(maxNewFixed()+1)',
            async () => {
                await fixidityLibMock
                    .newFixed(maxNewFixed.plus(1).toString(10));
            },
            'revert',
        );
        it('newFixed(-1)', async () => {
            const result = new BigNumber(await fixidityLibMock.newFixed(-1));
            result.should.be.bignumber.equal(fixed1.multipliedBy(-1));
        });
        it('newFixed(minNewFixed())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixed(minNewFixed.toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(minNewFixed));
        });
        itShouldThrow(
            'newFixed(minNewFixed()-1)',
            async () => {
                await fixidityLibMock
                    .newFixed(minNewFixed.minus(1).toString(10));
            },
            'revert',
        );
    });
});
