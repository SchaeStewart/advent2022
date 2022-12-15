import { readInput } from "../readInput.ts";

type Point = {
  x: number;
  y: number;
};

type Sensor = {
  loc: Point;
  beacon: Point;
  manhattan: number;
};

const manhattanDistance = (a: Point, b: Point): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const findLimits = (
  p: Point,
  mDist: number,
  targetRow: number
): [number, number] => {
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

const isSensorInRangeOfY = (y: number) => (s: Sensor) =>
  (s.loc.y <= y && s.loc.y + s.manhattan >= y) ||
  (s.loc.y >= y && s.manhattan <= y);

const countOfPointsWithBeacons = (sensors: Sensor[], targetRow: number) => {
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
  // console.log({ minX, maxX, diff: Math.abs(Math.abs(minX - maxX) - count) });
  return count;
};

const part2 = (sensors: Sensor[], maxCoordinate: number) => {
  for (let y = 0; y < maxCoordinate; y++) {
    const intervals: [number, number][] = [];
    for (const sensor of sensors) {
      const minDistance = manhattanDistance(sensor.loc, {
        x: sensor.loc.x,
        y,
      });
      if (minDistance <= sensor.manhattan) {
        const distanceAroundSensorX = sensor.manhattan - minDistance;
        intervals.push([
          sensor.loc.x - distanceAroundSensorX,
          sensor.loc.x + distanceAroundSensorX,
        ]);
      }
    }
    intervals.sort(([a], [b]) => a - b);
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i - 1][1] >= intervals[i][0]) {
        intervals[i - 1][1] = Math.max(intervals[i - 1][1], intervals[i][1]);
        intervals.splice(i, 1);
        i--;
      }
    }

    const res = [];
    for (const l of intervals) {
      if (l[0] > maxCoordinate || 0 > l[1]) {
        continue;
      }
      res.push([Math.max(l[0], 0), Math.min(l[1], maxCoordinate)]);
    }

    if (res.length > 1) {
      const x = res[0][1] + 1;
      return x * 4_000_000 + y;
    }
  }
};

// const sensors = parse(await readInput("./sampleInput.txt"));
// const targetRow = 10;
// const rowLimit = 20;
const sensors = parse(await readInput("./input.txt"));
const targetRow = 2_000_000;
const rowLimit = 4_000_000;

console.log("Part 1", countOfPointsWithBeacons(sensors, targetRow));
console.log("Part 2", part2(sensors, rowLimit));
