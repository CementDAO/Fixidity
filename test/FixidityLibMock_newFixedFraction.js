const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFixedFraction', () => {
    let fixidityLibMock;
    let fixed1;
    let maxFixedDiv;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        maxFixedDiv = new BigNumber(await fixidityLibMock.maxFixedDiv());
    });

    describe('newFixedFraction', () => {
        itShouldThrow(
            'newFixedFraction(maxFixedDiv()+1,1)',
            async () => {
                await fixidityLibMock
                    .newFixedFraction(maxFixedDiv.plus(1).toString(10), 1);
            },
            'revert',
        );
        itShouldThrow(
            'newFixedFraction(1,maxFixedDiv()+1)',
            async () => {
                await fixidityLibMock
                    .newFixedFraction(1, maxFixedDiv.plus(1).toString(10));
            },
            'revert',
        );
        itShouldThrow(
            'newFixedFraction(1,0)',
            async () => {
                await fixidityLibMock
                    .newFixedFraction(1, 0);
            },
            'revert',
        );
        it('newFixedFraction(0,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixedFraction(0, 1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('newFixedFraction(1,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixedFraction(1, 1),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        it('newFixedFraction(maxFixedDiv(),1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixedFraction(maxFixedDiv.toString(10), 1),
            );
            result.should.be.bignumber.equal(maxFixedDiv.multipliedBy(fixed1));
        });
        it('newFixedFraction(1,fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixedFraction(1, fixed1.toString(10)),
            );
            result.should.be.bignumber.equal(1);
        });
        itShouldThrow(
            'newFixedFraction(10, maxFixedDiv()*10)',
            async () => {
                await fixidityLibMock.newFixedFraction(
                    10,
                    maxFixedDiv.multipliedBy(10).toString(10),
                );
            },
            'revert',
        );
    });
});
