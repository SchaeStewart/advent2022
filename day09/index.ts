import { readInput } from "../readInput.ts";

type Direction = "U" | "D" | "L" | "R";
type Instruction = [Direction, number];
type Position = { x: number; y: number };

const parseInput = (input: string[]): Instruction[] =>
  input.map((line) => {
    const [d, n] = line.split(" ");
    return [d as Direction, parseInt(n)];
  });

const input = parseInput(await readInput("./input.txt"));
// const input = parseInput(await readInput("./sampleInput.txt"));

const updateTail = (tail: Position, head: Position): Position => {
  let { x, y } = tail;
  const updateX = () => {
    if (tail.x > head.x) {
      x -= 1;
    } else {
      x += 1;
    }
  };
  const updateY = () => {
    if (tail.y > head.y) {
      y -= 1;
    } else {
      y += 1;
    }
  };
  if (
    (Math.abs(tail.x - head.x) > 1 && Math.abs(tail.y - head.y) >= 1) ||
    (Math.abs(tail.x - head.x) >= 1 && Math.abs(tail.y - head.y) > 1)
  ) {
    updateX();
    updateY();
    return { x, y };
  }
  if (Math.abs(tail.x - head.x) > 1) {
    updateX();
  } else if (Math.abs(tail.y - head.y) > 1) {
    updateY();
  }
  return { x, y };
};

const updateHead = (
  { x, y }: Position,
  [direction, distance]: Instruction
): Position => {
  switch (direction) {
    case "U":
      return { x, y: y + distance };
    case "D":
      return { x, y: y - distance };
    case "L":
      return { x: x - distance, y };
    case "R":
      return { x: x + distance, y };
  }
};

const key = (p: Position) => `x:${p.x},y:${p.y}`;
const updatePositions = (
  [d, amt]: Instruction,
  head: Position,
  tail: Position,
  visited: Map<string, number>
) => {
  for (let i = 0; i < amt; i++) {
    head = updateHead(head, [d, 1]);
    tail = updateTail(tail, head);
    const c = visited.get(key(tail)) || 0;
    visited.set(key(tail), c + 1);
  }

  return [head, tail];
};

const solvePart1 = (instructions: Instruction[]) => {
  const visited = new Map<string, number>();
  let head: Position = { x: 0, y: 0 };
  let tail: Position = { x: 0, y: 0 };
  visited.set(key(tail), 1);
  for (const ins of instructions) {
    [head, tail] = updatePositions(ins, head, tail, visited);
  }

  console.log("Part 1:", visited.size);
};

const updatePositionsMultiple = (
  [d, amt]: Instruction,
  head: Position,
  knots: Position[],
  visited: Map<string, number>
): [Position, Position[]] => {
  let tail = {...knots[0]}
  for (let i = 0; i < amt; i++) {
    head = updateHead(head, [d, 1]);
    let h = {...head}
    for (let i = 0; i < knots.length; i++) {
      tail = {...knots[i]}
      tail = updateTail(tail, h)
      knots[i] = {...tail}
      h = tail
    }
    const c = visited.get(key(tail)) || 0;
    visited.set(key(tail), c + 1);
  }

  return [head, knots];
};

const solvePart2 = (instructions: Instruction[]) => {
  const visited = new Map<string, number>();
  let head: Position = { x: 0, y: 0 };
  let knots: Position[] = new Array(9).fill({ x: 0, y: 0 });
  visited.set(key(knots.at(-1)!), 1);
  for (const ins of instructions) {
    [head, knots] = updatePositionsMultiple(ins, head, knots, visited);
  }
  console.log("Part 2:", visited.size);
};

solvePart1(input);
solvePart2(input);
