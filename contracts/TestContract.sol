pragma solidity ^0.4.24;

import "./FixidityLib.sol";
import "./ExponentLib.sol";
import "./LogarithmLib.sol";

contract TestContract {
	using FixidityLib for FixidityLib.Fixidity;
	using ExponentLib for FixidityLib.Fixidity;
	using LogarithmLib for FixidityLib.Fixidity;

	FixidityLib.Fixidity public fixidity;

	function init(uint8 digits) public {
		fixidity.init(digits);
	}

	function add(int256 a, int256 b) public view returns (int256) {
		return fixidity.add(a, b);
	}

	function subtract(int256 a, int256 b) public view returns (int256) {
		return fixidity.subtract(a, b);
	}

	function divide(int256 a, int256 b) public view returns (int256) {
		return fixidity.divide(a, b);
	}

	function multiply(int256 a, int256 b) public view returns (int256) {
		return fixidity.multiply(a, b);
	}

	function log_e(int256 input) public view returns (int256) {
		return fixidity.log_e(input);
	}

	function log_base(uint8 base, int256 input) public view returns (int256) {
		return fixidity.log_base(base, input);
	}

	function power_e(int256 input) public view returns (int256) {
		return fixidity.power_e(input);
	}

}
