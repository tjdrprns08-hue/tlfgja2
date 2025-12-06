import { useEffect, useState } from "react";
import "./App.css";

type Tab = "overview" | "chain" | "sentiment" | "trend";

interface ApiState<T = any> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // 공통 입력값 (심볼 / 기간 등)
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1d");

  // 각 API 상태
  const [overviewState, setOverviewState] = useState<ApiState>({
    loading: false,
    error: null,
    data: null,
  });
  const [chainQuery, setChainQuery] = useState("");
  const [chainState, setChainState] = useState<ApiState>({
    loading: false,
    error: null,
    data: null,
  });
  const [sentimentText, setSentimentText] = useState("");
  const [sentimentState, setSentimentState] = useState<ApiState>({
    loading: false,
    error: null,
    data: null,
  });
  const [trendState, setTrendState] = useState<ApiState>({
    loading: false,
    error: null,
    data: null,
  });

  // JSON 예쁘게 출력용
  const pretty = (data: any) =>
    JSON.stringify(data, null, 2)
      .replace(/"([^"]+)":/g, '"$1":') // 키 하이라이트용 (그냥 보기용)
      .trim();

  // ---------------- API 호출 함수들 ----------------

  const fetchOverview = async () => {
    setOverviewState({ loading: true, error: null, data: null });
    try {
      const url = `/api/market-overview?symbol=${encodeURIComponent(
        symbol
      )}&timeframe=${encodeURIComponent(timeframe)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setOverviewState({ loading: false, error: null, data: json });
    } catch (err: any) {
      setOverviewState({
        loading: false,
        error: err.message ?? String(err),
        data: null,
      });
    }
  };

  const fetchChain = async () => {
    if (!chainQuery.trim()) return;
    setChainState({ loading: true, error: null, data: null });
    try {
      const res = await fetch("/api/chain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chainQuery }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setChainState({ loading: false, error: null, data: json });
    } catch (err: any) {
      setChainState({
        loading: false,
        error: err.message ?? String(err),
        data: null,
      });
    }
  };

  const fetchSentiment = async () => {
    if (!sentimentText.trim()) return;
    setSentimentState({ loading: true, error: null, data: null });
    try {
      const res = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentimentText }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSentimentState({ loading: false, error: null, data: json });
    } catch (err: any) {
      setSentimentState({
        loading: false,
        error: err.message ?? String(err),
        data: null,
      });
    }
  };

  const fetchTrend = async () => {
    setTrendState({ loading: true, error: null, data: null });
    try {
      const url = `/api/trend?symbol=${encodeURIComponent(
        symbol
      )}&timeframe=${encodeURIComponent(timeframe)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setTrendState({ loading: false, error: null, data: json });
    } catch (err: any) {
      setTrendState({
        loading: false,
        error: err.message ?? String(err),
        data: null,
      });
    }
  };

  // 첫 로딩 시 개요 자동 1번 호출
  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="app-root">
      {/* 헤더 */}
      <header className="app-header">
        <div>
          <h1 className="app-title">Global Market Radar · Lite</h1>
          <p className="app-subtitle">
            Google AI Studio에서 만들던 멀티 에이전트 대시보드의
            React/Vite 버전
          </p>
        </div>

        <div className="top-controls">
          <input
            className="input"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="심볼 (예: BTCUSDT / NVDA 등)"
          />
          <select
            className="select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="1h">1H</option>
            <option value="4h">4H</option>
            <option value="1d">1D</option>
            <option value="1w">1W</option>
          </select>
          <button className="button ghost" onClick={fetchOverview}>
            새로고침
          </button>
        </div>
      </header>

      {/* 탭 */}
      <nav className="tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Market Overview
        </button>
        <button
          className={`tab ${activeTab === "chain" ? "active" : ""}`}
          onClick={() => setActiveTab("chain")}
        >
          🔗 Chain Reasoning
        </button>
        <button
          className={`tab ${activeTab === "sentiment" ? "active" : ""}`}
          onClick={() => setActiveTab("sentiment")}
        >
          😶‍🌫️ Sentiment
        </button>
        <button
          className={`tab ${activeTab === "trend" ? "active" : ""}`}
          onClick={() => setActiveTab("trend")}
        >
          📈 Trend & Regime
        </button>
      </nav>

      {/* 메인 패널 */}
      <main className="panel-grid">
        {activeTab === "overview" && (
          <section className="panel">
            <h2 className="panel-title">📊 Market Overview (/api/market-overview)</h2>
            <p className="panel-description">
              심볼 + 타임프레임 기반으로 전체 시황/밸류에이션/리스크를 요약하는
              에이전트 구역.
            </p>

            {overviewState.loading && (
              <div className="info">분석 중… (AI 에이전트 호출)</div>
            )}
            {overviewState.error && (
              <div className="error">에러: {overviewState.error}</div>
            )}
            {overviewState.data && (
              <pre className="code-block">
                {pretty(overviewState.data)}
              </pre>
            )}

            {!overviewState.loading && !overviewState.data && !overviewState.error && (
              <div className="empty">
                아직 데이터가 없습니다. 상단의 &quot;새로고침&quot;을 눌러서
                호출해보세요.
              </div>
            )}
          </section>
        )}

        {activeTab === "chain" && (
          <section className="panel">
            <h2 className="panel-title">🔗 Chain Reasoning (/api/chain)</h2>
            <p className="panel-description">
              질문을 던지면 체인 오브 소트(Chain-of-Thought) / 멀티스텝 추론으로
              답변을 만드는 영역.
            </p>

            <div className="form-row">
              <textarea
                className="textarea"
                rows={4}
                placeholder="예: 2025년 1분기 NVDA / BTC / 금 가격이 어떤 매크로 시나리오에서 같이 움직일지 분석해줘"
                value={chainQuery}
                onChange={(e) => setChainQuery(e.target.value)}
              />
            </div>
            <div className="form-row right">
              <button className="button primary" onClick={fetchChain}>
                체인 분석 실행
              </button>
            </div>

            {chainState.loading && (
              <div className="info">체인 분석 중…</div>
            )}
            {chainState.error && (
              <div className="error">에러: {chainState.error}</div>
            )}
            {chainState.data && (
              <pre className="code-block">
                {pretty(chainState.data)}
              </pre>
            )}
          </section>
        )}

        {activeTab === "sentiment" && (
          <section className="panel">
            <h2 className="panel-title">😶‍🌫️ Sentiment (/api/sentiment)</h2>
            <p className="panel-description">
              뉴스 헤드라인, 텔레그램/레딧 댓글 등을 붙여넣으면,
              불/베어/중립, 리스크 단어, 공포·탐욕 포인트를 뽑아내는 영역.
            </p>

            <div className="form-row">
              <textarea
                className="textarea"
                rows={4}
                placeholder="시장 심리를 보고 싶은 뉴스/댓글 텍스트를 붙여넣어 주세요."
                value={sentimentText}
                onChange={(e) => setSentimentText(e.target.value)}
              />
            </div>
            <div className="form-row right">
              <button className="button primary" onClick={fetchSentiment}>
                심리 분석 실행
              </button>
            </div>

            {sentimentState.loading && (
              <div className="info">심리 분석 중…</div>
            )}
            {sentimentState.error && (
              <div className="error">에러: {sentimentState.error}</div>
            )}
            {sentimentState.data && (
              <pre className="code-block">
                {pretty(sentimentState.data)}
              </pre>
            )}
          </section>
        )}

        {activeTab === "trend" && (
          <section className="panel">
            <h2 className="panel-title">📈 Trend & Regime (/api/trend)</h2>
            <p className="panel-description">
              추세/변동성/레짐(유동성장, 디플레, 크래시 모드 등)을 텍스트로
              요약해주는 영역.
            </p>

            <div className="form-row">
              <button className="button primary" onClick={fetchTrend}>
                트렌드 스캔 실행
              </button>
            </div>

            {trendState.loading && (
              <div className="info">트렌드 스캔 중…</div>
            )}
            {trendState.error && (
              <div className="error">에러: {trendState.error}</div>
            )}
            {trendState.data && (
              <pre className="code-block">
                {pretty(trendState.data)}
              </pre>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
