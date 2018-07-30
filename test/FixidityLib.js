
function forInstance(msg, cb) {
	return it(msg, () => artifacts.require("FixidityLib").deployed().then(cb));
}

function expectToThrow(cb) {
	var flag = false;
	return cb()
	.catch(() => { flag = true; return assert(true); } )
	.then(() => { if(!flag) return assert(false); });
}

forInstance('FixidityLib', (instance) => {
});
