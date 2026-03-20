import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

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
      <main>
        <h2>Users Repositories</h2>
        {repos && repos.map((user, index) => <p key={index}>{user.name}</p>)}
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
        <h2>Dominance Detection</h2>
        {contributorData &&
          contributorData.map((user, index) => (
            <p key={index}>
              {user.username}: {user.dominanceScore}
            </p>
          ))}
        <h3>Top Contributor</h3>
        <h4>
          {contributorData.length > 0 //Displaying the top contributor (the array is already organized based on dominance percentage so I just get the first index)
            ? contributorData[0].username
            : "Loading..."}
        </h4>
        <h2>Files Content</h2>

        {filesContent &&
          filesContent.map((file, index) => (
            <p key={index}>
              {file.name} - {file.path}
            </p>
          ))}
      </main>
    </div>
  );
}

export default App;
