import { readInput } from "../readInput.ts";
import { BinaryHeap } from "https://deno.land/std@0.167.0/collections/binary_heap.ts";

const raw = await readInput("./input.txt");
// const raw = await readInput("./sampleInput.txt");

const parseInput = (input: string[]): string[][] => {
  return input.map((line) => line.split(""));
};

type Graph = {
  vertices: Graph[];
  value: number;
  x: number;
  y: number;
  loc: string;
  distance: number;
};

const key = ({ x, y }: { x: number; y: number }) => `x:${x}->y:${y}`;
let end: string;
let start: string;
const buildGraph = (input: string[][]): Map<string, Graph> => {
  const m = new Map<string, Graph>();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const v = input[y][x];
      const g: Graph = {
        value: v === "S" ? 0 : v === "E" ? 26 : v.charCodeAt(0) - 96,
        x: x,
        y: y,
        loc: key({ x, y }),
        vertices: [],
        distance: v === "S" ? 0 : Number.MAX_SAFE_INTEGER,
      };
      if (v === "E") {
        end = g.loc;
      }
      if (v === "S") {
        start = g.loc;
      }
      m.set(g.loc, g);
    }
  }

  for (const g of m.values()) {
    if (g.loc === end) {
      continue;
    }
    // check all cardinal dir values.
    const north = m.get(key({ ...g, y: g.y - 1 }));
    if (north && north.value - g.value <= 1) {
      g.vertices.push(north);
    }
    const south = m.get(key({ ...g, y: g.y + 1 }));
    if (south && south.value - g.value <= 1) {
      g.vertices.push(south);
    }
    const east = m.get(key({ ...g, x: g.x + 1 }));
    if (east && east.value - g.value <= 1) {
      g.vertices.push(east);
    }
    const west = m.get(key({ ...g, x: g.x - 1 }));
    if (west && west.value - g.value <= 1) {
      g.vertices.push(west);
    }
  }
  return m;
};

const traverse = (map: Map<string, Graph>): number => {
  const visited = new Set<string>();
  const order: string[] = [];
  const queue = new BinaryHeap<Graph>((a, b) => {
    if (a.distance >= b.distance) {
      return 1;
    } else {
      return -1;
    }
  });
  queue.push(map.get(start)!);
  while (queue.length > 0) {
    const g = queue.pop()!;
    const step = g.distance + 1;
    for (const v of g.vertices) {
      const n = map.get(key(v));
      if (n && !visited.has(key(n)) && n.distance > step) {
        n.distance = step;
        if (n.loc !== end) {
          queue.push(n);
        }
      }
    }
    visited.add(g.loc);
    order.push(g.loc);
  }
  // console.log(JSON.stringify(order, null, 2));
  console.log({ start, end });
  console.log(map.get(key({ x: 43, y: 20 })));
  return map.get(end)?.distance || -1;
};

const g = buildGraph(parseInput(raw));
console.log(traverse(g));

// console.log("Part 1", solvePart1(parseInput(raw)));
// console.log("Part 2", solvePart2(parseInput(raw)));
