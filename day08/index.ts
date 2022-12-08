import { readInput } from "../readInput.ts";

const parseInput = (input: string[]): number[][] =>
  input.map((line) => line.split("").map((c) => parseInt(c)));

const input = parseInput(await readInput("./input.txt"));
// const input = parseInput(await readInput("./sampleInput.txt"));

const isVisible = (grid: number[][], x: number, y: number): boolean => {
  if (x === 0 || y === 0) {
    return true;
  }
  // forward row search
  const fromRight = grid[y]
    .slice(x + 1)
    .every((tree) => tree < grid[y][x]);

  let fromLeft = true;
  for (let i = x - 1; i >= 0; i--) {
    if (grid[y][i] >= grid[y][x]) {
      fromLeft = false;
      break;
    }
  }
  let fromBottom = true;
  for (let i = y + 1; i < grid.length; i++) {
    if (grid[i][x] >= grid[y][x]) {
      fromBottom = false;
      break;
    }
  }
  let fromTop = true;
  for (let i = y - 1; i >= 0; i--) {
    if (grid[i][x] >= grid[y][x]) {
      fromTop = false;
      break;
    }
  }
  // console.log({fromRight, fromLeft, fromBottom, fromTop})
  return (
    fromRight || fromLeft || fromBottom || fromTop
  );
};

const countVisibleTrees = (input: number[][]): number => {
  let visible = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (isVisible(input, j, i)) {
        visible++;
      }
    }
  }
  return visible;
};

console.log("Solution 1:", countVisibleTrees(input));
console.log("Solution 2:");
