import { useState } from "react";

export default function Settings() {
  const [username, setUsername] = useState("");

  function saveUsername(username) {}

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold pb-10">Settings</h2>
      <div className="bg-[#272953] rounded-lg p-6 flex flex-col gap-4 h-full">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your GitHub username"
          className="w-full bg-[#1e2044] rounded-lg px-3 py-2 text-white outline-none text-center"
        />
        <button
          onClick={saveUsername(username)}
          className="bg-[#1e2044] hover:bg-[#16113a] py-2 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
}
