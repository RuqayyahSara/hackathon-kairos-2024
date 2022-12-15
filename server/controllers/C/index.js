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
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.c`,
      code
    );

    let output = await CCompiler(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.c`
    );
    let msg;
    if (output.statuscode || output.statuscode == null) {
      msg = "Compilation error";
      output.msg = msg;
      await fs.rm(
        `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`,
        { recursive: true, force: true }
      );
      return res.status(200).json({ output });
    } else {
      //Trigger Compiler SysCall
      const wrapped = performance.timerify(Cbinary);
      const obs = new PerformanceObserver((list) => {
        metrics.time = (list.getEntries()[0].duration / 1000).toFixed(6);
        obs.disconnect();
      });
      obs.observe({ entryTypes: ["function"] });
      wrapped();
      metrics.memory = `${Math.floor(process.memoryUsage().heapUsed / 1024)}`;
      if (!metrics.time) metrics.time = 0;
      let output2 = await Cbinary(vargs);
      if (output2.statuscode || output2.statuscode == null)
        msg = "Runtime error";
      else msg = "Successfully executed";
      output2.msg = msg;
      res.status(200).json({ output: output2, metrics });
    }
    await fs.unlink(`./a.out`);
    await fs.rm(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`,
      { recursive: true, force: true }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function CCompiler(fileName) {
  return new Promise((resolve, reject) => {
    let output = {};
    const child = execFile(
      `gcc`,
      [fileName],
      { maxBuffer: 1024 * 90, timeout: 6000 },
      (err, stdout, stderr) => {
        if (stdout) {
          output.stdout = stdout;
        }
        if (err) {
          if (stderr) {
            output.stderr = stderr;
            // console.log('stderr',stderr);
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

function Cbinary(vargs) {
  return new Promise((resolve, reject) => {
    let output = {};
    const child = execFile(
      `./a.out`,
      [vargs].flat(),
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
