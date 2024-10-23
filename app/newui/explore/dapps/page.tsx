"use client";
import { useState } from "react";
import Layout from "@/components/newui/Layout";
import { projects } from "@/components/newui/utils/data";
import Image from "next/image";

const Dapps = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("All");

  const handleSearch = (e:any) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e:any) => {
    setSelectedTrack(e.target.value);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTrack =
      selectedTrack === "All" || project.track === selectedTrack;

    return matchesSearch && matchesTrack;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <form
          className="w-full mx-auto mb-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Projects"
              required
              onChange={handleSearch}
              value={searchTerm}
            />
            <div className="flex items-center">
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-[#1a57db] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
              >
                Search
              </button>
            </div>
          </div>
          <select
            value={selectedTrack}
            onChange={handleFilter}
            className="mt-8 text-sm px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 "
          >
            <option value="All">All Tracks</option>
            <option value="Web3">Web3</option>
            <option value="RWA">RWA</option>
            <option value="DeFi">DeFi</option>
            <option value="DEX">DEX</option>
            <option value="NFTs">NFTs</option>

          </select>
        </form>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={project.icon}
                    alt={`${project.name} icon`}
                    width={12}
                    height={12}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                      {project.track}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dapps;

// {/* <input
//   type="search"
//   id="default-search"
//   className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//   placeholder="Search Projects"
//   value={searchTerm}
//   onChange={handleSearch}
//   required
// />

// <select
//   className="text-sm px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 ml-4"
//   value={selectedTrack}
//   onChange={handleFilter}
// >
//   <option value="All">All Tracks</option>
//   <option value="Track 1">Track 1</option>
//   <option value="Track 2">Track 2</option>
//  <option value="Track 2">Track 2</option>
//   {/* Add more track options as needed */}
//   </select>

//   <button
//     type="submit"
//     className="text-white absolute end-2.5 bottom-2.5 bg-[#1a57db] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
//   >
//     Search
//   </button>
