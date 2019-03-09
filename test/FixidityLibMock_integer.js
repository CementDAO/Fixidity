const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - integer', () => {
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

    describe('integer', () => {
        it('integer(0)', async () => {
            const result = new BigNumber(await fixidityLibMock.integer(0));
            assert.equal(result.comparedTo(new BigNumber(0)), 0, 'should be zero!');
        });
        it('integer(fixed_1())', async () => {
            const result = new BigNumber(await fixidityLibMock.integer(fixed_1.toString(10)));
            assert.equal(result.comparedTo(fixed_1), 0, 'should be fixed_1!');
        });
        it('integer(newFromInt256(max_fixed_new()))', async () => {
            const newFromMaxFixedNew = new BigNumber(
                await fixidityLibMock.newFromInt256(max_fixed_new.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.integer(newFromMaxFixedNew.toString(10)),
            );
            assert.equal(
                result.comparedTo(max_fixed_new.multipliedBy(fixed_1)),
                0,
                'should be max_fixed_new()*fixed_1()!',
            );
        });
        it('integer(-fixed_1())', async () => {
            const negativeFixed1 = fixed_1.multipliedBy(-1);
            const result = new BigNumber(
                await fixidityLibMock.integer(negativeFixed1.toString(10)),
            );
            assert.equal(result.comparedTo(negativeFixed1), 0, 'should be -fixed_1()!');
        });
        it('integer(newFromInt256(min_fixed_new()))', async () => {
            const newFromMinFixedNew = new BigNumber(
                await fixidityLibMock.newFromInt256(min_fixed_new.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.integer(newFromMinFixedNew.toString(10)),
            );
            assert.equal(
                result.comparedTo(min_fixed_new.multipliedBy(fixed_1)),
                0,
                'should be min_fixed_new()*fixed_1()!',
            );
        });
    });
});
