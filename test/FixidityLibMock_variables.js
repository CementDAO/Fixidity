const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - variables', () => {
    let fixidityLibMock;
    let digits;
    // eslint-disable-next-line camelcase
    let fixed_1;
    // eslint-disable-next-line camelcase
    let fixed_e;
    // eslint-disable-next-line camelcase
    let mul_precision;
    // eslint-disable-next-line camelcase
    let max_int256;
    // eslint-disable-next-line camelcase
    let min_int256;
    // eslint-disable-next-line camelcase
    let max_fixed_new;
    // eslint-disable-next-line camelcase
    let min_fixed_new;
    // eslint-disable-next-line camelcase
    let max_fixed_add;
    // eslint-disable-next-line camelcase
    let max_fixed_sub;
    // eslint-disable-next-line camelcase
    let max_fixed_mul;
    // eslint-disable-next-line camelcase
    let max_fixed_div;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        digits = new BigNumber(await fixidityLibMock.digits());
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        fixed_e = new BigNumber(await fixidityLibMock.fixed_e());
        // eslint-disable-next-line camelcase
        mul_precision = BigNumber(await fixidityLibMock.mul_precision());
        // eslint-disable-next-line camelcase
        max_int256 = BigNumber(await fixidityLibMock.max_int256());
        // eslint-disable-next-line camelcase
        min_int256 = BigNumber(await fixidityLibMock.min_int256());
        // eslint-disable-next-line camelcase
        max_fixed_new = BigNumber(await fixidityLibMock.max_fixed_new());
        // eslint-disable-next-line camelcase
        min_fixed_new = BigNumber(await fixidityLibMock.min_fixed_new());
        // eslint-disable-next-line camelcase
        max_fixed_add = BigNumber(await fixidityLibMock.max_fixed_add());
        // eslint-disable-next-line camelcase
        max_fixed_sub = BigNumber(await fixidityLibMock.max_fixed_sub());
        // eslint-disable-next-line camelcase
        max_fixed_mul = BigNumber(await fixidityLibMock.max_fixed_mul());
        // eslint-disable-next-line camelcase
        max_fixed_div = BigNumber(await fixidityLibMock.max_fixed_div());
    });

    it('fixed_1() equals 10**digits()', async () => {
        fixed_1.should.be.bignumber.equal(new BigNumber('10').pow(digits));
    });

    it('mul_precision() equals sqrt(fixed_1())', async () => {
        mul_precision.should.be.bignumber.equal(new BigNumber(fixed_1).sqrt());
    });

    /* it('fixed_e() equals 2718281828459045235360287471352662497757247093699959574966967627724076630/fixed_1()', async () => {
        fixed_e.should.be.bignumber.equal(new BigNumber(2718281828459045235360287471352662497757247093699959574966967627724076630).dividedBy(fixed_1));
    }); */

    it('max_int256() equals (2^255) - 1', async () => {
        max_int256.should.be.bignumber.equal(new BigNumber(2).pow(255).minus(1));
    });

    it('min_int256() equals (2^255)*(-1)', async () => {
        min_int256.should.be.bignumber.equal(new BigNumber(2).pow(255).multipliedBy(-1));
    });

    it('max_fixed_new() equals max_int256() / fixed_1()', async () => {
        max_fixed_new.should.be.bignumber.equal(max_int256.div(fixed_1).dp(0, 1));
    });

    it('min_fixed_new() equals -(max_int256()) / fixed_1()', async () => {
        min_fixed_new.should.be.bignumber.equal(max_int256.div(fixed_1).multipliedBy(-1).dp(0, 1));
    });

    it('max_fixed_add() equals max_int256()-1 / 2', async () => {
        max_fixed_add.should.be.bignumber.equal(max_int256.minus(1).div(2).dp(0, 1));
    });

    it('max_fixed_sub() equals min_int256() / 2', async () => {
        max_fixed_sub.should.be.bignumber.equal(min_int256.div(2).dp(0, 1));
    });

    /* it('max_fixed_mul equals sqrt(max_fixed_new())', async () => {
        max_fixed_mul.should.be.bignumber.equal(max_fixed_new.sqrt().dp(0, 1));
    }); */

    /* it('max_fixed_div() equals max_int256()/fixed_1()', async () => {
        max_fixed_div.should.be.bignumber.equal(max_int256.div(fixed_1));
    }); */
});
