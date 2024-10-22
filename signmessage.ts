import { createWalletClient, custom, WalletClient } from 'viem';

// Explicitly declare the type of walletClient
let walletClient: WalletClient | undefined;

if (typeof window !== 'undefined' && window.ethereum) {
  // Create wallet client only in the browser
  walletClient = createWalletClient({
    transport: custom(window.ethereum)
  });
}

// Function to sign a message
export const signMessage = async (message: string) => {
  try {
    if (!walletClient) {
      throw new Error("Wallet client is not initialized.");
    }

    const [account] = await walletClient.getAddresses();
    const signature = await walletClient.signMessage({
      account,
      message,
    });
    return { signature, address: account };
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
};

{/* <div className="w-full md:w-1/2" >
          <div
            className={`transition-all duration-300 ease-in-out ${
              isSticky ? "sticky top-0 pt-4" : ""
            }`}
          >
            <h1 className="text-3xl font-bold mb-6 font-mplus">
              What are you looking for?
            </h1>
            <form>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <GoSearch className="w-5 h-5 mb-2 text-gray-500" />
                </div>
                <input
                  type="search"
                  id="default-search"
                  value={input}
                  onChange={handleChange}
                  className="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md mb-2 outline-none placeholder:font-chivo"
                  placeholder="Search transactions/blocks/address/tokens"
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md font-chivo">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>

            <div className="mt-4">
              <h2 className="text-lg font-normal font-inter mb-2">
                Recent searches:
              </h2>
              <div className="">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search, index) => (
                    <span
                      key={index}
                      className="text-md text-gray-600 bg-purple-100 px-2 py-1 rounded-xl leading flex w-48 text-center items-center mb-2"
                    >
                      <Copyable text={search} copyText={search} className="" />
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No recent searches</p>
                )}
              </div>
            </div>
          </div>
        </div> */}