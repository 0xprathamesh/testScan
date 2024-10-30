import React from "react";

const SolidityFoundry = () => {
  return (
    <div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Contract verification via Foundry
        </label>
        <pre>
          {`
                    forge verify-contract \ --rpc-url https://xdcscan.io \
                    --verifier XDC \ --verifier-url
                    'https://rpc.xinfin.network/api/' \{params.address} \
                    [contractFile]:[contractName]
      `}
        </pre>
      </div>
    </div>
  );
};

export default SolidityFoundry;
