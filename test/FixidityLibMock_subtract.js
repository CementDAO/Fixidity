const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
// const BigNumber = require('bignumber.js');
const chai = require('chai');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - subtract', () => {
    let fixidityLibMock;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
    });

    describe('subtract', () => {
        it('subtract', async () => {
            await fixidityLibMock.subtract(4, 2);
        });
    });
});
