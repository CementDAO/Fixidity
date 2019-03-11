const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFromInt256Fraction', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed1;
    // eslint-disable-next-line camelcase
    let maxFixedDiv;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed1 = new BigNumber(await fixidityLibMock.fixed1());
        // eslint-disable-next-line camelcase
        maxFixedDiv = new BigNumber(await fixidityLibMock.maxFixedDiv());
    });

    describe('newFromInt256Fraction', () => {
        itShouldThrow(
            'newFromInt256Fraction(maxFixedDiv()+1,1)',
            async () => {
                await fixidityLibMock
                    .newFromInt256Fraction(maxFixedDiv.plus(1).toString(10), 1);
            },
            'revert',
        );
        itShouldThrow(
            'newFromInt256Fraction(1,maxFixedDiv()+1)',
            async () => {
                await fixidityLibMock
                    .newFromInt256Fraction(1, maxFixedDiv.plus(1).toString(10));
            },
            'revert',
        );
        itShouldThrow(
            'newFromInt256Fraction(1,0)',
            async () => {
                await fixidityLibMock
                    .newFromInt256Fraction(1, 0);
            },
            'revert',
        );
        it('newFromInt256Fraction(0,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(0, 1),
            );
            result.should.be.bignumber.equal(0);
        });
        it('newFromInt256Fraction(1,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(1, 1),
            );
            result.should.be.bignumber.equal(fixed1);
        });
        it('newFromInt256Fraction(maxFixedDiv(),1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(maxFixedDiv.toString(10), 1),
            );
            result.should.be.bignumber.equal(maxFixedDiv.multipliedBy(fixed1));
        });
        /* it('newFromInt256Fraction(100,fixed1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(1, fixed1.toString(10)),
            );
            console.log(result.toString(10));
            assert.equal(result.comparedTo(new BigNumber(1)), 0, 'should be one!');
        }); */
        it('newFromInt256Fraction(10,fixed1()+1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(1, fixed1.plus(1).toString(10)),
            );
            result.should.be.bignumber.equal(0);
        });
    });
});
