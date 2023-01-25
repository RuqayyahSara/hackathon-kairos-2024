import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import spinner from "./spinner.gif";
function App() {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState({
    code: "",
    language: "JavaScript",
    args: "",
  });

  useEffect(() => {
    let codes = localStorage.getItem(`${code.language}`)
    setCode({
      ...code,
      code: codes,
    });
    // eslint-disable-next-line
  }, [])

  let onChangeHandler = (e) => {
    localStorage.setItem(`${code.language}`, code.code);
    setCode({
      ...code,
      [e.target.name]: e.target.value,
    });
  };

  let onSubmitHandler = async (e) => {
    try {
      localStorage.setItem(`${code.language}`, code.code);
      e.preventDefault();
      setLoading(true);
      // setTimeout()
      let res;
      if (code.language === "Python2")
        res = await axios.post("/py2", code);
      else if (code.language === "C") {
        res = await axios.post("/c", code);
        console.log(res.data.metrics)
      }
      else if (code.language === "Python3")
        res = await axios.post("/py3", code);
      else if (code.language === "JavaScript")
        res = await axios.post("/js", code);
      else if (code.language === "Ruby")
        res = await axios.post("/rb", code);
      else if (code.language === "Cpp")
        res = await axios.post("/cpp", code);
      else res = await axios.post("/sh", code);
      // console.log(res.data)
      setOutput(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="App">
      <center>
        <div style={{ marginLeft: "15%" }}>
          <h1
            style={{
              fontFamily: "sans-serif",
              color: "#666",
              textAlign: "left",
            }}
          >
            Code & Compile
          </h1>
          <p
            style={{
              fontFamily: "sans-serif",
              color: "#666",
              textAlign: "left",
            }}
          >
            Compile & run your code with our online IDE. <br />
            Our online compiler supports multiple programming languages like
            Python, C++, C, NodeJS, and many more.
          </p>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className="run-info">
            <br />
            <br />
            <div className="select-style">
              <select
                name="language"
                onChange={(e) => {
                  let codes = localStorage.getItem(`${e.target.value}`)
                  setCode({
                    ...code,
                    language: e.target.value,
                    code: codes ? codes : ""
                  });
                }}
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python2"> Python (2.7.18)</option>
                <option value="Python3">Python (3.10.6)</option>
                <option value="C">C</option>
                <option value="Ruby">Ruby</option>
                <option value="Cpp">C++</option>
                <option value="Bash">Bash</option>
              </select>
            </div>
            <div className="files">
              <input
                style={{ alignItems: "start" }}
                type="file"
                accept=".c, .py, .js, .sh .rb .cpp"
                onChange={(e) => {
                  let file = e.target.files[0];
                  let reader = new FileReader();
                  reader.onload = function (event) {
                    setCode({
                      ...code,
                      code: event.target.result,
                    });
                    localStorage.setItem(`${code.language}`, code.code);
                  };
                  reader.readAsText(file);
                }}
              />
            </div>
            <br />
            <br />
            <textarea
              className="editor"
              name="code"
              rows="25"
              value={code.code}
              onChange={onChangeHandler}
              placeholder="Start typing..."
            />
            <br />
            <br />
            {loading && (
              <div style={{ marginLeft: "76%", display: "flex", fontFamily: "sans-serif", fontSize: "small" }}>
                <img src={spinner} alt="spinner" width={25} style={{ margin: "-5px" }} /> &nbsp;
                Submission queued
              </div>
            )}
            <br />



            <button type="submit" style={{ marginLeft: "70%" }}>
              Run
            </button>
            <br />
            <br />
          </div>
          <div className="run-info">
            <div className="run-details">
              <b>
                {" "}
                <div className="key" style={{ textAlign: "left" }}>
                  Command Line Arguments
                </div>{" "}
              </b>
              <input
                name="args"
                type="text"
                onChange={onChangeHandler}
                className="input"
                placeholder="Eg. 23 12"
              />
            </div>
          </div>
        </form>

        <br />
        <br />

        {output && (
          <div className="run-info">
            <div className="run-details">
              <span className="run-details-info">
                <span className="key">
                  <b>Status </b>
                </span>{" "}
                &nbsp;
                <span className="value">{output && output.output.msg}</span>
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
                  {output ? (output.metrics ? output.metrics.time : 0) : 0} sec
                </span>
              </span>

              <span className="run-details-info">
                <span className="key">
                  <b>Mem </b>
                </span>
                &nbsp;
                <span className="value">
                  {output ? (output.metrics ? output.metrics.memory : 0) : 0} KB
                </span>
              </span>
            </div>
            <div className="run-output">
              <div className="run-output-info">
                {output && output.output.stdout && (
                  <>
                    <div className="key">Output</div>
                    <textarea
                      readOnly
                      disabled
                      rows="6"
                      className={`output-stdout`}
                      value={output.output.stdout}
                    />
                  </>
                )}
              </div>
              <div className="run-output-info">
                {output && (output.output.stderr || output.output.err) && (
                  <>
                    <div className="key">Error</div>
                    <textarea
                      readOnly
                      rows="6"
                      className={`output-stderr`}
                      value={
                        output.output.stderr
                          ? output.output.stderr
                          : output.output.err.code
                            ? output.output.err.code
                            : output.output.err.signal
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </center>
    </div>
  );
}

export default App;
