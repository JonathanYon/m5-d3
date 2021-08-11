import { body } from "express-validator";

export const postValidation = [
  body("author.name").exists().withMessage("Name is required"),
  body("title").exists().withMessage("Title is required"),
  body("category").exists().withMessage("Category is required"),
  body("cover").exists().withMessage("Cover is required"),
  body("readTime.value").exists().isNumeric().withMessage("Value is required"),
  body("content").exists().withMessage("Content must be HTML"),
  body("author.avatar").exists().withMessage("Avatar photo is required"),
  body("readTime.unit").exists().withMessage("Unit is required"),
];
