// @ts-nocheck
import { Hono } from "hono";
import {
  handleMarketOverview,
  handleChain,
  handleSentiment,
  handleTrend,
} from "./api_handlers";

export interface Env {
  ASSETS: Fetcher;
}

const app = new Hono();

// Market Overview
app.get("/api/market-overview", (c) => {
  console.log("✅ /api/market-overview 라우트 진입!");
  return handleMarketOverview(c);
});

// Chain Reasoning
app.post("/api/chain", (c) => {
  console.log("✅ /api/chain 라우트 진입!");
  return handleChain(c);
});

// Sentiment
app.post("/api/sentiment", (c) => {
  console.log("✅ /api/sentiment 라우트 진입!");
  return handleSentiment(c);
});

// Trend & Regime
app.get("/api/trend", (c) => {
  console.log("✅ /api/trend 라우트 진입!");
  return handleTrend(c);
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API 라우트는 Hono 앱으로 처리
    if (url.pathname.startsWith("/api/")) {
      console.log(`🔵 API 요청: ${url.pathname}`);
      return app.fetch(request, env, ctx);
    }

    // 나머지는 정적 에셋
    return env.ASSETS.fetch(request);
  }
};
