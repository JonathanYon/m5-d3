import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const fileJasonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../public/images/students"
);
const authorsJasonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/blogposts.json"
);

export const getPosts = () => readJSON(authorsJasonPath);
export const writePosts = (content) => writeJSON(authorsJasonPath, content);
export const saveFile = (filename, content) =>
  writeFile(join(fileJasonPath, filename), content);
