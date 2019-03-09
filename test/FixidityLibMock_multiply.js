const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - multiply', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;
    // eslint-disable-next-line camelcase
    let fixed_e;
    // eslint-disable-next-line camelcase
    let max_fixed_mul;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        fixed_e = new BigNumber(await fixidityLibMock.fixed_e());
        // eslint-disable-next-line camelcase
        max_fixed_mul = new BigNumber(await fixidityLibMock.max_fixed_mul());
    });

    describe('multiply', () => {
        it('multiply(max_fixed_mul(),0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    0,
                    0,
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('multiply(max_fixed_mul(),0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    max_fixed_mul.toString(10),
                    0,
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('multiply(0, max_fixed_mul())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    0,
                    max_fixed_mul.toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('multiply(max_fixed_mul(),fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    max_fixed_mul.toString(10),
                    fixed_1.toString(10),
                ),
            );
            result.should.be.bignumber.equal(max_fixed_mul);
        });
        it('multiply(fixed_1(),max_fixed_mul())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.toString(10),
                    max_fixed_mul.toString(10),
                ),
            );
            result.should.be.bignumber.equal(max_fixed_mul);
        });
        it('multiply(fixed_1()*2,fixed_1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2).toString(10),
                    fixed_1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(4));
        });
        it('multiply(fixed_1()*2,fixed_1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(5));
        });
        it('multiply(fixed_1()*2.5,fixed_1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(5));
        });
        it('multiply(fixed_1()*0.5,fixed_1()*0.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(0.5).toString(10),
                    fixed_1.multipliedBy(0.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(0.25));
        });
        it('multiply(fixed_1()*0.000000000000000005,fixed_1()*0.000000000000000005)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(0.000000000000000005).toString(10),
                    fixed_1.multipliedBy(0.000000000000000005).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(0.000000000000000000000000000000000025));
        });
        it('multiply(fixed_1()*2.5,fixed_1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2.5).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(6.25));
        });

        it('multiply(fixed_1()*-2,fixed_1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2).toString(10),
                    fixed_1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(4));
        });
        it('multiply(fixed_1()*-2,fixed_1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2).toString(10),
                    fixed_1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-4));
        });
        it('multiply(fixed_1()*2,fixed_1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2).toString(10),
                    fixed_1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-4));
        });

        it('multiply(fixed_1()*-2.5,fixed_1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2.5).toString(10),
                    fixed_1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(5));
        });
        it('multiply(fixed_1()*-2.5,fixed_1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2.5).toString(10),
                    fixed_1.multipliedBy(2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-5));
        });
        it('multiply(fixed_1()*2.5,fixed_1()*-2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2.5).toString(10),
                    fixed_1.multipliedBy(-2).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-5));
        });

        it('multiply(fixed_1()*-2,fixed_1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2).toString(10),
                    fixed_1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(5));
        });
        it('multiply(fixed_1()*-2,fixed_1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-5));
        });
        it('multiply(fixed_1()*2,fixed_1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2).toString(10),
                    fixed_1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-5));
        });

        it('multiply(fixed_1()*-2.5,fixed_1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2.5).toString(10),
                    fixed_1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(6.25));
        });
        it('multiply(fixed_1()*-2.5,fixed_1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(-2.5).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-6.25));
        });
        it('multiply(fixed_1()*2.5,fixed_1()*-2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2.5).toString(10),
                    fixed_1.multipliedBy(-2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(-6.25));
        });
        /* it('multiply(fixed_1()*2,fixed_1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(5));
        });
        it('multiply(fixed_1()*2.5,fixed_1()*2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(5));
        });
        it('multiply(fixed_1()*0.5,fixed_1()*0.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(0.5).toString(10),
                    fixed_1.multipliedBy(0.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(0.25));
        });
        it('multiply(fixed_1()*0.000000000000000005,fixed_1()*0.000000000000000005)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(0.000000000000000005).toString(10),
                    fixed_1.multipliedBy(0.000000000000000005).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(0.000000000000000000000000000000000025));
        });
        it('multiply(fixed_1()*2.5,fixed_1()*2.5)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_1.multipliedBy(2.5).toString(10),
                    fixed_1.multipliedBy(2.5).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_1.multipliedBy(6.25));
        }); */


        /* it('multiply(-fixed_e(),fixed_e())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_e.multipliedBy(-1).toString(10),
                    fixed_e.toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_e.multipliedBy(-1).multipliedBy(fixed_e));
        });
        it('multiply(fixed_e(),-fixed_e())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_e.toString(10),
                    fixed_e.multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(fixed_e.multipliedBy(fixed_e.multipliedBy(-1)));
        });
        it('multiply(-fixed_e(),-fixed_e())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.multiply(
                    fixed_e.multipliedBy(-1).toString(10),
                    fixed_e.multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(
                fixed_e.multipliedBy(-1).multipliedBy(fixed_e.multipliedBy(-1)),
            );
        }); */
    });
});
