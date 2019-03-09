const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - variables', () => {
    let fixidityLibMock;
    let digits;
    // eslint-disable-next-line camelcase
    let fixed1;
    // eslint-disable-next-line camelcase
    let fixedE;
    // eslint-disable-next-line camelcase
    let mulPrecision;
    // eslint-disable-next-line camelcase
    let maxInt256;
    // eslint-disable-next-line camelcase
    let minInt256;
    // eslint-disable-next-line camelcase
    let maxNewFixed;
    // eslint-disable-next-line camelcase
    let minNewFixed;
    // eslint-disable-next-line camelcase
    let maxFixedAdd;
    // eslint-disable-next-line camelcase
    let maxFixedSub;
    // eslint-disable-next-line camelcase
    let maxFixedMul;
    // eslint-disable-next-line camelcase
    let maxFixedDiv;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        digits = new BigNumber(await fixidityLibMock.digits());
        // eslint-disable-next-line camelcase
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        // eslint-disable-next-line camelcase
        fixedE = new BigNumber(await fixidityLibMock.fixedE());
        // eslint-disable-next-line camelcase
        mulPrecision = BigNumber(await fixidityLibMock.mulPrecision());
        // eslint-disable-next-line camelcase
        maxInt256 = BigNumber(await fixidityLibMock.maxInt256());
        // eslint-disable-next-line camelcase
        minInt256 = BigNumber(await fixidityLibMock.minInt256());
        // eslint-disable-next-line camelcase
        maxNewFixed = BigNumber(await fixidityLibMock.maxNewFixed());
        // eslint-disable-next-line camelcase
        minNewFixed = BigNumber(await fixidityLibMock.minNewFixed());
        // eslint-disable-next-line camelcase
        maxFixedAdd = BigNumber(await fixidityLibMock.maxFixedAdd());
        // eslint-disable-next-line camelcase
        maxFixedSub = BigNumber(await fixidityLibMock.maxFixedSub());
        // eslint-disable-next-line camelcase
        maxFixedMul = BigNumber(await fixidityLibMock.maxFixedMul());
        // eslint-disable-next-line camelcase
        maxFixedDiv = BigNumber(await fixidityLibMock.maxFixedDiv());
    });

    it('fixed1() equals 10**digits()', async () => {
        fixed1.should.be.bignumber.equal(new BigNumber('10').pow(digits));
    });

    it('mulPrecision() equals sqrt(fixed1())', async () => {
        mulPrecision.should.be.bignumber.equal(new BigNumber(fixed1).sqrt());
    });

    /* it('fixedE() equals 2718281828459045235360287471352662497757247093699959574966967627724076630/fixed1()', async () => {
        fixedE.should.be.bignumber.equal(new BigNumber(2718281828459045235360287471352662497757247093699959574966967627724076630).dividedBy(fixed1).dp(0,1));
    }); */

    it('maxInt256() equals (2^255) - 1', async () => {
        maxInt256.should.be.bignumber.equal(new BigNumber(2).pow(255).minus(1));
    });

    it('minInt256() equals (2^255)*(-1)', async () => {
        minInt256.should.be.bignumber.equal(new BigNumber(2).pow(255).multipliedBy(-1));
    });

    it('maxNewFixed() equals maxInt256() / fixed1()', async () => {
        maxNewFixed.should.be.bignumber.equal(maxInt256.div(fixed1).dp(0, 1));
    });

    it('minNewFixed() equals -(maxInt256()) / fixed1()', async () => {
        minNewFixed.should.be.bignumber.equal(maxInt256.div(fixed1).multipliedBy(-1).dp(0, 1));
    });

    it('maxFixedAdd() equals maxInt256()-1 / 2', async () => {
        maxFixedAdd.should.be.bignumber.equal(maxInt256.minus(1).div(2).dp(0, 1));
    });

    it('maxFixedSub() equals minInt256() / 2', async () => {
        maxFixedSub.should.be.bignumber.equal(minInt256.div(2).dp(0, 1));
    });

    /* it('maxFixedMul equals sqrt(maxNewFixed())', async () => {
        maxFixedMul.should.be.bignumber.equal(maxNewFixed.sqrt().dp(0, 1));
    }); */

    /* it('maxFixedDiv() equals maxInt256()/fixed1()', async () => {
        maxFixedDiv.should.be.bignumber.equal(maxInt256.div(fixed1));
    }); */
});
