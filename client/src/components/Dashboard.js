import { useEffect, useState } from "react";
export default function Dashboard() {
  const [result, setResult] = useState(JSON.parse(localStorage.getItem("result")));

  useEffect(() => {
    console.log('first')
    setResult(JSON.parse(localStorage.getItem("result")));
  }, []);

  return (
    <div style={{ backgroundColor: "#141717" }}>
      <div style={{ width: "100%", paddingBottom: "20px", color: "white", fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>
        <div >
          <div style={{ width: "33%", float: "left" }}>
            <h3 >Quantitative Metrics</h3>
            <center>
              <table style={{ border: "3px solid white", padding: "10px" }}>
                <tr> <th>Parameter </th> <th>Score (out of 10) </th> </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Lines Of Code</td>
                  <td style={{ textAlign: "center" }}>{result.QuantitativeMetrics.LinesOfCode}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Code Churn</td>
                  <td style={{ textAlign: "center" }}>{result.QuantitativeMetrics.CodeChurn}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Efficiency</td>
                  <td style={{ textAlign: "center" }}>{result.QuantitativeMetrics.Efficiency}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Cyclomatic complexity</td>
                  <td style={{ textAlign: "center" }}>{result.QuantitativeMetrics["Cyclomatic complexity"]}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Code duplication</td>
                  <td style={{ textAlign: "center" }}>{result.QuantitativeMetrics["code duplication"]}</td>
                </tr>
              </table>
            </center>
          </div>

          <div style={{ width: "33%", float: "left", fontSize: "30px", color: "white", fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>
            <p>
              Final Score
            </p>
            <center>
              <div style={{ fontSize: "40px", borderRadius: "100%", border: "8px solid #C0C0C0", width: "30%", paddingTop: "10px", paddingBottom: "10px" }}>
                <p>{result.FinalScore}</p>
              </div>
            </center>
          </div>

          <div style={{ width: "33%", float: "right" }}>
            <h3>Qualitative Metrics</h3>
            <center>
              <table style={{ border: "3px solid white", padding: "20px", }}>
                <tr> <th> Parameter </th> <th> Score (out of 10) </th> </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Readability</td>
                  <td style={{ textAlign: "center" }}>{result.QualitativeMetrics.Readability}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Modularity</td>
                  <td style={{ textAlign: "center" }}>{result.QualitativeMetrics.Modularity}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>Comments</td>
                  <td style={{ textAlign: "center" }}>{result.QualitativeMetrics.Comments}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>variable_naming</td>
                  <td style={{ textAlign: "center" }}>{result.QualitativeMetrics.variable_naming}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>ErrorHandling</td>
                  <td style={{ textAlign: "center" }}>{result.QualitativeMetrics.ErrorHandling}</td>
                </tr>
              </table>
            </center>
          </div>



        </div>
      </div>


      <div style={{ width: "100%", paddingTop: "100px", paddingBottom: "60px", color: "white", fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>
        <center>
          <h3 style={{ marginRight: "420px" }}> Personality Traits </h3>

          <table style={{ border: "3px solid white", padding: "10px 10px 10px 20px", marginRight: "20px" }}>
            <tr> <th> Parameter </th> <th> Score (out of 10) </th> <th> Comment </th></tr>
            <tr>
              <td style={{ textAlign: "center" }}>Work Under Pressure</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.WorkUnderPressure.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.WorkUnderPressure.explanation}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Collaborator</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.Collaborator.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.Collaborator.explanation}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Communication</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.Communication.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.Communication.explanation}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Leadership Skills</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.LeadershipSkills.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.LeadershipSkills.explanation}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Time Management</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.TimeManagement.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.TimeManagement.explanation}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Continuous Learning</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.ContinuousLearning.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.ContinuousLearning.explanation}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Accountability</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.Accountability.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.Accountability.explanation}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Critical Thinking</td>
              <td style={{ textAlign: "center" }}>{result.PersonalityTraits.CriticalThinking.score}</td>
              <td style={{ textAlign: "justify" }}>{result.PersonalityTraits.CriticalThinking.explanation}</td>
            </tr>

          </table>
        </center>
      </div>



    </div>
  );
}
