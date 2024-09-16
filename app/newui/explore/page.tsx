import React from "react";
import Layout from "@/components/newui/Layout";
import { ArrowRight } from "lucide-react";
import VerifiedContracts from "@/components/newui/VerifiedContracts";
import AssetsTable from "@/components/newui/AssetsTable";

const Explore = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-4">MANTA</h1>
        <p className="text-lg text-gray-600 mb-8">
          The first EVM-native modular execution layer for wide ZK applications
          adoption, with Manta's universal circuit and zk interface
        </p>

        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-500">80% Cheaper</h2>
            <p className="text-gray-600">
              lower transaction costs through Celestia and Caldera's OP Stack
              Rollup solution
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-500">1.5M Users</h2>
            <p className="text-gray-600">
              significant user base in the ZK space, with over 300,000 zkSBTs
              minted on NPO sites
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-blue-400 mb-2">FEATURED</h3>
            <h2 className="text-2xl font-bold text-white mb-4">
              New Paradigm is live! Bridge ETH or USDC to earn PENTA yield and
              Manta Token Rewards
            </h2>
            <button className="text-blue-400 flex items-center">
              Join Now <ArrowRight className="ml-2" />
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-blue-400 mb-2">FEATURED DAPP</h3>
            <h2 className="text-2xl font-bold text-white mb-4">
              SocialFi platform to build and grow web3 community
            </h2>
            <button className="text-blue-400 flex items-center">
              Galxe <ArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <VerifiedContracts />
          </div>
          <AssetsTable />
    </Layout>
  );
};

export default Explore;
