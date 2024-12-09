import useCoinStore from "@/coinStore";
import React, { useEffect, useState } from "react";

const Search = ({ coinlist }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const [options, setOptions] = useState([]);
  const { setCoinName } = useCoinStore((e) => e);

  const handleSearch = () => {
    const filteredCoins = coinlist?.filter((coin) =>
      coin.coin.toLowerCase().includes(query.toLowerCase())
    );
    setOptions(filteredCoins);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, coinlist]);

  return (
    <div
      className="absolute top-32 w-svw left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      onFocus={() => setActive(true)}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 rounded p-2 w-full max-w-md text-black"
      />
      {active && (
        <>
          <div className="flex justify-between items-center max-w-md w-full p-2">
            <button onClick={() => setQuery("")}>Clear</button>
            <button onClick={() => setActive(false)}>Close</button>
          </div>
          <div className="max-w-md w-full overflow-y-scroll max-h-60 bg-gray-700">
            {options.map((coin) => (
              <div
                key={coin.coin}
                className="cursor-pointer flex justify-between items-center border-b border-gray-300 p-2"
                onClick={() => {
                  setQuery(coin.coin);
                  setActive(false);
                  setCoinName(coin.coin);
                }}
              >
                <p>{coin.coin}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
