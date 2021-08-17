import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./services/blogposts/index.js";
import { notFoundHandler } from "./errorHandler.js";
import { badRequestHandler } from "./errorHandler.js";
import { forbidenHandler } from "./errorHandler.js";
import { genericErrorHandler } from "./errorHandler.js";
import filesRouter from "./services/file/index.js";
import { join } from "path";

const server = express();
const port = process.env.PORT;

const publicFolderPath = join(process.cwd(), "public");

const links = [process.env.FE_DEV_URL, process.env.FE_PRO_URL];
// const links = ["http://localhost:3000", "http://myapp.com"];
const corsOpt = {
  origin: function (origin, next) {
    console.log("origin:", origin);
    console.log(port);

    if (!origin || links.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error(`origin  ${origin} NOT found!`));
    }
  },
};

server.use(express.static(publicFolderPath));
server.use(cors(corsOpt));
server.use(express.json());

server.use("/blogposts", blogPostsRouter);
server.use("/files", filesRouter);

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(forbidenHandler);
server.use(genericErrorHandler);

server.use((req, res) => {
  if (!req.route) {
    res.status(404).send("ROUTE NOT FOUND");
  }
});

console.table(listEndpoints(server));
server.listen(port, () => {
  console.log("server listen run on port: " + port);
});
