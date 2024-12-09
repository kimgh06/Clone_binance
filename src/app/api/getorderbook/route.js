import { NextResponse } from "next/server";
import { BinanceRestClient } from "../binanceClient";

export async function GET(req) {
  try {
    const coin = req.nextUrl.searchParams.get("coin") + "USDT";
    const orderBook = await BinanceRestClient.orderBook(coin);
    return NextResponse.json(orderBook);
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
