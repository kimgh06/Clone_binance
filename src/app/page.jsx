"use client";
import { useEffect, useState } from "react";
import axiosClient from "./axiosClient";
import Search from "@/components/mainPage/search";

/**
 * Recoil has been not supported anymore.
 * So, In React 19 version, Recoil can't used and choosing to use zustand.
 * It's not what you want, but it's what you get.
 * Reference: https://www.reddit.com/r/nextjs/comments/1elgh3b/error_in_recoil_with_react_in_a_nextjs_turbo_repo/
 * */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Search coinlist={coinlist} />;
}
