const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const LogarithmLibMock = artifacts.require('./LogarithmLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();

contract('LogarithmLibMock', () => {
    let fixidityLibMock;
    let logarithmLibMock;
    let fixed1;
    let fixedE;
    let mulPrecision;
    let maxNewFixed;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        logarithmLibMock = await LogarithmLibMock.deployed();
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        fixedE = new BigNumber(await logarithmLibMock.fixedE());
        mulPrecision = new BigNumber(await fixidityLibMock.mulPrecision());
        maxNewFixed = new BigNumber(await fixidityLibMock.maxNewFixed());
    });

    /*
    * Test ln(0) fails
    * Test ln(-fixed1()) fails
    * Test ln(fixed1()) returns 0
    * Test ln(fixedE()) returns fixed1()
    * Test ln(fixedE()*fixedE()) returns ln(fixedE())+ln(fixedE())
    * Test ln(maxNewFixed*fixed1()) returns 93859467695000404205515674067419529216
    * Test ln(1) returns -82
    */
    itShouldThrow('ln(0)', async () => {
        await logarithmLibMock.ln(0);
    }, 'revert');
    itShouldThrow('ln(-1)', async () => {
        await logarithmLibMock.ln(-1);
    }, 'revert');
    it('ln(fixed1())', async () => {
        const result = new BigNumber(
            await logarithmLibMock.ln(fixed1.toString(10)),
        );
        result.should.be.bignumber.equal(0);
    });
    it('ln(fixedE())', async () => {
        const result = new BigNumber(
            await logarithmLibMock.ln(fixedE.toString(10)),
        );
        result.should.be.bignumber.equal(fixed1);
    });
    it('ln(fixedE()*fixedE())', async () => { // 1/(10**16)% deviation at e**2
        const result = new BigNumber(
            await logarithmLibMock.ln(
                await fixidityLibMock.multiply(
                    fixedE.toString(10),
                    fixedE.toString(10),
                ),
            ),
        );
        result.should.be.bignumber.gte(fixed1.minus(mulPrecision).multipliedBy(2));
        result.should.be.bignumber.lte(fixed1.plus(mulPrecision).multipliedBy(2));
    });
    it('ln(maxNewFixed())', async () => { // 1000% deviation at maxNewFixed()
        const result = new BigNumber(
            await logarithmLibMock.ln(maxNewFixed.toString(10)),
        );
        const logMax = new BigNumber('93859467695000404205515674');
        result.should.be.bignumber.gte(logMax.multipliedBy(0.1));
        result.should.be.bignumber.lte(logMax.multipliedBy(10));
    });
    it('ln(1)', async () => { // 33% deviation at the lower precision limit
        const result = new BigNumber(
            await logarithmLibMock.ln(1),
        );
        result.should.be.bignumber.gte(fixed1.plus(fixed1.dividedBy(3)).multipliedBy(-82));
        result.should.be.bignumber.lte(fixed1.minus(fixed1.dividedBy(3)).multipliedBy(-82));
    });
    it('ln(10*fixed1)', async () => { // 10**-15 deviation at 1.0
        const result = new BigNumber(
            await logarithmLibMock.ln(fixed1.multipliedBy(10).toString(10)),
        );
        result.should.be.bignumber.gte(new BigNumber('2302585092994045000000000'));
        result.should.be.bignumber.lte(new BigNumber('2302585092994046000000000'));
    });
    it('log(10,11*fixed1)', async () => { // 10**-11 deviation at 11.0
        const result = new BigNumber(
            await logarithmLibMock.log_b(fixed1.multipliedBy(10).toString(10), fixed1.multipliedBy(11).toString(10)),
        );
        result.should.be.bignumber.gte(new BigNumber('1041392685157000000000000'));
        result.should.be.bignumber.lte(new BigNumber('1041392685158000000000000'));
    });
});
