export default function OfflinePage() {
  return (
    <main style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      background: "#f7f6f0",
      color: "#183d30",
      fontFamily: "system-ui, sans-serif",
    }}>
      <section style={{ maxWidth: 380, textAlign: "center" }}>
        <div style={{ fontSize: 48 }} aria-hidden="true">♧</div>
        <h1>You’re off the grid.</h1>
        <p>
          Your connection is unavailable right now. Try your saved EcoBingo
          page again when possible. The Nature Guide needs an internet connection.
        </p>
        <a href="/" style={{
          display: "inline-block",
          marginTop: 12,
          padding: "12px 20px",
          borderRadius: 24,
          background: "#183d30",
          color: "#f5ffdf",
          textDecoration: "none",
          fontWeight: 700,
        }}>
          Return to EcoBingo
        </a>
      </section>
    </main>
  );
}
