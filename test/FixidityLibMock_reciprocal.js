const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - reciprocal', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed1;
    // eslint-disable-next-line camelcase
    let fixedE;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        // eslint-disable-next-line camelcase
        fixedE = new BigNumber(await fixidityLibMock.fixedE());
    });

    describe('reciprocal', () => {
        itShouldThrow('reciprocal(0)', async () => {
            await fixidityLibMock.reciprocal(0);
        }, 'revert');
        it('reciprocal(fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed1,
            );
        });
        it('reciprocal(fixed1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed1.dividedBy(2),
            );
        });
        it('reciprocal(fixedE())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixedE.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed1.multipliedBy(fixed1).div(fixedE).dp(0, 1),
            );
        });
        it('reciprocal(fixed1()*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed1.multipliedBy(fixed1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                1,
            );
        });
        it('reciprocal(2*fixed1()*fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    new BigNumber(2).multipliedBy(fixed1).multipliedBy(fixed1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                0,
            );
        });
    });
});
