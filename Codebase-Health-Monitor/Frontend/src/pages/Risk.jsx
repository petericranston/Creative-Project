import { useState, useEffect } from "react";
import "../styles/overview.css";

export default function Risk({ chosenRepo, setChosenRepo }) {
  const [filesContent, setFilesContent] = useState([]);
  const [chosenFile, setChosenFile] = useState([]);

  useEffect(() => {
    //Getting data from the backend

    const fetchFilesContent = async (repoName) => {
      const response = await fetch(`/api/filesContent?repo=${repoName}`, {
        credentials: "include",
      });
      const data = await response.json();
      setFilesContent(data);
    };

    if (chosenRepo) {
      fetchFilesContent(chosenRepo.name);
    }
  }, [chosenRepo]);

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
  ];
  const paths = [".github", ".gitignore", ".gitattributes", "node_modules"];

  const filteredFiles = filesContent.filter((file) => {
    const hasIgnoredExtension = extensions.some((ext) =>
      file.name.endsWith(ext),
    );
    const hasIgnoredPath = paths.some((path) => file.path.includes(path));
    return !hasIgnoredExtension && !hasIgnoredPath;
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold pb-10">Risk</h2>
      <div className="flex gap-4 flex-1 overflow-hidden">
        <div className="bg-[#272953] rounded-lg w-1/3 flex flex-col">
          <h3 className="p-4">All Your Files</h3>
          <div className="overflow-y-auto flex-1">
            {filteredFiles &&
              filteredFiles.map((file, index) => (
                <p key={index}>
                  {file.name} - {file.path}
                </p>
              ))}
          </div>
        </div>
        <div className="bg-[#272953] rounded-lg flex-1"></div>
      </div>
    </div>
  );
}
