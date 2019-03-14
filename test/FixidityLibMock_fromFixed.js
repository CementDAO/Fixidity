const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

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
        it('fromFixed(fixed1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed1.toString(10)),
            );
            result.should.be.bignumber.equal(1);
        });
        it('fromFixed(maxNewFixed()*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed1.multipliedBy(maxNewFixed).toString(10)),
            );
            result.should.be.bignumber.equal(maxNewFixed);
        });

        it('fromFixed(-1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(-1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('fromFixed(fixed1*(-1))', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(-1);
        });
        it('fromFixed(minNewFixed()*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.fromFixed(fixed1.multipliedBy(minNewFixed).toString(10)),
            );
            result.should.be.bignumber.equal(minNewFixed);
        });
    });
});
