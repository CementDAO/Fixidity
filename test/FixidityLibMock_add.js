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

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        max_fixed_add = new BigNumber(await fixidityLibMock.max_fixed_add());
        // eslint-disable-next-line camelcase
        max_int256 = new BigNumber(await fixidityLibMock.max_int256());
    });

    describe('add', () => {
        it('add(0,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(0, 0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('add(max_fixed_add(),0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(max_fixed_add.toString(10), 0),
            );
            result.should.be.bignumber.equal(max_fixed_add);
        });
        it('add(0,max_fixed_add())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(0, max_fixed_add.toString(10)),
            );
            result.should.be.bignumber.equal(max_fixed_add);
        });
        it('add(max_fixed_add()-1,max_fixed_add())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.minus(1).toString(10),
                    max_fixed_add.toString(10),
                ),
            );
            result.should.be.bignumber.equal(max_int256.minus(1));
        });
        it('add(max_fixed_add(),max_fixed_add()-1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.toString(10),
                    max_fixed_add.minus(1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(max_int256.minus(1));
        });
        it('add(max_fixed_add(),max_fixed_add())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.toString(10),
                    max_fixed_add.toString(10),
                ),
            );
            result.should.be.bignumber.equal(max_int256);
        });
        itShouldThrow('add(max_fixed_add() + 1,max_fixed_add())', async () => {
            await fixidityLibMock.add(
                max_fixed_add.plus(1).toString(10),
                max_fixed_add.toString(10),
            );
        }, 'revert');
        it('add(-max_fixed_add(),0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.multipliedBy(-1).toString(10),
                    0,
                ),
            );
            result.should.be.bignumber.equal(max_fixed_add.multipliedBy(-1));
        });
        it('add(0,-max_fixed_add())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    0,
                    max_fixed_add.multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(max_fixed_add.multipliedBy(-1));
        });
        it('add(max_fixed_add(),-max_fixed_add())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.toString(10),
                    max_fixed_add.multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('add(-max_fixed_add(),max_fixed_add())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.multipliedBy(-1).toString(10),
                    max_fixed_add.toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('add(-max_fixed_add(),-max_fixed_add()+1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    max_fixed_add.multipliedBy(-1).toString(10),
                    max_fixed_add.multipliedBy(-1).plus(1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(new BigNumber(1).minus(max_int256));
        });
        itShouldThrow('add(-max_fixed_add(),-max_fixed_add())', async () => {
            await fixidityLibMock.add(
                max_fixed_add.multipliedBy(-1).toString(10),
                max_fixed_add.multipliedBy(-1).toString(10),
            );
        }, 'revert');
    });
});
