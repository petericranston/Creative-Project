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
import Overview from "./pages/Overview";
import Navbar from "./components/Navbar";
import Contribution from "./pages/Contribution";
import Analysis from "./pages/Analysis";
import Settings from "./pages/Settings";

function App() {
  const [repos, setRepos] = useState([]);
  const [chosenRepo, setChosenRepo] = useState(null);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || null,
  );
  const [newUser, setNewUser] = useState(false);

  return (
    <div className="root">
      <header className="sticky top-0 z-50">
        <h1 className="flex ">
          <span>Git</span>
          <span className="text-[#a78bfa]">Vitals</span>
        </h1>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "2rem", overflow: "auto" }}>
          <Routes>
            <Route
              path="/settings"
              element={
                <Settings
                  username={username}
                  setUsername={setUsername}
                  setNewUser={setNewUser}
                  setChosenRepo={setChosenRepo}
                />
              }
            />
            <Route
              path="/"
              element={
                <Overview
                  chosenRepo={chosenRepo}
                  setChosenRepo={setChosenRepo}
                  username={username}
                  setNewUser={setNewUser}
                  newUser={newUser}
                />
              }
            />
            <Route
              path="/contribution"
              element={
                <Contribution
                  chosenRepo={chosenRepo}
                  setChosenRepo={setChosenRepo}
                  username={username}
                />
              }
            />
            <Route
              path="/analysis"
              element={
                <Analysis
                  chosenRepo={chosenRepo}
                  setChosenRepo={setChosenRepo}
                  username={username}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
