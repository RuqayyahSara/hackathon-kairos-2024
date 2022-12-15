import { execFile } from "child_process";
import express from "express";
import fs from "fs/promises";
import { performance, PerformanceObserver } from "perf_hooks";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { code, language, args } = req.body;
    let metrics = {};
    let vargs = args.split(" ");
    console.log(req.body);
    let folderName = Math.random().toString(36).substring(2, 10);

    await fs.mkdir(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`
    );
    await fs.writeFile(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.py`,
      code
    );

    //Trigger Compiler SysCall
    const wrapped = performance.timerify(Py3compiler);
    const obs = new PerformanceObserver((list) => {
      metrics.time = (list.getEntries()[0].duration / 1000).toFixed(6);
      obs.disconnect();
    });
    obs.observe({ entryTypes: ["function"] });
    wrapped();
    metrics.memory = `${Math.floor(process.memoryUsage().heapUsed / 1024)}`;

    let output = await Py3compiler(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.py`,
      vargs
    );
    let msg;
    if (output.statuscode || output.statuscode == null) msg = "Runtime error";
    else msg = "Successfully executed";
    output.msg = msg;
    res.status(200).json({ output, metrics });

    await fs.rm(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`,
      { recursive: true, force: true }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function Py3compiler(fileName, vargs) {
  return new Promise((resolve, reject) => {
    let output = {};
    const child = execFile(
      "python3",
      [`${fileName}`, vargs].flat(),
      { maxBuffer: 1024 * 90, timeout: 6000 },
      (err, stdout, stderr) => {
        if (stdout) {
          output.stdout = stdout;
        }
        if (err) {
          if (stderr) {
            output.stderr = stderr;
            return;
          }
          output.err = err;
          console.log(err);
        }
      }
    );
    child.on("close", (statuscode) => {
      output.statuscode = statuscode;
      resolve(output);
    });
  });
}

export default router;
