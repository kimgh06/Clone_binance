import { NextResponse } from "next/server";
import { BinanceRestClient } from "../binanceClient";

export async function GET() {
  const time = await BinanceRestClient.checkServerTime();
  return NextResponse.json(time);
}
