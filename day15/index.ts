import { readInput } from "../readInput.ts";

type Point = {
  x: number;
  y: number;
};

const key = (p: Point) => `${p.x},${p.y}`;

type Sensor = {
  loc: Point;
  beacon: Point;
  manhattan: number;
};

const manhattanDistance = (a: Point, b: Point): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const findLimits = (p: Point, mDist: number, targetRow: number) => {
  const a = p.x - Math.abs(mDist - Math.abs(p.y - targetRow));
  const b = p.x + Math.abs(mDist - Math.abs(p.y - targetRow));
  return [Math.min(a, b), Math.max(a, b)];
};

const parse = (input: string[]) => {
  return input
    .map((line) =>
      line
        .replace("Sensor at", "")
        .replace("closest beacon is at ", "")
        .replaceAll("x=", "")
        .replaceAll("y=", "")
        .split(":")
        .map((rawPoint) => {
          const [x, y] = rawPoint.split(", ").map((n) => parseInt(n));
          return { x, y };
        })
    )
    .map(
      ([loc, beacon]: Point[]): Sensor => ({
        loc,
        beacon,
        manhattan: manhattanDistance(loc, beacon),
      })
    );
};

// const sensors = parse(await readInput("./sampleInput.txt"));
// const targetRow = 10;
const sensors = parse(await readInput("./input.txt"));
const targetRow = 2_000_000;
const isSensorInRangeOfY = (y: number) => (s: Sensor) =>
  (s.loc.y <= y && s.loc.y + s.manhattan >= y) ||
  (s.loc.y >= y && s.manhattan <= y);

const sensorsInRangeOfTarget = sensors.filter(isSensorInRangeOfY(targetRow));
let count = -[
  new Set([...sensors.filter((sensors) => sensors.beacon.y === targetRow)]),
].length;
const minX = Math.min(
  ...sensorsInRangeOfTarget.map(
    (s) => findLimits(s.loc, s.manhattan, targetRow)[0]
  )
);
const maxX = Math.max(
  ...sensorsInRangeOfTarget.map(
    (s) => findLimits(s.loc, s.manhattan, targetRow)[1]
  )
);
console.log(count);
for (let x = minX; x <= maxX; x++) {
  const p: Point = { x, y: targetRow };
  if (
    sensorsInRangeOfTarget.some((sensor) => {
      const mDist = manhattanDistance(p, sensor.loc);
      return sensor.manhattan >= mDist;
    })
  ) {
    count++;
  }
}

// max and mix x are calculated not by loc + manhattan, but by whatever their highest/lowest value on targetRow would be

console.log({ count, minX, maxX });
// console.log("Part 1", countCorrectOrder(parseIntoPackets(input)));
// console.log("Part 2", reOrderPackets(input));
