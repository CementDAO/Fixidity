const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - reciprocal', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;
    // eslint-disable-next-line camelcase
    let fixed_e;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        fixed_e = new BigNumber(await fixidityLibMock.fixed_e());
    });

    describe('reciprocal', () => {
        itShouldThrow('reciprocal(0)', async () => {
            await fixidityLibMock.reciprocal(0);
        }, 'revert');
        it('reciprocal(fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed_1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed_1,
            );
        });
        it('reciprocal(fixed_1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed_1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed_1.dividedBy(2),
            );
        });
        it('reciprocal(fixed_e())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed_e.toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed_1.dividedBy(fixed_e),
            );
        });
        it('reciprocal(fixed_1()*fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    fixed_1.multipliedBy(fixed_1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                1,
            );
        });
        it('reciprocal(2*fixed_1()*fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.reciprocal(
                    new BigNumber(2).multipliedBy(fixed_1).multipliedBy(fixed_1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                0,
            );
        });
    });
});
