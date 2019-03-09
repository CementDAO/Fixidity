const FixidityLib = artifacts.require('./FixidityLib.sol');
const LogarithmLib = artifacts.require('./LogarithmLib.sol');

module.exports = (deployer) => {
    // deploy fixidity
    deployer.deploy(FixidityLib);
    deployer.link(FixidityLib, LogarithmLib);
    // deploy logarithm
    deployer.deploy(LogarithmLib);
};
