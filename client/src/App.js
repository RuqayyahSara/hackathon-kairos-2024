import "./App.css";
import ExamPrompt from "./components/ExamPrompt";
import Header from "./components/Header";
import Timer from "./components/Timer";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ExamPrompt />} />
          <Route path="/result" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
