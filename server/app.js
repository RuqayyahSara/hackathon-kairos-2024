import express from "express";
import config from "config";
import path from "path"
import { fileURLToPath } from "url";

import cRouter from "./controllers/C/index.js";
import javaScriptRouter from "./controllers/JavaScript/index.js";
import python2Router from "./controllers/Python2/index.js";
import python3Router from "./controllers/Python3/index.js";

import bashRouter from "./controllers/Bash/index.js";
import rubyRouter from "./controllers/Ruby/index.js";
import cppRouter from "./controllers/Cpp/index.js";

const __filename = fileURLToPath(import.meta.url); //
const __dirname = path.dirname(__filename); //

const app = express();
const port = process.env.PORT || config.get("PORT");

app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));


app.use("/c", cRouter);
app.use("/js", javaScriptRouter);
app.use("/py2", python2Router);
app.use("/py3", python3Router);
app.use("/sh", bashRouter);
app.use("/rb", rubyRouter);
app.use("/cpp", cppRouter);

 app.get("/*", (req, res) => {
   res.sendFile(path.join(__dirname, "build", "index.html"));
 });

  app.listen(port, () => {
    console.log(`Server Started at ${port}`);
  });
