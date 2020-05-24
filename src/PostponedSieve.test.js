const PostponedSieve = require('./PostponedSieve');

describe('PostponedSieve', () => {
  let generator = PostponedSieve();
  const mockGenerator = (function*(){})();

  it("should expect the generator algorithm to exist", () => {
    expect(PostponedSieve).toBeDefined();
    expect(generator.constructor === mockGenerator.constructor).toBeTruthy();
  });

  describe("running the skip() method", function () {
    beforeEach(() => {
      generator = PostponedSieve();
    });

    it("should return a generator when given a non integer", () => {
      expect(generator.skip("bark").constructor === mockGenerator.constructor).toBeTruthy();
    });

    it("should return a generator when given a negative integer", () => {
      expect(generator.skip(-1).constructor === mockGenerator.constructor).toBeTruthy();
    });

    it("should return a generator when given an integer", () => {
      expect(generator.skip(10).constructor === mockGenerator.constructor).toBeTruthy();
    });

    it("should return 3 when ran 1 time", () => {
      expect(generator.skip(1).next().value).toBe(3);
    });

    it("should return 13 when ran 6 times", () => {
      expect(generator.skip(5).next().value).toBe(13);
    });

    it("should return 6143 when ran 801 times", () => {
      expect(generator.skip(800).next().value).toBe(6143);
    });
  });

  describe("running the next() method", () => {
    beforeEach(() => {
      generator = PostponedSieve();
    });

    it("should return 2", () => {
      expect(generator.next().value).toBe(2);
    });
    
    it("should return 541 on the 100th iteration", () => {
      for (let i = 99; i > 0; i--) {
        generator.next();
      }
      expect(generator.next().value).toBe(541);
    });

    it("shouldn't return 3", () => {
      expect(generator.next().value).not.toBe(3);
    });

    it("should return an object", () => {
      expect(generator.next() instanceof Object).toBeTruthy();
    });
  });
});