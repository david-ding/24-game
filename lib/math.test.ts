import {
  Fraction,
  performAddition,
  performDivision,
  performMultiplication,
  performSubtraction,
} from "./math";

describe("math utils", () => {
  describe("performAddition", () => {
    describe("when adding 2 numbers", () => {
      it("should return the correct result", () => {
        expect(performAddition(2, 5)).toBe(7);
      });
    });

    describe("when adding a number to a fraction", () => {
      it("should return the correct result", () => {
        const a = 3;
        const b: Fraction = {
          numerator: 3,
          denominator: 7,
        };
        const answer: Fraction = {
          numerator: 24,
          denominator: 7,
        };

        expect(performAddition(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        it("should return the correct result", () => {
          const a = -3;
          const b: Fraction = {
            numerator: 3,
            denominator: 7,
          };
          const answer: Fraction = {
            numerator: 18,
            denominator: 7,
            isNegative: true,
          };

          expect(performAddition(a, b)).toEqual(answer);
        });

        it("should return the correct result", () => {
          const a = 3;
          const b: Fraction = {
            numerator: 3,
            denominator: 7,
            isNegative: true,
          };
          const answer: Fraction = {
            numerator: 18,
            denominator: 7,
          };

          expect(performAddition(a, b)).toEqual(answer);
        });
      });
    });

    describe("when adding a fraction to a fraction", () => {
      it("should return the correct result", () => {
        const a: Fraction = {
          numerator: 5,
          denominator: 6,
        };

        const b: Fraction = {
          numerator: 2,
          denominator: 3,
        };
        const answer: Fraction = {
          numerator: 3,
          denominator: 2,
        };

        expect(performAddition(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        it("should return the correct result", () => {
          const a: Fraction = {
            numerator: 5,
            denominator: 6,
            isNegative: true,
          };

          const b: Fraction = {
            numerator: 2,
            denominator: 3,
            isNegative: true,
          };
          const answer: Fraction = {
            numerator: 3,
            denominator: 2,
            isNegative: true,
          };

          expect(performAddition(a, b)).toEqual(answer);
        });
      });
    });
  });

  describe("performSubtraction", () => {
    describe("when subtracting 2 numbers", () => {
      it("should return the correct result", () => {
        expect(performSubtraction(2, 5)).toBe(-3);
      });
    });

    describe("when subtracting a number from a fraction", () => {
      it("should return the correct result", () => {
        const a: Fraction = {
          numerator: 48,
          denominator: 7,
        };
        const b = 3;
        const answer: Fraction = {
          numerator: 27,
          denominator: 7,
        };

        expect(performSubtraction(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        it("should return the correct result", () => {
          const a: Fraction = {
            numerator: 3,
            denominator: 7,
          };
          const b = 3;
          const answer: Fraction = {
            numerator: 18,
            denominator: 7,
            isNegative: true,
          };

          expect(performSubtraction(a, b)).toEqual(answer);
        });
      });
    });

    describe("when subtracting a fraction from a number", () => {
      it("should return the correct result", () => {
        const a = 7;
        const b: Fraction = {
          numerator: 7,
          denominator: 3,
        };
        const answer: Fraction = {
          numerator: 14,
          denominator: 3,
        };

        expect(performSubtraction(a, b)).toEqual(answer);
      });
    });

    describe("when subtracting a fraction from a fraction", () => {
      it("should return the correct result", () => {
        const a: Fraction = {
          numerator: 5,
          denominator: 6,
        };

        const b: Fraction = {
          numerator: 2,
          denominator: 3,
        };
        const answer: Fraction = {
          numerator: 1,
          denominator: 6,
        };

        expect(performSubtraction(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        const a: Fraction = {
          numerator: 2,
          denominator: 3,
        };
        const b: Fraction = {
          numerator: 5,
          denominator: 6,
        };

        const answer: Fraction = {
          numerator: 1,
          denominator: 6,
          isNegative: true,
        };

        expect(performSubtraction(a, b)).toEqual(answer);
      });
    });
  });

  describe("performMultiplication", () => {
    describe("when multiplying 2 numbers", () => {
      it("should return the correct result", () => {
        expect(performMultiplication(2, 5)).toBe(10);
      });
    });

    describe("when multiplying a number with a fraction", () => {
      it("should return the correct result", () => {
        const a = 3;
        const b: Fraction = {
          numerator: 3,
          denominator: 7,
        };
        const answer: Fraction = {
          numerator: 9,
          denominator: 7,
        };

        expect(performMultiplication(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        it("should return the correct result", () => {
          const a = -3;
          const b: Fraction = {
            numerator: 3,
            denominator: 7,
          };
          const answer: Fraction = {
            numerator: 9,
            denominator: 7,
            isNegative: true,
          };

          expect(performMultiplication(a, b)).toEqual(answer);
        });

        it("should return the correct result", () => {
          const a = 3;
          const b: Fraction = {
            numerator: 3,
            denominator: 7,
            isNegative: true,
          };
          const answer: Fraction = {
            numerator: 9,
            denominator: 7,
            isNegative: true,
          };

          expect(performMultiplication(a, b)).toEqual(answer);
        });
      });
    });

    describe("when multiplying a fraction with a fraction", () => {
      it("should return the correct result", () => {
        const a: Fraction = {
          numerator: 5,
          denominator: 6,
        };

        const b: Fraction = {
          numerator: 2,
          denominator: 3,
        };
        const answer: Fraction = {
          numerator: 5,
          denominator: 9,
        };

        expect(performMultiplication(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        it("should return the correct result", () => {
          const a: Fraction = {
            numerator: 5,
            denominator: 6,
            isNegative: true,
          };

          const b: Fraction = {
            numerator: 2,
            denominator: 3,
            isNegative: true,
          };
          const answer: Fraction = {
            numerator: 5,
            denominator: 9,
          };

          expect(performMultiplication(a, b)).toEqual(answer);
        });
      });
    });
  });

  describe("performDivision", () => {
    describe("when dividing 2 numbers", () => {
      it("should return the correct result", () => {
        expect(performDivision(2, 5)).toEqual({
          numerator: 2,
          denominator: 5,
        } as Fraction);
      });
    });

    describe("when dividing a number with a fraction", () => {
      it("should return the correct result", () => {
        const a = 3;
        const b: Fraction = {
          numerator: 3,
          denominator: 7,
        };
        const answer = 7;

        expect(performDivision(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        it("should return the correct result", () => {
          const a = -3;
          const b: Fraction = {
            numerator: 3,
            denominator: 7,
          };
          const answer = -7;

          expect(performDivision(a, b)).toEqual(answer);
        });
      });
    });

    describe("when dividing a fraction with a fraction", () => {
      it("should return the correct result", () => {
        const a: Fraction = {
          numerator: 5,
          denominator: 6,
        };

        const b: Fraction = {
          numerator: 2,
          denominator: 3,
        };
        const answer: Fraction = {
          numerator: 5,
          denominator: 4,
        };

        expect(performDivision(a, b)).toEqual(answer);
      });

      describe("negative", () => {
        it("should return the correct result", () => {
          const a: Fraction = {
            numerator: 5,
            denominator: 6,
            isNegative: true,
          };

          const b: Fraction = {
            numerator: 2,
            denominator: 3,
          };
          const answer: Fraction = {
            numerator: 5,
            denominator: 4,
            isNegative: true,
          };

          expect(performDivision(a, b)).toEqual(answer);
        });
      });
    });
  });
});
