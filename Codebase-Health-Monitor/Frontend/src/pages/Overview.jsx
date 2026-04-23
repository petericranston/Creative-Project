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
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function Overview() {
  const [repos, setRepos] = useState([]);
  const [chosenRepo, setChosenRepo] = useState();
  const [overviewData, setOverviewData] = useState([]);
  const [contributorData, setContributorData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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
  }, []);

  const fetchContributors = async (repoName) => {
    const response = await fetch(`/api/contributors?repo=${repoName}`, {
      credentials: "include",
    });
    const data = await response.json();
    setContributorData(data.contributors);
    setTimelineData(data.timeline);
    console.log("contributors:", data);
  };

  const fetchOverview = async (repoName) => {
    const response = await fetch(`/api/overview?repo=${repoName}`, {
      credentials: "include",
    });
    const data = await response.json();
    setOverviewData(data);
  };

  const contributors = //Setting the contributor data for the commits over time graph
    timelineData.length > 0
      ? [
          ...new Set(
            timelineData.flatMap(
              (entry) => Object.keys(entry).filter((k) => k !== "day"), //Calculates is daily
            ),
          ),
        ]
      : [];

  const COLOURS = ["#8884d8", "#82ca9d", "#ff7f7f", "#ffc658", "#a4de6c"]; //Settings the colours for contributors

  return (
    <div>
      <h2 className="text-2xl font-semibold pb-10">Overview</h2>
      <div className="flex gap-4">
        <div className="bg-[#272953] w-[300px] h-[300px] flex rounded-lg items-center justify-center">
          <h2 className="text-2xl">Health Score: 50%</h2>
        </div>
        <div className="flex flex-col gap-4 flex-1 h-[300px]">
          <div className="bg-[#272953] rounded-lg p-3 text-white text-sm relative flex items-center justify-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2"
            >
              {chosenRepo ? chosenRepo.name : "Choose Repo"}
              <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#272953] rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {repos.map((repo, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setChosenRepo(repo);
                      setIsOpen(false);
                      fetchContributors(repo.name);
                      fetchOverview(repo.name);
                    }}
                    className="px-4 py-2 hover:bg-[#1e2044] cursor-pointer"
                  >
                    {repo.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-[#272953] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center">
            <p className="text-xl">Repo Name: {overviewData.name}</p>
            <p className="text-xl">Created at: {overviewData.created_at}</p>
            <p className="text-xl">Last Updated: {overviewData.updated_at}</p>
            <p className="text-xl">
              Most prominent language: {overviewData.language}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="bg-[#272953] w-1/2 h-[400px] flex rounded-lg flex-col items-center justify-center mt-4">
          <p className="text-base">Commits per Contributor</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributorData}>
              <XAxis dataKey="username" />
              <YAxis />
              <Bar dataKey="commits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#272953] w-1/2 h-[400px] flex rounded-lg flex-col items-center justify-center mt-4">
          <p className="text-base">Contributions Over Time</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis dataKey="day" interval="preserveStartEnd" />
              <YAxis />
              <Tooltip />
              <Legend />
              {contributors.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLOURS[i % COLOURS.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
