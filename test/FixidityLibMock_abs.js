const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - abs', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed1;
    // eslint-disable-next-line camelcase
    let maxNewFixed;
    // eslint-disable-next-line camelcase
    let minNewFixed;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        // eslint-disable-next-line camelcase
        maxNewFixed = new BigNumber(await fixidityLibMock.maxNewFixed());
        // eslint-disable-next-line camelcase
        minNewFixed = new BigNumber(await fixidityLibMock.minNewFixed());
    });

    describe('abs', () => {
        it('abs(0)', async () => {
            const result = new BigNumber(await fixidityLibMock.abs(0));
            result.should.be.bignumber.equal(0);
        });
        it('abs(fixed1())', async () => {
            const result = new BigNumber(await fixidityLibMock.abs(fixed1.toString(10)));
            result.should.be.bignumber.equal(fixed1);
        });
        it('abs(-fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.abs(fixed1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        it('abs(newFixed(maxNewFixed()))', async () => {
            const newFromMaxFixedNew = new BigNumber(
                await fixidityLibMock.newFixed(maxNewFixed.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.abs(newFromMaxFixedNew.toString(10)),
            );
            result.should.be.bignumber.equal(maxNewFixed.multipliedBy(fixed1));
        });
        it('abs(newFixed(minNewFixed()))', async () => {
            const newFromMinFixedNew = new BigNumber(
                await fixidityLibMock.newFixed(minNewFixed.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.abs(newFromMinFixedNew.toString(10)),
            );
            result.should.be.bignumber.equal(minNewFixed.multipliedBy(fixed1).multipliedBy(-1));
        });
    });
});
