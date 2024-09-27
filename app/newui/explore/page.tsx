import React from "react";
import Layout from "@/components/newui/Layout";
import { ArrowRight } from "lucide-react";
import VerifiedContracts from "@/components/newui/VerifiedContracts";
import AssetsTable from "@/components/newui/AssetsTable";
import ExploreComponent from "@/components/newui/ExploreComponent";
import BlockInfo from "@/components/BlockInfo";

const Explore = () => {
  return (
    
    <Layout>
<ExploreComponent />

      <div className="px-6 mb-10">
        <VerifiedContracts />
      </div>
      <div className="px-6">
        <AssetsTable />
      </div>
      <BlockInfo />
    </Layout>
  );
};

export default Explore;
