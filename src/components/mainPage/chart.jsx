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
    getTradeList();
    const Interval = setInterval(() => {
      getTradeList();
    }, 10000);
    return () => {
      clearInterval(Interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, coinName, isHovering]);

  useEffect(() => {
    if (tradelist?.length < 1) return;

    const chart = createChart(chartContainerRef.current, {
      width: width > 1290 ? width / 2 - 100 : width - 300,
      height: 600,
      layout: {
        backgroundColor: "#000000",
        textColor: "black",
      },
      grid: {
        vertLines: { color: "#334158" },
        horzLines: { color: "#334158" },
      },
      crosshair: { mode: 1 },
      priceScale: {
        borderColor: "#485c7b",
        mode: 1, // 오른쪽에 숫자를 표시
      },
      timeScale: { borderColor: "#485c7b" },
    });

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

    // Tooltip 생성
    const container = chartContainerRef.current;
    const tooltip = document.createElement("div");
    tooltip.style = `
    position: absolute;
    display: none;
    border: 1px solid #ccc;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
  `;
    container.appendChild(tooltip);
    const coinLabel = document.createElement("div");
    coinLabel.style = `
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 20px;
    font-weight: bold;
    z-index: 1000;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  `;
    coinLabel.innerText = coinName || "Loading...";
    container.appendChild(coinLabel);

    chart.subscribeCrosshairMove((param) => {
      if (
        param === undefined ||
        param.time === undefined ||
        param.seriesPrices?.size === 0
      ) {
        tooltip.style.display = "none";
        return;
      }

      const price = param.seriesPrices?.get(candleSeries);
      if (price) {
        const lastClose = candlestickData[candlestickData.length - 1].close;
        const percentChange = (((price - lastClose) / lastClose) * 100).toFixed(
          2
        );

        tooltip.style.display = "block";
        tooltip.style.left = `${param.point.x + 15}px`;
        tooltip.style.top = `${param.point.y}px`;
        tooltip.innerHTML = `
        <div>Price: ${price.toFixed(2)}</div>
        <div style="color: ${
          percentChange >= 0 ? "#26a69a" : "#ef5350"
        }">Change: ${percentChange}%</div>
      `;
      }
    });

    return () => {
      chart.remove();
      container.removeChild(tooltip);
      container.removeChild(coinLabel);
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
