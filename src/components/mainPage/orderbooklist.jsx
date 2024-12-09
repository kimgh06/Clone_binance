import axiosClient from "@/app/axiosClient";
import useCoinStore from "@/coinStore";
import { useEffect, useState } from "react";
import Orderbook from "./orderbook";

export default function Tradelist() {
  const { coinName } = useCoinStore();
  const [orderbooks, setOrderbooks] = useState([]);
  const getOrderBook = async () => {
    const { data } = await axiosClient.get(`/getorderbook?coin=${coinName}`);
    setOrderbooks(data);
  };
  useEffect(() => {
    const Interval = setInterval(() => {
      getOrderBook();
    }, 2000);
    return () => {
      clearInterval(Interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinName]);
  return (
    <div>
      <h1>{coinName}</h1>
      <div>
        <div>
          Buy Orders:
          <div className="overflow-scroll h-96 w-80">
            {orderbooks?.bids?.map((ask) => (
              <Orderbook key={ask[0]} price={ask[0]} amount={ask[1]} />
            ))}
          </div>
        </div>
        <div>
          Sell Orders:
          <div className="overflow-scroll h-96 w-80">
            {orderbooks?.bids?.map((ask) => (
              <Orderbook key={ask[0]} price={ask[0]} amount={ask[1]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
