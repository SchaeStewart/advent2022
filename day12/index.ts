import { readInput } from "../readInput.ts";

// const raw = await readInput("./input.txt");
const raw = await readInput("./sampleInput.txt");

const parseInput = (input: string[]): string[][] => {
  return input.map((line) => line.split(""));
};

type Graph = {
  // n?: Graph;
  // s?: Graph;
  // w?: Graph;
  // e?: Graph;
  vertices: Graph[];
  value: number;
  x: number;
  y: number;
  visited: boolean;
  end: boolean;
};

const key = ({ x, y }: { x: number; y: number }) => `x:${x}|y:${y}`;
const buildGraph = (input: string[][]): Graph => {
  const m = new Map<string, Graph>();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const v = input[y][x];
      const g: Graph = {
        value: v === "S" ? 1 : v === "E" ? 27 : v.charCodeAt(0) - 96,
        x: x,
        y: y,
        visited: false,
        vertices: [],
        end: v === "E",
      };
      m.set(key(g), g);
    }
  }

  for (const g of m.values()) {
    // check all cardinal dir values.
    const n = m.get(key({ ...g, y: g.y - 1 }));
    if (n && Math.abs(g.value - n.value) <= 1) {
      g.vertices.push(n);
    }
    const s = m.get(key({ ...g, y: g.y + 1 }));
    if (s && Math.abs(g.value - s.value) <= 1) {
      g.vertices.push(s);
    }
    const e = m.get(key({ ...g, x: g.x + 1 }));
    if (e && Math.abs(g.value - e.value) <= 1) {
      g.vertices.push(e);
    }
    const w = m.get(key({ ...g, x: g.x - 1 }));
    if (w && Math.abs(g.value - w.value) <= 1) {
      g.vertices.push(w);
    }
  }
  const g = m.get(key({ x: 0, y: 0 }));
  if (!g) {
    throw new Error("no graph!");
  }
  return g;
};

type QueueItem = {
  distance: number;
  g: Graph;
  previous?: Graph;
};
const queueItemFromGraph =
  (distance: number, previous?: Graph) =>
  (g: Graph): QueueItem => ({
    distance: 1 + distance,
    g,
    previous,
  });
const updateQueue = (v: Graph[], q: QueueItem[], currDistance: number) => {
  q.push(...v.map(queueItemFromGraph(currDistance, g)));
  //.sort((a, b) => a.distance - b.distance);
};

const traverse = (g: Graph) => {
  let queue: QueueItem[] = [];
  updateQueue(
    g.vertices.filter((vg) => vg !== g),
    queue,
    0
  );
  let curr: { distance: number; g: Graph } | undefined = queue.shift()!;
  let i = 0;
  while (curr) {
    if (curr.g.end) {
      return curr.distance + 1;
    }
    updateQueue(
      curr.g.vertices.filter((vg) => vg !== curr!.g) || [],
      queue,
      curr?.distance || Infinity
    );
    curr = queue.shift();
    i++;
    if (i === 2) {
      break;
    }
  }
  console.log({ queue: queue.map((q) => ({ x: q.g.x, y: q.g.y })), curr, g });
  return -1;
};

const g = buildGraph(parseInput(raw));
console.log(traverse(g));

// console.log("Part 1", solvePart1(parseInput(raw)));
// console.log("Part 2", solvePart2(parseInput(raw)));
