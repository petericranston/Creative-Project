import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Routes, Route } from "react-router-dom";
import Overview from "./pages/overview";
import Navbar from "./components/navbar";
import Contribution from "./pages/Contribution";
import Risk from "./pages/Risk";

function App() {
  const [repos, setRepos] = useState([]);
  const [chosenRepo, setChosenRepo] = useState(null);

  return (
    <div className="root">
      <header>
        <h1>Codebase Health Monitor</h1>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "2rem", overflow: "hidden" }}>
          <Routes>
            <Route
              path="/"
              element={
                <Overview
                  chosenRepo={chosenRepo}
                  setChosenRepo={setChosenRepo}
                />
              }
            />
            <Route
              path="/contribution"
              element={
                <Contribution
                  chosenRepo={chosenRepo}
                  setChosenRepo={setChosenRepo}
                />
              }
            />
            <Route
              path="/risk"
              element={
                <Risk chosenRepo={chosenRepo} setChosenRepo={setChosenRepo} />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
