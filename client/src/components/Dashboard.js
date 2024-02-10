import GradientRating from "./GradientRating";

export default function Dashboard() {
  return (
    <div>
      container
      <div>
        <div>
          <h3>quantativ</h3>
          <table>
            <tr>
              <td>Code Quality</td>
              <td>Readability, Maintainability</td>
            </tr>
            <tr>
              <td>Performance</td>
              <td>Speed memory</td>
            </tr>
            <tr>
              <td>Reliability</td>
              <td>Handle all error cases</td>
            </tr>
          </table>
        </div>
        <div>
          <h3>qualitative</h3>
          <table>
            <tr>
              <td>Property 1</td>
              <td>value 1</td>
            </tr>
            <tr>
              <td>Property 2</td>
              <td>value 2</td>
            </tr>
            <tr>
              <td>Property 3</td>
              <td>value 3</td>
            </tr>
            <tr>
              <td>Property 4</td>
              <td>value 4</td>
            </tr>
            <tr>
              <td>Property 5</td>
              <td>value 5</td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <h3> personality </h3>
        <table>
          <tr>
            <td>Property 1</td>
            <td>value 1</td>
          </tr>
          <tr>
            <td>Property 2</td>
            <td>value 2</td>
          </tr>
          <tr>
            <td>Property 3</td>
            <td>value 3</td>
          </tr>
          <tr>
            <td>Property 4</td>
            <td>value 4</td>
          </tr>
          <tr>
            <td>Property 5</td>
            <td>value 5</td>
          </tr>
        </table>
      </div>
      <div>%</div>
    </div>
  );
}

/* <GradientRating rating={8} personality="confident" />
      <GradientRating rating={5} personality="nervous" /> */
