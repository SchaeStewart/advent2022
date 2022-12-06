import { readInput } from "../readInput.ts";

const input = (await readInput("./input.txt"))[0];
// const input = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'
// const input = "bvwbjplbgvbhsrlpgdmjqwftvncz" // first marker after character 5
// const input = "nppdvjthqldpwncqszvftbrmjlhg" // first marker after character 6
// const input = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg" // first marker after character 10
// const input = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw" // first marker after character 11

const findUniqueMarker = (input: string, size = 4): number => {
  for (let i = 0; i < input.length; i++) {
    if ([...new Set([...input.slice(i, i + size)])].length === size) {
      return i + size;
    }
  }
  return -1;
};


console.log("Solution 1:", findUniqueMarker(input, 4));
console.log("Solution 2:", findUniqueMarker(input, 14));
