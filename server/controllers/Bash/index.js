import { execFile } from "child_process";
import express from "express";
import fs from "fs/promises"
import { performance, PerformanceObserver } from "perf_hooks";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let { code, language } = req.body
        let metrics = {}, msg, flag = 0
        let divide = code.split(" ")
        console.log(req.body)
 let noExe = [
      "rm -rf",
      "rm",
      "awk",
      "touch",
      "pwd",
      "sudo",
      "rmdir",
      "man",
      "mkdir",
      "cd",
      "cd ..",
      "ls",
      "ls -a",
      "ls -lhai",
      "mkdir -p",
      "cp",
      "cp -r",
      "mv",
      "tree",
      "wc",
      "ls /",
      "man",
      "wc -l",
      "ln -s",
      "tar -czvf",
      "nano",
      "vim",
      "export",
      "locate",
      "ls -lSh",
      "cat",
      "sudo su",
      "chmod",
      "which",
      "ps aux",
      "ps",
      "kill",
      "top",
      "htop",
      "ifconfig",
      "systemctl",
      "dnf",
      "apt",
      "mount",
      "ip -a",
      "ip addr show",
      "ping",
      "resolvectl status",
      "host",
      "dig",
      "ss",
      "traceroute",
      "tracepath",
      "ssh",
      "gcp",
      "yum",
      "iptables",
      "w",
      "crontab -l",
      "crontab -e",
      "git clone",
      "git",
      "cd /",
      "grep",
      "node",
      "npm",
      "history",
      "gcc",
      "g++",
      "pm2",
      "docker",
      "groups",
      "users",
      "uid",
      "id",
      "user",
      "whoami",
      "lsof",
      "pkg",
      "scp",
      "scp -r",
      "bash",
      "#!/bin/bash",
      "gcloud",
    ];      

    for (let i = 0; i < noExe.length; i++) {
      if (divide[0] == noExe[i]) {
        flag = 1
        break
      }
    }

    if (flag == 1) {
      return res.status(200).json({
        output: {
          msg: "Error",
          statuscode: 1,
          stderr: "Invalid Command",
        },
        metrics: { time: 0, memory: 0 },
      });
    }

    let folderName = Math.random().toString(36).substring(2, 10);
    await fs.mkdir(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`
    );
    await fs.writeFile(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.sh`,
      code
    );    
        //Trigger Compiler SysCall
        const wrapped = performance.timerify(BashCompiler);
        const obs = new PerformanceObserver((list) => {
            metrics.time = ((list.getEntries()[0].duration) / 1000).toFixed(6);
            obs.disconnect();
        });
        obs.observe({ entryTypes: ['function'] });
        wrapped();
        metrics.memory = `${Math.floor(process.memoryUsage().heapUsed / 1024)} KB`;

        let output = await BashCompiler(`/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}/code.sh`)
       if (output.statuscode !== 1 || output.statuscode !== null)
         msg = 'Successfully executed'
        else
            msg = 'Error'
        output.msg = msg
        res.status(200).json({ output, metrics });

 await fs.rm(
      `/var/lib/jenkins/workspace/Cloud-Compiler/server/workspaces/${language}/${folderName}`,
      { recursive: true, force: true }
    );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


function BashCompiler(fileName) {
    return new Promise((resolve, reject) => {
        let output = {};

        const child = execFile("bash", [`${fileName}`], { maxBuffer: 1024 * 90, timeout: 6000 } ,(err, stdout, stderr) => {
            if (stdout) {
                output.stdout = stdout;
                // console.log(stdout);
            }
            if (err) {
                if (stderr) {
                    output.stderr = stderr;
                    return;
                }
                output.err = err;
            }
        });
        child.on("close", (statuscode) => {
            output.statuscode = statuscode
            resolve(output);
        });
    });
}
export default router;
