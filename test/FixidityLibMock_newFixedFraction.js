const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('../../utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - newFixedFraction', () => {
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

    describe('newFixedFraction', () => {
        itShouldThrow(
            'newFixedFraction(max_fixed_div()+1,1)',
            async () => {
                await fixidityLibMock
                    .newFixedFraction(max_fixed_div.plus(1).toString(10), 1);
            },
            'revert',
        );
        itShouldThrow(
            'newFixedFraction(1,max_fixed_div()+1)',
            async () => {
                await fixidityLibMock
                    .newFixedFraction(1, max_fixed_div.plus(1).toString(10));
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
            result.should.be.bignumber.equal(fixed_1);
        });
        it('newFixedFraction(max_fixed_div(),1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixedFraction(max_fixed_div.toString(10), 1),
            );
            result.should.be.bignumber.equal(max_fixed_div.multipliedBy(fixed_1));
        });
        itShouldThrow(
            'newFixedFraction(1,fixed_1())',
            async () => {
                await fixidityLibMock
                    .newFixedFraction(1, 0);
            },
            'revert',
        );
        /* it('newFixedFraction(100,fixed_1())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixedFraction(1, fixed_1.toString(10)),
            );
            console.log(result.toString(10));
            assert.equal(result.comparedTo(new BigNumber(1)), 0, 'should be one!');
        }); */
        /* it('newFixedFraction(10,fixed_1()+1)', async () => {
            const result = new BigNumber(
                await fixidityLibMock.newFixedFraction(1, fixed_1.plus(1).toString(10)),
            );
            result.should.be.bignumber.equal(0);
        }); */
    });
});
