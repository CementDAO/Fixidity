const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');
const { itShouldThrow } = require('./utils');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();

contract('FixidityLibMock - toInt', () => {
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

    describe('toInt', () => {
        it('toInt(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toInt(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('toInt(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toInt(1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('toInt(fixed1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toInt(fixed1.toString(10)),
            );
            result.should.be.bignumber.equal(1);
        });
        it('toInt(maxNewFixed()*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toInt(fixed1.multipliedBy(maxNewFixed).toString(10)),
            );
            result.should.be.bignumber.equal(maxNewFixed);
        });

        it('toInt(-1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toInt(-1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('toInt(fixed1*(-1))', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toInt(fixed1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(-1);
        });
        it('toInt(minNewFixed()*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.toInt(fixed1.multipliedBy(minNewFixed).toString(10)),
            );
            result.should.be.bignumber.equal(minNewFixed);
        });
    });
});
