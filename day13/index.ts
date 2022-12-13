import { readInput } from "../readInput.ts";
import { chunk } from "https://deno.land/std@0.167.0/collections/chunk.ts";

type NestedNumArray = number | Array<number | number[] | NestedNumArray>;
type Packet = {
  left: NestedNumArray[];
  right: NestedNumArray[];
};

const parse = (input: string[]): NestedNumArray[][] =>
  input.filter((line) => line.startsWith("[")).map((line) => JSON.parse(line));

const parseIntoPackets = (input: NestedNumArray[][]): Packet[] =>
  chunk(input, 2).map(([left, right]): Packet => ({ left, right }));

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
        if (l.slice(1).length === 0 && r.slice(1).length === 0) {
          return null;
        }
        return compare(l.slice(1), r.slice(1));
      }
      return result;
    } else {
      return l < r ? true : l > r ? false : null;
    }
  };
  const result = compare(packet.left[0], packet.right[0]);
  if (result !== null) {
    return result;
  }
  return isPacketOrdered({
    left: packet.left.slice(1),
    right: packet.right.slice(1),
  });
};

const countCorrectOrder = (packets: Packet[]): number =>
  packets
    .map((packet) => isPacketOrdered(packet))
    .reduce((acc, isOrdered, i) => (isOrdered ? acc + i + 1 : acc), 0);

const reOrderPackets = (
  packets: NestedNumArray[][],
  dividerPackets: NestedNumArray[][] = [[[2]], [[6]]]
) =>
  [...dividerPackets, ...packets]
    .sort((left, right) => (isPacketOrdered({ left, right }) ? -1 : 1))
    .reduce(
      (acc, p, i) => (dividerPackets.includes(p) ? acc * (i + 1) : acc),
      1
    );

const input = parse(await readInput("./input.txt"));
// const input = parse(await readInput("./sampleInput.txt"));

console.log("Part 1", countCorrectOrder(parseIntoPackets(input)));
console.log("Part 2", reOrderPackets(input));
