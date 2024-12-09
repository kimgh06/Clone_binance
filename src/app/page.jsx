"use client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axiosClient from "./axiosClient";
import Search from "@/components/mainPage/search";
import Tradelist from "@/components/mainPage/orderbooklist";
import FinancialChart from "@/components/mainPage/chart";
import useWindowSize from "../hooks/getwindowsize";

/**
 * Recoil has been not supported anymore.
 * So, In React 19 version, Recoil can't used and choosing to use zustand.
 * It's not what you want, but it's what you get.
 * Reference: https://www.reddit.com/r/nextjs/comments/1elgh3b/error_in_recoil_with_react_in_a_nextjs_turbo_repo/
 * */

export default function Home() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <InnerHome />
    </QueryClientProvider>
  );
}

function InnerHome() {
  const getCoinList = async () => {
    try {
      const { data } = await axiosClient.get("/getcoinlist");
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const {
    data: coins,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["coinList"],
    queryFn: getCoinList,
  });
  const { width } = useWindowSize();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-36">
      <Search coinlist={coins} />
      <div className={width > 1280 ? `flex justify-between` : ""}>
        <FinancialChart />
        <Tradelist />
      </div>
    </div>
  );
}
