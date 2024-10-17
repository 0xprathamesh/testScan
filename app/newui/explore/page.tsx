"use client";
import React from "react";
import Layout from "@/components/newui/Layout";
import VerifiedContracts from "@/components/newui/VerifiedContracts";
import AssetsTable from "@/components/newui/AssetsTable";
import ExploreComponent from "@/components/newui/ExploreComponent";
import Projects from "@/components/newui/Projects";

const Explore = () => {
  return (
    <Layout>
      <ExploreComponent />

      <div className="px-6 mb-10">
        <Projects />
        <VerifiedContracts />
      </div>
      <div className="px-6">
        <AssetsTable quantity={5} />
      </div>
    </Layout>
  );
};

export default Explore;
