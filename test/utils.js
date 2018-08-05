
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

function testArray(msg, data, digits, cb) {
	var pa = data.map(t => {
		it(msg + t[0], () => {
			return artifacts.require("TestContract").deployed()
			.then(instance => {
				return instance.init(digits)
				.then(() => cb(instance, t[0]))
				.then(result => assert.equal(result.valueOf(), t[1]));
			});
		});
	});
	return Promise.all(pa);
};

module.exports = {
	forInstance, expectToThrow, toFixed, testArray
}


