import { NextResponse } from "next/server";
import { BinanceRestClient } from "../binanceClient";

export async function GET(req) {
  try {
    const coin = req.nextUrl.searchParams.get("coin") + "USDT";
    const tradelist = await BinanceRestClient.recentTradesList(coin);
    return NextResponse.json(tradelist);
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
