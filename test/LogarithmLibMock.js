const LogarithmLibMock = artifacts.require('./LogarithmLibMock.sol');

const BigNumber = require('bignumber.js');

contract('LogarithmLibMock', () => {
    let logarithmLibMock;

    before(async () => {
        logarithmLibMock = await LogarithmLibMock.deployed();
    });

    it('log_e', async () => {
        const result = await logarithmLibMock.log_e(5);
        console.log(result.toString(10));
    });

    it('log_any', async () => {
        const result = await logarithmLibMock.log_any(5, 2);
        console.log(result.toString(10));
    });
});
