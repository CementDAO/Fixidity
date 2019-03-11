const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFromInt256', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed1;
    // eslint-disable-next-line camelcase
    let maxFixedNew;
    // eslint-disable-next-line camelcase
    let minFixedNew;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        // eslint-disable-next-line camelcase
        maxFixedNew = new BigNumber(await fixidityLibMock.maxFixedNew());
        // eslint-disable-next-line camelcase
        minFixedNew = new BigNumber(await fixidityLibMock.minFixedNew());
    });

    describe('newFromInt256', () => {
        it('newFromInt256(0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256(0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('newFromInt256(1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256(1),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        it('newFromInt256(maxFixedNew())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256(maxFixedNew.toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(maxFixedNew));
        });
        itShouldThrow(
            'newFromInt256(maxFixedNew()+1)',
            async () => {
                await fixidityLibMock
                    .newFromInt256(maxFixedNew.plus(1).toString(10));
            },
            'revert',
        );
        it('newFromInt256(-1)', async () => {
            const result = new BigNumber(await fixidityLibMock.newFromInt256(-1));
            result.should.be.bignumber.equal(fixed1.multipliedBy(-1));
        });
        it('newFromInt256(minFixedNew())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256(minFixedNew.toString(10)),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(minFixedNew));
        });
        itShouldThrow(
            'newFromInt256(minFixedNew()-1)',
            async () => {
                await fixidityLibMock
                    .newFromInt256(minFixedNew.minus(1).toString(10));
            },
            'revert',
        );
    });
});
