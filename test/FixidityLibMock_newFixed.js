const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFixed', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;
    // eslint-disable-next-line camelcase
    let max_fixed_new;
    // eslint-disable-next-line camelcase
    let min_fixed_new;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        max_fixed_new = new BigNumber(await fixidityLibMock.max_fixed_new());
        // eslint-disable-next-line camelcase
        min_fixed_new = new BigNumber(await fixidityLibMock.min_fixed_new());
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
            result.should.be.bignumber.equal(fixed_1);
        });
        it('newFixed(max_fixed_new())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixed(max_fixed_new.toString(10)),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(max_fixed_new));
        });
        itShouldThrow(
            'newFixed(max_fixed_new()+1)',
            async () => {
                await fixidityLibMock
                    .newFixed(max_fixed_new.plus(1).toString(10));
            },
            'revert',
        );
        it('newFixed(-1)', async () => {
            const result = new BigNumber(await fixidityLibMock.newFixed(-1));
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-1));
        });
        it('newFixed(min_fixed_new())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixed(min_fixed_new.toString(10)),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(min_fixed_new));
        });
        itShouldThrow(
            'newFixed(min_fixed_new()-1)',
            async () => {
                await fixidityLibMock
                    .newFixed(min_fixed_new.minus(1).toString(10));
            },
            'revert',
        );
    });
});
