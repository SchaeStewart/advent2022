import { readInput } from "../readInput.ts";

const raw = await readInput("./input.txt");
// const raw = await readInput("./sampleInput.txt");

type NestedNumArray = number | Array<number | number[] | NestedNumArray>;
type Packet = {
  left: NestedNumArray[];
  right: NestedNumArray[];
};

const parseInput = (input: string[]): Packet[] => {
  const packets: Packet[] = [];
  for (let i = 0; i < input.length; i += 3) {
    const p: Packet = {
      left: JSON.parse(input[i]),
      right: JSON.parse(input[i + 1]),
    };
    packets.push(p);
  }
  return packets;
};

const isPacketOrdered = (packet: Packet): boolean => {
  const compare = (l?: NestedNumArray, r?: NestedNumArray): boolean | null => {
    if (l === undefined) {
      return true;
    } else if (r === undefined) {
      return false;
    } else if (Array.isArray(l) && l.length === 0) {
      return true;
    } else if (Array.isArray(r) && r.length === 0) {
      return false;
    } else if (typeof l === "number" && typeof r !== "number") {
      return compare([l], r);
    } else if (typeof r === "number" && typeof l !== "number") {
      return compare(l, [r]);
    } else if (Array.isArray(l) && Array.isArray(r)) {
      const result = compare(l.at(0), r.at(0));
      if (result === null) {
        return compare(l.slice(1), r.slice(1));
      }
      return result;
    } else if (!Array.isArray(l) && !Array.isArray(r)) {
      return l < r ? true : l > r ? false : null;
    }
    throw new Error("unreachable");
  };
  for (let i = 0; i < Math.max(packet.left.length, packet.right.length); i++) {
    const [l, r] = [packet.left[i], packet.right[i]];
    const result = compare(l, r);
    if (result !== null) {
      return result;
    }
  }
  return false;
};

const findRightOrder = (packets: Packet[]): number => {
  const rightOrder: number[] = [];
  for (let i = 0; i < packets.length; i++) {
    if (isPacketOrdered(packets[i])) {
      rightOrder.push(i + 1);
    }
  }

  console.log(rightOrder);
  return rightOrder.reduce((acc, val) => acc + val, 0);
};

// console.log(isPacketOrdered(parseInput(raw)[13]));

console.log("Part 1", findRightOrder(parseInput(raw)));
// console.log("Part 2", trail(buildBackwardGraph(parseInput(raw))));
