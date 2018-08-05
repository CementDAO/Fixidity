
function forInstance(cb, digits) {
	return artifacts.require("TestContract").deployed()
		.then(instance => instance.init(digits).then(() => cb(instance)));
}

function expectToThrow(cb) {
	var flag = false;
	return cb()
	.catch(() => { flag = true; return assert(true); } )
	.then(() => { if(!flag) return assert(false); });
}

function toFixed(a, digits) {
	return a * Math.pow(10, digits);
}

function compareFixedNumbers(a, b, digits, precision) {
	var t = Math.pow(10, (digits - precision));
	a = Math.round(a / t);
	b = Math.round(b / t);
	assert.equal(a, b);
}

function testArray(msg, data, digits, precision, cb) {
	var pa = data.map(t => {
		if(typeof(t[0]) == 'number') t[0] = toFixed(t[0], digits);
		else if(Array.isArray(t[0])) t[0] = t[0].map(tt => toFixed(tt, digits));
		it(msg + t[0], () => {
			return artifacts.require("TestContract").deployed()
			.then(instance => {
				return instance.init(digits)
				.then(() => cb(instance, t[0]))
				.then(result => compareFixedNumbers(result.valueOf(), t[1], digits, precision));
			});
		});
	});
	return Promise.all(pa);
};

module.exports = {
	forInstance, expectToThrow, toFixed, testArray
}
