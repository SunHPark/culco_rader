"use client";

import { useState, useEffect } from "react";

const getHypeColor = (score) => {
  if (score >= 90) return { bg: "#fee2e2", text: "#dc2626", label: "🔥 BLAZING" };
  if (score >= 80) return { bg: "#fef3c7", text: "#d97706", label: "📈 RISING" };
  if (score >= 70) return { bg: "#dbeafe", text: "#2563eb", label: "👀 WATCH" };
  return { bg: "#f3f4f6", text: "#6b7280", label: "—" };
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    month: months[date.getMonth()],
    day: date.getDate(),
    dayName: days[date.getDay()],
  };
};

const getDaysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `D-${diff}`;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("hype");
  const [keyword, setKeyword] = useState("");
  const [savedKeywords, setSavedKeywords] = useState([]);
  const [notifiedDrops, setNotifiedDrops] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hypeCards, setHypeCards] = useState([]);
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const hypeRes = await fetch("/api/hype");
        const hypeData = await hypeRes.json();
        if (hypeData.success) setHypeCards(hypeData.data);

        const dropsRes = await fetch("/api/drops?days=14");
        const dropsData = await dropsRes.json();
        if (dropsData.success) setDrops(dropsData.data);

        const saved = localStorage.getItem("culturecode_keywords");
        if (saved) setSavedKeywords(JSON.parse(saved));

        const notified = localStorage.getItem("culturecode_notified");
        if (notified) setNotifiedDrops(new Set(JSON.parse(notified)));
      } catch (err) {
        console.error("Data load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addKeyword = () => {
    if (keyword.trim() && !savedKeywords.includes(keyword.trim())) {
      const newKeywords = [...savedKeywords, keyword.trim()];
      setSavedKeywords(newKeywords);
      localStorage.setItem("culturecode_keywords", JSON.stringify(newKeywords));
      setKeyword("");
    }
  };

  const removeKeyword = (kw) => {
    const newKeywords = savedKeywords.filter((k) => k !== kw);
    setSavedKeywords(newKeywords);
    localStorage.setItem("culturecode_keywords", JSON.stringify(newKeywords));
  };

  const toggleNotify = (dropId) => {
    const newSet = new Set(notifiedDrops);
    if (newSet.has(dropId)) newSet.delete(dropId);
    else newSet.add(dropId);
    setNotifiedDrops(newSet);
    localStorage.setItem("culturecode_notified", JSON.stringify([...newSet]));
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Fetching market data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>◈</div>
          <div>
            <h1 style={styles.logo}>CultureCode</h1>
            <p style={styles.tagline}>Drop Radar</p>
          </div>
        </div>
        <div style={styles.liveIndicator}>
          <span style={styles.liveDot}></span>
          <span style={styles.liveText}>LIVE</span>
        </div>
      </header>

      {/* Keyword Alert Section */}
      <section style={styles.alertSection}>
        <div style={styles.alertHeader}>
          <span style={styles.alertIcon}>🔔</span>
          <span style={styles.alertTitle}>Watchlist</span>
          <span style={styles.alertSubtitle}>Get alerts when keywords spike</span>
        </div>
        <div style={styles.keywordInputWrapper}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            placeholder="Card name, set name..."
            style={styles.keywordInput}
            className="keyword-input"
          />
          <button onClick={addKeyword} style={styles.addButton} className="add-btn">
            Add
          </button>
        </div>
        {savedKeywords.length > 0 && (
          <div style={styles.keywordTags}>
            {savedKeywords.map((kw) => (
              <span key={kw} style={styles.keywordTag}>
                {kw}
                <button onClick={() => removeKeyword(kw)} style={styles.removeTag}>×</button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Tab Navigation */}
      <nav style={styles.tabNav}>
        <button
          onClick={() => setActiveTab("hype")}
          style={{ ...styles.tabButton, ...(activeTab === "hype" ? styles.tabButtonActive : {}) }}
        >
          <span style={styles.tabIcon}>🔥</span>
          Top 10 Hype
        </button>
        <button
          onClick={() => setActiveTab("drops")}
          style={{ ...styles.tabButton, ...(activeTab === "drops" ? styles.tabButtonActive : {}) }}
        >
          <span style={styles.tabIcon}>📅</span>
          Drop Calendar
        </button>
      </nav>

      {/* Content */}
      <main style={styles.content}>
        {activeTab === "hype" && (
          <div style={styles.hypeGrid}>
            {hypeCards.map((card, index) => {
              const hypeStyle = getHypeColor(card.hypeScore);
              return (
                <article key={card.id} style={styles.hypeCard} className="hype-card">
                  <div style={styles.rankBadge}>#{index + 1}</div>
                  <div style={styles.cardImageWrapper}>
                    <img
                      src={card.image}
                      alt={card.name}
                      style={styles.cardImage}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/200x280/f5f5f5/999?text=Card"; }}
                    />
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardName}>{card.name}</h3>
                      <span style={styles.cardSet}>{card.set}</span>
                    </div>
                    <div style={styles.hypeRow}>
                      <div style={{ ...styles.hypeScoreBadge, backgroundColor: hypeStyle.bg, color: hypeStyle.text }}>
                        <span style={styles.hypeNumber}>{card.hypeScore}</span>
                        <span style={styles.hypeLabel}>{hypeStyle.label}</span>
                      </div>
                      <span style={styles.priceChange}>{card.priceChange}</span>
                    </div>
                    {card.price && (
                      <div style={styles.priceInfo}>
                        <span style={styles.priceLabel}>Market</span>
                        <span style={styles.priceValue}>${card.price}</span>
                      </div>
                    )}
                    <p style={styles.cardReason}>{card.reason}</p>
                    <div style={styles.sourceLinks}>
                      {card.sources?.map((src, i) => (
                        <a key={i} href={src.url} style={styles.sourceLink} className="source-link" target="_blank" rel="noopener noreferrer">
                          {src.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {activeTab === "drops" && (
          <div style={styles.dropsList}>
            {drops.map((drop) => {
              const dateInfo = formatDate(drop.date);
              const daysUntil = getDaysUntil(drop.date);
              const isNotified = notifiedDrops.has(drop.id);

              return (
                <article key={drop.id} style={styles.dropCard}>
                  <div style={styles.dropDate}>
                    <span style={styles.dropMonth}>{dateInfo.month}</span>
                    <span style={styles.dropDay}>{dateInfo.day}</span>
                    <span style={styles.dropDayName}>{dateInfo.dayName}</span>
                  </div>
                  <div style={styles.dropInfo}>
                    <div style={styles.dropHeader}>
                      <h3 style={styles.dropTitle}>
                        {drop.hot && <span style={styles.hotBadge}>HOT</span>}
                        {drop.title}
                      </h3>
                      <span style={styles.daysUntil}>{daysUntil}</span>
                    </div>
                    <div style={styles.dropMeta}>
                      <span style={styles.dropPlatform}>📍 {drop.platform}</span>
                      <span style={styles.dropType}>{drop.type}</span>
                      {drop.region && <span style={styles.dropRegion}>{drop.region}</span>}
                    </div>
                    {drop.msrp && <div style={styles.msrpBadge}>MSRP: {drop.msrp}</div>}
                    {drop.notes && <p style={styles.dropNotes}>{drop.notes}</p>}
                  </div>
                  <button
                    onClick={() => toggleNotify(drop.id)}
                    style={{ ...styles.notifyButton, ...(isNotified ? styles.notifyButtonActive : {}) }}
                    className={`notify-btn ${isNotified ? "active" : ""}`}
                  >
                    {isNotified ? "✓ Notify ON" : "🔔 Notify"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>Data: pokemontcg.io, TCGPlayer, CardMarket</p>
        <p style={styles.footerSubtext}>Real-time updates · Built with 💜 by CultureCode</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    color: "#1a1a1a",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e5e5",
    borderTopColor: "#1a1a1a",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { marginTop: "16px", color: "#666", fontSize: "14px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #eaeaea",
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoSection: { display: "flex", alignItems: "center", gap: "12px" },
  logoIcon: { fontSize: "28px", fontFamily: "'Space Mono', monospace", color: "#1a1a1a" },
  logo: { fontSize: "20px", fontWeight: "700", margin: 0, letterSpacing: "-0.5px" },
  tagline: { fontSize: "12px", color: "#888", margin: 0, letterSpacing: "2px", textTransform: "uppercase" },
  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    backgroundColor: "#f0fdf4",
    borderRadius: "20px",
  },
  liveDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#22c55e",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  liveText: { fontSize: "11px", fontWeight: "600", color: "#16a34a", letterSpacing: "1px" },
  alertSection: { padding: "20px 24px", backgroundColor: "#fff", borderBottom: "1px solid #eaeaea" },
  alertHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" },
  alertIcon: { fontSize: "16px" },
  alertTitle: { fontSize: "14px", fontWeight: "600", color: "#1a1a1a" },
  alertSubtitle: { fontSize: "12px", color: "#888", marginLeft: "auto" },
  keywordInputWrapper: { display: "flex", gap: "8px", marginBottom: "12px" },
  keywordInput: {
    flex: 1,
    padding: "10px 14px",
    fontSize: "14px",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  addButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  keywordTags: { display: "flex", flexWrap: "wrap", gap: "8px" },
  keywordTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    fontSize: "13px",
    backgroundColor: "#f5f5f5",
    borderRadius: "20px",
    color: "#444",
  },
  removeTag: {
    background: "none",
    border: "none",
    fontSize: "16px",
    color: "#999",
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
  },
  tabNav: {
    display: "flex",
    padding: "0 24px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eaeaea",
    position: "sticky",
    top: "73px",
    zIndex: 99,
  },
  tabButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#888",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabButtonActive: { color: "#1a1a1a", borderBottomColor: "#1a1a1a" },
  tabIcon: { fontSize: "16px" },
  content: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  hypeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" },
  hypeCard: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #eaeaea",
    position: "relative",
    animation: "fadeInUp 0.4s ease-out both",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  rankBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "700",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: "4px",
    zIndex: 1,
  },
  cardImageWrapper: {
    flexShrink: 0,
    width: "100px",
    height: "140px",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  cardImage: { width: "100%", height: "100%", objectFit: "cover" },
  cardInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 },
  cardHeader: { marginBottom: "4px" },
  cardName: {
    fontSize: "15px",
    fontWeight: "600",
    margin: 0,
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardSet: { fontSize: "12px", color: "#888" },
  hypeRow: { display: "flex", alignItems: "center", gap: "10px" },
  hypeScoreBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  hypeNumber: { fontFamily: "'Space Mono', monospace", fontSize: "14px" },
  hypeLabel: { fontSize: "11px" },
  priceChange: { fontSize: "13px", fontWeight: "600", color: "#16a34a" },
  priceInfo: { display: "flex", alignItems: "center", gap: "6px" },
  priceLabel: { fontSize: "11px", color: "#888" },
  priceValue: { fontSize: "14px", fontWeight: "600", color: "#1a1a1a", fontFamily: "'Space Mono', monospace" },
  cardReason: { fontSize: "13px", color: "#555", lineHeight: "1.5", margin: 0 },
  sourceLinks: { display: "flex", gap: "8px", marginTop: "auto", flexWrap: "wrap" },
  sourceLink: {
    fontSize: "11px",
    color: "#888",
    textDecoration: "none",
    padding: "2px 8px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  dropsList: { display: "flex", flexDirection: "column", gap: "12px" },
  dropCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #eaeaea",
    animation: "fadeInUp 0.4s ease-out both",
  },
  dropDate: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "70px",
    padding: "12px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
  dropMonth: { fontSize: "11px", color: "#888", marginBottom: "2px" },
  dropDay: { fontSize: "24px", fontWeight: "700", fontFamily: "'Space Mono', monospace", color: "#1a1a1a", lineHeight: 1 },
  dropDayName: { fontSize: "11px", color: "#888", marginTop: "2px" },
  dropInfo: { flex: 1, minWidth: 0 },
  dropHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" },
  dropTitle: {
    fontSize: "15px",
    fontWeight: "600",
    margin: 0,
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  hotBadge: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 6px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    borderRadius: "4px",
  },
  daysUntil: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#888",
    backgroundColor: "#f5f5f5",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  dropMeta: { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" },
  dropPlatform: { fontSize: "13px", color: "#555" },
  dropType: { fontSize: "12px", color: "#888", padding: "2px 8px", backgroundColor: "#f5f5f5", borderRadius: "4px" },
  dropRegion: { fontSize: "11px", color: "#666", padding: "2px 6px", backgroundColor: "#e0f2fe", borderRadius: "4px" },
  msrpBadge: { fontSize: "12px", fontWeight: "600", color: "#059669", marginTop: "6px" },
  dropNotes: { fontSize: "12px", color: "#888", marginTop: "4px", margin: 0 },
  notifyButton: {
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: "500",
    backgroundColor: "#fff",
    color: "#1a1a1a",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  notifyButtonActive: { backgroundColor: "#1a1a1a", color: "#fff", borderColor: "#1a1a1a" },
  footer: {
    padding: "24px",
    textAlign: "center",
    borderTop: "1px solid #eaeaea",
    backgroundColor: "#fff",
    marginTop: "40px",
  },
  footerText: { fontSize: "12px", color: "#888", margin: "0 0 4px 0" },
  footerSubtext: { fontSize: "11px", color: "#bbb", margin: 0 },
};
