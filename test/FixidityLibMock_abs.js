const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - abs', () => {
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

    describe('abs', () => {
        it('abs(0)', async () => {
            const result = new BigNumber(await fixidityLibMock.abs(0));
            result.should.be.bignumber.equal(0);
        });
        it('abs(fixed_1())', async () => {
            const result = new BigNumber(await fixidityLibMock.abs(fixed_1.toString(10)));
            result.should.be.bignumber.equal(fixed_1);
        });
        it('abs(-fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.abs(fixed_1.multipliedBy(-1).toString(10)),
            );
            result.should.be.bignumber.equal(fixed_1);
        });
        it('abs(newFromInt256(max_fixed_new()))', async () => {
            const newFromMaxFixedNew = new BigNumber(
                await fixidityLibMock.newFromInt256(max_fixed_new.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.abs(newFromMaxFixedNew.toString(10)),
            );
            result.should.be.bignumber.equal(max_fixed_new.multipliedBy(fixed_1));
        });
        it('abs(newFromInt256(min_fixed_new()))', async () => {
            const newFromMinFixedNew = new BigNumber(
                await fixidityLibMock.newFromInt256(min_fixed_new.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.abs(newFromMinFixedNew.toString(10)),
            );
            result.should.be.bignumber.equal(min_fixed_new.multipliedBy(fixed_1).multipliedBy(-1));
        });
    });
});
