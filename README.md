<div align="center">

# 🔢 Fast Prime Gen

**Generate sequential prime numbers, lazily and forever.**

[![npm](https://img.shields.io/npm/v/fast-prime-gen.svg)](https://www.npmjs.com/package/fast-prime-gen)
[![types](https://img.shields.io/npm/types/fast-prime-gen.svg)](https://www.npmjs.com/package/fast-prime-gen)
[![license](https://img.shields.io/npm/l/fast-prime-gen.svg)](./LICENSE)

</div>

---

A tiny, dependency-free package that streams prime numbers on demand. Instead of
precomputing a list, it yields the next prime using a **postponed Sieve of
Eratosthenes** (based on [Vladimir Agafonkin](https://observablehq.com/@mourner/fast-prime-generator)'s
work) — so memory grows with the primes you've actually seen, not a fixed upper bound.

- 🪶 **Zero dependencies**
- ♾️ **Lazy & infinite** — pull one prime or a million
- 🧩 **Standard generator** — works with `for…of`, spread, destructuring
- 🔒 **Typed** — ships `.d.ts`, with ESM **and** CommonJS builds

## Install

```sh
npm install fast-prime-gen
```

## Quick start

```ts
import { primes } from 'fast-prime-gen';

const gen = primes();

gen.next().value;  // 2
gen.next().value;  // 3
gen.take(3);       // [5, 7, 11]  → continues from where you left off

primes().skip(100).next().value; // 547  → fresh generator, jump ahead
```

<details>
<summary>CommonJS</summary>

```js
const { primes } = require('fast-prime-gen');

console.log(primes().take(5)); // [2, 3, 5, 7, 11]
```
</details>

Because it's a plain generator, it drops into any iterable context:

```ts
for (const p of primes()) {
  if (p > 50) break;
  console.log(p); // 2, 3, 5, 7, … 47
}
```

## API

### `primes(): PrimeGenerator`

A lazy, never-ending generator of sequential primes, plus the chainable helpers below.

### `.skip(amount = 1)`

Advances past `amount` primes and returns the same generator for chaining. `0` is a no-op.

```ts
primes().skip(100).next().value; // 547
```

> ⚠️ Throws `RangeError` if `amount` isn't a non-negative integer.

### `.take(amount): number[]`

Collects the next `amount` primes into an array. Composes with `.skip()`.

```ts
primes().take(5);         // [2, 3, 5, 7, 11]
primes().skip(4).take(3); // [11, 13, 17]
```

> ⚠️ Throws `RangeError` if `amount` isn't a non-negative integer.

### `primesBelow(limit): number[]`

Every prime strictly below `limit` (exclusive bound).

```ts
primesBelow(20); // [2, 3, 5, 7, 11, 13, 17, 19]
```

> ⚠️ Throws `TypeError` for a non-number, or `RangeError` if `limit > Number.MAX_SAFE_INTEGER`.

## Limits

Primes use JavaScript `number` arithmetic, exact only up to `Number.MAX_SAFE_INTEGER`
(2⁵³ − 1). Past that point the generator **throws a `RangeError`** rather than silently
emit wrong values. Larger primes would need a `bigint` variant (not currently provided).

## Migrating from 1.x

| 1.x | 2.x |
| --- | --- |
| `const PostponedSieve = require('fast-prime-gen')` | `const { primes } = require('fast-prime-gen')` |
| JavaScript source, no types | TypeScript source, ships `.d.ts` |
| `skip()` silently ignored bad input | `skip()` **throws** on non-integer / negative |
| `skip()` only | added `take()` and `primesBelow()` |
| wrong values past 2⁵³ | **throws** past `Number.MAX_SAFE_INTEGER` |

## Development

```sh
npm install
npm test          # Vitest suite
npm run bench     # benchmarks
npm run lint      # Biome lint + format check  (lint:fix to auto-fix)
npm run typecheck # tsc --noEmit
npm run build     # dist/ → ESM + CJS + .d.ts  (tsup)
```

## License

[MIT](./LICENSE)
