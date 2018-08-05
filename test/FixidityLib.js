var utils = require('./utils');

const digits = 3;

describe('FixidityLib.add', () => {
	var data = [
		[ [3, 4], 7000 ],
		[ [3, -4], -1000 ],
		[ [-3, 4], 1000 ],
		[ [3.123, 4.789], 7912 ]
	];
	utils.testArray('', data, digits, (instance, t) => {
		return instance.add.call(utils.toFixed(t[0], digits), utils.toFixed(t[1], digits));
	});
});

