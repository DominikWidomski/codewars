// #!/usr/bin/env node

const keypad = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  [,'0',]
];

const neighbours = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function getPosition(char) {
  for(let y = 0; y < keypad.length; ++y) {
    for(let x = 0; x < keypad[y].length; ++x) {
      if(keypad[y][x] === char) {
        return [x, y];
      }
    }
  }
}

function getNumber(x, y) {
  if(keypad[y] === undefined || keypad[y][x] === undefined) {
    return undefined;
  }

  return keypad[y][x];
}

// THIS CAN DEFINITELY BE MEMOIZED
// CAN ALSO JUST BE A PIECE OF DATA LIKE IN ANOTHER EXAMPLE
function getNeighbours(number, pos) {
  const arr = [];
  
  for(let off of neighbours) {
    const n = getNumber(pos[0] + off[0], pos[1] + off[1]);
    // console.log(number, off, '=>', n);

    arr.push(n);
  }
  
  return arr.filter(n => n !== undefined);
}

function combine(arr, it = 0, base = '') {
  if(it === arr.length) {
    return base;
  }

  return arr[it].reduce((acc, n) => {
    return acc.concat(combine(arr, it + 1, base + n));
  }, []);
}

function getPINs(observed) {
  const positions = [];
  
  for(let char of ''+observed) {
    const pos = getPosition(char);
    const n = [...getNeighbours(char, pos), char];
    // console.log('GOT NEIGHBOURS', n);
    positions.push(n.sort());
  }

  return combine(positions);
}

const arr = [['8','9'],['1','2','3']];

// function combine(arr, itA = 0, itB = 0) {
//   const out = [];
  
//   if(itA === arr.length || arr[itA] && itB === arr[itA].length) {
//     return '';
//   }
  
//   console.log(`ARGS: ${arr.length} ${itA} ${itB} ${arr[itA].length}`);
  
//   if(itB < arr[itA].length) {
//     out.push(arr[itA][itB]);
//     out.push(combine(arr, itA, itB + 1));
//   }
  
//   out.push(arr[itA][itB]);
//   out.push(combine(arr, itA + 1, itB));
  
//   return out;
// }

console.log(combine(arr));

test(getNumber(0, 0), '1');
test(getNumber(1, 0), '2');
test(getNumber(2, 1), '6');
test(getNumber(2, 2), '9');
test(getNumber(2, 3), undefined);
test(getNumber(-1, 0), undefined);
test(getNumber(1, 4), undefined);
test(getNumber(4, 0), undefined);
test(getPosition('2').join(','), '1,0');
test(getPosition('9').join(','), '2,2');
test(getPosition('0').join(','), '1,3');
test(getPosition('-1'), undefined);

//test(getPINs(2), '1,2,3,5');
//test(getPINs(9), '6,8,9');
test(getPINs(92), '');






// console.log(getPINs(process.argv[2]));

















// =============================================================================

function test(res, expected) {
  if(res === expected) {
    console.log(`PASSED: ${res} => ${expected}`);
  } else {
    console.log(`FAILED: EXPECTED: <${typeof expected}>${expected}, ACTUAL: <${typeof res}>${res}`);
  }
}