import { useState, useEffect } from "react";
import "../styles/overview.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Contribution({ chosenRepo, setChosenRepo }) {
  const [overviewData, setOverviewData] = useState([]);
  const [contributorData, setContributorData] = useState([]);

  useEffect(() => {
    //Getting data from the backend
    const fetchContributors = async (repoName) => {
      const response = await fetch(`/api/contributors?repo=${repoName}`, {
        credentials: "include",
      });
      const data = await response.json();
      setContributorData(data.contributors);
      console.log("contributors:", data);
    };

    const fetchOverview = async (repoName) => {
      const response = await fetch(`/api/overview?repo=${repoName}`, {
        credentials: "include",
      });
      const data = await response.json();
      setOverviewData(data);
    };

    if (chosenRepo) {
      fetchContributors(chosenRepo.name);
      fetchOverview(chosenRepo.name);
    }
  }, [chosenRepo]);

  const COLOURS = ["#8884d8", "#82ca9d", "#ff7f7f", "#ffc658", "#a4de6c"];
  const topContributor = contributorData[0];

  return (
    <div>
      <h2 className="text-2xl font-semibold pb-10">Contribution</h2>
      <div className="flex gap-4">
        <div className="bg-[#272953] w-[400px] h-[300px] flex rounded-lg items-center justify-center flex-col">
          <p className="text-base">Dominance Chart</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contributorData}
                dataKey="dominanceScore"
                nameKey="username"
                cx="50%"
                cy="50%"
                outerRadius={120}
              >
                {contributorData.map((entry, i) => (
                  <Cell
                    key={entry.username}
                    fill={COLOURS[i % COLOURS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#272953] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center">
          {topContributor && (
            <div>
              <h2 className="text-4xl">Top Contributor</h2>
              <p className="text-xl">{topContributor.username}</p>
              <p>Dominance Score: {topContributor.dominanceScore}</p>
              <p>Commits: {topContributor.commits}</p>
              <p>Lines Added: {topContributor.additions}</p>
              <p>Lines Removed: {topContributor.deletions}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="bg-[#272953] w-[400px] h-[400px] flex rounded-lg items-center justify-center"></div>
        <div className="bg-[#272953] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center"></div>
      </div>
    </div>
  );
}
