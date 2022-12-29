const express = require("express")
const fs = require('fs/promises')
const { execFile } = require("child_process");
const { performance, PerformanceObserver } = require("perf_hooks")

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let { code, language } = req.body
        let metrics = {}
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
        if (output.statuscode || output.statuscode == null)
            msg = 'Error'
        else{
            msg = 'Successfully executed'
            let output2 = await BashDeleteContainer(`/var/lib/jenkins/workspace/compiler/server/workspaces/${language}/code.sh`)
            console.log(output2)
        }
        output.msg = msg
        console.log(output)
        res.status(200).json({ output, metrics });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

function BashDocker(code) {
    return new Promise((resolve, reject) => {
        let output = {};
        const child = execFile("sudo docker", ['run', 'ubuntu', `${code}`], { maxBuffer: 1024 * 90, timeout: 6000 }, (err, stdout, stderr) => {
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

        const child = execFile("bash", [fileName], (err, stdout, stderr) => {
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


module.exports = router;
