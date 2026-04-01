import { useState } from "react";
import { useEffect } from "react";
import "../styles/overview.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Overview() {
  const [repos, setRepos] = useState([]);
  const [chosenRepo, setChosenRepo] = useState();
  const [overviewData, setOverviewData] = useState([]);
  const [contributorData, setContributorData] = useState([]);

  useEffect(() => {
    //Getting data from the backend
    const getRepos = async () => {
      const response = await fetch("/api/getRepos", {
        credentials: "include",
      });
      const data = await response.json();
      setRepos(data);
    };

    getRepos();
  });

  return (
    <div>
      <h2>Overview</h2>
      {repos && repos.map((user, index) => <p key={index}>{user.name}</p>)}
    </div>
  );
}
