const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - variables', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
    });

    it('fixed_1', async () => {
        assert.equal(fixed_1.comparedTo(new BigNumber('1000000000000000000000000000000000000')), 0, '');
    });
});
