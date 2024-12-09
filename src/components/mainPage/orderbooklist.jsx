import axiosClient from "@/app/axiosClient";
import useCoinStore from "@/coinStore";
import { useEffect, useState } from "react";
import Orderbook from "./orderbook";

export default function Tradelist() {
  const { coinName } = useCoinStore();
  const [data, setData] = useState([]);
  const getOrderBook = async () => {
    const { data } = await axiosClient.get(`/getorderbook?coin=${coinName}`);
    setData(data);
  };
  useEffect(() => {
    setInterval(() => {
      getOrderBook();
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinName]);
  return (
    <div>
      <h1>{coinName}</h1>
      <div>
        <div>
          BIDS:
          <div className="overflow-scroll h-96 w-80">
            {data?.bids?.map((ask) => (
              <Orderbook key={ask[0]} price={ask[0]} quantity={ask[1]} />
            ))}
          </div>
        </div>
        <div>
          ASKS:
          <div className="overflow-scroll h-96 w-80">
            {data?.bids?.map((ask) => (
              <Orderbook key={ask[0]} price={ask[0]} quantity={ask[1]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
