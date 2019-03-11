const BigNumber = require('bignumber.js');

const itShouldThrow = (reason, fun, expectedMessage) => {
    it(reason, async () => {
        let error = false;
        try {
            await Promise.resolve(fun()).catch((e) => {
                error = e;
            });
        } catch (e) {
            error = e;
        }

        // No error was returned or raised - make the test fail plain and simple.
        if (!error) {
            assert.ok(false, 'expected to throw, did not');
        }

        // No exception message was provided, we'll only test against the important VM ones.
        if (expectedMessage === undefined) {
            assert.match(
                error.message,
                /invalid JUMP|invalid opcode|out of gas|The contract code couldn't be stored, please check your gas amount/,
            );
        // An expected exception message was passed - match it.
        } else if (error.message.length > 0) {
            // Get the error message from require method within the contract
            const errorReason = error.message.match('Reason given: (.*)\\.');
            // If there's no message error provided, check for default errors
            if (errorReason === null) {
                assert.ok(
                    error.message.indexOf(expectedMessage) >= 0,
                    'threw the wrong exception type',
                );
            } else {
                assert.equal(
                    expectedMessage,
                    errorReason[1],
                    'threw the wrong exception type',
                );
            }
        // In case that nothing matches!
        } else {
            assert.ok(false, `something went wrong with asserts. Given error ${error}`);
        }
    });
};

const tokenNumber = (decimals, tokens) => new BigNumber(10)
    .pow(decimals)
    .multipliedBy(tokens)
    .toString(10);

// Utils.js for Gadi's tests
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
    itShouldThrow,
	tokenNumber,
	forInstance, 
	expectToThrow, 
	toFixed, 
	testArray
};