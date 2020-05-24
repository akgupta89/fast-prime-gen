# Fast Prime Gen
A NodeJS/JavaScript package to generate prime numbers fast and efficiently

## Overview

Fast Prime Gen generates prime numbers procedurally on the fly. Instead of using a pre-generated list, this tool will spit out the next prime number using an algorithm based on [Vladmir Agafonkin](https://beta.observablehq.com/@mourner/fast-prime-generator)'s work.

## How To Use
Install the Package
```sh
npm install fast-prime-gen
```

## Examples
Initialize the Generator
```js
const PostponedSieve = require('fast-prime-gen'); 

const generator = PostponedSieve();
```

Run the generator one time
```js
console.log(generator.next().value);
```

Run the generator multiple times
```js
console.log(generator.next().next().next().value);
```

Skip entries
```js
console.log(generator.skip(100).next().value);
```