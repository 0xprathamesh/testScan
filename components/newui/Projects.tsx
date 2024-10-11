"use client";
import React, { useState } from "react";
import { projects } from "./utils/data";
import Image from "next/image";

const Projects = () => {
  const [activeTab, setActiveTab] = useState("RWA");

 
  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((project) => project.track === activeTab);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">Projects</h2>
      </div>

      <div className="flex space-x-2 p-4">
        <div className="border rounded-full p-2 w-full md:w-auto flex space-x-4 mb-4">
          {/* <span
            onClick={() => setActiveTab("All")}
            className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
              activeTab === "All" ? "bg-gray-200 text-gray-800" : ""
            }`}
          >
            All
          </span> */}
          <span
            onClick={() => setActiveTab("RWA")}
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
              activeTab === "RWA" ? "bg-gray-200 text-gray-800" : ""
            }`}
          >
            RWA
          </span>
          <span
            onClick={() => setActiveTab("DeFi")}
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
              activeTab === "DeFi" ? "bg-gray-200 text-gray-800" : ""
            }`}
          >
            DeFi
          </span>
          <span
            onClick={() => setActiveTab("NFTs")}
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
              activeTab === "NFTs" ? "bg-gray-200 text-gray-800" : ""
            }`}
          >
            NFTs
          </span>
          <span
            onClick={() => setActiveTab("DEX")}
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
              activeTab === "DEX" ? "bg-gray-200 text-gray-800" : ""
            }`}
          >
            DEX
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;

interface Project {
  name: string;
  track: string;
  icon: any;
  description: string;
}

interface ProjectCardProps extends Project {}

const ProjectCard: React.FC<ProjectCardProps> = ({
  icon,
  name,
  track,
  description,
}) => (
  <div className="flex items-start space-x-4 mb-8 hover:shadow-lg p-4 rounded-md">
    <div className="flex-shrink-0">
      {typeof icon === "string" ? (
        <img src={icon} alt={`${name} icon`} className="w-12 h-12 rounded-full" />
      ) : (
        <Image width={12} height={12} alt="img" src={icon} className="w-12 h-12 rounded-full" />
      )}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-lg">{name}</h3>
        <span className="px-3 py-1 bg-gray-200 text-xs rounded-md">{track}</span>
      </div>
      <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
    </div>
  </div>
);

  