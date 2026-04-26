import "../styles/overview.css";

import "../styles/overview.css";

export default function Risk() {
  return (
    <div>
      <h2 className="text-2xl font-semibold pb-10">Risk</h2>
      <div className="flex gap-4">
        <div className="bg-[#272953] w-[400px] h-[330px] flex rounded-lg items-center justify-center flex-col">
          <p className="text-xl">Choose a file to analyse</p>
        </div>
        <div className="bg-[#272953] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center">
          <h2 className="text-4xl">Top Contributor</h2>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="bg-[#272953] rounded-lg p-4 text-white flex-1 flex flex-col items-center justify-center h-[350px] overflow-hidden">
          <p className="text-base">Lines Added/Removed per Contributor</p>
        </div>
      </div>
    </div>
  );
}
