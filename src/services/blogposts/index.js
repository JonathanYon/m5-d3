import express from "express";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import fs from "fs";
import {
  getPosts,
  writePosts,
  fileParse,
  uploadFile,
  getPostStream,
} from "../lib/tool.js";
import { getPDFStream, generatePDF } from "../lib/pdf.js";
import { sendEmail } from "../lib/email.js";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { postValidation } from "./validation.js";
import { pipeline } from "stream";
import json2csv, { Transform } from "json2csv";

const blogPostsRouter = express.Router();

// const jsonPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "blogposts.json"
// );

// const getPosts = () => {
//   const contents = fs.readFileSync(jsonPath);
//   return JSON.parse(contents);
// };

// const writePost = (content) =>
//   fs.writeFileSync(jsonPath, JSON.stringify(content));

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await getPosts();
    if (req.query && req.query.title) {
      const filterposts = posts.filter(
        (post) => post.title === req.query.title
      );
      res.status(200).send(filterposts);
    } else {
      res.status(200).send(posts);
    }
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.get("/:postId", async (req, res, next) => {
  try {
    const posts = await getPosts();
    const post = posts.find((p) => p.id === req.params.postId);
    if (post) {
      res.status(201).send(post);
    } else {
      next(
        createHttpError(
          404,
          `The post with id ${req.params.postId} is not FOUND`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post("/", postValidation, async (req, res, next) => {
  try {
    const posts = await getPosts();
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    } else {
      const newPost = { ...req.body, id: uniqid(), createdAt: new Date() };
      posts.push(newPost);
      await writePosts(posts);
      res.status(201).send(newPost);
    }
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.put("/:postId", async (req, res, next) => {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex((post) => post.id === req.params.postId);
    if (postIndex == -1) {
      next(
        createHttpError(404, `the post with ${req.params.postId} is not found!`)
      );
    } else {
      const originalPost = posts[postIndex];
      const changedPost = {
        ...originalPost,
        ...req.body,
        updatedAt: new Date().toISOString,
      };
      posts[postIndex] = changedPost;
      await writePosts(posts);
      res.send(changedPost);
    }
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const posts = await getPosts();
    const allPost = posts.filter((p) => p.id !== req.params.postId);
    await writePosts(allPost);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

//post img cover
blogPostsRouter.post(
  "/:postId/cover",
  fileParse.single("cover"),
  postValidation,
  async (req, res, next) => {
    try {
      console.log(req.file);
      const posts = await getPosts();
      const postIndex = posts.findIndex(
        (post) => post.id === req.params.postId
      );
      if (postIndex == -1) {
        res.status(404).send({ meesage: "BlogPost not Found!" });
      } else {
        const originalPost = posts[postIndex];
        const changedPost = {
          ...originalPost,
          cover: req.file.path,
          ...req.body,
        };
        posts[postIndex] = changedPost;
        writePosts(posts);
        res.status(200).send(changedPost);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

//post img avatar
blogPostsRouter.post(
  "/:postId/avatar",
  fileParse.single("avatar"),
  // uploadFile,
  postValidation,
  async (req, res, next) => {
    try {
      console.log(req.file);
      // res.send(req.file);
      const posts = await getPosts();
      const postIndex = posts.findIndex(
        (post) => post.id === req.params.postId
      );
      const post = posts.find((post) => post.id === req.params.postId);
      if (postIndex == -1) {
        res.status(404).send({ meesage: "BlogPost not Found!" });
      } else {
        const originalPost = posts[postIndex];
        const changedPost = {
          ...originalPost,
          author: { name: post.author.name, avatar: req.file.path },
          ...req.body,
        };
        posts[postIndex] = changedPost;
        writePosts(posts);
        res.status(200).send(changedPost);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

blogPostsRouter.get("/:postId/PDFDownload", async (req, res, next) => {
  try {
    const posts = await getPosts();
    const post = posts.find((p) => p.id === req.params.postId);
    res.setHeader("Content-disposition", `attachment; filename=blogposts.pdf`);
    const source = getPDFStream(post); //{ cover: post.cover, contents: post.content }
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/CSV", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=test.csv");
    const source = getPostStream();
    const transform = new Transform({
      fields: ["title", "category", "author"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/JSONDownload", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", `attachment; filename=blogposts.json`);
    const source = getPostStream();
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
});

// blogPostsRouter.get("/:postId/pdfAsync", async (req, res, next) => {
blogPostsRouter.get("/:postId/pdfAsync", async (req, res, next) => {
  try {
    // const posts = await getPosts();
    // const post = posts.find((p) => p.id === req.params.postId);
    // res.setHeader("Content-disposition", `attachment; filename=blogposts.pdf`);
    await generatePDF({ greeting: "this is a test" }); //{ cover: post.cover, contents: post.content }
    res.send("Created!");
  } catch (error) {
    next(error);
    console.log(error);
  }
});

blogPostsRouter.post("/sendEmail", async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendEmail(email);
    res.send("Email sent!");
  } catch (error) {
    next(error);
  }
});

// post comment (not finished yet!)

blogPostsRouter.post("/", postValidation, async (req, res, next) => {
  try {
    const posts = await getPosts();
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    } else {
      const newPost = { ...req.body, id: uniqid(), createdAt: new Date() };
      posts.push(newPost);
      await writePosts(posts);
      res.status(201).send(posts);
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
