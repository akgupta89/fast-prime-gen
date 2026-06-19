import { beforeEach, describe, expect, it } from 'vitest';
import { type PrimeGenerator, primes, primesBelow } from './index';

const FIRST_10 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

// Reference: the first 25 primes (all primes below 100), per OEIS A000040.
const PRIMES_BELOW_100 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
];

// Reference checkpoints (the nth prime, 1-indexed), per OEIS A000040.
const NTH_PRIME: ReadonlyArray<readonly [n: number, prime: number]> = [
  [1, 2],
  [10, 29],
  [100, 541],
  [1000, 7919],
  [10000, 104729],
];

describe('primes', () => {
  let gen: PrimeGenerator;

  beforeEach(() => {
    gen = primes();
  });

  it('returns a generator', () => {
    expect(typeof gen.next).toBe('function');
    expect(typeof gen[Symbol.iterator]).toBe('function');
  });

  describe('skip()', () => {
    it('throws on a non-integer', () => {
      expect(() => gen.skip(Number.NaN)).toThrow(RangeError);
      expect(() => gen.skip('bark' as unknown as number)).toThrow(RangeError);
    });

    it('throws on a negative integer', () => {
      expect(() => gen.skip(-1)).toThrow(RangeError);
    });

    it('treats 0 as a no-op', () => {
      expect(gen.skip(0).next().value).toBe(2);
    });

    it('returns the same generator for chaining', () => {
      expect(gen.skip(10)).toBe(gen);
    });

    it('returns 3 after skipping 1', () => {
      expect(gen.skip(1).next().value).toBe(3);
    });

    it('returns 13 after skipping 5', () => {
      expect(gen.skip(5).next().value).toBe(13);
    });

    it('returns 6143 after skipping 800', () => {
      expect(gen.skip(800).next().value).toBe(6143);
    });
  });

  describe('take()', () => {
    it('throws on a non-integer', () => {
      expect(() => gen.take(Number.NaN)).toThrow(RangeError);
    });

    it('throws on a negative integer', () => {
      expect(() => gen.take(-1)).toThrow(RangeError);
    });

    it('returns an empty array for 0', () => {
      expect(gen.take(0)).toEqual([]);
    });

    it('returns the first 10 primes', () => {
      expect(gen.take(10)).toEqual(FIRST_10);
    });

    it('composes with skip', () => {
      expect(gen.skip(4).take(3)).toEqual([11, 13, 17]);
    });
  });

  describe('next()', () => {
    it('returns 2 first', () => {
      expect(gen.next().value).toBe(2);
    });

    it('does not return 3 first', () => {
      expect(gen.next().value).not.toBe(3);
    });

    it('returns an iterator result object', () => {
      expect(gen.next()).toMatchObject({ value: expect.any(Number), done: false });
    });

    it('returns 541 on the 100th iteration', () => {
      for (let i = 1; i < 100; i++) {
        gen.next();
      }
      expect(gen.next().value).toBe(541);
    });
  });

  it('yields the first primes in order when iterated', () => {
    expect(primes().take(10)).toEqual(FIRST_10);
  });

  it('matches the reference list of the first 25 primes', () => {
    expect(primes().take(PRIMES_BELOW_100.length)).toEqual(PRIMES_BELOW_100);
  });

  it.each(NTH_PRIME)('returns %i -> the nth prime %i', (n, expected) => {
    expect(
      primes()
        .skip(n - 1)
        .next().value,
    ).toBe(expected);
  });

  it('produces only genuine primes (property check over 2000 outputs)', () => {
    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) return false;
      }
      return true;
    };
    let previous = 0;
    for (const prime of primes().take(2000)) {
      expect(isPrime(prime)).toBe(true);
      expect(prime).toBeGreaterThan(previous); // strictly ascending, no gaps repeated
      previous = prime;
    }
  });
});

describe('primesBelow', () => {
  it('throws on a non-number', () => {
    expect(() => primesBelow('100' as unknown as number)).toThrow(TypeError);
    expect(() => primesBelow(Number.NaN)).toThrow(TypeError);
  });

  it('throws when the limit exceeds Number.MAX_SAFE_INTEGER', () => {
    expect(() => primesBelow(Number.MAX_SAFE_INTEGER + 2)).toThrow(RangeError);
  });

  it('returns an empty array for limits at or below 2', () => {
    expect(primesBelow(2)).toEqual([]);
    expect(primesBelow(0)).toEqual([]);
    expect(primesBelow(-5)).toEqual([]);
  });

  it('is an exclusive bound', () => {
    expect(primesBelow(7)).toEqual([2, 3, 5]);
    expect(primesBelow(8)).toEqual([2, 3, 5, 7]);
  });

  it('returns every prime below 30', () => {
    expect(primesBelow(30)).toEqual(FIRST_10);
  });
});
