import { body } from "express-validator";

export const postValidation = [
  body("name").exists().withMessage("Name is required"),
  body("title").exists().withMessage("Title is required"),
  body("category").exists().withMessage("Category is required"),
  body("cover").exists().withMessage("Cover is required"),
  body("value").exists().withMessage("Cover is required"),
];
