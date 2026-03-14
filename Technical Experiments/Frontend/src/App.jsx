import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [overviewData, setOverviewData] = useState([]);
  const [contributorData, setContributorData] = useState([]);

  useEffect(() => {
    //Getting data from the backend
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
    fetchContributors();
    fetchOverview();
  }, []);

  // name: repoData.name,
  // full_name: repoData.full_name,
  // created_at: repoData.created_at,
  // updated_at: repoData.updated_at,
  // language: repoData.language,
  return (
    <div>
      <header>
        <h1>Codebase Health Monitor</h1>
      </header>
      <main>
        <h2>Overview</h2>
        <p>Repo Name: {overviewData.name}</p>
        <p>Created at: {overviewData.created_at}</p>
        <p>Last Updated: {overviewData.updated_at}</p>
        <p>Most prominent language: {overviewData.language}</p>
        <h2>Contribution Data</h2>
        {contributorData &&
          contributorData.map((user, index) => (
            <p key={index}>
              {user.username}: {user.commits} commits
            </p>
          ))}
      </main>
    </div>
  );
}

export default App;
