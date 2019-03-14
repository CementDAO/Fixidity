const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - variables', () => {
    let fixidityLibMock;
    let digits;
    let fixed1;
    let mulPrecision;
    let maxInt256;
    let minInt256;
    let maxNewFixed;
    let minNewFixed;
    let maxFixedAdd;
    let maxFixedSub;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        digits = new BigNumber(await fixidityLibMock.digits());
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        mulPrecision = BigNumber(await fixidityLibMock.mulPrecision());
        maxInt256 = BigNumber(await fixidityLibMock.maxInt256());
        minInt256 = BigNumber(await fixidityLibMock.minInt256());
        maxNewFixed = BigNumber(await fixidityLibMock.maxNewFixed());
        minNewFixed = BigNumber(await fixidityLibMock.minNewFixed());
        maxFixedAdd = BigNumber(await fixidityLibMock.maxFixedAdd());
        maxFixedSub = BigNumber(await fixidityLibMock.maxFixedSub());
    });

    it('fixed1() equals 10**digits()', async () => {
        fixed1.should.be.bignumber.equal(new BigNumber('10').pow(digits));
    });

    it('mulPrecision() equals sqrt(fixed1())', async () => {
        mulPrecision.should.be.bignumber.equal(new BigNumber(fixed1).sqrt());
    });

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
