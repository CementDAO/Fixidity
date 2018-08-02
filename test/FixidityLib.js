
function forInstance(msg, cb) {
	return it(msg, () => artifacts.require("TestContract").deployed().then(cb));
}

function expectToThrow(cb) {
	var flag = false;
	return cb()
	.catch(() => { flag = true; return assert(true); } )
	.then(() => { if(!flag) return assert(false); });
}

function toFixed(a) {
	return a * 1000000000000000000;
}

function compareNumbers(fixed, float, msg) {
	console.log('' + msg + '   =>  ' + fixed + '   ' + float);
	var a = Math.round(fixed / 100);
	var b = Math.round(float * 10000000000);
	return assert.equal(a, b, msg);
}

forInstance('FixidityLib add', (instance) => {
	return instance.init(18)
		.then(() => instance.add.call(toFixed(3), toFixed(4)))
		.then((result) => assert.equal(result.valueOf(), toFixed(7), 'add two numbers'))
		.then(() => instance.add.call(toFixed(3), toFixed(-4)))
		.then((result) => assert.equal(result.valueOf(), toFixed(-1), 'add two numbers, one negative'))
		.then(() => instance.add.call(toFixed(-3), toFixed(-4)))
		.then((result) => assert.equal(result.valueOf(), toFixed(-7), 'add two numbers, both negative'));
});

forInstance('FixidityLib log_e', (instance) => {
	return instance.init(18)
		.then(() => instance.add.call(toFixed(3), toFixed(4)))
		.then((result) => assert.equal(result.valueOf(), toFixed(7), 'add two numbers'))
		.then(() => instance.add.call(toFixed(3), toFixed(-4)))
		.then((result) => assert.equal(result.valueOf(), toFixed(-1), 'add two numbers, one negative'))
		.then(() => instance.add.call(toFixed(-3), toFixed(-4)))
		.then((result) => assert.equal(result.valueOf(), toFixed(-7), 'add two numbers, both negative'));
});

