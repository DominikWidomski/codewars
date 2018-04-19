const assert = require('assert');

function sum(x, y) {
  return x + y;
}

function double(x) {
  return sum(x, x);
}

function minus (x, y) {
  return x - y;
}

function addOne(x) {
  return sum(x, 1);
}

function chain(fns) {
	const handler = {
		get(target, propKey, receiver) {
			// console.log('----------------------------------------------------');
			// console.log('Trying to call:', target, propKey);
			// console.dir(receiver); // WTF!??!??!?

			let { value } = target;

			if (propKey === "execute") {
				// console.log('Return value', value);
				return () => value;
			}

			let originalMethod = fns[propKey];
			if (!originalMethod) {
				// console.log('method not found in passed functions');
			}

			// if not using `this` change to ()=>{}
			return function (...args) {
				if (value) {
					args = [value, ...args];
				}

				value = originalMethod.apply(this, args);

				// Would like to avoid creating new Proxy every time
				// but not sure if viable since at each step we're creating
				// a new branch in the chain effectively
				return new Proxy({ value }, handler);
			}
		}
	}

	return new Proxy({ value: null }, handler);
}

var c = chain({ sum, minus, double, addOne });

const result = c.sum(4, 5).sum(5).minus(4).sum(7).addOne().double().double().execute(); // 72

assert(result === 72);
// console.log(result === 72 ? "PASSED" : `FAILED: ${JSON.stringify(result)}`);

//*
var c1 = c.sum(1, 2);
c1.execute(); // == fns.sum(1, 2) == 3
c1.double().execute(); // == fns.double(fns.sum(1, 2)) == 6
c1.addOne().execute(); // == fns.addOne(fns.sum(1, 2)) == 4
c1.execute(); // == fns.sum(1, 2) == 3

var c2 = c1.sum(5);
c2.addOne().execute(); // == fns.addOne(fns.sum(fns.sum(1, 2) 5)) == 9
c2.sum(3).execute(); // == fns.sum(c1.sum(fns.sum(1, 2), 5), 3) == 11
const r2 = c2.execute(); // == fns.sum(fns.sum(1, 2), 5) == 8

const r1 = c1.execute(); // == fns.sum(1, 2) == 3

assert(r2 === 8);
assert(r1 === 3);
//*/

// function traceMethodCalls(obj) {
// 	let handler = {
// 		get(target, propKey, receiver) {
// 			const originalMethod = target[propKey];
// 			return function(...args) {
// 				let result = originalMethod.apply(this, args);
// 				console.log(propKey + JSON.stringify(args) + " -> " + JSON.stringify(result));
// return result;
//             }
//         }
// 	};

// 	return new Proxy(obj, handler);
// }

console.log("All tests PASSED! 👍");

