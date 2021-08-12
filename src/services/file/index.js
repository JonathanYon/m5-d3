import express from "express";
import multer from "multer";
import { saveFile } from "../lib/tool.js";

const filesRouter = express.Router();

filesRouter.post(
  "/upload",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      await saveFile(req.file.originalname, req.file.buffer);
      res.send("Uploaded!");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/uploadMultiple",
  multer().array("avatar"),
  async (req, res, next) => {
    try {
      const arrayPromise = req.files.map((file) =>
        saveFile(file.originalname, file.buffer)
      );
      await Promise.all(arrayPromise);
      res.send("All Uploaded!");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
