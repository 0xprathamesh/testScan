"use client";
import Loading from "@/components/elements/Loading";
import Layout from "@/components/newui/Layout";
import { addressService } from "@/components/newui/utils/apiroutes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { useRouter } from "next/navigation";
interface Account {
  hash: string;
  coin_balance: string;
  transactions_count: number;
  token_transfers_count: number;
}

const formatBalance = (balance: string) => {

  const balanceInXdc = parseFloat(balance) / 1e18;

  return balanceInXdc.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const parseAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const fetchData = async () => {
    try {
      const response = await addressService.addresses(`?limit=50&page=1`);
      if (response?.items) {
        setAccounts(response.items);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
       <div className="h-40 m-auto text-blue"><Loading /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Link href="" className="mr-4" onClick={handleGoBack}>
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <div className="text-sm">Top Accounts</div>
          <h1 className="text-xs text-blue-500 font-bold">Home</h1>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-gray-200 p-6 mt-10">
        <table className="w-full">
          <thead>
            <tr className="text-left font-light text-black">
              <th className="py-2 font-light">Account</th>
              <th className="font-light">Balance</th>
              <th className="font-light">Transactions</th>
              <th className="font-light">Token Transfers</th>
            </tr>
          </thead>
          <tbody className="font-chivo">
            {accounts.map((account, index) => (
              <tr key={index} className="border-t">
                <td className="py-3">
                  <div className="text-sm font-semibold text-[#06afe8] flex items-center tracking-wider">
                    <Link href={`/newui/address/${account.hash}`}>
                    {parseAddress(account.hash)}
                 </Link>
                    <FiCopy
                      className="ml-2 text-gray-400 cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(account.hash)}
                    />
                  </div>
                </td>
                <td className="font-chivo text-blue tracking-wider">
                  {formatBalance(account.coin_balance)} XDC
                </td>
                <td>{account.transactions_count}</td>
                <td>{account.token_transfers_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Accounts;