import { useState } from "react";
import { Link } from "react-router-dom";

export default function Settings({ username, setUsername, setNewUser }) {
  const [input, setInput] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const saveUsername = async () => {
    try {
      const response = await fetch(`/api/getRepos?username=${input}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setUsername(input);
        setNewUser(true);
        setUserStatus("Success");
      } else {
        setUserStatus("Error");
      }
    } catch {
      setUserStatus("Error");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold pb-10">Settings</h2>
      <div className="bg-[#272953] border border-[#3d4199] rounded-lg p-6 flex flex-col gap-4 h-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your GitHub username"
          className="w-full bg-[#1e2044] rounded-lg px-3 py-2 text-white outline-none text-center"
        />
        <button
          onClick={saveUsername}
          className="bg-[#1e2044] hover:bg-[#16113a] py-2 rounded-lg"
        >
          Save
        </button>
        {userStatus === "Success" && (
          <p className="text-sm text-center">Logged in as {input}</p>
        )}
        {userStatus === "Error" && (
          <p className="text-sm text-center">Username not found</p>
        )}
      </div>
    </div>
  );
}
