import { readInput } from "../readInput.ts";

const input = await readInput("./input.txt");
// const input = await readInput("./sampleInput.txt");

const getShape = (letter: string): string => {
  const shapes: Record<string, string> = {
    X: "ROCK",
    Y: "PAPER",
    Z: "SCISSORS",
    A: "ROCK",
    B: "PAPER",
    C: "SCISSORS",
  };
  return shapes[letter];
};

const calculateWin = (t: string, m: string): number => {
  if (t === m) {
    return 3;
  } else if (
    (t === "ROCK" && m === "SCISSORS") ||
    (t === "PAPER" && m === "ROCK") ||
    (t === "SCISSORS" && m === "PAPER")
  ) {
    return 0;
  } else {
    return 6;
  }
};

const calculateScore = (input: string): number => {
  const valueTable: Record<string, number> = {
    X: 1,
    Y: 2,
    Z: 3,
  };

  return valueTable[input[2]] + calculateWin(getShape(input[0]), getShape(input[2]));
};

const calculateScores = (
  input: string[],
  score: (arg0: string) => number
): number => input.map(score).reduce((acc, val) => acc + val, 0);

const findShape = (them: string, target: string): string => {
  if (target === "Y") {
    // draw
    return getShape(them);
  } else if (target === "X") {
    switch (getShape(them)) {
      case "ROCK":
        return "SCISSORS";
      case "PAPER":
        return "ROCK";
      case "SCISSORS":
        return "PAPER";
    }
  } else if (target === "Z") {
    switch (getShape(them)) {
      case "ROCK":
        return "PAPER";
      case "PAPER":
        return "SCISSORS";
      case "SCISSORS":
        return "ROCK";
    }
  }
  return "";
};

const calculateScore2 = (input: string): number => {
  const valueTable: Record<string, number> = {
    "ROCK": 1,
    "PAPER": 2,
    "SCISSORS": 3,
  };

	const t = getShape(input[0])
	const m = findShape(input[0], input[2]) 

  return valueTable[m] + calculateWin(t, m);
};

console.log("Solution 1:", calculateScores(input, calculateScore));
console.log("Solution 2:", calculateScores(input, calculateScore2));
