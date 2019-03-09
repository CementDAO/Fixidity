const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFromInt256Fraction', () => {
    let fixidityLibMock;
    // eslint-disable-next-line camelcase
    let fixed_1;
    // eslint-disable-next-line camelcase
    let max_fixed_div;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        // eslint-disable-next-line camelcase
        fixed_1 = new BigNumber(await fixidityLibMock.fixed_1());
        // eslint-disable-next-line camelcase
        max_fixed_div = new BigNumber(await fixidityLibMock.max_fixed_div());
    });

    describe('newFromInt256Fraction', () => {
        itShouldThrow(
            'newFromInt256Fraction(max_fixed_div()+1,1)',
            async () => {
                await fixidityLibMock
                    .newFromInt256Fraction(max_fixed_div.plus(1).toString(10), 1);
            },
            'revert',
        );
        itShouldThrow(
            'newFromInt256Fraction(1,max_fixed_div()+1)',
            async () => {
                await fixidityLibMock
                    .newFromInt256Fraction(1, max_fixed_div.plus(1).toString(10));
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
            assert.equal(result.comparedTo(new BigNumber(0)), 0, 'should be zero!');
        });
        it('newFromInt256Fraction(1,1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(1, 1),
            );
            assert.equal(result.comparedTo(fixed_1), 0, 'should be fixed_1!');
        });
        it('newFromInt256Fraction(max_fixed_div(),1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(max_fixed_div.toString(10), 1),
            );
            assert.equal(result.comparedTo(max_fixed_div.multipliedBy(fixed_1)), 0, 'should be max_fixed_div!');
        });
        /* it('newFromInt256Fraction(100,fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(1, fixed_1.toString(10)),
            );
            console.log(result.toString(10));
            assert.equal(result.comparedTo(new BigNumber(1)), 0, 'should be one!');
        }); */
        it('newFromInt256Fraction(10,fixed_1()+1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFromInt256Fraction(1, fixed_1.plus(1).toString(10)),
            );
            assert.equal(result.comparedTo(new BigNumber(0)), 0, 'should be zero!');
        });
    });
});
