// @ts-nocheck
import { Hono } from "hono";
import {
  handleMarketOverview,
  handleChain,
  handleSentiment,
  handleTrend,
} from "./api_handlers";

const app = new Hono();

// Market Overview
app.get("/api/market-overview", (c) => {
  return handleMarketOverview(c);
});

// Chain Reasoning
app.post("/api/chain", (c) => {
  return handleChain(c);
});

// Sentiment
app.post("/api/sentiment", (c) => {
  return handleSentiment(c);
});

// Trend & Regime
app.get("/api/trend", (c) => {
  return handleTrend(c);
});

// 정적 파일 (React 빌드 결과)
app.all("*", (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
