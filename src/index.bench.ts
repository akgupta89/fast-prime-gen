import { bench, describe } from 'vitest';
import { primes, primesBelow } from './index';

describe('primes throughput', () => {
  bench('generate the first 1,000 primes', () => {
    primes().take(1_000);
  });

  bench('generate the first 10,000 primes', () => {
    primes().take(10_000);
  });

  bench('reach the 100,000th prime', () => {
    primes().skip(99_999).next();
  });
});

describe('primesBelow throughput', () => {
  bench('primesBelow(100_000)', () => {
    primesBelow(100_000);
  });
});
