/**
 * Problem is to reverse an array, without using `reverse` of course, in the least characters possible.
 * 28 more specifically.
 *
 * And yes, that's including the annoying long function name, whatever.
 */

let weirdReverse;

/**
 * Solution 1
 */

weirdReverse=a=>([...a]).map(_=>a.pop()); // 40

/**
 * I like that this one used `...` to clone the array
 * which was required to iterate over an array
 * that is not modified as we pop off the original.
 * It's not cool that we're destroying the argument passed in :(
 *
 * Below, an even nicer version of it. Thanks @alexcanessa.
 * I forgot `map` takes 2nd argument to use as context for the callback.
 * Nice.
 */

weirdReverse=a=>([...a]).map(a.pop,a); // 37

/**
 * Solution 2
 * 
 * Recursion, named a separate function for this case only :)
 */

const turn = weirdReverse = ([head, ...tail]) => tail[0] ? [...turn(tail), head] : [head];
// minimised, getting rid of the function name, using shorter name for recursive call
f=([h,...t])=>t[0]?[...f(t),h]:[h]; // 34

/**
 * I like this because it's using the rest/spread and a recursive call
 * It's functional programming
 * With no Array functions
 */

/**
 * Solution 3
 *
 * ... stupidly simple -_-
 */

weirdReverse=a=>a.sort(_=>1) // 28 ✅

/**
 * Uses the fact that `Array.sort` expects number value to indicate how to sort relative elements.
 * Which I always forget, it's kind of a weird API to me, but I get it, fine.
 * 
 * One problem, it still modifies the array D:
 * 
 * It's probably more obvious than 1st solution, and much more readable than 2nd one,
 * but in my opinion not nearly as cool :P
 */
