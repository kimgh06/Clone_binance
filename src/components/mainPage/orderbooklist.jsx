import axiosClient from "@/app/axiosClient";
import useCoinStore from "@/coinStore";
import { useEffect, useState } from "react";
import Orderbook from "./orderbook";

export default function Tradelist() {
  const { coinName } = useCoinStore();
  const [data, setData] = useState([]);
  const [tradelist, setTradelist] = useState([]);
  const getOrderBook = async () => {
    const { data } = await axiosClient.get(`/getorderbook?coin=${coinName}`);
    setData(data);
  };
  const getTradeList = async () => {
    const { data } = await axiosClient.get(`/gettradelist?coin=${coinName}`);
    setTradelist(data);
  };
  useEffect(() => {
    const Interval = setInterval(() => {
      getOrderBook();
      getTradeList();
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
            {data?.bids?.map((ask) => (
              <Orderbook key={ask[0]} price={ask[0]} amount={ask[1]} />
            ))}
          </div>
        </div>
        <div>
          Sell Orders:
          <div className="overflow-scroll h-96 w-80">
            {data?.bids?.map((ask) => (
              <Orderbook key={ask[0]} price={ask[0]} amount={ask[1]} />
            ))}
          </div>
        </div>
        <div>
          Trade List:
          <div className="overflow-scroll h-96 w-80">
            {tradelist?.map((trade) => (
              <Orderbook
                key={trade.id}
                price={trade.price}
                amount={trade.qty}
                when={trade.time}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
