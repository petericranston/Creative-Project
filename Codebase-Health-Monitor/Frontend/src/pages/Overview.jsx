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
  Cell,
} from "recharts";

export default function Overview({
  chosenRepo,
  setChosenRepo,
  username,
  newUser,
  setNewUser,
}) {
  //Usestate variables
  const [repos, setRepos] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [contributorData, setContributorData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [showHealthTips, setShowHealthTips] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    //Getting data from the backend

    const fetchContributors = async (repoName) => {
      //Getting contributor data
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contributors?repo=${repoName}&username=${username}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setContributorData(data.contributors);
      setTimelineData(data.timeline);
      setHealthScore(data.healthScore);
      console.log("contributors:", data);
    };

    const fetchOverview = async (repoName) => {
      //Getting overview data
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/overview?repo=${repoName}&username=${username}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setOverviewData(data);
    };

    const getRepos = async () => {
      //Getting the repos to be chosen from
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getRepos?username=${username}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setRepos(data);
    };

    if (chosenRepo) {
      //Asking for repo data once a repo has been chosen
      fetchContributors(chosenRepo.name);
      fetchOverview(chosenRepo.name);
    }
    if (newUser == true) {
      //Resetting chosenRepo variable if the user signs in as a different github user
      setChosenRepo("");
      setNewUser(false);
    }

    getRepos();
  }, [chosenRepo, username, newUser, setChosenRepo, setNewUser]); //Reruns the useEffect if any of these change

  return (
    <div>
      <h2 className="text-2xl font-semibold pb-10">Overview</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-[#1f2937] border border-[#8b5cf6]/25 w-full md:w-[300px] h-[300px] flex rounded-lg items-center justify-center order-last md:order-first">
          <div className="text-center p-4">
            {healthScore ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "4px solid #8b5cf6",
                  boxShadow: "0 0 20px rgba(139,92,246,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#c4b5fd",
                  margin: "0 auto",
                }}
              >
                {healthScore.overall}%
              </div>
            ) : (
              <div>
                <h2 className="text-2xl">Health Score</h2>
                <p className="text-gray-400 text-sm">
                  Select a repo to view data
                </p>
              </div>
            )}

            <button
              onClick={() => setShowHealthTips(!showHealthTips)}
              className="text-sm text-white hover:text-blue-300 mt-2"
            >
              {showHealthTips ? "Hide ▲" : "Learn more ▼"}
            </button>
            {showHealthTips && (
              <div className="text-sm mt-2 text-left">
                <p>
                  The health score is based on four calculations: How recently
                  you've committed, how even the workload is, how frequently you
                  commit and the amount of deletions vs additions to code
                  (cleaning code)
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1 sm:h-[300px] order-first md:order-last">
          <div className="bg-[#1f2937] border border-[#8b5cf6]/25 rounded-lg p-3 text-white text-sm relative flex items-center justify-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2"
            >
              {chosenRepo ? chosenRepo.name : "Choose Repo"}
              <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#1f2937] border border-[#8b5cf6]/25 rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {repos.map((repo, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setChosenRepo(repo);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-[#1e2044] cursor-pointer"
                  >
                    {repo.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-[#1f2937] border border-[#8b5cf6]/25 rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center">
            {overviewData.name ? (
              <>
                <div className="flex gap-2">
                  {/* Improving the styling by separating the label and content */}
                  <span className="text-gray-400">Repo Name:</span>
                  <span>{overviewData.name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">Created at:</span>
                  <span>{overviewData.created_at?.slice(0, 10)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">Last Updated:</span>
                  <span>{overviewData.updated_at?.slice(0, 10)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">
                    Most prominent language:
                  </span>
                  <span>{overviewData.language}</span>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">
                Select a repo to view data
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-[#1f2937] border border-[#8b5cf6]/25 w-full md:w-1/2 h-[400px] flex rounded-lg flex-col items-center justify-center mt-4">
          <p className="text-base">Commits per Contributor</p>
          {contributorData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributorData}>
                <XAxis dataKey="username" />
                <YAxis />
                <Bar dataKey="commits">
                  {/* Adding colour coding to the graphs */}
                  {contributorData.map((entry, i) => (
                    <Cell
                      key={entry.username}
                      fill={COLOURS[i % COLOURS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">Select a repo to view data</p>
          )}
          {/* Default content if no data is available */}
        </div>
        <div className="bg-[#1f2937] border border-[#8b5cf6]/25 w-full md:w-1/2 h-[400px] flex rounded-lg flex-col items-center justify-center mt-4">
          <p className="text-base">Contributions Over Time</p>
          {contributorData.length > 0 ? (
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
          ) : (
            <p className="text-gray-400 text-sm">Select a repo to view data</p>
          )}
        </div>
      </div>
    </div>
  );
}
