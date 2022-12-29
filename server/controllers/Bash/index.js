import { execFile } from "child_process";
import express from "express";
import fs from "fs/promises"
import { performance, PerformanceObserver } from "perf_hooks";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let { code, language } = req.body
        let metrics = {}, msg
        console.log(req.body)

        //Trigger Compiler SysCall
        const wrapped = performance.timerify(BashDocker);
        const obs = new PerformanceObserver((list) => {
            metrics.time = ((list.getEntries()[0].duration) / 1000).toFixed(6);
            obs.disconnect();
        });
        obs.observe({ entryTypes: ['function'] });
        wrapped();
        metrics.memory = `${Math.floor(process.memoryUsage().heapUsed / 1024)} KB`;

        let output = await BashDocker(code)
       if (output.statuscode !== 1 || output.statuscode !== null)
         msg = 'Successfully executed'
        else
            msg = 'Error'
        output.msg = msg
        res.status(200).json({ output, metrics });
        if (output.statuscode !== 1 || output.statuscode !== null) {  
            let output2 = await BashDeleteContainer(`/var/lib/jenkins/workspace/compiler/server/workspaces/Bash/code.sh`)
            console.log(output2)
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

function BashDocker(code) {
    return new Promise((resolve, reject) => {
        let output = {};
       let codes = code.split(" ")
        const child = execFile("sudo", ['docker', 'run', 'myubuntu', codes].flat() , { maxBuffer: 1024 * 90, timeout: 6000 }, (err, stdout, stderr) => {
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
    })
}

function BashDeleteContainer(fileName) {
    return new Promise((resolve, reject) => {
        let output = {};

        const child = execFile("bash", [`${fileName}`], (err, stdout, stderr) => {
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
