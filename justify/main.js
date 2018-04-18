/**
 * @param {String} str - inital string
 * @param {Number} len - line length
 */
var justify = function(str, len) {
  let combinedLineLength = 0;
  let line = [];
  
  function pad(items) {
    let spaceLeft = len - items.reduce((totalLength, item) => totalLength + item.length, 0);
    let nextSpace = 0;
    let out = items.shift();

    while(spaceLeft > 0 && items.length) {
      nextSpace = Math.ceil((spaceLeft -= nextSpace) / items.length);
      if(nextSpace) {
        out += ' '.repeat(nextSpace) + items.shift();
      }
    }
    
    return out;
  }

  let justified = str.split(/\s/g).reduce((reduced, token, i) => {
    if(combinedLineLength + line.length + token.length <= len) {
      combinedLineLength += token.length;
      line.push(token);
    } else {  
      reduced += pad(line) + '\n';
      
      combinedLineLength = token.length;
      line = [token];
    }
    return reduced;
  }, '');

  justified += line.join(' ');
  
  return justified.replace(/\n$/, '');
};

let text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt quae mollitia totam quidem tempora nulla pariatur dolore voluptas ipsum consequuntur velit hic, aspernatur dicta sunt, laborum iste officia repellendus eligendi too absddasd dsde b!';

// text = "tempor eget. In quis";

const n = process.argv[2] || 30;
console.log(`Justifying to ${n}`);
console.log(Array(Number(n)).fill('-').join('') + '+');
logLines(justify(text, n));

function logLines(str) {
  str.split(/\n/).forEach(line => {
    process.stdout.cursorTo(0);
    process.stdout.write(line);
    // if(line.length > n) {
      // process.stdout.write('OVER', '\n');
    // }
    process.stdout.cursorTo(n);
    process.stdout.write('|');
    process.stdout.cursorTo(n + 2);
    process.stdout.write(`(${line.length})`);
    process.stdout.write('\n');
  });
}