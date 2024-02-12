import { useEffect, useState } from "react";
import axios from "axios";
import spinner from "../images/spinner.gif";
import Header from "./Header";
import Timer from "./Timer";
import { Navigate, useNavigate, useResolvedPath } from "react-router-dom";
import { minutesRemain } from "./services";

export default function ExamPrompt(props) {
  const [output, setOutput] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const [code, setCode] = useState({
    code: "",
    language: "JavaScript",
    args: "",
  });
  const [ans1, setAns1] = useState("");
  const [ans2, setAns2] = useState("");

  useEffect(() => {
    localStorage.removeItem("result");
    let codes = localStorage.getItem(`${code.language}`);
    setCode({
      ...code,
      code: codes,
    });
    // eslint-disable-next-line
  }, []);

  let onChangeHandler = (e) => {
    localStorage.setItem(`${code.language}`, code.code);
    setCode({
      ...code,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "code1") {
      setAns1(e.target.value);
    } else {
      setAns2(e.target.value);
    }
  };

  let onSubmitHandler = async (e) => {
    let attempted = 0;
    if (ans1.length > 0 && ans2.length > 0) {
      attempted = 2;
    } else if (ans1.length > 0 || ans2.length > 0) {
      attempted = 1;
    }

    const req = {
      count: 2,
      attempted: attempted,
      timeTaken: minutesRemain(timeRemaining),
      questions: [
        {
          question: "Write a program to print Fibonacci series",
          code: ans1,
        },
        {
          question: "Write a program to find Prime number",
          code: ans2,
        },
      ],
    };

    try {
      localStorage.setItem(`${code.language}`, code.code);
      e.preventDefault();
      let res = await axios.post("/results", req);
      let data = res?.data?.results.replaceAll("\n", "");
      data = data.replaceAll("\"", "");
      const resString = JSON.parse(res?.data?.results);
      localStorage.setItem("result", JSON.stringify(resString));
      navigate("/result");
    } catch (err) {
      navigate("/result");
      console.log(err?.response?.data);
    }
  };

  const onClickRun = async (e) => {
    e.preventDefault();
    const codeTemp = {
      code: e.target.name === "code1" ? ans1 : ans2,
      language: code.language,
      args: "",
    };
    let res;
    if (codeTemp.language === "C") {
      res = await axios.post("/c", codeTemp);
    } else if (codeTemp.language === "Python3")
      res = await axios.post("/py3", codeTemp);
    else if (codeTemp.language === "JavaScript")
      res = await axios.post("/js", codeTemp);
    else if (codeTemp.language === "Cpp")
      res = await axios.post("/cpp", codeTemp);
    setOutput(res?.data);
  };

  return (
    <center>
      <Timer setTimeRemaining={setTimeRemaining} />
      <form onSubmit={onSubmitHandler}>
        <div className="run-info">
          <br />
          <div className="select-style">
            <select
              name="language"
              onChange={(e) => {
                let codes = localStorage.getItem(`${e.target.value}`);
                setCode({
                  ...code,
                  language: e.target.value,
                  code: codes ? codes : "",
                });
              }}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python3">Python (3.10.6)</option>
              <option value="C">C</option>
              <option value="Cpp">C++</option>
            </select>
          </div>
          <br />
          <p>Q1. Write a program to print Fibonacci series</p>
          <textarea
            className="editor"
            name="code1"
            rows="25"
            value={ans1}
            onChange={onChangeHandler}
            placeholder="Start typing..."
          />
          <br />

          <button
            style={{ marginLeft: "70%", borderRadius: "15px" }}
            name="code1"
            onClick={onClickRun}
          >
            Run
          </button>
          <br />
          <br />

          <p>Q1. Write a program to find Prime number</p>
          <textarea
            className="editor"
            name="code2"
            rows="25"
            value={ans2}
            onChange={onChangeHandler}
            placeholder="Start typing..."
          />
          <br />
          <button
            style={{ marginLeft: "70%", borderRadius: "15px" }}
            name="code2"
            onClick={onClickRun}
          >
            Run
          </button>
          <br />
          <br />
        </div>
        <div>
          <button type="submit" onClick={onSubmitHandler} style={{ marginTop: "5px", borderRadius: "15px" }}>Submit</button>
        </div>
      </form>

      {output && (
        <div className="run-info">
          <div className="run-details">
            <span className="run-details-info">
              <span className="key">
                <b>Status </b>
              </span>{" "}
              &nbsp;
              <span className="value">{output && output?.output?.msg}</span>
            </span>

            <span className="run-details-info">
              <span className="key">
                <b>Date </b>
              </span>
              &nbsp;
              <span className="value">{new Date().toLocaleString()}</span>
            </span>

            <span className="run-details-info">
              <span className="key">
                <b>Time </b>
              </span>
              &nbsp;
              <span className="value">
                {output ? (output?.metrics ? output?.metrics?.time : 0) : 0} sec
              </span>
            </span>

            <span className="run-details-info">
              <span className="key">
                <b>Mem </b>
              </span>
              &nbsp;
              <span className="value">
                {output ? (output?.metrics ? output?.metrics?.memory : 0) : 0}{" "}
                KB
              </span>
            </span>
          </div>
          <div className="run-output">
            <div className="run-output-info">
              {output && output?.output?.stdout && (
                <>
                  <div className="key">Output</div>
                  <textarea
                    readOnly
                    disabled
                    rows="6"
                    className={`output-stdout`}
                    value={output?.output?.stdout}
                  />
                </>
              )}
            </div>
            <div className="run-output-info">
              {output && (output?.output?.stderr || output?.output?.err) && (
                <>
                  <div className="key">Error</div>
                  <textarea
                    readOnly
                    rows="6"
                    className={`output-stderr`}
                    value={
                      output.output.stderr
                        ? output?.output?.stderr
                        : output?.output?.err?.code
                          ? output?.output?.err?.code
                          : output?.output?.err?.signal
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </center>
  );
}
