"use client";

import type React from "react";
import { useMemo } from "react";
import { useTokenTrend } from "../queries/token-trend";
import { CandleData } from "../types";

interface BTCTrendComponentProps {
  pair: string;
}

const BTCTrendComponent: React.FC<BTCTrendComponentProps> = ({ pair }) => {
  const { data: candleData, isLoading, isError } = useTokenTrend(pair);

  // Calculate price metrics with useMemo to avoid unnecessary recalculations
  const priceMetrics = useMemo(() => {
    if (!candleData || candleData.length < 2) {
      return null;
    }

    // Get all close prices as numbers
    const closePrices = candleData.map((candle: CandleData) =>
      Number.parseFloat(candle[4])
    );

    // Current price is the last close price
    const currentPrice = closePrices[closePrices.length - 1];

    // Calculate 24h percentage change
    const firstClose = closePrices[0];
    const lastClose = currentPrice;
    const changePercent = ((lastClose - firstClose) / firstClose) * 100;

    // Determine if trend is positive or negative
    const isPositive = changePercent >= 0;

    return {
      currentPrice,
      changePercent,
      closePrices,
      isPositive,
    };
  }, [candleData]);

  // Generate the sparkline SVG path
  const sparklinePath = useMemo(() => {
    if (!priceMetrics) return "";

    const { closePrices } = priceMetrics;

    // Normalize the prices to fit within the 40x12 SVG area
    const min = Math.min(...closePrices);
    const max = Math.max(...closePrices);
    const range = max - min;

    // Skip normalization if there's no range (flat line)
    const normalizedPrices =
      range === 0
        ? closePrices.map(() => 6) // Middle of 12px height
        : closePrices.map((price: number) => 12 - ((price - min) / range) * 12);

    // Create the SVG path
    const points = normalizedPrices.map((y: number, i: number) => {
      const x = (i / (closePrices.length - 1)) * 40;
      return `${x},${y}`;
    });

    return `M${points.join(" L")}`;
  }, [priceMetrics]);

  // Generate ARIA label for accessibility
  const ariaLabel = useMemo(() => {
    if (!priceMetrics) {
      return "Loading Bitcoin price data";
    }

    const { currentPrice, changePercent, isPositive } = priceMetrics;
    const direction = isPositive ? "up" : "down";
    const formattedPrice = Math.round(currentPrice).toLocaleString();
    const formattedChange = Math.abs(changePercent).toFixed(2);

    return `Bitcoin price: ${formattedPrice} US Dollars, ${direction} ${formattedChange} percent in the last 24 hours`;
  }, [priceMetrics]);

  if (isError) {
    return (
      <div
        className="error bg-gray-900 text-white p-1 rounded-lg w-full max-w-[200px] h-[72px] flex items-center justify-center"
        role="alert"
        aria-label="Bitcoin price data unavailable"
      >
        <span className="text-red-500 text-xl font-bold" aria-hidden="true">×</span>
      </div>
    );
  }

  if (isLoading || !priceMetrics) {
    return (
      <div
        className="bg-gray-900 text-white p-1 rounded-lg w-full max-w-[200px]"
        aria-label="Loading Bitcoin price data"
      >
        <div className="flex justify-between items-center mb-1">
          <div className="h-4 w-16 skeleton-el rounded"></div>
          <div className="h-3 w-6 skeleton-el rounded"></div>
        </div>
        <div className="flex items-baseline">
          <div className="h-5 w-20 skeleton-el rounded mb-1"></div>
          <div className="h-4 w-12 skeleton-el rounded ml-1"></div>
        </div>
        <div className="mt-1 flex items-center">
          <div className="h-3 w-8 skeleton-el rounded mr-1"></div>
          <div className="h-3 w-40 skeleton-el rounded"></div>
        </div>
      </div>
    );
  }

  const { currentPrice, changePercent, isPositive } = priceMetrics;
  const colorClass = isPositive ? "positive" : "negative";

  return (
    <div
      className={`${colorClass} bg-gray-900 text-white p-1 rounded-lg w-full max-w-[200px] flex flex-col`}
      aria-label={ariaLabel}
      tabIndex={0}
      role="region"
    >
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-sm font-bold">BTC/USDT</h2>
        <span className="text-xs">24h</span>
      </div>
      <div className="flex items-baseline">
        <div className="text-sm font-bold">
          ${Math.round(currentPrice).toLocaleString()}
        </div>
        <div
          className={`text-xs ml-1 ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </div>
      </div>
      <div className="mt-1 flex items-center">
        <span className="text-xs mr-1">Trend:</span>
        <svg
          className="sparkline"
          width="40"
          height="12"
          viewBox="0 0 40 12"
          role="img"
          aria-hidden="true"
        >
          <path
            d={sparklinePath}
            stroke={isPositive ? "#4ade80" : "#f87171"}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

export default BTCTrendComponent;
