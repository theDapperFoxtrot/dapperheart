export function ModPopup({ popup, setPopup }) {
  if (!popup) return null;
  return (
    <div className="dh-mod-popup" style={{
      position: "fixed", left: Math.min(popup.x, window.innerWidth - 220), top: popup.y,
      background: "#1a1a1e", border: "2px solid #3a3a3e", borderRadius: 6, padding: 12,
      minWidth: 200, maxWidth: 280, zIndex: 250, boxShadow: "0 8px 24px rgba(0,0,0,.6)",
      animation: "fadeIn .15s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Cinzel'", fontWeight: 700, fontSize: 13, color: "#d4a017" }}>{popup.label} BREAKDOWN</span>
        <button onClick={() => setPopup(null)} style={{ background: "none", border: "none", color: "#888", fontSize: 18, cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>✕</button>
      </div>
      {popup.lines.map((l, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#ccc", lineHeight: 1.8 }}>
        <span>{l.source}</span>
        <span style={{ fontWeight: 700, color: l.value > 0 ? "#2d6a4f" : l.value < 0 ? "#e05545" : "#999" }}>{l.value > 0 ? "+" : ""}{l.value}</span>
      </div>)}
      <div style={{ borderTop: "1px solid #3a3a3e", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
        <span style={{ color: "#e0ddd5" }}>Total</span>
        <span style={{ color: "#e0ddd5" }}>{popup.lines.reduce((a, l) => a + l.value, 0) > 0 ? "+" : ""}{popup.lines.reduce((a, l) => a + l.value, 0)}</span>
      </div>
    </div>
  );
}
