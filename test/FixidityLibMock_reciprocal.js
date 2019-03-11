const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - reciprocal', () => {
    let fixidityLibMock;
    let fixed1;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
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
        it('reciprocal(2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed1.div(2.5).dp(0, 1),
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
