"use client";
import ContractInteraction from "@/components/ContractInteraction";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="">
      <Navbar />
      <section className="w-full px-32 py-8">
        <h1 className="text-center text-lg text-gray-700">
          Interact w/ Contract Functions
        </h1>
        <ContractInteraction />
      </section>
    </div>
  );
};
export default Home;
