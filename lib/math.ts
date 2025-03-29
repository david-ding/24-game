export type Fraction = {
  numerator: number;
  denominator: number;
  isNegative?: boolean;
};

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

const simplifyFraction = (input: Fraction): number | Fraction => {
  const { numerator, denominator, isNegative } = input;

  if (numerator % denominator === 0) {
    return numerator / denominator;
  }

  const divisor = gcd(numerator, denominator);

  const finalNumerator = numerator / divisor;
  const finalDenominator = denominator / divisor;

  const isNegativeExtra =
    ((finalNumerator >= 0 && finalDenominator > 0) ||
      (finalNumerator < 0 && finalDenominator < 0)) &&
    !isNegative
      ? {}
      : { isNegative: true };

  return {
    numerator: Math.abs(finalNumerator),
    denominator: Math.abs(finalDenominator),
    ...isNegativeExtra,
  };
};

const addNumberToFraction = (a: number, b: Fraction) => {
  const nonNegativeB = coerceIntoNonNegative(b);
  const numerator = nonNegativeB.denominator * a + nonNegativeB.numerator;

  return simplifyFraction({
    numerator,
    denominator: nonNegativeB.denominator,
  });
};

const addFractionToFraction = (a: Fraction, b: Fraction) => {
  const nonNegativeA = coerceIntoNonNegative(a);
  const nonNegativeB = coerceIntoNonNegative(b);

  const lowestCommmonMultiple = lcm(
    nonNegativeA.denominator,
    nonNegativeB.denominator
  );
  const newA: Fraction = coerceIntoNonNegative({
    numerator:
      (lowestCommmonMultiple / nonNegativeA.denominator) *
      nonNegativeA.numerator,
    denominator: lowestCommmonMultiple,
  });
  const newB: Fraction = coerceIntoNonNegative({
    numerator:
      (lowestCommmonMultiple / nonNegativeB.denominator) *
      nonNegativeB.numerator,
    denominator: lowestCommmonMultiple,
  });

  return simplifyFraction({
    numerator: newA.numerator + newB.numerator,
    denominator: lowestCommmonMultiple,
  });
};

const subtractFractionFromNumber = (a: number, b: Fraction) => {
  const nonNegativeB = coerceIntoNonNegative(b);
  const numerator = nonNegativeB.denominator * a - nonNegativeB.numerator;

  return simplifyFraction({
    numerator,
    denominator: nonNegativeB.denominator,
  });
};

const subtractFractionFromFraction = (a: Fraction, b: Fraction) => {
  const nonNegativeA = coerceIntoNonNegative(a);
  const nonNegativeB = coerceIntoNonNegative(b);

  const lowestCommmonMultiple = lcm(
    nonNegativeA.denominator,
    nonNegativeB.denominator
  );
  const newA: Fraction = coerceIntoNonNegative({
    numerator:
      (lowestCommmonMultiple / nonNegativeA.denominator) *
      nonNegativeA.numerator,
    denominator: lowestCommmonMultiple,
  });
  const newB: Fraction = coerceIntoNonNegative({
    numerator:
      (lowestCommmonMultiple / nonNegativeB.denominator) *
      nonNegativeB.numerator,
    denominator: lowestCommmonMultiple,
  });

  return simplifyFraction({
    numerator: newA.numerator - newB.numerator,
    denominator: lowestCommmonMultiple,
  });
};

const multiplyNumberWithFraction = (a: number, b: Fraction) => {
  const nonNegativeB = coerceIntoNonNegative(b);
  const numerator = nonNegativeB.numerator * a;

  return simplifyFraction({
    numerator,
    denominator: nonNegativeB.denominator,
  });
};

const multiplyFractionWithFraction = (a: Fraction, b: Fraction) => {
  const nonNegativeA = coerceIntoNonNegative(a);
  const nonNegativeB = coerceIntoNonNegative(b);

  return simplifyFraction({
    numerator: nonNegativeA.numerator * nonNegativeB.numerator,
    denominator: nonNegativeA.denominator * nonNegativeB.denominator,
  });
};

export const performAddition = (a: number | Fraction, b: number | Fraction) => {
  if (typeof a === "number") {
    if (typeof b === "number") {
      return a + b;
    }
    return addNumberToFraction(a, b);
  }

  if (typeof b === "number") {
    return addNumberToFraction(b, a);
  }

  return addFractionToFraction(a, b);
};

export const performSubtraction = (
  a: number | Fraction,
  b: number | Fraction
) => {
  if (typeof a === "number") {
    if (typeof b === "number") {
      return a - b;
    }
    return subtractFractionFromNumber(a, b);
  }

  if (typeof b === "number") {
    return performMultiplication(subtractFractionFromNumber(b, a), -1);
  }

  return subtractFractionFromFraction(a, b);
};

export const performMultiplication = (
  a: number | Fraction,
  b: number | Fraction
) => {
  if (typeof a === "number") {
    if (typeof b === "number") {
      return a * b;
    }
    return multiplyNumberWithFraction(a, b);
  }

  if (typeof b === "number") {
    return multiplyNumberWithFraction(b, a);
  }

  return multiplyFractionWithFraction(a, b);
};

const coerceIntoFraction = (input: number | Fraction): Fraction => {
  if (typeof input === "object") {
    return input;
  }
  return {
    numerator: input,
    denominator: 1,
  };
};

const coerceIntoNonNegative = (input: Fraction): Fraction => {
  const { numerator, denominator, isNegative } = input;
  if (!isNegative) {
    return input;
  }
  return {
    numerator: numerator * -1,
    denominator: denominator,
    isNegative: false,
  };
};

export const performDivision = (a: number | Fraction, b: number | Fraction) => {
  const nonNegativeFractionB = coerceIntoNonNegative(coerceIntoFraction(b));
  return performMultiplication(a, {
    numerator: nonNegativeFractionB.denominator,
    denominator: nonNegativeFractionB.numerator,
  });
};

export const coerceIntoNumber = (input: number | Fraction): number => {
  if (typeof input === "number") {
    return input;
  }
  const { numerator, denominator } = input;
  return numerator / denominator;
};

export const fractionToString = (input: number | Fraction): string => {
  if (typeof input === "number") {
    return `${input}`;
  }
  const { numerator, denominator, isNegative } = input;
  return `${isNegative ? "-" : ""}${numerator}/${denominator}`;
};
