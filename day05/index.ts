import { readInput } from "../readInput.ts";

const input = await readInput("./input.txt");
// const input = await readInput("./sampleInput.txt");

type Instruction = {
  count: number;
  from: number;
  to: number;
};

const parseInput = (
  input: string[]
): { crates: string[][]; instructions: Instruction[] } => {
  const crateEndIdx = input.findIndex((l) => l === "");
  const rawCrates = input.slice(0, crateEndIdx - 1);
  const rawInstructions = input.slice(crateEndIdx + 1);

  // parseCrates
  const indexCrateLocationMap: Record<string, number> = input
    .splice(crateEndIdx - 1, 1)[0]
    .split("")
    .reduce(
      (acc, val, idx) =>
        val !== " " ? { ...acc, [idx]: parseInt(val) - 1 } : acc,
      {}
    );

  const crates: string[][] = new Array(
    Object.keys(indexCrateLocationMap).length
  )
    .fill(null)
    .map((_) => []);
  for (const line of rawCrates) {
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (![" ", "[", "]"].includes(c)) {
        crates[indexCrateLocationMap[i]].push(c);
      }
    }
  }

  // parseInstructions
  const regex = /(\d{1,}).*(\d{1,}).*(\d{1,})/;
  const instructions: Instruction[] = [];
  for (const line of rawInstructions) {
    const [_, count, from, to] = (line.match(regex) || [])
      .map((x) => parseInt(x));
    instructions.push({ count, from, to });
  }

  // console.log({
  //   crateEndIdx,
  //   rawCrates,
  //   indexCrateLocationMap,
  //   crates,
  //   rawInstructions,
  //   instructions,
  // });

  return { crates, instructions };
};

const execute = ({keepOrder}: {keepOrder: boolean}) => (crates: string[][], instruction: Instruction): string[][] => {
  const cloned = crates.slice(0).map((c) => c.slice(0));
  let toMove = cloned[instruction.from - 1].splice(0, instruction.count);
  if (keepOrder) {
    toMove = toMove.reverse()
  }
  for (const item of toMove) {
    cloned[instruction.to - 1].unshift(item);
  }
  return cloned;
};

const executeAll = (
  crates: string[][],
  instructions: Instruction[],
  execute: (crates: string[][], instruction: Instruction) => string[][]
) => {
  return instructions.reduce(execute, crates).reduce((acc, crate) => acc + crate[0], "")
};

const executeKeepOrder = (crates: string[][], instruction: Instruction): string[][] => {
  const cloned = crates.slice(0).map((c) => c.slice(0));
  const toMove = cloned[instruction.from - 1].splice(0, instruction.count);
  for (const item of toMove.reverse()) {
    cloned[instruction.to - 1].unshift(...item);
  }
  return cloned;
};

const { crates, instructions } = parseInput(input);

console.log(
  "Solution 1:",
  executeAll(crates, instructions, execute({keepOrder:false}))
);

console.log("Solution 2:", executeAll(crates, instructions, execute({keepOrder: true})))
