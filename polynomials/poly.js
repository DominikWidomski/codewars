#!/usr/bin/env node

function sortMonomial(monomial) {
  return monomial.split('').sort().join('');
}

function sortByVariableCount(a, b) {
  return a.monomial.length > b.monomial.length;
}

function transformToken(token) {
  // coefficient < 0 ? '-' : '+'
  const sign = token.match(/^\-/) ? '-' : '+';
  let coefficient = parseFloat(token);

  if(isNaN(coefficient)) {
    coefficient = Number(`${sign}1`);
  }
  
  return {
    coefficient,
    monomial: sortMonomial(token.match(/[a-zA-Z]+/g)[0]), // can I trust this?
    toString: function() { return this.monomial }
  }
}


function simplify(poly) {
  // console.log('Input:', poly);
  const tokens = poly.match(/[^\w\d]?(?:[\w\d])+/g)
    .map(transformToken)
    .reduce((acc, token) => {
      if (acc[token.monomial]) {
//           console.log(token.monomial, acc[token.monomial].coefficient, token.coefficient);
          acc[token.monomial].coefficient += token.coefficient;
//           console.log(acc[token.monomial].coefficient);
      } else {
          acc[token.monomial] = token;
      }
      
      return acc;
    }, {});
    
//   console.log(tokens);
    
  const tokensArr = [];
  for(const key in tokens) {
    const token = tokens[key];
    tokensArr.push(token);
  }
  
  poly = tokensArr.sort() // lexicographic ordering
  .sort(sortByVariableCount)
  .reduce((acc, token) => {
    if(token.coefficient === 0) {
      return acc;
    }
      
    const sign = String(token.coefficient).match(/^\-/) ? '-' : '+';

    return acc + sign + (Math.abs(token.coefficient) === 1 ? '' : Math.abs(token.coefficient)) + token.monomial
  }, '');
  // strip leading '+'
  return poly.replace(/^\+/, '');
}

function outputProcess(label, duration) {
  var i = 0;  // dots counter
  const int = setInterval(function() {
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    i = (i + 1) % 4;
    var dots = new Array(i + 1).join(".");
    process.stdout.write(`[${label}]: Waiting ${dots}`);  // write text
  }, 300);

  setTimeout(() => {
    clearInterval(int)
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(`[${label}]: DONE`);
  }, duration);
}

function test(res, expected) {
  if(res === expected) {
    console.log(`PASSED: ${res} => ${expected}`);
  } else {
    console.log('FAILED');
  }
}

console.log('ARGS');
console.log(process.argv);
console.log('=======================');

console.log('OUTPUT');
// console.log(test(simplify(process.argv[2]), process.argv[3]);
test(simplify('-8fk+5kv-4yk+7kf-qk+yqv-3vqy+4ky+4kf+yvqkf'), '3fk-kq+5kv-2qvy+fkqvy');
console.log('=======================');
// outputProcess('Simplifying', 2000);
// setTimeout(() => outputProcess('Complexifying', 2000), 100);











