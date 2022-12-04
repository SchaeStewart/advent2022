import { readInput } from "../readInput.ts";

const input = await readInput("./input.txt");
// const input = await readInput("./sampleInput.txt");

const getPriority = (c: string): number => {
  const offset = c > "Z" ? 96 : 38;
  return c.charCodeAt(0) - offset;
};

const findUnion = (a: string, b: string): string => {
  const _intersection = new Set();
  const setA = new Set([...a]);
  for (const elem of new Set([...b])) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return [..._intersection.values()].join("");
};

const halve = (line: string): [string, string] => {
  return [line.slice(0, line.length / 2), line.slice(line.length / 2)];
};

const sumInventory = (input: string[]): number => {
  return input
    .map(halve)
    .map(([a, b]) => findUnion(a, b))
    .map(getPriority)
    .reduce((acc, val) => acc + val, 0);
};

const groupByThree = (input: string[]): [string, string, string][] => {
  const groups: [string, string, string][] = [];
  let current = [];
  for (let i = 0; i < input.length; i++) {
    current.push(input[i]);
    if ((i + 1) % 3 === 0) {
      groups.push([current[0], current[1], current[2]]);
      current = [];
    }
  }
  return groups;
};

const sumBadges = (input: string[]): number => {
  return groupByThree(input)
    .map(([a, b, c]) => findUnion(findUnion(a, b), c))
    .map(getPriority)
    .reduce((acc, val) => acc + val, 0);
};

console.log("Solution 1:", sumInventory(input));
console.log("Solution 2:", sumBadges(input));
