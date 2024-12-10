import { NextResponse } from "next/server";
import { BinanceRestClient } from "../binanceClient";

export async function GET(req) {
  try {
    const coin = req.nextUrl.searchParams.get("coin") + "USDT";
    const tradelist = [];
    let tempTradeId = -1;
    await Array.from({ length: 10 }).reduce(async (promise, _, i) => {
      await promise;
      const options = { limit: 1000 };
      if (tempTradeId !== -1) {
        options.fromId = tempTradeId;
      }
      const trades = await BinanceRestClient.oldTradeLookup(coin, options);
      tempTradeId = trades[0].id - 1000;
      tradelist.unshift(...trades);
    }, Promise.resolve());
    return NextResponse.json(tradelist);
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
