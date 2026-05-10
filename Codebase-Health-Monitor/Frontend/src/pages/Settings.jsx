import { useState } from "react";
import { Link } from "react-router-dom";

export default function Settings({ username, setUsername, setNewUser }) {
  const [input, setInput] = useState(null);

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
          onClick={() => {
            (setUsername(input), setInput(""), setNewUser(true));
          }}
          className="bg-[#1e2044] hover:bg-[#16113a] py-2 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
}
