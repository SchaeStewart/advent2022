import { readInput } from "../readInput.ts";

type Addx = { name: "addx"; amount: number };
type NoOp = { name: "noop" };
type Instruction = Addx | NoOp;

const parseInput = (input: string[]): Instruction[] =>
  input.map((line) => {
    if (line === "noop") {
      return { name: "noop" };
    } else if (line.startsWith("addx")) {
      return { name: "addx", amount: parseInt(line.split(" ")[1]) };
    }
    throw new Error("unknown command");
  });

const input = parseInput(await readInput("./input.txt"));
// const input = parseInput(await readInput("./sampleInput.txt"));

const solvePart1 = (instructions: Instruction[]) => {
  const signalStrengthMap = new Map<number, number>();
  let cycle = 1;
  let xReg = 1;
  let xCycle = 0;
  let i = 0;
  while (i < instructions.length) {
    let ins = instructions[i];
    if (ins.name === "noop") {
      i++;
    } else if (ins.name === "addx") {
      xCycle++;
    }
    if (xCycle === 2 && ins.name === "addx") {
      xCycle = 0;
      i++;
      xReg += ins.amount;
    }
    cycle++;
    signalStrengthMap.set(cycle, xReg * cycle);
  }

  // console.log(signalStrengthMap)

  return (
    (signalStrengthMap.get(20) || 0) +
    (signalStrengthMap.get(60) || 0) +
    (signalStrengthMap.get(100) || 0) +
    (signalStrengthMap.get(140) || 0) +
    (signalStrengthMap.get(180) || 0) +
    (signalStrengthMap.get(220) || 0)
  );
};

const cycleOverlapsWithSprite = (cycle: number, xReg: number): boolean => {
  let c = cycle
  return c >= xReg - 1 && c <= xReg + 1;
}

const solvePart2 = (instructions: Instruction[]) => {
  let cycle = 1;
  let xReg = 1;
  let xCycle = 0;
  let i = 0;
  const lines: string[] = [];
  let line = "";
  while (i < instructions.length) {
    // draw line
    if (cycleOverlapsWithSprite(line.length, xReg)) {
      line += "#";
    } else {
      line += ".";
    }
    let ins = instructions[i];
    if (ins.name === "noop") {
      i++;
    } else if (ins.name === "addx") {
      xCycle++;
    }
    if (xCycle === 2 && ins.name === "addx") {
      xCycle = 0;
      i++;
      xReg += ins.amount;
    }
    // new line
    if (line.length === 40) {
      lines.push(line);
      line = "";
    }
    cycle++;
  }

  // console.log(signalStrengthMap)
  lines.forEach((l) => console.log(l));
  return "^^^^^^";
};

console.log("Part 1", solvePart1(input));
console.log("Part 2", solvePart2(input));
