import { readInput } from "../readInput.ts";

const parseInput = (input: string[]): number[][] =>
  input.map((line) => line.split("").map((c) => parseInt(c)));

const input = parseInput(await readInput("./input.txt"));
// const input = parseInput(await readInput("./sampleInput.txt"));

type Neighbors = {
  left: number[];
  right: number[];
  top: number[];
  bottom: number[];
};

const getNeighbors = (grid: number[][], x: number, y: number): Neighbors => {
  const right = grid[y].slice(x + 1);
  const left = [...grid[y].slice(0, x)].reverse();

  const bottom: number[] = [];
  for (let i = y + 1; i < grid.length; i++) {
    bottom.push(grid[i][x]);
  }
  const top: number[] = [];
  for (let i = y - 1; i >= 0; i--) {
    top.push(grid[i][x]);
  }
  // console.log({fromRight, fromLeft, fromBottom, fromTop})
  return { left, right, top, bottom };
};

const isVisible = (
  targetTree: number,
  { left, right, top, bottom }: Neighbors
) => {
  const _isVisible = (trees: number[]) =>
    trees.every((tree) => tree < targetTree);
  return (
    _isVisible(left) ||
    _isVisible(right) ||
    _isVisible(top) ||
    _isVisible(bottom)
  );
};

const countVisibleTrees = (input: number[][]): number => {
  let visible = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const neighbors = getNeighbors(input, x, y);
      if (isVisible(input[y][x], neighbors)) {
        visible++;
      }
    }
  }
  return visible;
};

const calcScenicScore = (
  tree: number,
  { left, right, top, bottom }: Neighbors
): number => {
  const viewingDistance = (line: number[]): number => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] >= tree) {
        return i + 1;
      }
    }
    return line.length;
  };

  // console.log({left, right, top, bottom})
  // console.log(viewingDistance(left) , viewingDistance(right) , viewingDistance(top) , viewingDistance(bottom))
  return (
    viewingDistance(left) *
    viewingDistance(right) *
    viewingDistance(top) *
    viewingDistance(bottom)
  );
};

const findHighestScenicScore = (input: number[][]): number => {
  let highest = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const score = calcScenicScore(input[y][x], getNeighbors(input, x, y));
      highest = Math.max(highest, score);
    }
  }
  return highest;
};

console.log("Solution 1:", countVisibleTrees(input));
console.log("Solution 2:", findHighestScenicScore(input));
