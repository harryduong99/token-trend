import { CandleData } from "../types";

export const poolService = {
  // TODO: add other query parameters (interval, limit, etc) as the input of method
  async getTokenTrend(pair: string): Promise<CandleData[]> {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&limit=24`);

    if (!response.ok) {
      throw new Error(`Failed to fetch trend data for ${pair}`);
    }

    const data = await response.json();
    return data;
  }
}