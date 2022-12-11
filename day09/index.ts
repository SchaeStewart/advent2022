import { readInput } from "../readInput.ts";

type Direction = "U" | "D" | "L" | "R";
type Instruction = [Direction, number];
type Position = { x: number; y: number };

const parseInput = (input: string[]): Instruction[] =>
  input.map((line) => {
    const [d, n] = line.split(" ");
    return [d as Direction, parseInt(n)];
  });

// const input = parseInput(await readInput("./input.txt"));
const input = parseInput(await readInput("./sampleInput.txt"));

const updateTail = (tail: Position, head: Position): Position => {
  let { x, y } = tail;
  const xDiff = Math.abs(tail.x - head.x);
  const yDiff = Math.abs(tail.y - head.y);
  const updateX = () => (x = tail.x > head.x ? x - 1 : x + 1);
  const updateY = () => (y = tail.y > head.y ? y - 1 : y + 1);
  if ((xDiff > 1 && yDiff >= 1) || (xDiff >= 1 && yDiff > 1)) {
    updateX();
    updateY();
    return { x, y };
  }
  if (xDiff > 1) {
    updateX();
  } else if (yDiff > 1) {
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
  knots: Position[],
  visited: string[] 
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
    const c = visited.push(key(tail))
  }

  return [head, knots];
};

const plot = (visited: string[]) => {
  const parse = (loc: string): Position => {
    const [xPart, yPart] = loc.split(',')
    const x = parseInt(xPart.split(":")[1])
    const y = parseInt(yPart.split(":")[1])
    return {x, y}
  }

  const size = 26 
  const grid = new Array(size).fill('.'.repeat(size).split(""))
  const xStart = size/2
  const yStart = size/2 
  for (const loc of visited) {
    const {x, y} = parse(loc)
    console.log({x,y})
    grid[y][x] = "#"
  }

  // console.log(grid.map(line => line.join("")).join("\n"))
  console.log(grid)

}

const countVisitedByTail = (instructions: Instruction[], knotCount: number) => {
  let head: Position = { x: 0, y: 0 };
  let knots: Position[] = new Array(knotCount).fill({ x: 0, y: 0 });
  const visited: string[] = [key(head)]
  for (const ins of instructions) {
    [head, knots] = updatePositions(ins, head, knots, visited);
  }

  plot(visited)
  return new Set(visited).size;
};

console.log("Part 1", countVisitedByTail(input, 1));
// console.log("Part 2", countVisitedByTail(input, 9));
