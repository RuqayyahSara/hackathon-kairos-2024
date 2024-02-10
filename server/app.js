import os from "os";
import config from "config";
import express from "express";
import cluster from "node:cluster";

import main from "./openai.js";
import cRouter from "./controllers/C/index.js";
import cppRouter from "./controllers/Cpp/index.js";
import python3Router from "./controllers/Python3/index.js";
import javaScriptRouter from "./controllers/JavaScript/index.js";

const app = express();
const numCpu = os.cpus().length;
const port = process.env.PORT || config.get("PORT");

if (cluster.isPrimary) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork(); // Distribution of process to other cores
  }

  //  Event to get the killed pid
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // 0 down time arch.
  });
} else {
  app.use(express.json());
  // app.use(express.static(path.join(__dirname, "build")));

  app.use("/c", cRouter);
  app.use("/cpp", cppRouter);
  app.use("/py3", python3Router);
  app.use("/js", javaScriptRouter);

  app.get("/", (req, res) => {
    res.send("Server running at 8007");
  });

  app.post("/results", async (req, res) => {
    try {
      let response = await main(req.body)
      console.log(response)
      return res.json(200).json({ response })
    } catch (err) {
      console.log(err)
      return res.json(500).json({ msg: "Internal Server Error" })
    }
  })

  app.listen(port, () => {
    console.log(`Server Started at ${port}`);
  });
  console.log(`Worker ${process.pid} started`)
}
