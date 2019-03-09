const FixidityLib = artifacts.require('./fixidity/FixidityLib.sol');
const LogarithmLib = artifacts.require('./fixidity/LogarithmLib.sol');
const FixidityLibMock = artifacts.require('./mocks/FixidityLibMock.sol');
const LogarithmLibMock = artifacts.require('./mocks/LogarithmLibMock.sol');


module.exports = (deployer) => {
    // deploy fixidity lib
    deployer.deploy(FixidityLib);
    deployer.link(FixidityLib, FixidityLibMock);
    deployer.link(FixidityLib, LogarithmLibMock);
    // deploy logarithm lib
    deployer.deploy(LogarithmLib);
    deployer.link(LogarithmLib, LogarithmLibMock);
    // deploy fixidity lib mock
    deployer.deploy(FixidityLibMock);
    deployer.deploy(LogarithmLibMock);
};
