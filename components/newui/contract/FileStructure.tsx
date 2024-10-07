"use client";
import React, { useState } from "react";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface FileNode {
  filePath: string; 
  code: string;    
}

interface FolderNode {
  name: string;
  files?: FileNode[];
  subFolders?: FolderNode[];
}

interface FileStructureProps {
  files: FileNode[];
}

// Function to build folder structure from file paths
const buildFileTree = (files: FileNode[]): FolderNode[] => {
  const root: FolderNode[] = [];

  files.forEach((file) => {
    const parts = file.filePath.split("/"); // Split file path into parts
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingFolder = currentLevel.find((item) => item.name === part);

      if (!existingFolder) {
        existingFolder = {
          name: part,
          files: [],
          subFolders: [],
        };
        currentLevel.push(existingFolder);
      }

      // If it's the last part of the path, it's a file
      if (index === parts.length - 1) {
        existingFolder.files?.push(file);
      }

      currentLevel = existingFolder.subFolders!;
    });
  });

  return root;
};

// Recursive component to display file tree
const FileTree: React.FC<{
  folder: FolderNode;
  onFileClick: (filePath: string) => void;
  selectedFile: string | null;
}> = ({ folder, onFileClick, selectedFile }) => {
  return (
    <ul className="pl-4">
      <li className="font-bold">{folder.name}</li>
      {folder.subFolders?.map((subFolder, index) => (
        <FileTree
          key={index}
          folder={subFolder}
          onFileClick={onFileClick}
          selectedFile={selectedFile}
        />
      ))}
      {folder.files?.map((file, index) => (
        <li key={index}>
          <button
            className={`text-blue text-xs hover:underline cursor-pointer ${
              selectedFile === file.filePath ? "font-bold" : ""
            }`}
            onClick={() => onFileClick(file.filePath)}
          >
            {file.filePath.split("/").pop()} {/* Display file name */}
          </button>
        </li>
      ))}
    </ul>
  );
};

const FileStructure: React.FC<FileStructureProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const fileTree = buildFileTree(files);

  const handleFileClick = (filePath: string) => {
    setSelectedFile(filePath === selectedFile ? null : filePath);
  };

  return (
    <div className="flex">
      {/* File Structure Tree */}
      <div className="w-1/3 border-r border-gray-300 p-4">
        <h2 className="font-bold text-lg">File Structure</h2>
        {fileTree.map((folder, index) => (
          <FileTree
            key={index}
            folder={folder}
            onFileClick={handleFileClick}
            selectedFile={selectedFile}
          />
        ))}
      </div>

      {/* Code Viewer */}
      <div className="w-2/3 p-4  overflow-auto scrollbar-default">
        {selectedFile ? (
          <div>
            <h2 className="font-bold text-lg">Code for {selectedFile}</h2>
            <SyntaxHighlighter
              language="solidity" // Adjust language if needed
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                textWrap: "wrap",
              }}
            >
              {files.find((file) => file.filePath === selectedFile)?.code || ""}
            </SyntaxHighlighter>
          </div>
        ) : (
          <p className="text-gray-500">Select a file to view the code.</p>
        )}
      </div>
    </div>
  );
};

export default FileStructure;




// "use client";
// import React, { useState } from "react";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// interface FileNode {
//   filePath: string; // should match the file_path from the API response
//   code: string;     // ensure this is included as required
// }

// interface FileStructureProps {
//   files: FileNode[];
// }

// const FileStructure: React.FC<FileStructureProps> = ({ files }) => {
//   const [selectedFile, setSelectedFile] = useState<string | null>(null);

//   const handleFileClick = (filePath: string) => {
//     setSelectedFile(filePath === selectedFile ? null : filePath);
//   };

//   return (
//     <div className="flex">
//       {/* File Structure Tree */}
//       <div className="w-1/3 border-r border-gray-300 p-4">
//         <h2 className="font-bold text-lg">File Structure</h2>
//         <ul className="list-disc pl-5">
//           {files.map((file, index) => (
//             <li key={index}>
//               <button
//                 className="text-blue text-xs hover:underline cursor-pointer"
//                 onClick={() => handleFileClick(file.filePath)}
//               >
//                 {file.filePath}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Code Viewer */}
//       <div className="w-2/3 p-4 max-h-[400px] overflow-auto scrollbar-default">
//         {selectedFile ? (
//           <div className="">
//             <h2 className="font-bold text-lg">Code for {selectedFile}</h2>
//             <SyntaxHighlighter
//               language="solidity" // Change this to the appropriate language if needed
//               style={vscDarkPlus}
//               customStyle={{
//                 margin: 0,
//                 padding: "1rem",
//                 fontSize: "0.875rem",
//                 textWrap: "wrap",
//               }}
//             >
//               {files.find((file) => file.filePath === selectedFile)?.code || ""}
//             </SyntaxHighlighter>
//           </div>
//         ) : (
//           <p className="text-gray-500">Select a file to view the code.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileStructure;
{/* <div className="h-[400px] overflow-auto scrollbar-default rounded-md w-full">
<SyntaxHighlighter
  language="json"
  style={vscDarkPlus}
  customStyle={{
    margin: 0,
    padding: "1rem",
    fontSize: "0.875rem",
    textWrap: "wrap",
  }}
>

</SyntaxHighlighter>
</div> */}