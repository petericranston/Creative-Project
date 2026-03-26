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

function App() {
  const [repos, setRepos] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [contributorData, setContributorData] = useState([]);
  const [filesContent, setFilesContent] = useState([]);

  useEffect(() => {
    //Getting data from the backend
    const getRepos = async () => {
      const response = await fetch("/api/getRepos", {
        credentials: "include",
      });
      const data = await response.json();
      setRepos(data);
    };

    const fetchContributors = async () => {
      const response = await fetch("/api/contributors", {
        credentials: "include",
      });
      const data = await response.json();
      setContributorData(data);
    };

    const fetchOverview = async () => {
      const response = await fetch("/api/overview", {
        credentials: "include",
      });
      const data = await response.json();
      setOverviewData(data);
    };

    const fetchFilesContent = async () => {
      const response = await fetch("/api/filesContent", {
        credentials: "include",
      });
      const data = await response.json();
      setFilesContent(data);
    };
    getRepos();
    fetchContributors();
    fetchOverview();
    fetchFilesContent();
  }, []);

  return (
    <div>
      <header>
        <h1>Codebase Health Monitor</h1>
      </header>
      <Routes>
        <Route path="/" element={<Overview />} />
      </Routes>
    </div>
  );
}

export default App;
