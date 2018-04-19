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
			const { value } = target;

			if (propKey === "execute") {
				return () => value;
			}

			let originalMethod = fns[propKey];
			if (!originalMethod) {
				return () => receiver;
			}

			return (...args) => {
				if (value) {
					args = [value, ...args];
				}

				return new Proxy({
					value: originalMethod.apply(this, args)
				}, handler);
			}
		}
	}

	return new Proxy({ value: undefined }, handler);
}

var c = chain({ sum, minus, double, addOne });

const result = c.sum(4, 5).invalidFunction().sum(5).minus(4).sum(7).addOne().double().double().execute(); // 72

assert.equal(result, 72);

var c1 = c.sum(1, 2);
c1.execute(); // == fns.sum(1, 2) == 3
c1.double().execute(); // == fns.double(fns.sum(1, 2)) == 6
c1.addOne().execute(); // == fns.addOne(fns.sum(1, 2)) == 4
c1.execute(); // == fns.sum(1, 2) == 3

var c2 = c1.sum(5);
c2.addOne().execute(); // == fns.addOne(fns.sum(fns.sum(1, 2) 5)) == 9
c2.sum(3).execute(); // == fns.sum(c1.sum(fns.sum(1, 2), 5), 3) == 11

assert.equal(c2.execute(), 8); // == fns.sum(fns.sum(1, 2), 5) == 8
assert.equal(c1.execute(), 3); // == fns.sum(1, 2) == 3

console.log("All tests PASSED! 👍");
