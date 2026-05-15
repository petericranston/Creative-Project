import { useState, useEffect } from "react";

export default function Analysis({ chosenRepo, setChosenRepo, username }) {
  const [filesContent, setFilesContent] = useState([]);
  const [chosenFile, setChosenFile] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //Getting data from the backend

    const fetchFilesContent = async (repoName) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/filesContent?repo=${repoName}&username=${username}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setFilesContent(data);
    };

    if (chosenRepo) {
      fetchFilesContent(chosenRepo.name);
    }
  }, [chosenRepo, username]);

  const analyseFile = async () => {
    //Sending the username and chosen file path to the server for analysis
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analyseFile?repo=${chosenRepo.name}&username=${username}&path=${chosenFile.path}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //Filtering out all the file and path types that I don't want the user to see
  const extensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".json",
    "eslint.config.js",
    "vite.config.js",
    ".md",
    ".DS_Store",
    ".xd",
    ".pdf",
  ];
  const paths = [".github", ".gitignore", ".gitattributes", "node_modules"];

  const filteredFiles = filesContent.filter((file) => {
    //Filtering the files
    const hasIgnoredExtension = extensions.some((ext) =>
      file.name.endsWith(ext),
    );
    const hasIgnoredPath = paths.some((path) => file.path.includes(path));
    return !hasIgnoredExtension && !hasIgnoredPath;
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold pb-10">
        Select a file for analysis
      </h2>
      <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-auto">
        <div className="bg-[#1f2937] border border-[#8b5cf6]/25 rounded-lg w-full md:w-1/3 flex flex-col min-h-[200px]">
          <h3 className="p-4">All Your Files</h3>
          {chosenRepo ? (
            <>
              <div className="overflow-y-auto flex-1">
                {filteredFiles &&
                  filteredFiles.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setChosenFile(file);
                        setAnalysis(null);
                      }}
                      className={`w-full text-left px-4 py-1 hover:bg-[#1e2044]`}
                    >
                      {file.name}
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm mt-4">
              Select a repo to view data
            </p>
          )}
        </div>

        <div className="bg-[#1f2937] border border-[#8b5cf6]/25 rounded-lg flex-1 flex flex-col overflow-hidden">
          <div className="p-4 flex flex-col flex-1 overflow-y-auto">
            {chosenFile ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{chosenFile.name}</h3>
                  <button
                    onClick={analyseFile}
                    className="bg-[#1e2044] px-4 py-2 rounded-lg hover:bg-[#16113a]"
                  >
                    {loading ? "Analysing..." : "Analyse with AI"}
                  </button>
                </div>
                {analysis && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">Overall Score</h4>
                      <p className="text-sm">{analysis.overallScore}/100</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Deep Dive</h4>
                      <p className="text-sm">{analysis.deepDive}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Conclusion</h4>
                      <p className="text-sm">{analysis.conclusion}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400">Select a file to analyse</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
