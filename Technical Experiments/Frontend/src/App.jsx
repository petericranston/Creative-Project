import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    //Getting data from the backend
    const fetchData = async () => {
      const response = await fetch("/api/data", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
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
      </main>
    </div>
  );
}

export default App;
