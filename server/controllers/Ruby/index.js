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
    let folderName = Math.random().toString(36).substring(2, 10);

    await fs.mkdir(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`
    );
    await fs.writeFile(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.rb`,
      code
    );

    //Trigger Compiler SysCall
    const wrapped = performance.timerify(rubyCompiler);
    const obs = new PerformanceObserver((list) => {
      metrics.time = (list.getEntries()[0].duration / 1000).toFixed(6);
      obs.disconnect();
    });
    obs.observe({ entryTypes: ["function"] });
    wrapped();
    metrics.memory = `${Math.floor(process.memoryUsage().heapUsed / 1024)}`;
    if (!metrics.time) metrics.time = 0;
    let output = await rubyCompiler(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.rb`,
      vargs
    );
    let msg;
    if (output.statuscode || output.statuscode == null) msg = "Runtime error";
    else msg = "Successfully executed";
    output.msg = msg;
    res.status(200).json({ success: "Received the Code", output, metrics });

    await fs.rm(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`,
      { recursive: true, force: true }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function rubyCompiler(fileName, vargs) {
  return new Promise((resolve, reject) => {
    let output = {};
    const child = execFile(
      "ruby",
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
