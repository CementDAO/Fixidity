const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFixed', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let max_int256;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        max_int256 = new BigNumber(await fixidityLibMock.max_int256());
    });

    describe('convertFixed', () => {
        it('convertFixed(1,0,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1, 0, 0),
            );
            result.should.be.bignumber.equal(1);
        });
        it('convertFixed(1,1,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1, 1, 1),
            );
            result.should.be.bignumber.equal(1);
        });
        it('convertFixed(1,1,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1, 1, 0),
            );
            result.should.be.bignumber.equal(0);
        });
        it('convertFixed(1,0,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1, 0, 1),
            );
            result.should.be.bignumber.equal(10);
        });
        it('convertFixed(10,1,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(10, 1, 0),
            );
            result.should.be.bignumber.equal(1);
        });
        it('convertFixed(10,0,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(10, 0, 1),
            );
            result.should.be.bignumber.equal(100);
        });
        it('convertFixed(100,1,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(100, 1, 0),
            );
            result.should.be.bignumber.equal(10);
        });
        it('convertFixed(100,0,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(100, 0, 1),
            );
            result.should.be.bignumber.equal(1000);
        });
        it('convertFixed(1000,2,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1000, 2, 0),
            );
            result.should.be.bignumber.equal(10);
        });
        it('convertFixed(1000,0,2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1000, 0, 2),
            );
            result.should.be.bignumber.equal(100000);
        });
        it('convertFixed(1000,2,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1000, 2, 1),
            );
            result.should.be.bignumber.equal(100);
        });
        it('convertFixed(1000,1,2)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1000, 1, 2),
            );
            result.should.be.bignumber.equal(10000);
        });
        it('convertFixed(max_int256,1,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(max_int256.toString(10), 1, 0),
            );
            result.should.be.bignumber.equal(max_int256.dividedBy(10).dp(0, 1));
        });
        it('convertFixed(max_int256,38,0)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(max_int256.toString(10), 38, 0),
            );
            result.should.be.bignumber.equal(
                max_int256.dividedBy((new BigNumber(10).pow(38))).dp(0, 1),
            );
        });
        it('convertFixed(1,0,38)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(1, 0, 38),
            );
            result.should.be.bignumber.equal(new BigNumber(10).pow(38));
        });
        it('convertFixed(10**38,0,38)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(
                    new BigNumber(10).pow(38).toString(10), 0, 38,
                ),
            );
            result.should.be.bignumber.equal(new BigNumber(10).pow(76));
        });
        it('convertFixed(-1*10**38,0,38)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.convertFixed(
                    new BigNumber(10).pow(38).multipliedBy(-1).toString(10), 0, 38,
                ),
            );
            result.should.be.bignumber.equal(new BigNumber(10).pow(76).multipliedBy(-1));
        });
        itShouldThrow(
            'convertFixed(max_int256,0,1)',
            async () => {
                await fixidityLibMock
                    .convertFixed(max_int256.toString(10), 0, 1);
            },
            'revert',
        );
        itShouldThrow(
            'convertFixed(max_int256,39,0)',
            async () => {
                await fixidityLibMock
                    .convertFixed(max_int256.toString(10), 39, 0);
            },
            'revert',
        );
        itShouldThrow(
            'convertFixed(1,0,39)',
            async () => {
                await fixidityLibMock.convertFixed(1, 0, 39);
            },
            'revert',
        );
    });
});
