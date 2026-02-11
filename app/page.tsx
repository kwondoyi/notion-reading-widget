export default async function Page() {
  const { year, total } = await fetch("/api/total-pages", {
    cache: "no-store",
  }).then((r) => r.json());

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