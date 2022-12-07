import { readInput } from "../readInput.ts";

const input = await readInput("./input.txt");
// const input = await readInput("./sampleInput.txt");

type File = { name: string; size: number };
type Directory = {
  previous?: Directory;
  dirName: string;
  contents: { [key: string]: File | Directory };
  size: number;
};

const isFile = (f: File | Directory): f is File => {
  return Object.hasOwn(f, "size") && Object.hasOwn(f, "name");
};

const dirSize = (root: Directory): void => {
  for (const item of Object.values(root.contents)) {
    if (!isFile(item)) {
      dirSize(item);
    }
    root.size += item.size;
  }
};

const buildFS = (input: string[]): Directory => {
  const root: Directory = { dirName: "/", contents: {}, size: 0 };
  let wd: Directory = root;
  for (let i = 1; i < input.length; i++) {
    const line = input[i];
    if (line === "$ cd ..") {
      wd = wd.previous!;
    } else if (line.startsWith("$ cd ")) {
      const dirName = line.slice("$ cd ".length);
      wd = wd.contents[dirName] as Directory;
    } else if (/^\d/.test(line)) {
      const [size, name] = line.split(" ");
      const f: File = { name, size: parseInt(size) };
      wd.contents[name] = f;
    } else if (line.startsWith("dir")) {
      const [_, name] = line.split(" ");
      wd.contents[name] = {
        dirName: name,
        previous: wd,
        contents: {},
        size: 0,
      };
    }
  }
  dirSize(root);
  return root;
};

const root = buildFS(input);
const filter =
  (predicate: (d: Directory) => boolean) =>
  (d: Directory): Directory[] => {
    const results: Directory[] = [];
    if (predicate(d)) {
      results.push(d);
    }
    for (const item of Object.values(d.contents)) {
      if (!isFile(item)) {
        results.push(...filter(predicate)(item));
      }
    }
    return results;
  };

const filterByDirMaxSize = (maxSize: number) =>
  filter((d) => d.size <= maxSize);
const filterByDirMinSize = (minSize: number) =>
  filter((d) => d.size >= minSize);

const maxSpace = 70_000_000;
const updateSize = 30_000_000;
const unusedSpace = maxSpace - root.size;
const spaceRequired = updateSize - unusedSpace;

console.log(
  "Solution 1:",
  filterByDirMaxSize(100_000)(root).reduce((acc, val) => acc + val.size, 0)
);
console.log(
  "Solution 2:",
  filterByDirMinSize(spaceRequired)(root).sort((a, b) => a.size - b.size)[0].size
);
