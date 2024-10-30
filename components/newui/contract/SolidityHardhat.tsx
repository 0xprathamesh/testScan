import React from "react";

const SolidityHardhat = () => {
  return (
    <>
      <div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Contract verification via Foundry
          </label>
          <pre>
            {`
const config: HardhatUserConfig = {
    solidity: "v0.8.27", // replace if necessary
    networks: {
        'Mainnet': {
            url: 'https://xdcscan.io'
        },
    },
    XDC: {
        apiKey: {
            'Mainnet': 'empty'
        }, 
    },
    customChains: [
        {
            network: "Mainnet",
            chainId: 50,
            urls: {
                apiURL: "https://rpc.xinfin.network",
                browserURL: "https://xdcscan.io"
            }
        }
    ]
};
            `}
          </pre>
        </div>
      </div>
    </>
  );
};

export default SolidityHardhat;
