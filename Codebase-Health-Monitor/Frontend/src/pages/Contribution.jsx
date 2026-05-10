import { useState, useEffect } from "react";

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

export default function Contribution({ chosenRepo, setChosenRepo, username }) {
  const [contributorData, setContributorData] = useState([]);

  useEffect(() => {
    //Getting data from the backend
    const fetchContributors = async (repoName) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contributors?repo=${repoName}&username=${username}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setContributorData(data.contributors);
      console.log("contributors:", data);
    };

    if (chosenRepo) {
      fetchContributors(chosenRepo.name);
    }
  }, [chosenRepo, username]);

  const COLOURS = ["#8884d8", "#82ca9d", "#ff7f7f", "#ffc658", "#a4de6c"];
  const topContributor = contributorData[0];

  return (
    <div>
      <h2 className="text-2xl font-semibold pb-10">Contribution</h2>
      <div className="flex gap-4">
        <div className="bg-[#272953] border border-[#3d4199] w-[400px] h-[330px] flex rounded-lg items-center justify-center flex-col">
          <p className="text-base">Dominance Chart</p>
          {contributorData.length > 0 ? (
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
          ) : (
            <p className="text-gray-400 text-sm">Select a repo to view data</p>
          )}
        </div>
        <div className="bg-[#272953] border border-[#3d4199] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center">
          <h2 className="text-4xl">Top Contributor</h2>
          {topContributor ? (
            <div className="flex flex-col mt-4">
              <div className="flex gap-2">
                <span className="text-gray-400">Username:</span>
                <span>{topContributor.username}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Dominance Score:</span>
                <span>{topContributor.dominanceScore}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Commits:</span>
                <span>{topContributor.commits}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Lines Added:</span>
                <span>{topContributor.additions}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Lines Removed:</span>
                <span>{topContributor.deletions}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-4">
              Select a repo to view data
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="bg-[#272953] border border-[#3d4199] w-[400px] h-[350px] flex rounded-lg items-center justify-center overflow-hidden flex-col">
          <p className="text-base">Commits per Contributor</p>
          <div className="overflow-y-auto w-full h-full rounded-lg p-4 text-white flex flex-1 items-center flex-col">
            {contributorData.length > 0 ? (
              <>
                {contributorData.map((contributor, i) => (
                  <div
                    key={contributor.username}
                    className="flex items-center gap-2 py-2"
                  >
                    <div
                      style={{ background: COLOURS[i % COLOURS.length] }}
                      className="w-3 h-3 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{contributor.username}</p>
                      <p className="text-sm">{contributor.commits} commits</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-400 text-sm mt-4">
                Select a repo to view data
              </p>
            )}
          </div>
        </div>
        <div className="bg-[#272953] border border-[#3d4199] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center h-[350px] overflow-hidden">
          <p className="text-base">Lines Added/Removed per Contributor</p>
          <div className="overflow-y-auto w-full h-full flex flex-col flex-1 items-center">
            {contributorData.length > 0 ? (
              <>
                {contributorData.map((contributor, i) => (
                  <div
                    key={contributor.username}
                    className="flex items-center gap-2 py-2"
                  >
                    <div
                      style={{ background: COLOURS[i % COLOURS.length] }}
                      className="w-3 h-3 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{contributor.username}</p>
                      <p className="text-sm">
                        {contributor.additions} Lines Added
                      </p>
                      <p className="text-sm">
                        {contributor.deletions} Lines Removed
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-400 text-sm mt-4">
                Select a repo to view data
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
