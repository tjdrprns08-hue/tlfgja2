// @ts-nocheck
export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

export async function handleMarketOverview(c: any): Promise<Response> {
  const symbol = c.req.query("symbol") || "BTCUSDT";
  const timeframe = c.req.query("timeframe") || "1d";
  return json({
    type: "market-overview",
    symbol,
    timeframe,
    note: "여기는 나중에 진짜 Google AIS 에이전트 결과 넣을 자리 (더미 응답)",
  });
}

export async function handleChain(c: any): Promise<Response> {
  const body = await c.req.json().catch(() => ({}));
  return json({
    type: "chain",
    query: body.query ?? null,
    note: "체인 오브 소트 에이전트 더미 응답",
  });
}

export async function handleSentiment(c: any): Promise<Response> {
  const body = await c.req.json().catch(() => ({}));
  return json({
    type: "sentiment",
    text: body.text ?? null,
    sentiment: "neutral",
    note: "심리 분석 에이전트 더미 응답",
  });
}

export async function handleTrend(c: any): Promise<Response> {
  const symbol = c.req.query("symbol") || "BTCUSDT";
  const timeframe = c.req.query("timeframe") || "1d";
  return json({
    type: "trend",
    symbol,
    timeframe,
    regime: "range / low-vol",
    note: "트렌드/레짐 에이전트 더미 응답",
  });
}
