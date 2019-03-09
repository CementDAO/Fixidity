const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - add', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let max_fixed_add;
    // eslint-disable-next-line camelcase
    let max_int256;
    // eslint-disable-next-line camelcase
    let max_fixed_sub;
    // eslint-disable-next-line camelcase
    let min_int256;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        max_fixed_add = new BigNumber(await fixidityLibMock.max_fixed_add());
        // eslint-disable-next-line camelcase
        max_fixed_sub = new BigNumber(await fixidityLibMock.max_fixed_sub());
        // eslint-disable-next-line camelcase
        max_int256 = new BigNumber(await fixidityLibMock.max_int256());
        // eslint-disable-next-line camelcase
        min_int256 = new BigNumber(await fixidityLibMock.min_int256());
    });

    describe('add', () => {
        it('add(max_fixed_add(),max_fixed_add())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.toString(10),
                    max_fixed_add.toString(10),
                ),
            );
            result.should.be.bignumber.equal(max_int256.minus(1));
        });
        itShouldThrow('add(max_fixed_add()+1,max_fixed_add()+1)', async () => {
            await fixidityLibMock.add(
                max_fixed_add.plus(1).toString(10),
                max_fixed_add.plus(1).toString(10),
            );
        }, 'revert');
        it('add(max_fixed_sub(),max_fixed_sub())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_sub.toString(10),
                    max_fixed_sub.toString(10),
                ),
            );
            result.should.be.bignumber.equal(min_int256);
        });
        itShouldThrow('add(max_fixed_sub()-1,max_fixed_sub()-1)', async () => {
            await fixidityLibMock.add(
                max_fixed_sub.minus(1).toString(10),
                max_fixed_sub.minus(1).toString(10),
            );
        }, 'revert');
        itShouldThrow('add(max_int256(),max_int256())', async () => {
            await fixidityLibMock.add(
                max_int256.toString(10),
                max_int256.toString(10),
            );
        }, 'revert');
        itShouldThrow('add(min_int256(),min_int256())', async () => {
            await fixidityLibMock.add(
                min_int256.toString(10),
                min_int256.toString(10),
            );
        }, 'revert');
        it('add(max_int256(),-max_int256())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_int256.toString(10),
                    max_int256.multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('add(min_int256()+1,-(min_int256()+1))', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    min_int256.plus(1).toString(10),
                    min_int256.plus(1).multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
    });
});
