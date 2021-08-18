import fs from "fs-extra";
import { fileURLToPath } from "url";
import { extname, dirname, join } from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, //coming from env
  params: {
    folder: "blog Photos",
  },
});

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const fileJasonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../public/images"
);
const authorsJasonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/blogposts.json"
);

export const fileParse = multer({ storage: cloudinaryStorage });
export const uploadFile = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extention = extname(originalname);
    const fileName = `${req.params.postId}${extention}`;
    const pathToFile = join(fileJasonPath, fileName);
    fs.writeFile(pathToFile, buffer);
    const link = `http://localhost:3003/${fileName}`;
    req.file = link;
    // console.log(
    //   `req.file =>📁: ${req.file}, fs.writeFile(pathToFile, buffer) is => 🏁: ${fileName}`
    // );
    next();
  } catch (error) {
    next(error);
  }
};

export const getPosts = () => readJSON(authorsJasonPath);
export const writePosts = (content) => writeJSON(authorsJasonPath, content);
export const saveFile = (filename, content) =>
  writeFile(join(fileJasonPath, filename), content);
export const getPostStream = () => createReadStream(authorsJasonPath);
