import { readInput } from "../readInput.ts";

type Monkey = {
  items: number[];
  operation: (old: number) => number;
  test: (item: number) => number;
  itemsHandled: number;
  d: number;
};

const parseInput = (input: string[]): Monkey[] => {
  const monkeys: Monkey[] = [];
  for (let i = 1; i < input.length; i += 7) {
    const raw = input.slice(i, i + 7).map((line) => line.trim());
    const items = raw[0]
      .split(":")[1]
      .split(", ")
      .map((number) => parseInt(number));
    const operation = (old: number) => eval(raw[1].split(" = ")[1]);
    const test = (item: number) =>
      item % parseInt(raw[2].slice(-2)) === 0
        ? parseInt(raw[3].slice(-1))
        : parseInt(raw[4].slice(-1));
    monkeys.push({
      items,
      operation,
      test,
      itemsHandled: 0,
      d: parseInt(raw[2].slice(-2)),
    });
  }
  return monkeys;
};

const raw = await readInput("./input.txt");
// const raw = await readInput("./sampleInput.txt");

const takeTurn = (monkeys: Monkey[], monkey: Monkey) => {
  while (monkey.items.length > 0) {
    const item = monkey.items.shift();
    if (!item) return;
    const newItem = Math.floor(monkey.operation(item) / 3);
    monkeys[monkey.test(newItem)].items.push(newItem);
    monkey.itemsHandled++;
  }
};

const takeRound = (monkeys: Monkey[], take = takeTurn) => {
  for (const monkey of monkeys) {
    take(monkeys, monkey);
  }
};

const solvePart1 = (monkeys: Monkey[]) => {
  for (let i = 0; i < 20; i++) {
    takeRound(monkeys);
  }
  return monkeys
    .sort((a, b) => b.itemsHandled - a.itemsHandled)
    .slice(0, 2)
    .reduce((acc, val) => acc * val.itemsHandled, 1);
};

const takeTurn2 = (monkeys: Monkey[], monkey: Monkey) => {
  while (monkey.items.length > 0) {
    const item = monkey.items.shift();
    if (!item) return;
    const newItem = Math.floor(
      monkey.operation(item) % monkeys.reduce((acc, val) => val.d * acc, 1)
    );
    monkeys[monkey.test(newItem)].items.push(newItem);
    monkey.itemsHandled++;
  }
};

const solvePart2 = (monkeys: Monkey[]) => {
  for (let i = 0; i < 10_000; i++) {
    takeRound(monkeys, takeTurn2);
  }
  console.log(monkeys);
  return monkeys
    .sort((a, b) => b.itemsHandled - a.itemsHandled)
    .slice(0, 2)
    .reduce((acc, val) => acc * val.itemsHandled, 1);
};

console.log("Part 1", solvePart1(parseInput(raw)));
console.log("Part 2", solvePart2(parseInput(raw)));
