var FixidityLib = artifacts.require("FixidityLib");
var LogarithmLib = artifacts.require("LogarithmLib");
var ExponentLib = artifacts.require("ExponentLib");
var TestContract = artifacts.require("TestContract");

module.exports = function(deployer) {

	deployer.deploy(FixidityLib)
	.then(() => deployer.link(FixidityLib, LogarithmLib))
	.then(() => deployer.deploy(LogarithmLib))
	.then(() => deployer.link(LogarithmLib, ExponentLib))
	.then(() => deployer.link(FixidityLib, ExponentLib))
	.then(() => deployer.deploy(ExponentLib))
	.then(() => {
    	deployer.link(FixidityLib, TestContract);
    	deployer.link(LogarithmLib, TestContract);
    	deployer.link(ExponentLib, TestContract);
    	return deployer.deploy(TestContract);
	});
};
