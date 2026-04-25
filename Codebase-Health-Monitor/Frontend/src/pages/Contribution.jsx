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

  return (
    <div>
      <h2 className="text-2xl font-semibold pb-10">Contribution</h2>
      <div className="flex gap-4">
        <div className="bg-[#272953] w-[400px] h-[300px] flex rounded-lg items-center justify-center"></div>
        <div className="bg-[#272953] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center"></div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="bg-[#272953] w-[400px] h-[400px] flex rounded-lg items-center justify-center"></div>
        <div className="bg-[#272953] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center"></div>
      </div>
    </div>
  );
}
