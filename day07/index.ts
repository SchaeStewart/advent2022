import { readInput } from "../readInput.ts";

const input = await readInput("./input.txt");
// const input = await readInput("./sampleInput.txt");

type File = { name: string; size: number };
type Directory = {
  parent?: Directory;
  /** not needed, but nice for visualization */
  dirName: string;
  files: File[];
  subDirs: Directory[];
  size: number;
};

const sumSizes = (acc: number, item: Directory | File): number =>
  acc + item.size;

const sortSize = (a: Directory, b: Directory) => a.size - b.size;

const calculateDirSize = (root: Directory): void => {
  root.subDirs.forEach(calculateDirSize);
  root.size += [...root.files, ...root.subDirs].reduce(sumSizes, 0);
};

const buildFs = (input: string[]): Directory => {
  const root: Directory = { dirName: "/", files: [], subDirs: [], size: 0 };
  let workingDir: Directory = root;
  for (let i = 1; i < input.length; i++) {
    const line = input[i];
    if (line === "$ cd .." && workingDir.parent) {
      workingDir = workingDir.parent;
    } else if (line.startsWith("$ cd ")) {
      const dirName = line.slice("$ cd ".length);
      workingDir = workingDir.subDirs.find((dir) => dir.dirName === dirName)!;
    } else if (/^\d/.test(line)) {
      const [size, name] = line.split(" ");
      workingDir.files.push({ name, size: parseInt(size) });
    } else if (line.startsWith("dir")) {
      const [, name] = line.split(" ");
      workingDir.subDirs.push({
        dirName: name,
        parent: workingDir,
        files: [],
        subDirs: [],
        size: 0,
      });
    }
  }
  calculateDirSize(root);
  return root;
};

const filter = (
  predicate: (d: Directory) => boolean,
  d: Directory
): Directory[] => {
  const results: Directory[] = [];
  if (predicate(d)) {
    results.push(d);
  }
  for (const item of d.subDirs) {
    results.push(...filter(predicate, item));
  }
  return results;
};

const filterByDirMaxSize = (maxSize: number, dir: Directory) =>
  filter((d) => d.size <= maxSize, dir);
const filterByDirMinSize = (minSize: number, dir: Directory) =>
  filter((d) => d.size >= minSize, dir);

const root = buildFs(input);
const maxSpace = 70_000_000;
const updateSize = 30_000_000;
const unusedSpace = maxSpace - root.size;
const spaceRequired = updateSize - unusedSpace;

console.log(
  "Solution 1:",
  filterByDirMaxSize(100_000, root).reduce(sumSizes, 0)
);
console.log(
  "Solution 2:",
  filterByDirMinSize(spaceRequired, root).sort(sortSize)[0].size
);
