var FixidityLib = artifacts.require("FixidityLib");
var LogarithmLib = artifacts.require("LogarithmLib");
var ExponentLib = artifacts.require("ExponentLib");

module.exports = function(deployer) {

	deployer.deploy(FixidityLib).then(() => {
		return deployer.deploy(FixidityLib).then(() => {
	    	deployer.link(FixidityLib, LogarithmLib);
	    	deployer.link(FixidityLib, ExponentLib);
	        return Promise.all([
	        	deployer.deploy(LogarithmLib),
	        	deployer.deploy(ExponentLib)
	        ]);	    	
		});
    });	
};
