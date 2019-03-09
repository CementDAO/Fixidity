const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const LogarithmLibMock = artifacts.require('./LogarithmLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();

contract('LogarithmLibMock', () => {
    let fixidityLibMock;
    let logarithmLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;
    // eslint-disable-next-line camelcase
    let fixed_e;
    // eslint-disable-next-line camelcase
    let mul_precision;
    // eslint-disable-next-line camelcase
    let max_fixed_new;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        logarithmLibMock = await LogarithmLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        fixed_e = new BigNumber(await fixidityLibMock.fixed_e());
        // eslint-disable-next-line camelcase
        mul_precision = new BigNumber(await fixidityLibMock.mul_precision());
        // eslint-disable-next-line camelcase
        max_fixed_new = new BigNumber(await fixidityLibMock.max_fixed_new());
    });

    /*
    * Test ln(0) fails
    * Test ln(-fixed_1()) fails
    * Test ln(fixed_1()) returns 0
    * Test ln(fixed_e()) returns fixed_1()
    * Test ln(fixed_e()*fixed_e()) returns ln(fixed_e())+ln(fixed_e())
    * Test ln(max_fixed_new*fixed_1()) returns 93859467695000404205515674067419529216
    * Test ln(1) returns -82
    */
    itShouldThrow('ln(0)', async () => {
        await logarithmLibMock.ln(0);
    }, 'revert');
    itShouldThrow('ln(-1)', async () => {
        await logarithmLibMock.ln(-1);
    }, 'revert');
    it('ln(fixed_1())', async () => {
        const result = new BigNumber(
            await logarithmLibMock.ln(fixed_1.toString(10)),
        );
        result.should.be.bignumber.equal(0);
    });
    it('ln(fixed_e())', async () => {
        const result = new BigNumber(
            await logarithmLibMock.ln(fixed_e.toString(10)),
        );
        result.should.be.bignumber.equal(fixed_1);
    });
    it('ln(fixed_e()*fixed_e())', async () => { // 1/(10**16)% deviation at e**2
        const result = new BigNumber(
            await logarithmLibMock.ln(
                await fixidityLibMock.multiply(
                    fixed_e.toString(10),
                    fixed_e.toString(10),
                ),
            ),
        );
        result.should.be.bignumber.gte(fixed_1.minus(mul_precision).multipliedBy(2));
        result.should.be.bignumber.lte(fixed_1.plus(mul_precision).multipliedBy(2));
    });
    it('ln(max_fixed_new())', async () => { // 1000% deviation at max_fixed_new()
        const result = new BigNumber(
            await logarithmLibMock.ln(max_fixed_new.toString(10)),
        );
        const log_max = new BigNumber(93859467695000404205515674067419529216);
        result.should.be.bignumber.gte(log_max.multipliedBy(0.1));
        result.should.be.bignumber.lte(log_max.multipliedBy(10));
    });
    it('ln(1)', async () => { // 2% deviation at the lower precision limit
        const result = new BigNumber(
            await logarithmLibMock.ln(1),
        );
        result.should.be.bignumber.gte(fixed_1.plus(fixed_1.dividedBy(50)).multipliedBy(-82));
        result.should.be.bignumber.lte(fixed_1.minus(fixed_1.dividedBy(50)).multipliedBy(-82));
    });
});
