import { slidingWindows } from "https://deno.land/std@0.167.0/collections/sliding_windows.ts";
import { readInput } from "../readInput.ts";

const input = (await readInput("./input.txt"))[0];
// const input = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'
// const input = "bvwbjplbgvbhsrlpgdmjqwftvncz" // first marker after character 5
// const input = "nppdvjthqldpwncqszvftbrmjlhg" // first marker after character 6
// const input = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg" // first marker after character 10
// const input = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw" // first marker after character 11

const findUniqueMarker = (input: string, size = 4): number => {
  return slidingWindows([...input], size)
    .map(window => [...new Set(window)])
    .findIndex(window => window.length === size)
    +size
};

console.log("Solution 1:", findUniqueMarker(input, 4));
console.log("Solution 2:", findUniqueMarker(input, 14));
