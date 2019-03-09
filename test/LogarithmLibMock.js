const LogarithmLibMock = artifacts.require('./LogarithmLibMock.sol');

const BigNumber = require('bignumber.js');

contract('LogarithmLibMock', () => {
    let logarithmLibMock;

    before(async () => {
        logarithmLibMock = await LogarithmLibMock.deployed();
    });

    it('ln', async () => {
        const result = await logarithmLibMock.ln(5);
        console.log(result.toString(10));
    });

    it('log_b', async () => {
        const result = await logarithmLibMock.log_b(5, 2);
        console.log(result.toString(10));
    });
});
