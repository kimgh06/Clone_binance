import { NextResponse } from "next/server";
import { BinanceRestClient } from "../binanceClient";

export async function GET() {
  const coinList = await BinanceRestClient.allCoinsInformation();
  return NextResponse.json(coinList);
}
