import { readInput } from "../readInput.ts";

type Point = {
  x: number;
  y: number;
};

type Line = Point[];

const parse = (input: string[]) => {
  const lines: Line[] = [];
  for (const row of input) {
    const ps: Point[] = row.split(" -> ").map((p) => {
      const [x, y] = p.split(",").map((n) => parseInt(n));
      return { x, y };
    });
    lines.push(ps);
  }
  return { lines };
};

const pointsBetween = (a: Point, b: Point): Point[] => {
  const points: Point[] = [];
  if (a.x === b.x) {
    const smaller = Math.min(a.y, b.y);
    const larger = Math.max(a.y, b.y);
    for (let y = smaller; y <= larger; y++) {
      points.push({ x: a.x, y });
    }
    return points;
  }
  const smaller = Math.min(a.x, b.x);
  const larger = Math.max(a.x, b.x);
  for (let x = smaller; x <= larger; x++) {
    points.push({ y: a.y, x });
  }
  return points;
};

const key = (p: Point) => `${p.x},${p.y}`;
const buildGrid = ({ lines }: { lines: Line[] }) => {
  const grid = new Map<string, string>();
  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const start = line[i];
      const end = line[i + 1];
      const between = pointsBetween(start, end);
      for (const p of between) {
        grid.set(key(p), "#");
      }
    }
  }
  return grid;
};

// sand can rest directly on rock, but not on other sand
const simulateSand = (grid: Map<string, string>, start: Point) => {
  let isMoving = true;
  let loc: Point = { ...start };
  while (isMoving) {
    isMoving = false;
    const y = loc.y + 1;
    let x = loc.x;
    if (!grid.has(key({ x, y }))) {
      isMoving = true;
      loc = { x, y };
      continue;
    }
    x = loc.x - 1;
    if (!grid.has(key({ x, y }))) {
      isMoving = true;
      loc = { x, y };
      continue;
    }
    x = loc.x + 1;
    if (!grid.has(key({ x, y }))) {
      isMoving = true;
      loc = { x, y };
      continue;
    }
  }
  if (key(loc) !== key(start)) {
    grid.set(key(loc), "o");
    return true;
  }
  return false;
};

const simulateWhile = (grid: Map<string, string>): number => {
  let i = 0;
  let didPlace = true;
  while (didPlace) {
    i++;
    didPlace = simulateSand(grid, { x: 500, y: 0 });
    console.log({ grid, i });
  }
  return i;
};

const input = buildGrid(parse(await readInput("./input.txt")));
// const input = buildGrid(parse(await readInput("./sampleInput.txt")));
simulateWhile(input);
console.log(input);

// console.log("Part 1", countCorrectOrder(parseIntoPackets(input)));
// console.log("Part 2", reOrderPackets(input));
