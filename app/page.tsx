"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<{ year: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/total-pages")
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData({ year: new Date().getFullYear(), total: 0 }));
  }, []);

  const year = data?.year ?? new Date().getFullYear();
  const total = data?.total ?? 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "transparent",
        padding: 24,
        fontFamily: "system-ui, -apple-system",
      }}
    >
      <div
        style={{
          width: 320,
          borderRadius: 18,
          padding: 18,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.6 }}>{year}년</div>
        <div style={{ marginTop: 6, fontSize: 28, fontWeight: 800 }}>
          {Number(total).toLocaleString()}p
        </div>
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.55 }}>
          올해 완독한 페이지 합계
        </div>
      </div>
    </main>
  );
}