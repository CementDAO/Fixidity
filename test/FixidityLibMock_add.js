const FixidityLibMock = artifacts.require('./FixidityLibMock.sol');
const BigNumber = require('bignumber.js');
const chai = require('chai');

const { itShouldThrow } = require('./utils');
// use default BigNumber
chai.use(require('chai-bignumber')()).should();


contract('FixidityLibMock - add', () => {
    let fixidityLibMock;
    let maxFixedAdd;
    let maxInt256;
    let maxFixedSub;
    let minInt256;

    before(async () => {
        fixidityLibMock = await FixidityLibMock.deployed();
        maxFixedAdd = new BigNumber(await fixidityLibMock.maxFixedAdd());
        maxFixedSub = new BigNumber(await fixidityLibMock.maxFixedSub());
        maxInt256 = new BigNumber(await fixidityLibMock.maxInt256());
        minInt256 = new BigNumber(await fixidityLibMock.minInt256());
    });

    describe('add', () => {
        it('add(maxFixedAdd(),maxFixedAdd())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    maxFixedAdd.toString(10),
                    maxFixedAdd.toString(10),
                ),
            );
            result.should.be.bignumber.equal(maxInt256.minus(1));
        });
        itShouldThrow('add(maxFixedAdd()+1,maxFixedAdd()+1)', async () => {
            await fixidityLibMock.add(
                maxFixedAdd.plus(1).toString(10),
                maxFixedAdd.plus(1).toString(10),
            );
        }, 'revert');
        it('add(maxFixedSub(),maxFixedSub())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    maxFixedSub.toString(10),
                    maxFixedSub.toString(10),
                ),
            );
            result.should.be.bignumber.equal(minInt256);
        });
        itShouldThrow('add(maxFixedSub()-1,maxFixedSub()-1)', async () => {
            await fixidityLibMock.add(
                maxFixedSub.minus(1).toString(10),
                maxFixedSub.minus(1).toString(10),
            );
        }, 'revert');
        itShouldThrow('add(maxInt256(),maxInt256())', async () => {
            await fixidityLibMock.add(
                maxInt256.toString(10),
                maxInt256.toString(10),
            );
        }, 'revert');
        itShouldThrow('add(minInt256(),minInt256())', async () => {
            await fixidityLibMock.add(
                minInt256.toString(10),
                minInt256.toString(10),
            );
        }, 'revert');
        it('add(maxInt256(),-maxInt256())', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    maxInt256.toString(10),
                    maxInt256.multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
        it('add(minInt256()+1,-(minInt256()+1))', async () => {
            const result = new BigNumber(
                await fixidityLibMock.add(
                    minInt256.plus(1).toString(10),
                    minInt256.plus(1).multipliedBy(-1).toString(10),
                ),
            );
            result.should.be.bignumber.equal(0);
        });
    });
});
