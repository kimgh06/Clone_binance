"use client";
import { useEffect, useState } from "react";
import axiosClient from "./axiosClient";

export default function Home() {
  const [coinlist, setCoinList] = useState([]);
  const getCoinList = async () => {
    try {
      const { data: coins, status } = await axiosClient.get("/getcoinlist");
      if (status === 200) {
        setCoinList(coins);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCoinList();
  }, []);
  return <>{coinlist?.map((item) => item.coin)}</>;
}
