import { Spot } from "@binance/connector-typescript";

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const BASE_URL = process.env.API_URL;

export const BinanceRestClient = new Spot(API_KEY, API_SECRET, {
  baseURL: BASE_URL,
});

const callbacks = {
  open: (client) => client.exchangeInfo(),
  close: () => console.debug("Disconnected from WebSocket server"),
  message: (data) => console.info(JSON.parse(data)),
};

export const BinanceWSClient = new Spot(API_KEY, API_SECRET, { callbacks });
