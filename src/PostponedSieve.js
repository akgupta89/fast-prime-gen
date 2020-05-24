const PostponedSieve = function*() {
  yield 2; yield 3; yield 5; yield 7;
  const sieve = new Map();
  const ps = PostponedSieve().skip(2);

  for (let p = 3, prime = 9; true; prime += 2) {
    let s = sieve.get(prime);
    if (s !== undefined) {
      sieve.delete(prime);
    } else if (prime < p * p) {
      yield prime;
      continue;
    } else {
      s = 2 * p;
      p = ps.next().value;
    }

    let k = prime + s;
    while (sieve.has(k)) k += s;
    sieve.set(k, s);
  }
};

PostponedSieve.prototype.skip = function(amount = 1) {
  if (!Number.isInteger(amount)) {
    return this;
  }
  while (amount-- > 0) {
    this.next();
  }
  return this;
};

module.exports = PostponedSieve;