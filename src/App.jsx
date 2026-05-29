import { useState, useRef } from "react";

function solve(raw) {
  let { tp, fp, fn, tn, sens, spec, ppv, npv,
        cases, controls, n, lrp, lrn, dor, accuracy, f1, f2 } = raw;

  for (let pass = 0; pass < 24; pass++) {
    if (lrp != null && spec != null && sens == null) sens = lrp * (1 - spec);
    if (lrp != null && sens != null && spec == null) spec = 1 - sens / lrp;
    if (sens != null && spec != null && lrp == null && spec < 1) lrp = sens / (1 - spec);
    if (lrn != null && spec != null && sens == null) sens = 1 - lrn * spec;
    if (lrn != null && sens != null && spec == null) spec = (1 - sens) / lrn;
    if (sens != null && spec != null && lrn == null && sens < 1) lrn = (1 - sens) / spec;
    if (dor != null && lrp != null && lrn == null) lrn = lrp / dor;
    if (dor != null && lrn != null && lrp == null) lrp = dor * lrn;
    if (lrp != null && lrn != null && lrn > 0 && dor == null) dor = lrp / lrn;
    if (accuracy != null && n != null && tp != null && tn == null) tn = accuracy * n - tp;
    if (accuracy != null && n != null && tn != null && tp == null) tp = accuracy * n - tn;
    if (tp != null && tn != null && n != null && n > 0 && accuracy == null) accuracy = (tp + tn) / n;
    if (f1 != null && sens != null && ppv == null && (2 * sens - f1) !== 0) ppv = f1 * sens / (2 * sens - f1);
    if (f1 != null && ppv != null && sens == null && (2 * ppv - f1) !== 0) sens = f1 * ppv / (2 * ppv - f1);
    if (ppv != null && sens != null && f1 == null && (ppv + sens) > 0) f1 = 2 * ppv * sens / (ppv + sens);
    if (f2 != null && sens != null && ppv == null && (5 * sens - f2) !== 0) ppv = f2 * sens / (5 * sens - f2);
    if (f2 != null && ppv != null && sens == null && (5 * ppv - f2) !== 0) sens = f2 * ppv / (5 * ppv - f2);
    if (ppv != null && sens != null && f2 == null && (4 * ppv + sens) > 0) f2 = 5 * ppv * sens / (4 * ppv + sens);
    if (sens != null) sens = Math.max(0, Math.min(1, sens));
    if (spec != null) spec = Math.max(0, Math.min(1, spec));
    if (ppv != null) ppv = Math.max(0, Math.min(1, ppv));
    if (npv != null) npv = Math.max(0, Math.min(1, npv));
    if (accuracy != null) accuracy = Math.max(0, Math.min(1, accuracy));
    if (f1 != null) f1 = Math.max(0, Math.min(1, f1));
    if (f2 != null) f2 = Math.max(0, Math.min(1, f2));
    if (tp != null && fn != null) cases = cases ?? tp + fn;
    if (fp != null && tn != null) controls = controls ?? fp + tn;
    if (tp != null && fp != null && fn != null && tn != null) n = n ?? tp + fp + fn + tn;
    if (cases != null && controls != null) n = n ?? cases + controls;
    if (sens != null && cases != null && tp == null) tp = sens * cases;
    if (sens != null && tp != null && cases == null) cases = tp / sens;
    if (sens != null && fn != null && tp == null && sens < 1) tp = fn * sens / (1 - sens);
    if (sens != null && tp != null && fn == null && sens > 0) fn = tp * (1 - sens) / sens;
    if (tp != null && cases != null && sens == null && cases > 0) sens = tp / cases;
    if (cases != null && tp != null && fn == null) fn = cases - tp;
    if (cases != null && fn != null && tp == null) tp = cases - fn;
    if (spec != null && controls != null && tn == null) tn = spec * controls;
    if (spec != null && tn != null && controls == null) controls = tn / spec;
    if (spec != null && fp != null && tn == null && spec < 1) tn = fp * spec / (1 - spec);
    if (spec != null && tn != null && fp == null && spec > 0) fp = tn * (1 - spec) / spec;
    if (tn != null && controls != null && spec == null && controls > 0) spec = tn / controls;
    if (controls != null && tn != null && fp == null) fp = controls - tn;
    if (controls != null && fp != null && tn == null) tn = controls - fp;
    if (ppv != null && tp != null && fp == null && ppv < 1) fp = tp * (1 - ppv) / ppv;
    if (ppv != null && fp != null && tp == null && ppv > 0) tp = fp * ppv / (1 - ppv);
    if (tp != null && fp != null && ppv == null) ppv = tp / (tp + fp);
    if (npv != null && tn != null && fn == null && npv < 1) fn = tn * (1 - npv) / npv;
    if (npv != null && fn != null && tn == null && npv > 0) tn = fn * npv / (1 - npv);
    if (tn != null && fn != null && npv == null) npv = tn / (tn + fn);
    if (n != null && cases != null && controls == null) controls = n - cases;
    if (n != null && controls != null && cases == null) cases = n - controls;
    if (tp != null && fn != null) cases = cases ?? tp + fn;
    if (fp != null && tn != null) controls = controls ?? fp + tn;
    if (tp != null && fp != null && fn != null && tn != null) n = n ?? tp + fp + fn + tn;
    if (cases != null && controls != null) n = n ?? cases + controls;
  }

  const _n = (tp != null && fp != null && fn != null && tn != null) ? tp + fp + fn + tn : n;
  if (_n && _n > 0 && tp != null && tn != null) accuracy = (tp + tn) / _n;
  if (ppv != null && sens != null && (ppv + sens) > 0) f1 = 2 * ppv * sens / (ppv + sens);
  if (ppv != null && sens != null && (4 * ppv + sens) > 0) f2 = 5 * ppv * sens / (4 * ppv + sens);
  if (sens != null && spec != null && spec < 1) lrp = sens / (1 - spec);
  if (sens != null && spec != null && sens < 1) lrn = (1 - sens) / spec;
  let dorFinal = null;
  if (tp != null && tn != null && fp != null && fn != null && fp > 0 && fn > 0)
    dorFinal = (tp * tn) / (fp * fn);
  else if (lrp != null && lrn != null && lrn > 0)
    dorFinal = lrp / lrn;

  const fix = v => (v != null && isFinite(v) && v >= 0) ? Math.round(v * 10) / 10 : null;
  const fixP = v => (v != null && isFinite(v)) ? Math.max(0, Math.min(1, v)) : null;
  return {
    tp: fix(tp), fp: fix(fp), fn: fix(fn), tn: fix(tn),
    sens: fixP(sens), spec: fixP(spec), ppv: fixP(ppv), npv: fixP(npv),
    cases: fix(cases), controls: fix(controls), n: fix(_n),
    accuracy: fixP(accuracy), f1: fixP(f1), f2: fixP(f2),
    lrp: (lrp != null && isFinite(lrp)) ? Math.max(0, lrp) : null,
    lrn: (lrn != null && isFinite(lrn)) ? Math.max(0, lrn) : null,
    dor: dorFinal != null && isFinite(dorFinal) ? Math.max(0, dorFinal) : null,
  };
}

const fmtNum = v => (v != null && isFinite(v)) ? (Number.isInteger(v) ? String(v) : v.toFixed(1)) : null;

function PieChart({ slices, size = 110 }) {
  const total = slices.reduce((s, x) => s + (x.value || 0), 0);
  if (!total) return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 9, color: "#64748b" }}>—</span>
    </div>
  );
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  let paths = [], angle = -Math.PI / 2;
  slices.forEach(sl => {
    if (!sl.value) return;
    const sweep = (sl.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    paths.push({ d: `M${cx},${cy} L${x1},${y1} A${r},${r},0,${sweep > Math.PI ? 1 : 0},1,${x2},${y2} Z`, color: sl.color, name: sl.name, value: sl.value, pct: ((sl.value / total) * 100).toFixed(1) });
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} stroke="#ffffff" strokeWidth={2}>
          <title>{p.name}: {p.value} ({p.pct}%)</title>
        </path>
      ))}
    </svg>
  );
}

function Ring({ value, size = 80, label, sublabel }) {
  const thickness = 9;
  const r = (size - thickness) / 2, circ = 2 * Math.PI * r;
  const pv = value != null ? Math.max(0, Math.min(1, value)) : 0;
  const col = value == null ? "#cbd5e1" : value >= 0.8 ? "#059669" : value >= 0.6 ? "#d97706" : "#dc2626";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={thickness} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={thickness}
          strokeDasharray={`${pv * circ} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.3s", filter: value != null ? `drop-shadow(0 0 4px ${col}88)` : "none" }} />
        <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={900}
          fill={value == null ? "#94a3b8" : col} fontFamily="'Courier New', monospace">
          {value != null ? Math.round(value * 100) + "%" : "?"}
        </text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", letterSpacing: "0.05em" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 8, color: "#475569", letterSpacing: "0.08em", marginTop: 1 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function SmartInput({ label, aliases, hint, pctField, color, userVal, computedVal, onUserChange, compact }) {
  const [focused, setFocused] = useState(false);
  const hasUser = userVal !== "" && userVal !== undefined && userVal !== null;
  const isComputed = !hasUser && computedVal != null;

  let display = "";
  if (focused) display = hasUser ? userVal : "";
  else if (hasUser) display = userVal;
  else if (computedVal != null) {
    if (pctField) display = (computedVal * 100).toFixed(1);
    else display = fmtNum(computedVal) ?? "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "'Courier New', monospace", letterSpacing: "0.06em" }}>{label}</span>
        {aliases && <span style={{ fontSize: 8, color: "#64748b", letterSpacing: "0.04em" }}>{aliases}</span>}
      </div>
      <div style={{ position: "relative" }}>
        <input type="text" inputMode="decimal" value={display}
          onChange={e => { const v = e.target.value; if (v === "" || /^[\d.]*$/.test(v)) onUserChange(v); }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="—"
          style={{
            width: "100%", boxSizing: "border-box",
            padding: compact ? "7px 26px 7px 10px" : "10px 30px 10px 12px",
            borderRadius: 8,
            border: `1.5px solid ${hasUser ? color : isComputed ? "#333" : "#222"}`,
            background: hasUser ? color + "18" : isComputed ? "#f8fafc" : "#ffffff",
            color: hasUser ? color : isComputed ? "#666" : "#333",
            fontSize: compact ? 14 : 16, fontFamily: "'Courier New', monospace", fontWeight: 700,
            fontStyle: isComputed ? "italic" : "normal",
            outline: "none", transition: "border-color 0.2s, background 0.2s"
          }} />
        {pctField && <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#64748b", fontFamily: "monospace", pointerEvents: "none" }}>%</span>}
      </div>
      {isComputed && <div style={{ fontSize: 8, color: "#64748b", letterSpacing: "0.06em" }}>COMPUTED</div>}
    </div>
  );
}

function StatRow({ icon, label, formula, color, pctField, decField, isBar, userVal, computedVal, onUserChange, even }) {
  const [open, setOpen] = useState(false);
  const hasUser = userVal !== "" && userVal !== undefined && userVal !== null;
  const isComputed = !hasUser && computedVal != null;
  const val = hasUser ? (pctField ? parseFloat(userVal) / 100 : parseFloat(userVal)) : computedVal;
  const qualColor = isBar && val != null ? val >= 0.8 ? "#059669" : val >= 0.6 ? "#d97706" : "#dc2626" : color;

  let display = "";
  const [focused, setFocused] = useState(false);
  if (focused) display = hasUser ? userVal : "";
  else if (hasUser) display = userVal;
  else if (computedVal != null) {
    if (pctField) display = (computedVal * 100).toFixed(1);
    else if (decField) display = computedVal.toFixed(2);
    else display = fmtNum(computedVal) ?? "";
  }

  return (
    <div style={{ borderBottom: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: even ? "#f8fafc" : "#ffffff" }}>
        <span style={{ fontSize: 14, width: 22, textAlign: "center" }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: computedVal == null && !hasUser ? "#94a3b8" : "#1e293b", letterSpacing: "0.04em" }}>{label}</span>
          {isBar && val != null && (
            <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: "#e2e8f0", overflow: "hidden" }}>
              <div style={{ height: "100%", width: Math.max(0, Math.min(1, val)) * 100 + "%", background: qualColor, transition: "width 0.4s ease", boxShadow: `0 0 6px ${qualColor}88` }} />
            </div>
          )}
        </div>
        <div style={{ width: 100 }}>
          <div style={{ position: "relative" }}>
            <input type="text" inputMode="decimal" value={display}
              onChange={e => { const v = e.target.value; if (v === "" || /^[\d.]*$/.test(v)) onUserChange(v); }}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder="—"
              style={{
                width: "100%", boxSizing: "border-box", padding: "5px 22px 5px 8px", borderRadius: 6,
                border: `1.5px solid ${hasUser ? qualColor : isComputed ? "#cbd5e1" : "#e2e8f0"}`,
                background: hasUser ? qualColor + "18" : isComputed ? "#f8fafc" : "#ffffff",
                color: hasUser ? qualColor : isComputed ? "#555" : "#cbd5e1",
                fontSize: 13, fontFamily: "'Courier New', monospace", fontWeight: 800,
                fontStyle: isComputed ? "italic" : "normal",
                outline: "none", textAlign: "right", transition: "border-color 0.18s"
              }} />
            {pctField && <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "#64748b", fontFamily: "monospace", pointerEvents: "none" }}>%</span>}
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "#64748b", padding: "2px 4px" }}>{open ? "▲" : "▼"}</button>
      </div>
      {open && (
        <div style={{ padding: "6px 14px 10px 44px", background: even ? "#f8fafc" : "#ffffff", borderTop: "1px solid #e2e8f0" }}>
          <code style={{ fontSize: 10, color: qualColor, background: qualColor + "18", padding: "3px 8px", borderRadius: 4 }}>{formula}</code>
        </div>
      )}
    </div>
  );
}

function LRInput({ label, positive, userVal, computedVal, onUserChange }) {
  const [focused, setFocused] = useState(false);
  const hasUser = userVal !== "" && userVal !== undefined && userVal !== null;
  const isComputed = !hasUser && computedVal != null;
  let display = "";
  if (focused) display = hasUser ? userVal : "";
  else if (hasUser) display = userVal;
  else if (computedVal != null) display = computedVal.toFixed(2);

  const val = hasUser ? parseFloat(userVal) : computedVal;
  const bands = positive
    ? [{ max: 2, col: "#555" }, { max: 5, col: "#d97706" }, { max: 10, col: "#0891b2" }, { max: Infinity, col: "#059669" }]
    : [{ max: 0.1, col: "#059669" }, { max: 0.2, col: "#0891b2" }, { max: 0.5, col: "#d97706" }, { max: Infinity, col: "#555" }];
  const band = val != null ? (bands.find(b => val < b.max) || bands[bands.length - 1]) : null;
  const col = band ? band.col : "#333";

  return (
    <div style={{ flex: 1, borderRadius: 10, border: `1.5px solid ${col}44`, background: col + "08", padding: "10px 12px" }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      <div style={{ position: "relative" }}>
        <input type="text" inputMode="decimal" value={display}
          onChange={e => { const v = e.target.value; if (v === "" || /^[\d.]*$/.test(v)) onUserChange(v); }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="—"
          style={{
            width: "100%", boxSizing: "border-box", padding: "8px 10px", borderRadius: 7,
            border: `1.5px solid ${hasUser ? col : isComputed ? "#cbd5e1" : "#e2e8f0"}`,
            background: hasUser ? col + "18" : isComputed ? "#f8fafc" : "#ffffff",
            color: hasUser ? col : isComputed ? "#555" : "#cbd5e1",
            fontSize: 20, fontFamily: "'Courier New', monospace", fontWeight: 900,
            fontStyle: isComputed ? "italic" : "normal",
            outline: "none", transition: "all 0.18s"
          }} />
      </div>
      {isComputed && <div style={{ fontSize: 8, color: "#64748b", marginTop: 3, letterSpacing: "0.06em" }}>COMPUTED</div>}
      <div style={{ fontSize: 8, color: "#64748b", marginTop: 5, fontFamily: "monospace" }}>{positive ? "Sens / (1−Spec)" : "(1−Sens) / Spec"}</div>
    </div>
  );
}

export default function App() {
  const [ui, setUi] = useState({ tp: "", fp: "", fn: "", tn: "", sens: "", spec: "", ppv: "", npv: "", cases: "", controls: "", n: "", lrp: "", lrn: "", dor: "", accuracy: "", f1: "", f2: "" });
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef(null);

  function parseRaw(u) {
    const pf = k => { const v = parseFloat(u[k]); return isNaN(v) ? null : Math.max(0, Math.min(100, v)) / 100; };
    const num = k => { const v = parseFloat(u[k]); return isNaN(v) ? null : Math.max(0, v); };
    return {
      tp: num("tp"), fp: num("fp"), fn: num("fn"), tn: num("tn"),
      sens: pf("sens"), spec: pf("spec"), ppv: pf("ppv"), npv: pf("npv"),
      cases: num("cases"), controls: num("controls"), n: num("n"),
      lrp: num("lrp"), lrn: num("lrn"), dor: num("dor"),
      accuracy: pf("accuracy"), f1: pf("f1"), f2: pf("f2"),
    };
  }

  const s = solve(parseRaw(ui));
  const set = (k, v) => setUi(u => ({ ...u, [k]: v }));
  const cv = key => (ui[key] !== "" && ui[key] !== null) ? null : s[key];

  async function sendChat(override) {
    const msg = (override ?? chatInput).trim();
    if (!msg) return;
    setChatInput(""); setChatLoading(true);
    const ctx = `TP=${s.tp ?? '?'} FP=${s.fp ?? '?'} FN=${s.fn ?? '?'} TN=${s.tn ?? '?'} Sens=${s.sens != null ? (s.sens * 100).toFixed(1) + '%' : '?'} Spec=${s.spec != null ? (s.spec * 100).toFixed(1) + '%' : '?'} PPV=${s.ppv != null ? (s.ppv * 100).toFixed(1) + '%' : '?'} NPV=${s.npv != null ? (s.npv * 100).toFixed(1) + '%' : '?'} LR+=${s.lrp != null ? s.lrp.toFixed(2) : '?'} LR-=${s.lrn != null ? s.lrn.toFixed(2) : '?'} DOR=${s.dor != null ? s.dor.toFixed(1) : '?'}`;
    const newMsgs = [...chat, { role: "user", content: msg }];
    setChat(newMsgs);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are a clinical biostatistics expert. Current state: ${ctx}. If user wants to SET values respond ONLY with JSON: {"set":{"sens":90,"lrp":4.5,...}}. Keys: tp,fp,fn,tn,sens,spec,ppv,npv,cases,controls,n,lrp,lrn,dor,accuracy,f1,f2. Percentage fields (sens,spec,ppv,npv,accuracy,f1,f2) as 0-100. Otherwise 2-4 sentences clinical explanation. No markdown.`,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      let reply = text;
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        if (parsed.set) { const nu = { ...ui }; Object.entries(parsed.set).forEach(([k, v]) => { nu[k] = String(v); }); setUi(nu); reply = "Values updated — everything recalculated."; }
      } catch { }
      setChat(c => [...c, { role: "assistant", content: reply }]);
    } catch { setChat(c => [...c, { role: "assistant", content: "Connection error — try again." }]); }
    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }

  const has4 = s.tp != null && s.fp != null && s.fn != null && s.tn != null;
  const cellPie = has4 ? [{ value: s.tp, color: "#059669", name: "TP" }, { value: s.fp, color: "#d97706", name: "FP" }, { value: s.fn, color: "#dc2626", name: "FN" }, { value: s.tn, color: "#0891b2", name: "TN" }] : [];
  const accPie = s.accuracy != null && has4 ? [{ value: (s.tp ?? 0) + (s.tn ?? 0), color: "#059669", name: "Correct" }, { value: (s.fp ?? 0) + (s.fn ?? 0), color: "#dc2626", name: "Incorrect" }] : [];

  const statRows = [
    { key: "accuracy", icon: "🎯", label: "Accuracy", pctField: true, decField: false, isBar: true, color: "#0891b2", formula: "(TP+TN) / N" },
    { key: "f1", icon: "⚡", label: "F1 Score", pctField: true, decField: false, isBar: true, color: "#a78bfa", formula: "2·PPV·Sens / (PPV+Sens)" },
    { key: "f2", icon: "⚖️", label: "F2 Score", pctField: true, decField: false, isBar: true, color: "#c084fc", formula: "5·PPV·Sens / (4·PPV+Sens)" },
    { key: "dor", icon: "🔬", label: "Diag Odds Ratio", pctField: false, decField: true, isBar: false, color: "#d97706", formula: "LR+ / LR−  =  TP·TN / FP·FN" },
    { key: "cases", icon: "🔴", label: "Cases (D+)", pctField: false, decField: false, isBar: false, color: "#dc2626", formula: "TP + FN" },
    { key: "controls", icon: "🔵", label: "Controls (D−)", pctField: false, decField: false, isBar: false, color: "#0891b2", formula: "FP + TN" },
    { key: "n", icon: "∑", label: "Total N", pctField: false, decField: false, isBar: false, color: "#64748b", formula: "Cases + Controls" },
  ];

  const quickPrompts = [
    "Set sens=92%, spec=87%, cases=150, controls=300",
    "Set LR+=8, LR-=0.15, cases=200, controls=400",
    "Explain what DOR means clinically",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'Courier New', monospace", color: "#1e293b" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(90deg, #0a3055 0%, #1565a0 50%, #0d5f8a 100%)", borderBottom: "1px solid #e2e8f0", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 22 }}>🩺</div>
        <div>
          <div style={{ color: "#059669", fontWeight: 900, fontSize: 18, letterSpacing: "0.1em", textTransform: "uppercase" }}>DiagnosticIQ</div>
          <div style={{ color: "#64748b", fontSize: 9, letterSpacing: "0.12em", marginTop: 1 }}>BIDIRECTIONAL DIAGNOSTIC STATISTICS ENGINE</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setUi({ tp: "", fp: "", fn: "", tn: "", sens: "", spec: "", ppv: "", npv: "", cases: "", controls: "", n: "", lrp: "", lrn: "", dor: "", accuracy: "", f1: "", f2: "" })}
            style={{ padding: "6px 13px", borderRadius: 6, border: "1px solid #e2e8f0", background: "transparent", color: "#475569", cursor: "pointer", fontSize: 11, fontFamily: "inherit", letterSpacing: "0.06em" }}>↺ CLEAR</button>
          <button onClick={() => setShowChat(v => !v)}
            style={{ padding: "6px 13px", borderRadius: 6, border: `1px solid ${showChat ? "#059669" : "#e2e8f0"}`, background: showChat ? "#05966918" : "transparent", color: showChat ? "#059669" : "#555", cursor: "pointer", fontSize: 11, fontFamily: "inherit", letterSpacing: "0.06em" }}>AI HELP</button>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 12px", display: "flex", gap: 12, flexWrap: "wrap" }}>

        {/* LEFT */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* 2x2 TABLE */}
          <div style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#059669", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>⊞ 2×2 TABLE</span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr", gap: 7, marginBottom: 7 }}>
                <div />
                <div style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: "#dc2626", letterSpacing: "0.12em" }}>DISEASE +</div>
                <div style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: "#0891b2", letterSpacing: "0.12em" }}>DISEASE −</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr", gap: 7, marginBottom: 7, alignItems: "start" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingTop: 18 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#059669", letterSpacing: "0.08em" }}>TEST+</span>
                </div>
                <SmartInput label="TP" aliases="True Pos" pctField={false} color="#059669" userVal={ui.tp} computedVal={cv("tp")} onUserChange={v => set("tp", v)} compact />
                <SmartInput label="FP" aliases="False Pos" pctField={false} color="#d97706" userVal={ui.fp} computedVal={cv("fp")} onUserChange={v => set("fp", v)} compact />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr", gap: 7, alignItems: "start" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingTop: 18 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#475569", letterSpacing: "0.08em" }}>TEST−</span>
                </div>
                <SmartInput label="FN" aliases="False Neg" pctField={false} color="#dc2626" userVal={ui.fn} computedVal={cv("fn")} onUserChange={v => set("fn", v)} compact />
                <SmartInput label="TN" aliases="True Neg" pctField={false} color="#0891b2" userVal={ui.tn} computedVal={cv("tn")} onUserChange={v => set("tn", v)} compact />
              </div>
            </div>
          </div>

          {/* PRIMARY METRICS */}
          <div style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>% PRIMARY METRICS</span>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                <SmartInput label="Sensitivity" aliases="TPR · Recall" pctField={true} color="#059669" userVal={ui.sens} computedVal={cv("sens")} onUserChange={v => set("sens", v)} />
                <SmartInput label="Specificity" aliases="TNR" pctField={true} color="#0891b2" userVal={ui.spec} computedVal={cv("spec")} onUserChange={v => set("spec", v)} />
                <SmartInput label="PPV" aliases="Precision" pctField={true} color="#a78bfa" userVal={ui.ppv} computedVal={cv("ppv")} onUserChange={v => set("ppv", v)} />
                <SmartInput label="NPV" aliases="" pctField={true} color="#38bdf8" userVal={ui.npv} computedVal={cv("npv")} onUserChange={v => set("npv", v)} />
              </div>
              <div style={{ height: 1, background: "#e2e8f0" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                <SmartInput label="Cases" aliases="D+" pctField={false} color="#dc2626" userVal={ui.cases} computedVal={cv("cases")} onUserChange={v => set("cases", v)} compact />
                <SmartInput label="Controls" aliases="D−" pctField={false} color="#0891b2" userVal={ui.controls} computedVal={cv("controls")} onUserChange={v => set("controls", v)} compact />
                <SmartInput label="N" aliases="Total" pctField={false} color="#555" userVal={ui.n} computedVal={cv("n")} onUserChange={v => set("n", v)} compact />
              </div>
            </div>
          </div>

          {/* GAUGES */}
          <div style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ color: "#0891b2", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>◉ CORE PERFORMANCE</span>
            </div>
            <div style={{ padding: "12px 8px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Ring value={s.sens} label="Sensitivity" sublabel="TPR · RECALL" />
                <Ring value={s.spec} label="Specificity" sublabel="TNR" />
                <Ring value={s.ppv} label="PPV" sublabel="PRECISION" />
                <Ring value={s.npv} label="NPV" sublabel="" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* PIE CHARTS */}
          <div style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ color: "#38bdf8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>◔ VISUAL BREAKDOWN</span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { pie: cellPie, label: "2×2 CELL SPLIT", legend: [{ c: "#059669", l: "TP" }, { c: "#d97706", l: "FP" }, { c: "#dc2626", l: "FN" }, { c: "#0891b2", l: "TN" }] },
                  { pie: accPie, label: "ACCURACY VIEW", legend: [{ c: "#059669", l: "Correct" }, { c: "#dc2626", l: "Incorrect" }] },
                ].map((g, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <PieChart slices={g.pie} size={100} />
                    <div style={{ fontSize: 8, fontWeight: 700, color: "#64748b", letterSpacing: "0.1em" }}>{g.label}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
                      {g.legend.map(x => (
                        <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 8, color: "#475569" }}>
                          <div style={{ width: 6, height: 6, borderRadius: 1, background: x.c }} />{x.l}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LR PANEL */}
          <div style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ color: "#d97706", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>⚖ LIKELIHOOD RATIOS</span>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", gap: 9 }}>
                <LRInput label="LR+ (Rule In)" positive={true} userVal={ui.lrp} computedVal={cv("lrp")} onUserChange={v => set("lrp", v)} />
                <LRInput label="LR− (Rule Out)" positive={false} userVal={ui.lrn} computedVal={cv("lrn")} onUserChange={v => set("lrn", v)} />
              </div>
              <div style={{ border: "1.5px solid #d9770644", borderRadius: 8, padding: "9px 11px", background: "#d9770608" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", marginBottom: 6 }}>DOR — DIAGNOSTIC ODDS RATIO</div>
                <div style={{ position: "relative" }}>
                  <input type="text" inputMode="decimal"
                    value={ui.dor !== "" ? ui.dor : (cv("dor") != null ? cv("dor").toFixed(1) : "")}
                    onChange={e => { const v = e.target.value; if (v === "" || /^[\d.]*$/.test(v)) set("dor", v); }}
                    placeholder="—"
                    style={{
                      width: "100%", boxSizing: "border-box", padding: "7px 10px", borderRadius: 6,
                      border: `1.5px solid ${ui.dor ? "#d97706" : cv("dor") != null ? "#cbd5e1" : "#e2e8f0"}`,
                      background: ui.dor ? "#d9770618" : cv("dor") != null ? "#f8fafc" : "#ffffff",
                      color: ui.dor ? "#d97706" : cv("dor") != null ? "#475569" : "#cbd5e1",
                      fontSize: 18, fontFamily: "'Courier New', monospace", fontWeight: 900,
                      fontStyle: (!ui.dor && cv("dor") != null) ? "italic" : "normal", outline: "none"
                    }} />
                </div>
                {(!ui.dor && cv("dor") != null) && <div style={{ fontSize: 8, color: "#64748b", marginTop: 2, letterSpacing: "0.06em" }}>COMPUTED</div>}
                <div style={{ fontSize: 8, color: "#64748b", marginTop: 5, fontFamily: "monospace" }}>LR+ / LR−  =  TP·TN / FP·FN</div>
              </div>
              <div style={{ fontSize: 8, color: "#64748b", lineHeight: 1.9, fontFamily: "monospace", padding: "4px 7px", background: "#e2e8f0", borderRadius: 5 }}>
                LR+ &gt;10 → large rule-in · &gt;5 moderate · &gt;2 small{"\n"}
                LR− &lt;0.1 → large rule-out · &lt;0.2 moderate
              </div>
            </div>
          </div>

          {/* FULL STATS */}
          <div style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ color: "#1e293b", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>Σ FULL STATISTICS</span>
              <span style={{ fontSize: 8, color: "#64748b", marginLeft: 8 }}>▼ tap to expand formula</span>
            </div>
            <div>
              {statRows.map((r, i) => (
                <StatRow key={r.key} {...r} userVal={ui[r.key]} computedVal={cv(r.key)} onUserChange={v => set(r.key, v)} even={i % 2 === 1} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI CHAT */}
      {showChat && (
        <div style={{
          position: "fixed", bottom: 0, right: 0, width: 360, height: 480,
          background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "3px solid #0a3055",
          borderTopLeftRadius: 14, boxShadow: "-4px 0 30px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column", zIndex: 1000
        }}>
          <div style={{ padding: "11px 14px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#0a3055,#1565a0)", borderTopLeftRadius: 14 }}>
            <span style={{ color: "#e3f2fd", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>🤖 AI BIOSTATISTICS ASSISTANT</span>
            <button onClick={() => setShowChat(false)} style={{ background: "none", border: "none", color: "#90caf9", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 7 }}>
            {chat.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.1em", marginBottom: 2 }}>QUICK PROMPTS</div>
                {quickPrompts.map(q => (
                  <button key={q} onClick={() => sendChat(q)} style={{ textAlign: "left", padding: "7px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 11, cursor: "pointer", fontFamily: "inherit", lineHeight: 1.5 }}>{q}</button>
                ))}
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} style={{ padding: "8px 11px", borderRadius: 8, fontSize: 11, lineHeight: 1.6, background: m.role === "user" ? "linear-gradient(135deg,#0a3055,#1565a0)" : "#f1f5f9", color: m.role === "user" ? "#ffffff" : "#334155", border: "none", alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>{m.content}</div>
            ))}
            {chatLoading && <div style={{ padding: "8px 11px", borderRadius: 8, fontSize: 11, background: "#f8fafc", color: "#64748b", alignSelf: "flex-start" }}>analysing…</div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: "8px 10px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 7 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !chatLoading && sendChat()}
              placeholder="ask or set values…"
              style={{ flex: 1, padding: "8px 10px", borderRadius: 7, border: "1px solid #bfdbfe", background: "#f0f7ff", color: "#1e293b", outline: "none", fontSize: 11, fontFamily: "inherit" }} />
            <button onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}
              style={{ padding: "8px 14px", borderRadius: 7, border: "none", background: "linear-gradient(135deg,#0a3055,#1565a0)", color: "#ffffff", cursor: "pointer", fontSize: 12, fontWeight: 900, fontFamily: "inherit" }}>→</button>
          </div>
        </div>
      )}

      <style>{`* { box-sizing: border-box; } input:focus { border-color: #1565a0 !important; box-shadow: 0 0 0 3px rgba(21,101,160,0.12) !important; } button:hover:not(:disabled) { filter: brightness(1.05); } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }`}</style>
    </div>
  );
}
