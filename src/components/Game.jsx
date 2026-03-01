import { useState, useEffect, useRef } from "react";

const choices = [
  { id: "Rock", emoji: "✊", color: "#FF6B35", glow: "#FF6B3566" },
  { id: "Paper", emoji: "✋", color: "#4ECDC4", glow: "#4ECDC466" },
  { id: "Scissors", emoji: "✌️", color: "#FFE66D", glow: "#FFE66D66" },
];

const beats = { Rock: "Scissors", Paper: "Rock", Scissors: "Paper" };

function determineWinner(user, computer) {
  if (user === computer) return "draw";
  return beats[user] === computer ? "win" : "lose";
}
const resultConfig = {
  win: { label: "za3im", color: "#4ECDC4", sub: "zhar brk" },
  lose: { label: "bghal", color: "#FF6B35", sub: "roh trgd " },
  draw: { label: "3wd", color: "#FFE66D", sub: "" },
};

export default function Game() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [scores, setScores] = useState({ wins: 0, losses: 0, draws: 0 });
  const [computerAnim, setComputerAnim] = useState(false);
  const [shake, setShake] = useState(false);
  const timeoutRef = useRef(null);

  const handleChoice = (choice) => {
    if (animating) return;
    setAnimating(true);
    setResult(null);
    setUserChoice(choice);
    setComputerChoice(null);
    setComputerAnim(true);
    setShake(true);
    setTimeout(() => setShake(false), 600);

    const compIdx = Math.floor(Math.random() * choices.length);
    const comp = choices[compIdx].id;

    timeoutRef.current = setTimeout(() => {
      setComputerChoice(comp);
      setComputerAnim(false);
      const res = determineWinner(choice, comp);
      setResult(res);
      setScores((s) => ({
        wins: s.wins + (res === "win" ? 1 : 0),
        losses: s.losses + (res === "lose" ? 1 : 0),
        draws: s.draws + (res === "draw" ? 1 : 0),
      }));
      setAnimating(false);
    }, 1000);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
    setAnimating(false);
    setComputerAnim(false);
  };

  const resetAll = () => {
    reset();
    setScores({ wins: 0, losses: 0, draws: 0 });
  };

  const userChoice_obj = choices.find((c) => c.id === userChoice);
  const compChoice_obj = choices.find((c) => c.id === computerChoice);
  const res = result ? resultConfig[result] : null;

  return (
    <div style={styles.root}>
      {/* Background */}
      <div style={styles.bg} />
      <div style={styles.grid} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>RPS</div>
          <h1 style={styles.title}>haya tal3AB</h1>
          <p style={styles.subtitle}>5ayar wahda</p>
        </div>

        {/* Scoreboard */}
        <div style={styles.scoreboard}>
          {[
            { label: "WINS", value: scores.wins, color: "#4ECDC4" },
            { label: "DRAWS", value: scores.draws, color: "#FFE66D" },
            { label: "LOSSES", value: scores.losses, color: "#FF6B35" },
          ].map((s) => (
            <div key={s.label} style={styles.scoreCard}>
              <span style={{ ...styles.scoreNum, color: s.color }}>{s.value}</span>
              <span style={styles.scoreLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Arena */}
        <div style={styles.arena}>
          {/* Player side */}
          <div style={styles.side}>
            <div style={styles.sideLabel}>YOU</div>
            <div
              style={{
                ...styles.choiceDisplay,
                background: userChoice_obj
                  ? `radial-gradient(circle, ${userChoice_obj.glow}, transparent 70%)`
                  : "transparent",
                borderColor: userChoice_obj ? userChoice_obj.color : "#ffffff22",
                transform: userChoice_obj ? "scale(1)" : "scale(0.9)",
                opacity: userChoice_obj ? 1 : 0.4,
              }}
            >
              <span style={styles.choiceEmoji}>
                {userChoice_obj ? userChoice_obj.emoji : "?"}
              </span>
              {userChoice_obj && (
                <span style={{ ...styles.choiceName, color: userChoice_obj.color }}>
                  {userChoice_obj.id}
                </span>
              )}
            </div>
          </div>

          {/* VS */}
          <div style={styles.vsContainer}>
            <div style={styles.vs}>VS</div>
            {shake && <div style={styles.shakeIndicator}>⚡</div>}
          </div>

          {/* Computer side */}
          <div style={styles.side}>
            <div style={styles.sideLabel}>CPU</div>
            <div
              style={{
                ...styles.choiceDisplay,
                background: compChoice_obj
                  ? `radial-gradient(circle, ${compChoice_obj.glow}, transparent 70%)`
                  : "transparent",
                borderColor: compChoice_obj ? compChoice_obj.color : "#ffffff22",
                transform: compChoice_obj ? "scale(1)" : "scale(0.9)",
                opacity: compChoice_obj ? 1 : 0.4,
              }}
            >
              <span
                style={{
                  ...styles.choiceEmoji,
                  animation: computerAnim ? "spin 0.15s linear infinite" : "none",
                }}
              >
                {computerAnim ? "🎲" : compChoice_obj ? compChoice_obj.emoji : "?"}
              </span>
              {compChoice_obj && !computerAnim && (
                <span style={{ ...styles.choiceName, color: compChoice_obj.color }}>
                  {compChoice_obj.id}
                </span>
              )}
              {computerAnim && <span style={styles.thinking}>thinking…</span>}
            </div>
          </div>
        </div>

        {/* Result Banner */}
        <div style={{ ...styles.resultBanner, opacity: res ? 1 : 0 }}>
          {res && (
            <>
              <span style={{ ...styles.resultLabel, color: res.color }}>{res.label}</span>
              <span style={styles.resultSub}>{res.sub}</span>
            </>
          )}
        </div>

        {/* Choice Buttons */}
        <div style={styles.buttons}>
          {choices.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChoice(c.id)}
              disabled={animating}
              style={{
                ...styles.btn,
                borderColor: userChoice === c.id ? c.color : "#ffffff33",
                boxShadow: userChoice === c.id ? `0 0 20px ${c.glow}, inset 0 0 20px ${c.glow}` : "none",
                opacity: animating ? 0.6 : 1,
                cursor: animating ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!animating) {
                  e.currentTarget.style.borderColor = c.color;
                  e.currentTarget.style.boxShadow = `0 0 20px ${c.glow}`;
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!animating) {
                  e.currentTarget.style.borderColor = userChoice === c.id ? c.color : "#ffffff33";
                  e.currentTarget.style.boxShadow = userChoice === c.id ? `0 0 20px ${c.glow}` : "none";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                }
              }}
            >
              <span style={styles.btnEmoji}>{c.emoji}</span>
              <span style={{ ...styles.btnLabel, color: c.color }}>{c.id}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={reset} style={styles.actionBtn}>
            NEW ROUND
          </button>
          <button onClick={resetAll} style={{ ...styles.actionBtn, color: "#FF6B35aa", borderColor: "#FF6B3533" }}>
            RESET ALL
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Space Mono', monospace",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse at 20% 50%, #FF6B3511 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #4ECDC411 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, #FFE66D11 0%, transparent 60%)",
    pointerEvents: "none",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 680,
    padding: "40px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
  },
  header: {
    textAlign: "center",
  },
  logo: {
    display: "inline-block",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 11,
    letterSpacing: "0.4em",
    color: "#ffffff44",
    border: "1px solid #ffffff22",
    padding: "4px 12px",
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(28px, 6vw, 52px)",
    letterSpacing: "0.08em",
    color: "#ffffff",
    lineHeight: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: "0.3em",
    color: "#ffffff44",
    textTransform: "uppercase",
  },
  scoreboard: {
    display: "flex",
    gap: 2,
    background: "#ffffff08",
    border: "1px solid #ffffff11",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
  },
  scoreCard: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "14px 8px",
    gap: 4,
    borderRight: "1px solid #ffffff11",
  },
  scoreNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 36,
    lineHeight: 1,
    transition: "all 0.3s",
  },
  scoreLabel: {
    fontSize: 9,
    letterSpacing: "0.3em",
    color: "#ffffff44",
  },
  arena: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    width: "100%",
    justifyContent: "center",
  },
  side: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    flex: 1,
    maxWidth: 200,
  },
  sideLabel: {
    fontSize: 10,
    letterSpacing: "0.4em",
    color: "#ffffff44",
  },
  choiceDisplay: {
    width: 140,
    height: 140,
    borderRadius: 16,
    border: "2px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    background: "#ffffff08",
  },
  choiceEmoji: {
    fontSize: 52,
    lineHeight: 1,
    display: "block",
  },
  choiceName: {
    fontSize: 10,
    letterSpacing: "0.2em",
    fontWeight: 700,
  },
  thinking: {
    fontSize: 9,
    letterSpacing: "0.2em",
    color: "#ffffff44",
    animation: "pulse 0.8s ease-in-out infinite",
  },
  vsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    minWidth: 50,
  },
  vs: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 28,
    color: "#ffffff22",
    letterSpacing: "0.1em",
  },
  shakeIndicator: {
    fontSize: 20,
    animation: "pulse 0.3s ease-in-out infinite",
  },
  resultBanner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    minHeight: 56,
    transition: "opacity 0.3s",
  },
  resultLabel: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 44,
    letterSpacing: "0.1em",
    lineHeight: 1,
  },
  resultSub: {
    fontSize: 10,
    letterSpacing: "0.3em",
    color: "#ffffff55",
    textTransform: "uppercase",
  },
  buttons: {
    display: "flex",
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  btn: {
    flex: 1,
    maxWidth: 180,
    background: "#ffffff06",
    border: "2px solid",
    borderRadius: 12,
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  btnEmoji: {
    fontSize: 40,
    lineHeight: 1,
    display: "block",
  },
  btnLabel: {
    fontSize: 10,
    letterSpacing: "0.3em",
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
  },
  actions: {
    display: "flex",
    gap: 12,
  },
  actionBtn: {
    background: "transparent",
    border: "1px solid #ffffff22",
    color: "#ffffff55",
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.2em",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};