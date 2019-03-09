const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - multiply', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed1;
    // eslint-disable-next-line camelcase
    let fixedE;
    // eslint-disable-next-line camelcase
    let maxFixedMul;
    // eslint-disable-next-line camelcase
    let mulPrecision;
    // eslint-disable-next-line camelcase
    let maxFixedAdd;
    // eslint-disable-next-line camelcase
    let maxInt256;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        // eslint-disable-next-line camelcase
        fixedE = new BigNumber(await fixidityLibMock.fixedE());
        // eslint-disable-next-line camelcase
        maxFixedMul = new BigNumber(await fixidityLibMock.maxFixedMul());
        // eslint-disable-next-line camelcase
        mulPrecision = new BigNumber(await fixidityLibMock.mulPrecision());
        // eslint-disable-next-line camelcase
        maxFixedAdd = new BigNumber(await fixidityLibMock.maxFixedAdd());
        // eslint-disable-next-line camelcase
        maxInt256 = new BigNumber(await fixidityLibMock.maxInt256());
    });

    describe('multiply', () => {
        it('multiply(maxFixedMul(),0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    0,
                    0,
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('multiply(maxFixedMul(),0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    maxFixedMul.toString(10),
                    0,
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('multiply(0, maxFixedMul())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    0,
                    maxFixedMul.toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('multiply(maxFixedMul(),fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    maxFixedMul.toString(10),
                    fixed1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(maxFixedMul);
        });
        it('multiply(fixed1(),maxFixedMul())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.toString(10),
                    maxFixedMul.toString(10),
                ),
            );
            result.should.be.bignumber.equal(maxFixedMul);
        });
        it('multiply(fixed1()*2,fixed1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2).toString(10),
                    fixed1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(4));
        });
        it('multiply(fixed1()*2,fixed1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2).toString(10),
                    fixed1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(5));
        });
        it('multiply(fixed1()*2.5,fixed1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2).toString(10),
                    fixed1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(5));
        });
        it('multiply(fixed1()*0.5,fixed1()*0.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(0.5).toString(10),
                    fixed1.multipliedBy(0.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(0.25));
        });
        it('multiply(fixed1()/mulPrecision(),fixed1()*mulPrecision())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.dividedBy(mulPrecision).toString(10),
                    fixed1.dividedBy(mulPrecision).toString(10),
                ),
            );
            result.should.be.bignumber.equal(1);
        });
        it('multiply(fixed1()*2.5,fixed1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2.5).toString(10),
                    fixed1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(6.25));
        });

        it('multiply(fixed1()*-2,fixed1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2).toString(10),
                    fixed1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(4));
        });
        it('multiply(fixed1()*-2,fixed1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2).toString(10),
                    fixed1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-4));
        });
        it('multiply(fixed1()*2,fixed1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2).toString(10),
                    fixed1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-4));
        });

        it('multiply(fixed1()*-2.5,fixed1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2.5).toString(10),
                    fixed1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(5));
        });
        it('multiply(fixed1()*-2.5,fixed1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2.5).toString(10),
                    fixed1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-5));
        });
        it('multiply(fixed1()*2.5,fixed1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2.5).toString(10),
                    fixed1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-5));
        });

        it('multiply(fixed1()*-2,fixed1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2).toString(10),
                    fixed1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(5));
        });
        it('multiply(fixed1()*-2,fixed1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2).toString(10),
                    fixed1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-5));
        });
        it('multiply(fixed1()*2,fixed1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2).toString(10),
                    fixed1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-5));
        });

        it('multiply(fixed1()*-2.5,fixed1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2.5).toString(10),
                    fixed1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(6.25));
        });
        it('multiply(fixed1()*-2.5,fixed1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(-2.5).toString(10),
                    fixed1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-6.25));
        });
        it('multiply(fixed1()*2.5,fixed1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed1.multipliedBy(2.5).toString(10),
                    fixed1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed1.multipliedBy(-6.25));
        });
        it('multiply(maxFixedAdd(),2*fixed1()', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    maxFixedAdd.toString(10),
                    fixed1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.lte(maxInt256);
        });
        itShouldThrow('multiply(maxFixedAdd()+1,2*fixed1())', async () => {
            await fixidityLibMock.multiply(
                maxFixedAdd.plus(fixed1).toString(10),
                fixed1.multipliedBy(2).toString(10),
            );
        }, 'revert');
        itShouldThrow('multiply(maxFixedAdd(),2.5*fixed1())', async () => {
            await fixidityLibMock.multiply(
                maxFixedAdd.plus(fixed1).toString(10),
                fixed1.multipliedBy(2.5).toString(10),
            );
        }, 'revert');
        itShouldThrow('multiply(maxFixedAdd(),maxFixedAdd())', async () => {
            await fixidityLibMock.multiply(
                maxFixedAdd.toString(10),
                maxFixedAdd.toString(10),
            );
        }, 'revert');
        it('multiply(maxFixedMul(),maxFixedMul()', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    maxFixedMul.toString(10),
                    maxFixedMul.toString(10),
                ),
            );
            result.should.be.bignumber.lte(maxInt256);
        });
        itShouldThrow('multiply(maxFixedMul(),maxFixedMul()+1)', async () => {
            await fixidityLibMock.multiply(
                maxFixedMul.toString(10),
                maxFixedMul.plus(fixed1).toString(10),
            );
        }, 'revert');

        it('multiply(maxFixedAdd(),-2*fixed1()', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    maxFixedAdd.toString(10),
                    fixed1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.lte(maxInt256);
        });
        itShouldThrow('multiply(maxFixedAdd()+1,-2*fixed1())', async () => {
            await fixidityLibMock.multiply(
                maxFixedAdd.plus(fixed1).toString(10),
                fixed1.multipliedBy(-2).toString(10),
            );
        }, 'revert');
        itShouldThrow('multiply(maxFixedAdd(),-2.5*fixed1())', async () => {
            await fixidityLibMock.multiply(
                maxFixedAdd.plus(fixed1).toString(10),
                fixed1.multipliedBy(-2.5).toString(10),
            );
        }, 'revert');
        itShouldThrow('multiply(maxFixedAdd(),-maxFixedAdd())', async () => {
            await fixidityLibMock.multiply(
                maxFixedAdd.toString(10),
                maxFixedAdd.multipliedBy(-1).toString(10),
            );
        }, 'revert');
        it('multiply(maxFixedMul(),-maxFixedMul()', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    maxFixedMul.toString(10),
                    maxFixedMul.multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.lte(maxInt256);
        });
        itShouldThrow('multiply(maxFixedMul()+1,-maxFixedMul())', async () => {
            await fixidityLibMock.multiply(
                maxFixedMul.plus(fixed1).toString(10),
                maxFixedMul.multipliedBy(-1).toString(10),
            );
        }, 'revert');
    });
});
