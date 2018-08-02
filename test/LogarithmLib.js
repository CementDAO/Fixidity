
const digits = 16;


function forInstance(msg, cb) {
	return it(msg, () => artifacts.require("TestContract").deployed()
		.then((instance) => {
			return instance.init(digits).then(() => cb(instance));
		})
	);
}

function expectToThrow(cb) {
	var flag = false;
	return cb()
	.catch(() => { flag = true; return assert(true); } )
	.then(() => { if(!flag) return assert(false); });
}

function toFixed(a) {
	return Math.round(a * Math.pow(10, digits));
}

function compareNumbers(value, expected) {
	//console.log(value + (value == expected ? ' = ' : ' != ') + expected);
	assert.equal(value, expected);
}

var data = [
	[ 1, 0 ],
	[ 2, 6931471805599453 ],
	[ 1.1, 953101798043249 ],
	[ 1.2, 1823215567939546 ],
//	[ 1.333333, 2876818224517497 ],          TODO: fix rouding error in this test case
	[ 1.48763547, 3971879265597280 ],
	[ 0.000001, -138155105579642741 ],
	[ 0.1, -23025850929940457 ],
	[ 0.2, -16094379124341004 ],
	[ 0.4, -9162907318741551 ],
	[ 0.6, -5108256237659907 ],
	[ 0.7, -3566749439387324 ],
	[ 0.8, -2231435513142098 ],
	[ 1.9, 6418538861723948 ],
	[ 1.99, 6881346387364010 ],
	[ 1.9999, 6930971793099036 ],
	[ 1.99999999, 6931471755599453 ],
	[ 2, 6931471805599453 ],
	[ 57, 40430512678345502 ],
	[ 148, 49972122737641151 ],
	[ 19283765, 167747741081649877 ]
];
var p = Promise.resolve();
data.forEach(t => {
	p = p.then(() => {
		return forInstance('FixidityLib log_e: ' + t[0], instance => {
			instance.log_e.call(toFixed(  t[0] ))
				.then(result => compareNumbers(result.valueOf(), t[1] ));
		});
	});
});
