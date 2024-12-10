import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import useWindowSize from "@/hooks/getwindowsize";
import axiosClient from "@/app/axiosClient";
import useCoinStore from "@/coinStore";

const FinancialChart = () => {
  const chartContainerRef = useRef();
  const { width } = useWindowSize();
  const [tradelist, setTradelist] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const { coinName } = useCoinStore();

  // Preprocess trades into candlestick format by seconds
  const preprocessTrades = (trades, intervalSeconds = 1) => {
    const grouped = {};

    trades.forEach((trade) => {
      const interval =
        Math.floor(trade.time / (intervalSeconds * 1000)) *
        (intervalSeconds * 1000);

      if (!grouped[interval]) {
        grouped[interval] = {
          open: parseFloat(trade.price),
          high: parseFloat(trade.price),
          low: parseFloat(trade.price),
          close: parseFloat(trade.price),
          volume: parseFloat(trade.qty),
        };
      } else {
        grouped[interval].high = Math.max(
          grouped[interval].high,
          parseFloat(trade.price)
        );
        grouped[interval].low = Math.min(
          grouped[interval].low,
          parseFloat(trade.price)
        );
        grouped[interval].close = parseFloat(trade.price);
        grouped[interval].volume += parseFloat(trade.qty);
      }
    });

    return Object.entries(grouped).map(([time, data]) => ({
      time: Math.floor(time / 1000), // Convert to seconds
      ...data,
    }));
  };

  const getTradeList = async () => {
    const { data } = await axiosClient.get(`/getoldtradelist?coin=${coinName}`);
    setTradelist(data);
  };

  useEffect(() => {
    if (!coinName || isHovering) return;
    const Interval = setInterval(() => {
      getTradeList();
    }, 2000);
    return () => {
      clearInterval(Interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, coinName, isHovering]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: width > 1290 ? width / 2 - 100 : width - 300,
      height: 600,
      layout: {
        backgroundColor: "#000000",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#334158" },
        horzLines: { color: "#334158" },
      },
      crosshair: { mode: 1 },
      priceScale: { borderColor: "#485c7b" },
      timeScale: { borderColor: "#485c7b" },
    });

    // Preprocess trade data into candlestick format
    const candlestickData = preprocessTrades(tradelist);

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    candleSeries.setData(candlestickData);

    // Optionally, add moving average lines
    const ma1Sec = chart.addLineSeries({ color: "#ffeb3b", lineWidth: 2 });
    const ma5Sec = chart.addLineSeries({ color: "#ff5722", lineWidth: 2 });
    const ma10Sec = chart.addLineSeries({ color: "#9c27b0", lineWidth: 2 });

    // Moving Averages
    const calculateMA = (candles, periodSeconds) => {
      const maData = [];
      const periodMs = periodSeconds * 1000; // Convert seconds to milliseconds

      for (let i = 0; i < candles.length; i++) {
        const endTime = candles[i].time * 1000; // Convert seconds to milliseconds
        const startTime = endTime - periodMs;

        // Find candles within the time window
        const relevantCandles = candles.filter(
          (candle) =>
            candle.time * 1000 >= startTime && candle.time * 1000 <= endTime
        );

        if (relevantCandles.length > 0) {
          const avg =
            relevantCandles.reduce((sum, candle) => sum + candle.close, 0) /
            relevantCandles.length;

          maData.push({ time: candles[i].time, value: avg });
        }
      }

      return maData;
    };

    ma1Sec.setData(calculateMA(candlestickData, 1));
    ma5Sec.setData(calculateMA(candlestickData, 5));
    ma10Sec.setData(calculateMA(candlestickData, 10));

    return () => {
      chart.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradelist]);

  return (
    <>
      {tradelist && (
        <div
          ref={chartContainerRef}
          onPointerOver={() => setIsHovering(true)}
          onPointerOut={() => setIsHovering(false)}
        />
      )}
    </>
  );
};

export default FinancialChart;
