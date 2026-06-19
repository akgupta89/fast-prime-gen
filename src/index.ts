/**
 * Largest prime this generator can produce reliably. Beyond
 * {@link Number.MAX_SAFE_INTEGER} the integer arithmetic the sieve relies on
 * loses precision, so the generator throws instead of emitting wrong values.
 */
const MAX_SAFE = Number.MAX_SAFE_INTEGER;
const TOO_LARGE = `fast-prime-gen: primes beyond Number.MAX_SAFE_INTEGER (${MAX_SAFE}) cannot be generated reliably`;

/**
 * A never-ending generator of sequential prime numbers, augmented with
 * chainable helpers.
 */
export interface PrimeGenerator extends Generator<number, never, void> {
  /**
   * Advance the generator past `amount` primes without collecting them.
   *
   * @param amount - Number of primes to discard. Defaults to `1`. `0` is a
   *   no-op.
   * @returns The same generator, enabling fluent chaining.
   * @throws {RangeError} If `amount` is not a non-negative integer.
   */
  skip(amount?: number): this;

  /**
   * Collect the next `amount` primes into an array.
   *
   * @param amount - Number of primes to return. `0` returns an empty array.
   * @returns An array of the next `amount` primes.
   * @throws {RangeError} If `amount` is not a non-negative integer, or if
   *   generating would exceed {@link Number.MAX_SAFE_INTEGER}.
   */
  take(amount: number): number[];
}

/**
 * Create a prime generator based on Vladimir Agafonkin's postponed Sieve of
 * Eratosthenes. Primes are produced lazily, so the generator uses memory
 * proportional to the primes seen so far rather than a fixed upper bound.
 *
 * @example
 * ```ts
 * const gen = primes();
 * gen.next().value;            // 2
 * gen.skip(100).next().value;  // 547
 * gen.take(3);                 // next three primes
 * ```
 */
export function primes(): PrimeGenerator {
  const generator = primeSieve() as PrimeGenerator;

  generator.skip = function skip(amount = 1): PrimeGenerator {
    assertCount(amount, 'skip(amount)');
    for (let i = 0; i < amount; i++) {
      this.next();
    }
    return this;
  };

  generator.take = function take(amount: number): number[] {
    assertCount(amount, 'take(amount)');
    const out: number[] = [];
    for (let i = 0; i < amount; i++) {
      out.push(this.next().value);
    }
    return out;
  };

  return generator;
}

/**
 * Collect every prime strictly below `limit`.
 *
 * @param limit - Exclusive upper bound. Values `<= 2` yield an empty array.
 * @returns An ascending array of primes less than `limit`.
 * @throws {TypeError} If `limit` is not a number.
 * @throws {RangeError} If `limit` exceeds {@link Number.MAX_SAFE_INTEGER}.
 *
 * @example
 * ```ts
 * primesBelow(20); // [2, 3, 5, 7, 11, 13, 17, 19]
 * ```
 */
export function primesBelow(limit: number): number[] {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    throw new TypeError(`fast-prime-gen: primesBelow(limit) expects a number, received ${String(limit)}`);
  }
  if (limit > MAX_SAFE) {
    throw new RangeError(TOO_LARGE);
  }

  const out: number[] = [];
  for (const prime of primes()) {
    if (prime >= limit) break;
    out.push(prime);
  }
  return out;
}

function assertCount(amount: number, label: string): void {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new RangeError(
      `fast-prime-gen: ${label} must be a non-negative integer, received ${String(amount)}`,
    );
  }
}

function* primeSieve(): Generator<number, never, void> {
  yield 2;
  yield 3;
  yield 5;
  yield 7;

  // Maps the next composite to skip -> the doubled prime used to step over it.
  const composites = new Map<number, number>();
  // A second sieve supplying the "base" primes whose squares gate when each
  // prime first starts marking composites. Raw generator, no skip/take wrapper
  // needed internally — drop the first two primes (2, 3) so it starts at 5.
  const basePrimes = primeSieve();
  basePrimes.next();
  basePrimes.next();

  for (let p = 3, candidate = 9; ; candidate += 2) {
    if (candidate > MAX_SAFE) {
      throw new RangeError(TOO_LARGE);
    }

    let step = composites.get(candidate);

    if (step !== undefined) {
      composites.delete(candidate);
    } else if (candidate < p * p) {
      yield candidate;
      continue;
    } else {
      step = 2 * p;
      p = basePrimes.next().value;
    }

    let next = candidate + step;
    while (composites.has(next)) {
      next += step;
    }
    composites.set(next, step);
  }
}

export default primes;
