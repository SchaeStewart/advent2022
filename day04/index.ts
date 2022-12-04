import { readInput } from "../readInput.ts";

const input = await readInput("./input.txt");
// const input = await readInput("./sampleInput.txt");

const isContainedBy = (a: [number, number], b: [number, number]): boolean => {
  return a[0] <= b[0] && a[1] >= b[1];
};

const parse = (line: string): [[number, number], [number, number]] => {
  const [aRaw, bRaw] = line.split(",");
  const [a1, a2] = aRaw.split("-").map((n) => parseInt(n));
  const [b1, b2] = bRaw.split("-").map((n) => parseInt(n));

  return [
    [a1, a2],
    [b1, b2],
  ];
};

const isOverlappedBy = (a: [number, number], b: [number, number]): boolean => {
  return (a[0] >= b[0] && a[0] <= b[1]) || (a[1] >= b[0] && a[1] <= b[1]);
};

const countOverlaps = (input: string[]): number => {
  return input
    .map(parse)
    .filter(([a, b]) => isContainedBy(a, b) || isContainedBy(b, a)).length;
};


const countAnyOverlap = (input: string[]): number => {
  return input
    .map(parse)
    .filter(([a, b]) => isOverlappedBy(a, b) || isOverlappedBy(b, a)).length;
};

console.log("Solution 1:", countOverlaps(input));
console.log("Solution 2:", countAnyOverlap(input));
