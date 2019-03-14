const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - integer', () => {
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

    describe('integer', () => {
        it('integer(0)', async () => {
            const result = new BigNumber(await fixidityLibMock.integer(0));
            assert.equal(result.comparedTo(new BigNumber(0)), 0, 'should be zero!');
        });
        it('integer(fixed1())', async () => {
            const result = new BigNumber(await fixidityLibMock.integer(fixed1.toString(10)));
            assert.equal(result.comparedTo(fixed1), 0, 'should be fixed1!');
        });
        it('integer(newFixed(maxNewFixed()))', async () => {
            const newFromMaxFixedNew = new BigNumber(
                await fixidityLibMock.newFixed(maxNewFixed.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.integer(newFromMaxFixedNew.toString(10)),
            );
            assert.equal(
                result.comparedTo(maxNewFixed.multipliedBy(fixed1)),
                0,
                'should be maxNewFixed()*fixed1()!',
            );
        });
        it('integer(-fixed1())', async () => {
            const negativeFixed1 = fixed1.multipliedBy(-1);
            const result = new BigNumber(
                await fixidityLibMock.integer(negativeFixed1.toString(10)),
            );
            assert.equal(result.comparedTo(negativeFixed1), 0, 'should be -fixed1()!');
        });
        it('integer(newFixed(minNewFixed()))', async () => {
            const newFromMinFixedNew = new BigNumber(
                await fixidityLibMock.newFixed(minNewFixed.toString(10)),
            );
            const result = new BigNumber(
                await fixidityLibMock.integer(newFromMinFixedNew.toString(10)),
            );
            assert.equal(
                result.comparedTo(minNewFixed.multipliedBy(fixed1)),
                0,
                'should be minNewFixed()*fixed1()!',
            );
        });
    });
});
