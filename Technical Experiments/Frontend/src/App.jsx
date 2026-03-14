import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    //Getting data from the backend
    const fetchData = async () => {
      const response = await fetch("/api/data", {
        credentials: "include",
      });
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <header>
        <h1>New Page</h1>
      </header>
      <main>
        <p>Main</p>
        {data &&
          data.map((user, index) => (
            <p key={index}>
              {user.username}: {user.commits} commits
            </p>
          ))}
      </main>
    </div>
  );
}

export default App;
