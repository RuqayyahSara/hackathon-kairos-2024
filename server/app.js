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

  app.post("/results", async (req, res) => {
    try {
      console.log(req.body)
      let response = await main(
        `I have an assessment of ${req.body.count} questions timed for 20 minutes. 
        The interviewee answered ${req.body.attempted}/${req.body.count} questions in a span of ${req.body.timeTaken} minutes. 
        I will provide the code for each question below. Review my code and tell me how skilled a programmer he is. 
        if no relevant code is given for the corresponding question, evaluate that program as a fail and set results accordingly. 
        Categorise code quality into quantitative and qualitative coding metrics. 
        Make sure to apply all the valid test cases to the corresponding problem for better results.  
        I also want you to infer the personality traits of the coder from the above metrics that you evaluated and add other traits such as work under pressure, collaborator, communication, leadership skills, time management, continuous learning, accountability & critical thinking etc.  
        Give me the scoring out of 10 and give a one line explanation of each trait in the 'explanation' property. Show me the results in JSON format. Please follow the json schema given below. And dont give any explanations outside the json
        
        {
          "QuantitativeMetrics": {
            "LinesOfCode": "Number",
            "CodeChurn": "Number",
            "Efficiency": "Number",
            "Cyclomatic complexity" : "Number",
            "code duplication" :"Number",
          },
          "QualitativeMetrics": {
            "Readability": "Number",
            "Modularity": "Number",
            "Comments": "Number",
            "variable_naming": "Number",
            "ErrorHandling": "Number"
          },
          "PersonalityTraits": {
            "WorkUnderPressure": {"score": "Number", "explanation": "String"},
            "Collaborator": {"score": "Number", "explanation": "String"},
            "Communication": {"score": "Number", "explanation": "String"},
            "LeadershipSkills": {"score": "Number", "explanation": "String"},
            "TimeManagement": {"score": "Number", "explanation": "String"},
            "ContinuousLearning": {"score": "Number", "explanation": "String"},
            "Accountability": {"score": "Number", "explanation": "String"},
            "CriticalThinking": {"score": "Number", "explanation": "String"},
          },
          "FinalScore": "Number"
        }
        Finally, give me the Final score of the interviewer as a skilled coder based on the metrics and personality traits.
         
        Question 1 -  ${req.body.questions[0].question}
        code - ${req.body.questions[0].code}
         
        Question 2 -  ${req.body.questions[1].question}
        code - ${req.body.questions[1].code}`
      )
      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: "Internal Server Error" })
    }
  })

  app.use("/c", cRouter);
  app.use("/cpp", cppRouter);
  app.use("/py3", python3Router);
  app.use("/js", javaScriptRouter);

  app.get("/", (req, res) => {
    res.send("Server running at 8007");
  });

  app.listen(port, () => {
    console.log(`Server Started at ${port}`);
  });
  console.log(`Worker ${process.pid} started`)
}
