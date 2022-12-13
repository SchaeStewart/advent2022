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
        value: v === "S" ? 1 : v === "E" ? 26 : v.charCodeAt(0) - 96,
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
  }
  return map.get(end)?.distance || -1;
};

const buildBackwardGraph = (input: string[][]): Map<string, Graph> => {
  const m = new Map<string, Graph>();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const v = input[y][x];
      const g: Graph = {
        value: v === "S" ? 1 : v === "E" ? 26 : v.charCodeAt(0) - 96,
        x: x,
        y: y,
        loc: key({ x, y }),
        vertices: [],
        distance: v === "E" ? 0 : Number.MAX_SAFE_INTEGER,
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
    // check all cardinal dir values.
    const north = m.get(key({ ...g, y: g.y - 1 }));
    if (north && g.value - north.value <= 1) {
      g.vertices.push(north);
    }
    const south = m.get(key({ ...g, y: g.y + 1 }));
    if (south && g.value - south.value <= 1) {
      g.vertices.push(south);
    }
    const east = m.get(key({ ...g, x: g.x + 1 }));
    if (east && g.value - east.value <= 1) {
      g.vertices.push(east);
    }
    const west = m.get(key({ ...g, x: g.x - 1 }));
    if (west && g.value - west.value <= 1) {
      g.vertices.push(west);
    }
  }
  return m;
};

const trail = (map: Map<string, Graph>): number => {
  const visited = new Set<string>();
  const queue = new BinaryHeap<Graph>((a, b) => {
    if (a.distance >= b.distance) {
      return 1;
    } else {
      return -1;
    }
  });
  queue.push(map.get(end)!);
  let last = Number.MAX_SAFE_INTEGER;
  while (queue.length > 0) {
    const g = queue.pop()!;
    const step = g.distance + 1;
    for (const v of g.vertices) {
      const n = map.get(key(v));
      if (n && !visited.has(key(n)) && n.distance > step) {
        n.distance = step;
        if (n.value !== 1) {
          queue.push(n);
        } else {
          last = Math.min(last, step);
        }
      }
    }
    visited.add(g.loc);
  }
  return last;
};

console.log("Part 1", traverse(buildGraph(parseInput(raw))));
console.log("Part 2", trail(buildBackwardGraph(parseInput(raw))));
