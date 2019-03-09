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

    describe('fromFixed', () => {
        it('fromFixed(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fromFixed(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fromFixed(fixed_1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed_1.toString(10)),
            );
            result.should.be.bignumber.equal(1);
        });
        it('fromFixed(max_fixed_new()*fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed_1.multipliedBy(max_fixed_new).toString(10)),
            );
            result.should.be.bignumber.equal(max_fixed_new);
        });

        it('fromFixed(-1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(-1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fromFixed(fixed_1*(-1))', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed_1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(-1);
        });
        it('fromFixed(min_fixed_new()*fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed_1.multipliedBy(min_fixed_new).toString(10)),
            );
            result.should.be.bignumber.equal(min_fixed_new);
        });
    });
});
