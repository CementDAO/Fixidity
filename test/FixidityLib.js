var utils = require('./utils');

describe('FixidityLib.add', () => {
	var data = [
		[ [3, 4], 7000 ],
		[ [3, -4], -1000 ],
		[ [-3, 4], 1000 ],
		[ [3.123, 4.789], 7912 ]
	];
	utils.testArray('', data, 3, 3, (instance, t) => {
		return instance.add.call(t[0], t[1]);
	});
});
