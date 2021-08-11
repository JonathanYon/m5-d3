import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./services/blogposts/index.js";
import { notFoundHandler } from "./errorHandler.js";
import { badRequestHandler } from "./errorHandler.js";
import { forbidenHandler } from "./errorHandler.js";
import { genericErrorHandler } from "./errorHandler.js";

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());

server.use("/blogposts", blogPostsRouter);

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(forbidenHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));
server.listen(port, () => {
  console.log("server listen run on port: " + port);
});
