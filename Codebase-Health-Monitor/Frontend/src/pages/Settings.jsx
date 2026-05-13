import { useState } from "react";
import { Link } from "react-router-dom";

export default function Settings({
  username,
  setUsername,
  setNewUser,
  setChosenRepo,
}) {
  const [input, setInput] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const saveUsername = async () => {
    //Checking if the github username exists and saving it if so
    try {
      const response = await fetch(`/api/getRepos?username=${input}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setUsername(input);
        setChosenRepo(null);
        setNewUser(true);
        localStorage.setItem("username", input);
        setUserStatus("Success");
      } else {
        setUserStatus("Error"); //Tells the user that the account doesn't exist if there isn't a match with a github username
      }
    } catch {
      setUserStatus("Error");
    }
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold pb-10">Settings</h2>
      <div className="bg-[#1f2937] border border-[#8b5cf6]/25 rounded-lg p-6 flex flex-col gap-4 h-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your GitHub username"
          className="w-full bg-[#374151] rounded-lg px-3 py-2 text-white outline-none text-center"
        />
        <button
          onClick={saveUsername}
          className="bg-[#374151] hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] py-2 rounded-lg"
        >
          Save
        </button>
        {userStatus === "Success" && (
          <p className="text-sm text-center">Logged in as {username}</p>
        )}
        {userStatus === "Error" && (
          <p className="text-sm text-center">Username not found</p>
        )}
      </div>
    </div>
  );
}
