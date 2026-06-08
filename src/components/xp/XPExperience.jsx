import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  ExternalLink,
  FileText,
  Folder,
  Globe2,
  Mail,
  Maximize2,
  Minimize2,
  Monitor,
  MonitorPlay,
  Search,
  Terminal,
  X,
} from "lucide-react";

/*
  CORRECTED DIRECTION
  Fun mode = a believable Windows XP machine that reveals the portfolio through OS behavior.
  Formal mode = red / black / white Gen-Z recruiter dossier, not a boring dashboard.
  This keeps the original file's logic: boot, welcome/login, XP desktop, start menu,
  My Computer proof folders, reel library opening portrait windows, terminal,
  notepad/control-panel/hire actions and a profile-photo identity system.
*/

const CASES = [
  { id: "house", year: "2026 → NOW", title: "House of UD", role: "Brand Manager / Multi-brand Operator", metric: "3 brands", tags: ["Beauty", "Brand OS", "Shoots", "Creators"], short: "Running Depano, Barber Syndicate and My Artist like a three-brand operating room.", impact: ["Built two brands from zero: identity, content, audience and creator distribution", "Own shoots, creator partnerships and rollouts across three brands simultaneously", "Turn fuzzy product ideas into visible public worlds with a consistent voice"], weird: "This is where the design brain becomes useful: one eye on culture, one eye on commerce, one eye on how it looks in a feed at 2 AM." },
  { id: "super", year: "2024 → 2025", title: "SuperProfile × CosmoFeed", role: "Content Marketing Lead", metric: "500+ activations", tags: ["Creator Economy", "Partnerships", "USA Play"], short: "A creator-growth engine pretending to be a normal marketing role.", impact: ["100+ creators onboarded into the partner program", "500+ paid activations executed", "Launched agency partnerships vertical and USA-market play"], weird: "Most people make a calendar. I built a little factory where creators, offers and distribution kept colliding." },
  { id: "burger", year: "2025", title: "Burger Bae", role: "Creator-led Streetwear Growth", metric: "₹30K → ₹3L/day", tags: ["Fashion", "Creators", "Revenue Jump"], short: "Streetwear campaign with messy internet energy and a serious outcome.", impact: ["Moved the brand from roughly ₹30K/day to ₹3L/day during campaign momentum", "Built creator-led attention around the brand", "Made the work feel internet-native instead of ad-agency sterile"], weird: "Burger Bae had the correct disease: it wanted to be loud. I helped it scream in the right rooms." },
  { id: "seekho", year: "2025", title: "Seekhobecho / Rawcast", role: "Media Vertical Builder", metric: "0 → 1 media vertical", tags: ["Podcast", "Media", "Zero → One"], short: "Built Rawcast as Seekhobecho's media vertical from zero.", impact: ["Hosted and produced multiple long-form podcast episodes", "Built the media vertical from scratch", "Turned conversations into brand surface area"], weird: "A podcast is not content. It is a room where a brand can stop sounding like a LinkedIn caption." },
  { id: "baecave", year: "2025", title: "Baecave × Radisson", role: "Creator-room Curator", metric: "30–40 creators", tags: ["Event", "Creators", "Experience"], short: "A creator room inside a Radisson. Not a meet-up. A contained social experiment.", impact: ["Curated 30–40 creators in one branded environment", "Built offline energy for online distribution", "Managed vibe, people and output together"], weird: "The best events feel slightly illegal even when they are perfectly legal." },
  { id: "investx", year: "2022 → 2023", title: "InvestX / Chitkara Innovation Incubator", role: "Organising Head", metric: "20CR+ commitments", tags: ["Startups", "VCs", "Operations"], short: "Capital ecosystem, startup rooms and a 30-person operating crew.", impact: ["Supported 40+ early-stage startups", "Led InvestX with 20CR+ in investor commitments", "Managed a 30-person team with 10+ VCs in the room"], weird: "Nobody knows what is happening, but somebody still has to run the room. I became that somebody." },
  { id: "tofire", year: "2021 → 2022", title: "Tongues on Fire", role: "Founder / Community Builder", metric: "120+ members", tags: ["Community", "Events", "19 y/o founder"], short: "A community built before permission to be impressive.", impact: ["120+ member community", "Team of 5 and 20+ interns", "300+ sessions, 7 events, 2 national festivals"], weird: "Before credentials, I had momentum. Momentum is better." },
];

const REELS = [
  { id: "rawcast", title: "Rawcast Podcast", brand: "Seekhobecho / Rawcast", type: "YouTube", emoji: "🎙", proof: "Media vertical + long-form format", embedUrl: "https://www.youtube.com/embed/o0WCff2O4hY?autoplay=1&si=sz8GyfMNhXWpNNzF", openUrl: "https://www.youtube.com/watch?v=o0WCff2O4hY" },
  { id: "barber", title: "Barber Syndicate Reel", brand: "Barber Syndicate", type: "Instagram", emoji: "✂", proof: "Salon category content + brand-in-motion", embedUrl: "https://www.instagram.com/reel/DWtbWwSyHN-/embed/captioned/", openUrl: "https://www.instagram.com/reel/DWtbWwSyHN-/" },
  { id: "myartist", title: "My Artist Reel", brand: "My Artist", type: "Instagram", emoji: "🎨", proof: "Beauty product content + brand world", embedUrl: "https://www.instagram.com/reel/DWWQRk3JVjU/embed/captioned/", openUrl: "https://www.instagram.com/reel/DWWQRk3JVjU/" },
  { id: "depano", title: "Depano Reel", brand: "Depano", type: "Instagram", emoji: "💆", proof: "Beauty/salon storytelling", embedUrl: "https://www.instagram.com/reel/DXMU2tjCKHd/embed/captioned/", openUrl: "https://www.instagram.com/reel/DXMU2tjCKHd/" },
  { id: "burger", title: "Burger Bae Collab", brand: "Burger Bae", type: "Instagram", emoji: "B", proof: "Creator-led streetwear growth", embedUrl: "https://www.instagram.com/reel/DLB_j8-BLej/embed/captioned/", openUrl: "https://www.instagram.com/reel/DLB_j8-BLej/" },
  { id: "baecave", title: "Baecave Room", brand: "Baecave × Radisson", type: "Instagram", emoji: "★", proof: "Creator-room experience proof", embedUrl: "https://www.instagram.com/reel/DJhSzl2ToSx/embed/captioned/", openUrl: "https://www.instagram.com/reel/DJhSzl2ToSx/" },
];

const CONTACT = {
  email: "pushkarsvashisht@gmail.com",
  phone: "9729317565",
  instagram: "https://www.instagram.com/ifeelperi/",
  linkedin: "https://www.linkedin.com/in/pushkarvashisht",
};

const XP_WALLPAPER_URL = "https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png";
const CV_URL = "/Pushkar_Vashisht_CV.html";
const PROFILE_PHOTO_URL = "/pushkar-profile.jpg";
const PITCH = "Pushkar Vashisht builds internet-native brand worlds, creator campaigns and content systems that turn messy attention into visible momentum.";

function downloadTextFile(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadVCard() {
  downloadTextFile(
    "Pushkar_Vashisht.vcf",
    `BEGIN:VCARD
VERSION:3.0
FN:Pushkar Vashisht
EMAIL:${CONTACT.email}
	TEL:${CONTACT.phone}
URL:${CONTACT.linkedin}
NOTE:Creative operator / creator growth / brand systems
END:VCARD`,
    "text/vcard"
  );
}

const DESKTOP_ICONS = [
  ["about", "My Computer", "computer"],
  ["work", "Case Studies", "folder"],
  ["reels", "Reel Player", "play"],
  ["internet", "Internet", "globe"],
  ["hire", "Hire Me", "hire"],
  ["cmd", "Command", "cmd"],
  ["paint", "Paint", "paint"],
  ["games", "Games", "games"],
  ["note", "README", "note"],
  ["control", "Control Panel", "ctrl"],
  ["bin", "Recycle Bin", "bin"],
];

const MATRIX_STREAM = [
  "01001101",
  "10110100",
  "XP-ROOT",
  "ACCESS",
  "HIRE-ME",
  "00010111",
  "PORTFOLIO",
  "OVERRIDE",
].join("\n");

function cx(...v) { return v.filter(Boolean).join(" "); }
async function copyText(text) { if (navigator.clipboard?.writeText) { try { await navigator.clipboard.writeText(text); return true; } catch {} } const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok; }
function XPButton({ children, onClick, primary=false, className="", type="button", href, ...props }) { const Component = href ? "a" : "button"; return <Component {...(!href ? { type } : { href })} onClick={onClick} className={cx("border border-white border-r-stone-600 border-b-stone-600 px-3 py-1 text-xs shadow-sm active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60", primary ? "bg-gradient-to-b from-[#6ca4ff] to-[#1d5fd4] font-bold text-white" : "bg-gradient-to-b from-white to-[#e4dfcc]", className)} {...props}>{children}</Component>; }
function XPIconGlyph({ type }) { return <span className={cx("xp-ico", `i-${type}`)} />; }
function IdentityMark({ small=false, dark=false }) { return <div className={cx("identity-mark", small && "small", dark && "dark")} aria-label="Pushkar Vashisht design mark"><span>PV</span></div>; }
function ProfilePhoto({ small=false, stamp=false }) { return <img src={PROFILE_PHOTO_URL} alt="Pushkar Vashisht" className={cx("profile-photo", small && "small", stamp && "stamp")} />; }

function MatrixBoot({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 1700), setTimeout(() => setPhase(2), 3200), setTimeout(onDone, 4700)];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);
  const columns = Array.from({ length: 34 }, (_, i) => i);
  return <div className="relative grid min-h-screen place-items-center overflow-hidden bg-black font-mono text-green-400">
    <div className="absolute inset-0 opacity-45">{columns.map(i => <motion.div key={i} className="absolute top-[-40%] whitespace-pre text-xs leading-4" style={{ left: `${i*3}%` }} animate={{ y: [0, 1100] }} transition={{ duration: 2.3 + (i%6)*.35, repeat: Infinity, ease: "linear", delay: i*.04 }}>{MATRIX_STREAM}</motion.div>)}</div>
    <AnimatePresence mode="wait">
      {phase === 0 && <motion.div key="scan" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="z-10 text-center"><div className="text-xs tracking-[.5em]">RUNNING SYSTEM SCAN</div><div className="mt-4 h-1 w-80 overflow-hidden bg-green-900"><motion.div className="h-full bg-green-400" animate={{x:[-320,320]}} transition={{duration:.8,repeat:Infinity}} /></div></motion.div>}
      {phase === 1 && <motion.div key="hacked" initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{opacity:0}} className="z-10 text-center"><AlertTriangle className="mx-auto mb-4 text-red-500" size={50}/><h1 className="text-5xl font-black text-red-600 sm:text-7xl">YOUR DEVICE IS HACKED</h1><p className="mt-4 text-green-300">encrypting recruiter boredom.exe...</p></motion.div>}
      {phase === 2 && <motion.div key="lol" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{opacity:0}} className="z-10 rounded border border-green-500 bg-black/70 p-8 text-center shadow-[0_0_80px_rgba(34,197,94,.3)]"><h2 className="text-5xl font-black text-white">lol just kidding</h2><p className="mt-3 text-green-300">Booting Pushkar XP...</p></motion.div>}
    </AnimatePresence>
    <button onClick={onDone} className="absolute bottom-6 right-6 z-20 border border-green-700 px-4 py-2 text-xs text-green-300">skip intro</button>
  </div>;
}

function XPBoot({ onDone }) {
  useEffect(() => { const t=setTimeout(onDone, 2100); return () => clearTimeout(t); }, [onDone]);
  return <div className="grid min-h-screen place-items-center bg-[#050505] text-white" style={{fontFamily:"Tahoma, Arial, sans-serif"}}>
    <div className="text-center"><div className="text-5xl tracking-[-.08em]">Microsoft <b>Windows</b><span className="ml-2 align-top text-xl text-orange-500">xp</span></div><div className="mx-auto mt-8 h-5 w-64 overflow-hidden border border-stone-500 bg-black p-[2px]"><motion.div className="h-full w-24 bg-[linear-gradient(90deg,#000_0_8px,#2f74ff_8px_30px,#8dc5ff_30px_42px,#2f74ff_42px_65px,#000_65px_76px)]" animate={{x:[-100,260]}} transition={{duration:1,repeat:Infinity,ease:"linear"}} /></div><p className="mt-5 text-xs text-stone-400">Loading creative drivers...</p></div>
  </div>;
}

function FormalBoot({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1450); return () => clearTimeout(t); }, [onDone]);
  return <div className="grid min-h-screen place-items-center bg-black px-6 text-white">
    <style>{xpCss}</style>
    <div className="w-[min(620px,92vw)] border border-red-700 bg-[#080808] p-5 shadow-[14px_14px_0_#7a0000]">
      <div className="mb-4 flex items-center gap-3 border-b border-white/15 pb-4"><ProfilePhoto small stamp/><div><p className="text-xs uppercase tracking-[.35em] text-red-600">opening dossier</p><h1 className="text-3xl font-black">Pushkar Vashisht</h1></div></div>
      <div className="h-3 overflow-hidden bg-white/10"><motion.div className="h-full bg-red-700" initial={{width:"8%"}} animate={{width:"100%"}} transition={{duration:1.15,ease:"easeInOut"}} /></div>
      <p className="mt-4 text-sm text-white/60">Loading proof numbers, case notes, contact routes and embedded work.</p>
      <button onClick={onDone} className="mt-5 border border-white/40 px-3 py-1 text-xs font-bold hover:bg-white hover:text-black">open now</button>
    </div>
  </div>;
}

function ModeGate({ startXP, startFormal }) {
  return <div className="min-h-screen overflow-hidden bg-black text-white">
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
    <main className="relative mx-auto grid min-h-screen max-w-6xl content-center gap-8 px-5 py-10">
      <div><p className="mb-3 text-xs uppercase tracking-[.45em] text-red-600">pick your route</p><h1 className="max-w-4xl text-6xl font-black leading-[.88] tracking-[-.07em] sm:text-8xl">Same work. Two ways to read it.</h1><p className="mt-5 max-w-2xl text-white/60">Use the XP desktop if you want personality and little discoveries. Use the dossier if you want the clean recruiter version: roles, proof, contact, and embedded work in one serious pass.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <button onClick={startXP} className="group border border-white/20 bg-white p-5 text-left text-black transition hover:-translate-y-1 hover:shadow-[14px_14px_0_#e00000]"><Monitor className="mb-8"/><h2 className="text-4xl font-black">Fun XP OS</h2><p className="mt-2 text-sm text-black/60">A desktop portfolio with guide notes, case folders, reels, paint, games and one button you really should not touch.</p><span className="mt-8 inline-flex items-center gap-2 bg-black px-4 py-2 text-sm font-bold text-white">Boot the machine <ArrowRight size={15}/></span></button>
        <button onClick={startFormal} className="group border border-red-700 bg-red-700 p-5 text-left text-white transition hover:-translate-y-1 hover:shadow-[14px_14px_0_#fff]"><Briefcase className="mb-8"/><h2 className="text-4xl font-black">Formal Dossier</h2><p className="mt-2 text-sm text-white/70">A sharper CV surface: proof numbers, filtered cases, direct video embeds, contact utilities and downloadable files.</p><span className="mt-8 inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-bold text-black">Open the dossier <ArrowRight size={15}/></span></button>
      </div>
    </main>
  </div>;
}

function XPWelcome({ onLogin, goGate }) {
  return <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_22%_15%,#8fc7ff_0_12%,transparent_32%),linear-gradient(135deg,#0e3fbd,#0a2472_55%,#061746)] text-white" style={{fontFamily:"Tahoma, Arial, sans-serif"}}>
    <div className="grid w-[min(760px,94vw)] grid-cols-1 items-center gap-6 p-5 md:grid-cols-[1fr_280px]"><div><h1 className="text-5xl font-bold leading-[.94] tracking-[-.06em] drop-shadow md:text-6xl">Welcome to <span className="text-yellow-300">Pushkar XP</span></h1><p className="mt-4 text-blue-100">Click the profile to log on.</p></div><div className="rounded-lg border border-white/45 bg-white/15 p-5 shadow-2xl"><div className="mb-3 flex items-center gap-3"><ProfilePhoto small stamp/><div><h2 className="text-xl font-bold">Pushkar Vashisht</h2><p className="text-xs text-blue-100">Creative Operator</p></div></div><input value="hire-me" readOnly type="password" className="my-3 w-full border-2 border-white bg-white p-2 text-black" aria-label="Portfolio login password"/><button onClick={onLogin} className="w-full rounded border border-green-200 border-r-green-900 border-b-green-900 bg-gradient-to-b from-[#75c45a] to-[#2c8d1c] px-4 py-2 font-bold text-white">Log on →</button></div></div>
    <div className="absolute bottom-0 left-0 right-0 flex h-14 items-center justify-between bg-[#0b3da7] px-6 text-xs text-blue-100"><button onClick={goGate}>Turn off computer</button><span>Case Studies → Reel Player → Hire Me</span></div>
  </div>;
}

const apps = {
  guide: { title: "Start Here - Guide", icon: "note", w: 560, h: 430, x: 155, y: 64 },
  about: { title: "My Computer", icon: "computer", w: 760, h: 560, x: 145, y: 26 },
  work: { title: "Case Studies", icon: "folder", w: 860, h: 590, x: 165, y: 45 },
  reels: { title: "Reel Player", icon: "play", w: 760, h: 520, x: 190, y: 68 },
  internet: { title: "Internet Explorer", icon: "globe", w: 650, h: 430, x: 220, y: 88 },
  hire: { title: "Hire Me", icon: "hire", w: 660, h: 430, x: 250, y: 108 },
  cmd: { title: "Command Prompt", icon: "cmd", w: 640, h: 420, x: 280, y: 130 },
  paint: { title: "untitled - Paint", icon: "paint", w: 760, h: 520, x: 190, y: 56 },
  games: { title: "Games", icon: "games", w: 680, h: 480, x: 210, y: 82 },
  note: { title: "README - Notepad", icon: "note", w: 620, h: 500, x: 300, y: 70 },
  control: { title: "Control Panel", icon: "ctrl", w: 620, h: 420, x: 330, y: 95 },
  bin: { title: "Recycle Bin", icon: "bin", w: 530, h: 340, x: 344, y: 142 },
};

function XPDesktop({ goGate, openFormal }) {
  const [open, setOpen] = useState([{ id:"guide", z:10, min:false, max:false }]);
  const [start, setStart] = useState(false);
  const [clock, setClock] = useState("--:--");
  const [selectedIcon, setSelectedIcon] = useState("about");
  const [activeCase, setActiveCase] = useState(0);
  const [termLines, setTermLines] = useState(["Microsoft Windows XP [Version Pushkar.1]", "Type: help · hire · contact · proof · reels · joke · formal · clear"]);
  const [term, setTerm] = useState("");
  const [dialog, setDialog] = useState(null);
  const [sparks, setSparks] = useState([]);
  const [screensaver, setScreensaver] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [muted, setMuted] = useState(false);
  const [dontTouchWarnings, setDontTouchWarnings] = useState([]);
  const audioRef = useRef(null);
  useEffect(() => { const tick=()=>setClock(new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})); tick(); const i=setInterval(tick,1000); return()=>clearInterval(i); }, []);
  useEffect(() => {
    let timer;
    const reset = () => { setScreensaver(false); clearTimeout(timer); timer = setTimeout(() => setScreensaver(true), 30000); };
    ["mousemove", "keydown"].forEach(ev => window.addEventListener(ev, reset));
    reset();
    return () => { clearTimeout(timer); ["mousemove", "keydown"].forEach(ev => window.removeEventListener(ev, reset)); };
  }, []);
  const focus = (id) => { setSelectedIcon(id); setOpen(ws => ws.map(w => w.id===id ? {...w, z: Math.max(...ws.map(x=>x.z),10)+1, min:false} : w)); };
  const playSound = (type="click") => { if(muted) return; try { const Ctx = window.AudioContext || window.webkitAudioContext; if(!Ctx) return; const ctx = audioRef.current || new Ctx(); audioRef.current = ctx; const osc = ctx.createOscillator(); const gain = ctx.createGain(); const tones = { click: 520, open: 660, close: 240, dialog: 420, wow: 880 }; osc.frequency.value = tones[type] || 520; osc.type = type==="wow" ? "triangle" : "square"; gain.gain.setValueAtTime(.035, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .09); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .1); } catch {} };
  const openApp = (id) => { playSound("open"); setOpen(ws => ws.some(w=>w.id===id) ? ws.map(w=>w.id===id?{...w,min:false,z:Math.max(...ws.map(x=>x.z),10)+1}:w) : [...ws,{id,z:Math.max(...ws.map(x=>x.z),10)+1,min:false,max:false}]); };
  const closeApp = (id) => { playSound("close"); setOpen(ws => ws.filter(w=>w.id!==id)); };
  const minApp = (id) => { playSound("click"); setOpen(ws => ws.map(w => w.id===id ? {...w,min:true} : w)); };
  const maxApp = (id) => { playSound("click"); setOpen(ws => ws.map(w => w.id===id ? {...w,max:!w.max,min:false,z:99} : w)); };
  const openReel = (r) => { playSound("open"); const id = `reel-${r.id}`; setOpen(ws => { const z = Math.max(...ws.map(x=>x.z),10)+1; if(ws.some(w=>w.id===id)) return ws.map(w=>w.id===id?{...w,min:false,z}:w); const reelCount = ws.filter(w=>w.reel).length; const isMobile = typeof window !== "undefined" && window.innerWidth < 640; const maxH = window.innerHeight - 54; const ww = isMobile ? Math.min(window.innerWidth - 12, Math.floor((maxH - 42) * 9 / 16)) : Math.min(432, window.innerWidth - 40, Math.floor((maxH - 42) * 9 / 16)); const wh = Math.min(maxH, Math.round(ww * 16 / 9) + 42); const off = (reelCount % 5) * 22; const x = isMobile ? 6 : Math.max(20, Math.floor((window.innerWidth - ww) / 2) + off - 44); const y = isMobile ? 6 : Math.max(12, Math.floor((window.innerHeight - wh - 40) / 2) + off - 14); return [...ws,{id,z,min:false,max:false,reel:r,x,y,w:ww,h:wh}]; }); };
  const showDialog = (title, message) => { playSound("dialog"); setDialog({ title, message }); };
  const celebrate = () => { playSound("wow"); setSparks(Array.from({ length: 42 }, (_, i) => ({ id: `${Date.now()}-${i}`, left: 5 + Math.random() * 90, top: 8 + Math.random() * 72, text: ["WOW","XP","HIRE","PROOF","OK"][i % 5] }))); };
  const dontTouch = () => { playSound("wow"); setDontTouchWarnings(w => w.length ? [] : Array.from({ length: 96 }, (_, i) => ({ id: `${Date.now()}-${i}`, left: Math.random() * 72, top: 5 + Math.random() * 72, z: 320 + i, title: ["Warning", "System Alert", "Told You", "Pushkar XP"][i % 4], msg: ["You touched it.", "This button had one job.", "Recruiter boredom multiplying.", "Click the button again to reset."][i % 4] }))); };
  const copyAndTell = async (text, label) => showDialog("Copied", await copyText(text) ? `${label} copied to clipboard.` : "Copy was blocked by the browser.");
  function runTerm(e, forced){ e?.preventDefault?.(); const raw = forced || term; const c=raw.trim().toLowerCase(); if(!c) return; const out=[`C:\\>${raw}`]; if(c==="help") out.push("Commands: help · hire · contact · proof · reels · joke · formal · clear"); else if(c==="hire"||c==="contact"){openApp("hire"); out.push("Opening Hire Me...");} else if(c==="proof"){openApp("work"); out.push("100+ creators · 500+ activations · 40+ startups · 20CR+ capital rooms");} else if(c==="reels"){openApp("reels"); out.push("Opening Reel Library...");} else if(c==="joke") out.push("A recruiter, a PDF, and this XP desktop walk into a bar. Only the desktop gets a callback."); else if(c==="formal"){openFormal(); return;} else if(c==="clear"){setTermLines([]); setTerm(""); return;} else out.push("Bad command or file name. Type help to see available commands."); setTermLines(l=>[...l,...out]); setTerm(""); }
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openApp("cmd"); setStart(false); }
      if (e.key === "Escape") { setStart(false); setDialog(null); setContextMenu(null); setScreensaver(false); }
      if (open.some(w => w.id === "work" && !w.min) && e.key === "ArrowRight") setActiveCase(i => (i + 1) % CASES.length);
      if (open.some(w => w.id === "work" && !w.min) && e.key === "ArrowLeft") setActiveCase(i => (i - 1 + CASES.length) % CASES.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const actions = { showDialog, celebrate, setScreensaver, copyAndTell, runTerm, playSound };
  const visible = open.filter(w=>!w.min);
  return <div className="relative h-screen overflow-hidden bg-[#74b856] text-[#111]" style={{fontFamily:"Tahoma, Arial, sans-serif"}} onClick={()=>setContextMenu(null)} onContextMenu={(e)=>{e.preventDefault(); setContextMenu({ x: Math.min(e.clientX, window.innerWidth - 210), y: Math.min(e.clientY, window.innerHeight - 270) });}}>
    <style>{xpCss}</style>
    <div className="xp-wall" />
    <div className="absolute left-4 top-4 z-10 flex w-[108px] flex-col gap-2">
      {DESKTOP_ICONS.slice(0,6).map(([id,label,ico]) => <button key={id} onClick={()=>{focus(id); openApp(id);}} className={cx("xp-desktop-icon", selectedIcon===id && "selected")} aria-label={`${label}: open`} title="Single-click opens"><XPIconGlyph type={ico}/><span>{label}</span></button>)}
    </div>
    <div className="absolute right-4 top-4 z-10 flex w-[108px] flex-col gap-2">
      {DESKTOP_ICONS.slice(6).map(([id,label,ico]) => <button key={id} onClick={()=>{focus(id); openApp(id);}} className={cx("xp-desktop-icon", selectedIcon===id && "selected")} aria-label={`${label}: open`} title="Single-click opens"><XPIconGlyph type={ico}/><span>{label}</span></button>)}
      <button onClick={()=>{setSelectedIcon("dont-touch"); dontTouch();}} className={cx("xp-desktop-icon danger-icon", selectedIcon==="dont-touch" && "selected")} aria-label={dontTouchWarnings.length ? "Told you: click again to reset" : "Do not touch"} title="Single-click opens regret"><XPIconGlyph type="danger"/><span>{dontTouchWarnings.length ? "Told You" : "Do Not Touch"}</span></button>
    </div>
    {visible.map(w => <XPWindow key={w.id} win={w} app={apps[w.id] || { title:`${w.reel?.emoji || "▶"} ${w.reel?.title || "Reel Window"}`, icon:"play", w:w.w || 330, h:w.h || 560, x:w.x || 340, y:w.y || 35 }} focus={focus} close={closeApp} min={minApp} max={maxApp} actions={actions}>{w.reel ? <ReelWindow reel={w.reel}/> : <AppContent id={w.id} openApp={openApp} openReel={openReel} activeCase={activeCase} setActiveCase={setActiveCase} termLines={termLines} term={term} setTerm={setTerm} runTerm={runTerm} goGate={goGate} actions={actions}/>}</XPWindow>)}
    <AnimatePresence>{start && <motion.div initial={{y:10,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}} className="xp-start" onClick={(e)=>e.stopPropagation()}><div className="xp-start-head"><ProfilePhoto small stamp/><b>Pushkar Vashisht</b></div><div className="grid grid-cols-2"><div className="p-2">{[["guide","Start Here","note"],["work","Case Studies","folder"],["reels","Reel Player","play"],["hire","Hire Me","hire"],["about","My Computer","computer"],["internet","Internet","globe"],["cmd","Command","cmd"]].map(([id,l,ico])=><button key={id} className="xp-start-item" onClick={()=>{openApp(id);setStart(false)}}><XPIconGlyph type={ico}/>{l}</button>)}</div><div className="border-l border-blue-200 bg-[#dcedff] p-2">{[["games","Games","games"],["note","README","note"],["paint","Paint","paint"],["control","Control Panel","ctrl"],["bin","Recycle Bin","bin"]].map(([id,l,ico])=><button key={id} className="xp-start-item" onClick={()=>{openApp(id);setStart(false)}}><XPIconGlyph type={ico}/>{l}</button>)}<button className="xp-start-item" onClick={goGate}><XPIconGlyph type="bin"/>Switch Mode</button></div></div><div className="h-9 bg-[#0b4fc1] p-1 text-right"><XPButton onClick={celebrate}>Tour</XPButton><XPButton onClick={()=>showDialog("Turn Off Computer","Nice try. Recruiters must see the proof first.")}>Turn Off</XPButton></div></motion.div>}</AnimatePresence>
    {contextMenu && <div className="xp-context" style={{left:contextMenu.x, top:contextMenu.y}} onClick={(e)=>e.stopPropagation()}><span>Desktop</span>{[["about","My Computer"],["work","Case Studies"],["reels","Reel Player"]].map(([id,l])=><button key={id} onClick={()=>{openApp(id);setContextMenu(null)}}>{l}</button>)}<hr/><button onClick={()=>{celebrate();setContextMenu(null)}}>Sparkle</button><button onClick={()=>{setScreensaver(true);setContextMenu(null)}}>Screensaver</button><a href={CV_URL} download="Pushkar_Vashisht_CV.html">Download CV</a><hr/><button onClick={()=>{showDialog("System message","Your generic portfolio has stopped responding. Send a creative operator instead?");setContextMenu(null)}}>Warning</button><button onClick={()=>{showDialog("Turn Off Computer","Nice try. Recruiters must see the proof first.");setContextMenu(null)}}>Turn off</button></div>}
    <AnimatePresence>{dialog && <motion.div className="xp-dialog" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.96}}><div className="xp-titlebar"><AlertTriangle size={14}/><b>{dialog.title}</b><span className="flex-1"/><button className="close" onClick={()=>setDialog(null)} aria-label="Close dialog"><X size={13}/></button></div><div className="flex gap-3 p-4 text-sm"><AlertTriangle className="shrink-0 text-yellow-500"/><p className="whitespace-pre-line">{dialog.message}</p></div><div className="bg-[#ece9d8] p-2 text-right"><XPButton primary onClick={()=>setDialog(null)}>OK</XPButton><XPButton onClick={()=>setDialog(null)}>Cancel</XPButton></div></motion.div>}</AnimatePresence>
    {sparks.map(s=><span key={s.id} className="spark" style={{left:`${s.left}%`, top:`${s.top}%`}}>{s.text}</span>)}
    {dontTouchWarnings.map(w=><div key={w.id} className="chaos-warning" style={{left:`${w.left}%`, top:`${w.top}%`, zIndex:w.z}}><div>{w.title}<button onClick={()=>setDontTouchWarnings([])}>×</button></div><p>{w.msg}</p><XPButton onClick={()=>setDontTouchWarnings([])}>OK</XPButton></div>)}
    {screensaver && <div className="screensaver" onClick={()=>setScreensaver(false)}><div className="ss-badge">Pushkar XP<br/><span>{clock}</span></div></div>}
    <div className="xp-taskbar"><button className="xp-start-btn" onClick={(e)=>{e.stopPropagation();playSound("click");setStart(s=>!s)}} aria-expanded={start}>start</button><div className="flex min-w-0 flex-1 gap-1 overflow-hidden">{open.map(w=><button key={w.id} onClick={()=>focus(w.id)} className={cx("xp-task", !w.min && "active")} title={w.min ? "Restore window" : "Focus window"}>{apps[w.id]?.title || w.reel?.title}</button>)}</div><div className="xp-tray"><button onClick={()=>{setMuted(m=>!m); if(muted) setTimeout(()=>playSound("open"),20);}} title="Toggle sound state" aria-label="Toggle sound">{muted ? "🔇" : "🔊"}</button><span aria-hidden="true">📶</span><span>{clock}</span></div></div>
  </div>;
}

function XPWindow({ win, app, children, focus, close, min, max, actions }) {
  const style = win.max ? { left:0, top:0, width:"100vw", height:"calc(100vh - 40px)", zIndex:win.z } : { left:app.x, top:app.y, width:app.w, height:app.h, zIndex:win.z };
  const menuJokes = { File:"File menu opened. File not found. Confidence intact.", Edit:"Edit what? The personality? HR already tried.", View:"View: proof first, jokes second, panic never.", Favorites:"Added to Favorites. Bold. Correct.", Tools:"taste yes  speed yes  chaos control yes  IE not included.", Help:"Help = Hire Me window." };
  const menu = ["File","Edit","View","Favorites","Tools","Help"].map(label => [label, () => actions.showDialog(`${label} menu`, menuJokes[label]), `${label} menu joke`]);
  return <motion.div drag={!win.max} dragMomentum={false} onMouseDown={()=>focus(win.id)} className="xp-window" style={style} initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.96}}>
    <div className="xp-titlebar"><XPIconGlyph type={app.icon}/><b>{app.title}</b><span className="flex-1"/><button onClick={()=>min(win.id)} aria-label={`Minimize ${app.title}`} title="Minimize"><Minimize2 size={12}/></button><button onClick={()=>max(win.id)} aria-label={`${win.max ? "Restore" : "Maximize"} ${app.title}`} title={win.max ? "Restore" : "Maximize"}><Maximize2 size={12}/></button><button className="close" onClick={()=>close(win.id)} aria-label={`Close ${app.title}`} title="Close"><X size={13}/></button></div>
    <div className="xp-menubar">{menu.map(([label, action, title]) => <button key={label} type="button" onClick={action} title={title}>{label}</button>)}</div>
    <div className="xp-body">{children}</div><div className="xp-status">Ready · Pushkar XP Portfolio Edition</div>
  </motion.div>;
}

function AppContent({ id, ...p }) {
  if(id==="guide") return <GuideApp openApp={p.openApp} goGate={p.goGate} actions={p.actions}/>;
  if(id==="about") return <AboutApp openApp={p.openApp}/>;
  if(id==="work") return <WorkApp activeCase={p.activeCase} setActiveCase={p.setActiveCase} openApp={p.openApp} actions={p.actions}/>;
  if(id==="reels") return <ReelsApp openReel={p.openReel}/>;
  if(id==="internet") return <InternetApp openApp={p.openApp}/>;
  if(id==="hire") return <HireApp goGate={p.goGate} actions={p.actions}/>;
  if(id==="paint") return <PaintApp actions={p.actions}/>;
  if(id==="games") return <GamesApp actions={p.actions}/>;
  if(id==="cmd") return <CmdApp termLines={p.termLines} term={p.term} setTerm={p.setTerm} runTerm={p.runTerm} actions={p.actions}/>;
  if(id==="note") return <NotepadApp actions={p.actions}/>;
  if(id==="control") return <ControlApp openApp={p.openApp} actions={p.actions}/>;
  if(id==="bin") return <RecycleBinApp openApp={p.openApp}/>;
  return null;
}

function GuideApp({ openApp, goGate, actions }) { return <div className="guide-app"><div className="guide-head"><ProfilePhoto stamp/><div><h1>Start here</h1><p>This is the playful version. Open folders like a desktop, but every icon should lead somewhere useful.</p></div></div><div className="guide-actions"><XPButton primary onClick={()=>openApp("about")}>My Computer</XPButton><XPButton onClick={()=>openApp("work")}>Case Studies</XPButton><XPButton onClick={()=>openApp("reels")}>Reel Player</XPButton><XPButton onClick={()=>openApp("hire")}>Hire Me</XPButton><XPButton onClick={()=>actions.showDialog("Guide","Try File, Edit, View, Favorites, Tools and Help. They are jokes, not dead buttons.")}>Menu Jokes</XPButton><XPButton onClick={goGate}>Switch Mode</XPButton></div><ul><li>Single-click desktop icons. No double-click tax.</li><li>Use My Computer when you want the proof map.</li><li>Use Reel Player when you want embedded work, not screenshot bait.</li><li>The red button on the desktop has been clearly labelled for legal reasons.</li></ul></div>; }
function AboutApp({ openApp }) { return <div className="about-outer authentic"><div className="xp-explorer-layout"><aside className="xp-task-pane"><h3>System Tasks</h3><button onClick={()=>openApp("work")}>View portfolio proof</button><button onClick={()=>openApp("reels")}>Play reel evidence</button><button onClick={()=>openApp("hire")}>Contact this computer</button><h3>Other Places</h3><button onClick={()=>openApp("control")}>Control Panel</button><button onClick={()=>openApp("games")}>Games</button></aside><main className="xp-system-main"><div className="xp-system-head"><ProfilePhoto stamp/><div><h1>Pushkar Vashisht</h1><p>Creative Operator · Brand Systems · Creator Growth</p></div></div><div className="xp-section-title">Files Stored On This Computer</div><div className="xp-file-grid">{[["Case Studies","7 folders of proof","folder","work"],["Reel Player","vertical proof library","play","reels"],["Hire Me","contact + CV + vCard","hire","hire"],["Command Prompt","hidden shortcuts","cmd","cmd"]].map(([name,meta,ico,id])=><button key={name} className="xp-file-tile" onClick={()=>openApp(id)}><XPIconGlyph type={ico}/><span><b>{name}</b><small>{meta}</small></span></button>)}</div><div className="xp-section-title">Details</div><div className="xp-details-grid">{[["100+","Creators onboarded"],["500+","Paid activations"],["40+","Startups supported"],["20CR+","Capital rooms"],["3","Beauty brands operated"],["0→1","Media vertical built"]].map(([n,l])=><div key={l}><b>{n}</b><span>{l}</span></div>)}</div><div className="xp-note">This window should feel like My Computer: practical first, playful second. Every folder opens into proof instead of dumping a PDF.</div></main></div></div>; }
function WorkApp({ activeCase, setActiveCase, openApp, actions }) { const c=CASES[activeCase]; const move=(d)=>setActiveCase((activeCase+d+CASES.length)%CASES.length); return <div className="grid gap-3 md:grid-cols-[220px_1fr]"><aside className="rounded border border-[#91a7d0] bg-gradient-to-b from-[#d9e9ff] to-white p-3"><h3 className="mb-2 font-bold text-[#1646a0]">Case folders</h3><p className="mb-2 text-[11px] text-stone-500">Pick a project. Arrow keys navigate when this window is open.</p><div className="mb-2 flex flex-wrap gap-1"><XPButton onClick={()=>openApp("reels")}>Reel Player</XPButton><XPButton onClick={()=>openApp("hire")}>Hire Me</XPButton></div><div className="grid grid-cols-2 gap-1"><XPButton onClick={()=>move(-1)}>Back</XPButton><XPButton onClick={()=>move(1)}>Forward</XPButton></div><div className="mt-3 grid gap-1">{CASES.map((x,i)=><button key={x.id} onClick={()=>setActiveCase(i)} className={cx("rounded border px-2 py-2 text-left text-xs", i===activeCase?"border-[#316ac5] bg-[#316ac5] text-white":"border-blue-200 bg-white hover:bg-blue-50")}><b>{x.title}</b><br/><span className="opacity-70">{x.year}</span></button>)}</div></aside><main><div className="mb-2 flex flex-wrap gap-1">{c.tags.map(t=><span key={t} className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] text-[#1746b8]">{t}</span>)}</div><h1 className="text-4xl font-black leading-none text-[#1746b8]">{c.title}</h1><p className="mt-1 font-bold text-stone-700">{c.role} · {c.metric}</p><p className="mt-3 leading-6 text-stone-700">{c.short}</p><ul className="mt-4 list-disc pl-5 text-sm leading-7">{c.impact.map(x=><li key={x}>{x}</li>)}</ul><div className="mt-4 border-l-4 border-yellow-400 bg-yellow-50 p-3 text-xs italic text-stone-600">{c.weird}</div><div className="mt-4 flex flex-wrap gap-2"><XPButton primary onClick={()=>actions.copyAndTell(`${c.title} - ${c.impact.join(" / ")}`, "Case proof")}>Copy Case</XPButton><XPButton href={CV_URL} download="Pushkar_Vashisht_CV.html">Download CV</XPButton></div></main></div>; }
function ReelsApp({ openReel }) { return <div><div className="-m-3 mb-3 bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1e] p-3 text-xs text-stone-300"><b className="text-blue-300">Reel Library</b> — 1080x1920-first cards. One click opens the embedded vertical player; original link stays available.</div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{REELS.map(r=><button key={r.id} onClick={()=>openReel(r)} className="reel-card"><span className="reel-thumb"><span className="reel-thumb-design"><b>{r.emoji}</b><small>{r.brand}</small></span></span><span className="block p-2 text-left"><b className="block">{r.title}</b><span className="block text-[11px] font-bold text-[#1746b8]">{r.brand} · {r.type}</span><span className="block text-[11px] text-stone-500">{r.proof}</span></span></button>)}</div></div>; }
function ReelWindow({ reel }) { return <div className="flex h-full flex-col bg-[#111]"><div className="reel-player-frame"><iframe src={reel.embedUrl} title={reel.title} loading="eager" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen/></div><div className="flex items-center justify-between gap-3 bg-[#1a1a2e] px-3 py-2 text-[11px] text-stone-300"><span className="truncate">{reel.emoji || "▶"} {reel.brand}</span><a href={reel.openUrl} target="_blank" rel="noreferrer" className="shrink-0 text-blue-300">open original</a></div></div>; }
function InternetApp({ openApp }) { return <div className="grid gap-4 md:grid-cols-[1fr_230px]"><div><h1 className="text-4xl font-black text-[#1746b8]">Internet Explorer</h1><p className="my-3 text-sm">This fake browser exists because every XP desktop needs one. Links are real; the vibe is nostalgic; the proof remains serious.</p>{[["Instagram",CONTACT.instagram,"@ifeelperi"],["LinkedIn",CONTACT.linkedin,"Pushkar Vashisht"]].map(([l,u,t])=><div key={l} className="mb-2 border bg-white p-3 text-sm"><b className="text-[#1746b8]">{l}:</b> <a href={u} target="_blank" rel="noreferrer">{t}</a></div>)}<XPButton onClick={()=>openApp("hire")} primary>Open Hire Me</XPButton></div><div className="ie-design-panel"><ProfilePhoto stamp/><p>Profile loaded from the CV asset pack.</p></div></div>; }
function HireApp({ goGate, actions }) { const [status, setStatus] = useState(""); const copyEmail = async () => { const ok = await copyText(CONTACT.email); setStatus(ok ? "Email copied to clipboard." : "Copy blocked. Use the email link above."); }; return <div className="grid gap-4 md:grid-cols-2"><div><h1 className="text-4xl font-black text-[#1746b8]">Hire Me</h1><p className="my-3 text-sm leading-6">Brand worlds, creator distribution, content systems, campaigns, tasteful internet chaos.</p>{[["Email",CONTACT.email,`mailto:${CONTACT.email}`],["Phone",CONTACT.phone,`tel:${CONTACT.phone}`],["Instagram","@ifeelperi",CONTACT.instagram],["LinkedIn","Pushkar Vashisht",CONTACT.linkedin]].map(([l,t,u])=><div key={l} className="mb-2 border bg-white p-3 text-sm"><b className="text-[#1746b8]">{l}:</b> <a href={u} target={u.startsWith("http") ? "_blank" : undefined} rel={u.startsWith("http") ? "noreferrer" : undefined}>{t}</a></div>)}<div className="mt-3 flex flex-wrap gap-2"><XPButton onClick={copyEmail} primary>Copy Email</XPButton><XPButton onClick={()=>{downloadVCard();setStatus("vCard download started.");}}>vCard</XPButton><XPButton href={CV_URL} download="Pushkar_Vashisht_CV.html" onClick={()=>setStatus("CV download started.")}>Download CV</XPButton><XPButton onClick={goGate}>Switch Mode</XPButton></div>{status && <p className="mt-2 text-xs font-bold text-[#1746b8]" role="status">{status}</p>}</div><div><ProfilePhoto stamp/><h2 className="mb-2 mt-3 font-bold">Why this should work</h2><p className="text-sm leading-6">The desktop gets curiosity. The apps make the proof browsable. The jokes make him memorable. The case studies make it hireable.</p><div className="mt-4 rounded border border-[#0a246a] bg-[#ece9d8] shadow"><div className="bg-gradient-to-b from-[#2d8cff] to-[#0b3da4] px-2 py-1 text-xs font-bold text-white">System Warning</div><div className="flex gap-3 p-4 text-sm"><span className="text-3xl" aria-hidden="true">⚠️</span><span>Recruiter boredom has been detected. Open formal dossier or continue XP inspection.</span></div></div><div className="mt-3 flex flex-wrap gap-2"><XPButton onClick={()=>actions.showDialog("System message","Your generic portfolio has stopped responding.\n\nWould you like to send a creative operator instead?")}>System Warning</XPButton><XPButton onClick={actions.celebrate}>Celebrate</XPButton></div></div></div>; }
function CmdApp({ termLines, term, setTerm, runTerm, actions }) { return <><div className="h-[300px] overflow-auto bg-black p-3 font-mono text-xs leading-6 text-green-400">{termLines.map((l,i)=><div key={i}>{l}</div>)}</div><form onSubmit={runTerm} className="mt-2 flex bg-black font-mono text-green-400"><span className="border border-green-700 border-r-0 px-2 py-2">C:\&gt;</span><input value={term} onChange={e=>setTerm(e.target.value)} className="min-w-0 flex-1 border border-green-700 bg-black px-2 outline-none" autoFocus/><button className="bg-green-700 px-4 font-bold text-white">Run</button></form><div className="mt-2 flex flex-wrap gap-2"><XPButton onClick={(e)=>actions.runTerm(e,"help")}>Help</XPButton><XPButton onClick={(e)=>actions.runTerm(e,"clear")}>Clear</XPButton></div></>; }
function NotepadApp({ actions }){return <div className="grid h-full gap-2"><div className="flex justify-end"><XPButton onClick={()=>actions.copyAndTell(PITCH, "Pitch")}>Copy Pitch</XPButton></div><textarea className="h-full min-h-[340px] w-full resize-none border-0 p-2 font-mono text-sm outline-none" defaultValue={`README - Pushkar XP

1. My Computer = captcha-style about me.
2. Case Studies = 7 proof folders.
3. Reel Player = brand buttons open portrait player windows.
4. Hire Me = contact, vCard, CV download, warning, celebration.
5. Terminal commands: help, hire, contact, proof, reels, joke, formal, clear.
6. Paint = draw, erase, clear, save PNG.

Keyboard:
  Ctrl+K  = open terminal
  Left/Right = navigate cases
  Esc = close dialogs and menus

Right-click desktop = context menu.
Stay idle 30s = screensaver.

No beige portfolio detected.`}/></div>; }
function ControlApp({openApp, actions}){const shortcuts=[["work","Proof folders",Folder],["reels","Reel player",MonitorPlay],["hire","Network",Mail],["cmd","Terminal",Terminal],["note","Readme",FileText],["internet","Internet",Globe2],["paint","Paint",Monitor],["games","Games",MonitorPlay],["bin","Recycle Bin",Folder]];return <div><h1 className="text-4xl font-black text-[#1746b8]">Control Panel</h1><div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{shortcuts.map(([id,l,Icon])=><button key={id} onClick={()=>openApp(id)} className="rounded border bg-white p-4 text-center hover:bg-blue-50"><Icon className="mx-auto mb-2"/><b>{l}</b></button>)}<button onClick={actions.celebrate} className="rounded border bg-white p-4 text-center hover:bg-blue-50"><b className="text-2xl">✨</b><br/><b>Display</b><br/><small>XP sparkle</small></button><button onClick={()=>actions.showDialog("System message","Your generic portfolio has stopped responding.\n\nWould you like to send a creative operator instead?")} className="rounded border bg-white p-4 text-center hover:bg-blue-50"><b className="text-2xl">!</b><br/><b>Warnings</b><br/><small>Fake alerts</small></button><button onClick={()=>actions.showDialog("File menu","File menu opened. File not found. Confidence intact.")} className="rounded border bg-white p-4 text-center hover:bg-blue-50"><b className="text-2xl">?</b><br/><b>Menu Jokes</b><br/><small>Old HTML bits</small></button><button onClick={()=>openApp("games")} className="rounded border bg-white p-4 text-center hover:bg-blue-50"><b className="text-2xl">☺</b><br/><b>Laugh Lab</b><br/><small>tiny games</small></button><button onClick={()=>actions.setScreensaver(true)} className="rounded border bg-white p-4 text-center hover:bg-blue-50"><b className="text-2xl">&gt;_</b><br/><b>Screensaver</b><br/><small>Activate now</small></button><a href={CV_URL} download="Pushkar_Vashisht_CV.html" className="rounded border bg-white p-4 text-center hover:bg-blue-50"><FileText className="mx-auto mb-2"/><b>My CV</b><br/><small>Download</small></a></div></div>}

function PaintApp({ actions }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [size, setSize] = useState(5);
  const [color, setColor] = useState("#1746b8");
  const last = useRef(null);
  useEffect(() => { const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height); ctx.lineCap="round"; ctx.lineJoin="round"; }, []);
  const point = (e) => { const r=canvasRef.current.getBoundingClientRect(); const p=e.touches?.[0] || e; return { x:(p.clientX-r.left)*(canvasRef.current.width/r.width), y:(p.clientY-r.top)*(canvasRef.current.height/r.height) }; };
  const start = (e) => { e.preventDefault(); last.current=point(e); };
  const draw = (e) => { if(!last.current) return; e.preventDefault(); const c=canvasRef.current, ctx=c.getContext("2d"), p=point(e); ctx.lineWidth=tool==="eraser"?size*4:size; ctx.strokeStyle=tool==="eraser"?"#fff":color; ctx.beginPath(); ctx.moveTo(last.current.x,last.current.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last.current=p; };
  const clear = () => { const c=canvasRef.current, ctx=c.getContext("2d"); ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height); };
  const save = () => { const a=document.createElement("a"); a.href=canvasRef.current.toDataURL("image/png"); a.download="pushkar-paint.png"; a.click(); actions.showDialog("Paint","Saved pushkar-paint.png."); };
  return <div className="paint-wrap"><div className="paint-sidebar">{[["pencil","Pencil"],["brush","Brush"],["eraser","Eraser"]].map(([id,label])=><button key={id} className={cx("paint-tool-btn", tool===id && "active")} onClick={()=>setTool(id)} title={label}>{id==="pencil"?"P":id==="brush"?"B":"E"}</button>)}<button className="paint-tool-btn" onClick={clear} title="Clear">X</button><input type="color" value={color} onChange={e=>setColor(e.target.value)} title="Color"/></div><div className="paint-canvas-area"><div className="paint-options"><label>Size:</label><input type="range" min="1" max="32" value={size} onChange={e=>setSize(Number(e.target.value))}/><span>{size}px</span><XPButton onClick={save}>Save PNG</XPButton><XPButton onClick={clear}>Clear</XPButton></div><canvas ref={canvasRef} width="900" height="560" onMouseDown={start} onMouseMove={draw} onMouseUp={()=>last.current=null} onMouseLeave={()=>last.current=null} onTouchStart={start} onTouchMove={draw} onTouchEnd={()=>last.current=null}/></div></div>;
}

function GamesApp({ actions }) {
  const [hits, setHits] = useState(0);
  const [pos, setPos] = useState({ left: 22, top: 42 });
  const [bsod, setBsod] = useState(false);
  const dodge = () => { actions.playSound("wow"); setPos({ left: 8 + Math.random() * 68, top: 26 + Math.random() * 48 }); };
  return <div className="games-grid">
    <section><h2>Do Not Click</h2><div className="game-arena"><button style={{left:`${pos.left}%`, top:`${pos.top}%`}} onMouseEnter={dodge} onClick={()=>{setHits(h=>h+1);actions.showDialog("Impossible", "You clicked it. HR has been notified.")}}>do not click</button></div><p>Hits: {hits}. The button is dramatic.</p></section>
    <section><h2>Buzzword Whack</h2><div className="buzz-grid">{["synergy","viral","authentic","funnel","AI magic","deck"].map(word=><button key={word} onClick={()=>{actions.playSound("click"); setHits(h=>h+1);}}>{word}</button>)}</div><p>Click the corporate words until they stop sounding real.</p></section>
    <section><h2>Fake BSOD</h2><button className="bsod-btn" onClick={()=>setBsod(true)}>crash the portfolio</button><p>Completely fake. Emotionally accurate.</p></section>
    {bsod && <div className="fake-bsod" onClick={()=>setBsod(false)}><b>:(</b><p>Pushkar XP ran into recruiter boredom and recovered instantly.</p><small>Click anywhere to continue.</small></div>}
  </div>;
}

function RecycleBinApp({ openApp }) { return <div><h1 className="text-4xl font-black text-[#1746b8]">Recycle Bin</h1><p className="my-2 text-sm">Deleted files:</p><ul className="list-disc pl-5 text-sm leading-8"><li>generic_portfolio.pdf</li><li>corporate_buzzwords.doc</li><li>beige_layout_final_2.html</li><li>linkedin_spam.txt</li><li>another_boring_deck.pptx</li></ul><XPButton primary className="mt-3" onClick={()=>openApp("work")}>Restore Proof</XPButton></div>; }

function FormalDossier({ goGate }) {
  const [active, setActive] = useState(CASES[0]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const filtered = CASES.filter(c => [c.title, c.role, c.metric, c.tags.join(" "), c.short].join(" ").toLowerCase().includes(query.toLowerCase()));
  const copyEmail = async () => { setCopied(await copyText(CONTACT.email) ? "Email copied." : "Copy blocked. Email is visible above."); };
  const copyPitch = async () => { setCopied(await copyText(PITCH) ? "Pitch copied." : "Copy blocked. Pitch is visible in the intro."); };
  return <div className="min-h-screen bg-black text-white">
    <style>{xpCss}</style>
    <div className="fixed inset-0 opacity-15 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:50px_50px]" />
    <main className="relative mx-auto max-w-7xl px-5 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-5"><div className="flex items-center gap-4"><ProfilePhoto small stamp/><div><p className="text-xs uppercase tracking-[.45em] text-red-600">formal dossier</p><h1 className="text-3xl font-black tracking-[-.04em]">Pushkar Vashisht</h1><p className="mt-1 text-sm text-white/55">Creative Operator · Brand Systems · Creator Growth</p></div></div><div className="flex flex-wrap gap-2"><button onClick={goGate} className="border border-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black">change mode</button><button onClick={copyEmail} className="border border-red-700 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-700 hover:text-white">copy email</button><a href={CV_URL} download="Pushkar_Vashisht_CV.html" className="bg-red-700 px-4 py-2 text-sm font-bold">download cv</a></div></header>
      <section className="grid gap-8 py-10 lg:grid-cols-[1.05fr_.95fr]"><div><div className="mb-4 inline-flex items-center gap-2 bg-red-700 px-3 py-1 text-xs font-bold uppercase tracking-widest"><BadgeCheck size={14}/> proof-led operator</div><h2 className="max-w-4xl text-6xl font-black leading-[.86] tracking-[-.07em] sm:text-8xl">I build the messy middle between brand, creators and growth.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{PITCH} Useful in rooms where taste, execution, people and numbers all have to show up together.</p><div className="mt-6 flex flex-wrap gap-2 text-sm"><a href={`mailto:${CONTACT.email}`} className="border border-white/20 px-3 py-2 hover:bg-white hover:text-black">{CONTACT.email}</a><a href={`tel:${CONTACT.phone}`} className="border border-white/20 px-3 py-2 hover:bg-white hover:text-black">{CONTACT.phone}</a><a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="border border-white/20 px-3 py-2 hover:bg-white hover:text-black">LinkedIn</a><button onClick={copyPitch} className="border border-white/20 px-3 py-2 hover:bg-white hover:text-black">copy pitch</button></div>{copied && <p className="mt-3 text-sm font-bold text-red-500" role="status">{copied}</p>}</div><div className="formal-photo-card"><ProfilePhoto/><div><p className="text-xs uppercase tracking-[.35em] text-red-600">current signal</p><h3>Brand worlds, creator rooms, content machines.</h3><p>CV data says: 100+ creators, 500+ activations, 40+ startups, 20CR+ capital rooms. The work is not one neat lane. That is the point.</p></div></div></section>
      <section className="grid gap-3 md:grid-cols-4">{[["100+","creators onboarded"],["500+","paid activations"],["40+","startups supported"],["20CR+","capital ecosystem rooms"]].map(([n,l])=><div key={l} className="border border-white/20 p-5"><b className="text-4xl font-black text-red-600">{n}</b><p className="mt-1 text-sm text-white/55">{l}</p></div>)}</section>
      <section className="mt-10 grid gap-4 lg:grid-cols-3">{[["What I Do","Build brand systems, shoots, creator partnerships, launches and content surfaces that can actually move."],["Best Fit","Internet-native brands, creator economy teams, founder-led marketing, beauty/fashion/media experiments."],["Why It Pulls","The proof has numbers, but the page still has a pulse. Useful work should not read like a beige PDF."]].map(([h,p])=><div key={h} className="border border-white/20 bg-white p-5 text-black"><h3 className="text-2xl font-black text-red-700">{h}</h3><p className="mt-3 text-sm leading-6 text-black/70">{p}</p></div>)}</section>
      <section className="mt-10 grid gap-5 lg:grid-cols-[340px_1fr]"><aside className="border border-white/20 p-4"><div className="mb-4 flex items-center gap-2 border border-white/20 px-3 py-2"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="filter cases, roles, proof" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"/></div><p className="mb-4 text-xs uppercase tracking-[.35em] text-red-600">case dossiers</p>{filtered.map(c=><button key={c.id} onClick={()=>setActive(c)} className={cx("mb-2 w-full border p-3 text-left transition", active.id===c.id?"border-red-700 bg-red-700 text-white":"border-white/20 hover:bg-white hover:text-black")}><b>{c.title}</b><br/><span className="text-xs opacity-65">{c.metric} · {c.year}</span></button>)}</aside><article className="border border-white/20 bg-white p-6 text-black"><p className="text-xs font-black uppercase tracking-[.35em] text-red-700">{active.year}</p><h3 className="mt-3 text-6xl font-black leading-[.9] tracking-[-.06em]">{active.title}</h3><p className="mt-3 font-bold text-red-700">{active.role}</p><p className="mt-5 max-w-3xl text-lg leading-8 text-black/70">{active.short}</p><div className="mt-4 flex flex-wrap gap-2">{active.tags.map(t=><span key={t} className="border border-black/15 px-2 py-1 text-xs font-bold">{t}</span>)}</div><div className="mt-6 grid gap-3">{active.impact.map(x=><div key={x} className="border-l-4 border-red-700 bg-black p-3 text-sm text-white">{x}</div>)}</div><p className="mt-5 border-l-4 border-yellow-500 bg-yellow-50 p-3 text-sm italic text-black/70">{active.weird}</p></article></section>
      <section className="mt-10 border border-white/20 p-5"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.35em] text-red-600">screenings</p><h3 className="text-4xl font-black tracking-[-.05em]">Embedded work. No fake play layer.</h3></div><Search className="text-red-600"/></div><div className="grid gap-4 lg:grid-cols-3">{REELS.map(r=><div key={r.id} className="border border-white/20 bg-white/5"><div className="aspect-[9/16] bg-black"><iframe src={r.embedUrl} title={r.title} loading="lazy" className="h-full w-full border-0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen/></div><div className="p-3"><b>{r.title}</b><p className="mt-1 text-sm text-white/60">{r.proof}</p><a href={r.openUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-red-500">open original <ExternalLink size={14}/></a></div></div>)}</div></section>
    </main>
  </div>;
}

const xpCss = `
.xp-wall{position:absolute;inset:0;background:linear-gradient(#6bb8ff 0 50%,#55a53f 50% 100%)}.xp-wall:before{content:"";position:absolute;left:-8%;right:-5%;bottom:14%;height:43%;background:radial-gradient(ellipse at 28% 95%,#216718 0 28%,transparent 29%),radial-gradient(ellipse at 68% 90%,#7bc65a 0 36%,transparent 37%),linear-gradient(9deg,#247b1f,#93d060 54%,#2f841c 55%);clip-path:polygon(0 48%,15% 36%,31% 48%,45% 30%,63% 43%,78% 24%,100% 39%,100% 100%,0 100%)}.cloud{position:absolute;background:#fff;border-radius:999px;opacity:.92}.cloud:before,.cloud:after{content:"";position:absolute;background:#fff;border-radius:999px}.c1{width:150px;height:38px;left:12%;top:12%}.c1:before{width:60px;height:60px;left:22px;top:-26px}.c1:after{width:82px;height:70px;right:20px;top:-34px}.c2{width:210px;height:44px;right:15%;top:19%;opacity:.82}.c2:before{width:84px;height:74px;left:34px;top:-34px}.c2:after{width:94px;height:84px;right:34px;top:-42px}.xp-desktop-icon{width:90px;min-height:70px;color:#fff;text-shadow:1px 1px 2px #000;background:transparent;border:1px solid transparent;text-align:center;padding:6px 4px;border-radius:3px}.xp-desktop-icon:hover,.xp-desktop-icon.selected{background:rgba(49,106,197,.45);border-color:rgba(255,255,255,.6)}.xp-desktop-icon span{display:block;font-size:11px;line-height:1.3;margin-top:3px}.xp-ico{width:40px;height:38px;margin:0 auto;border-radius:5px;position:relative;display:inline-flex;align-items:center;justify-content:center;box-shadow:inset -3px -3px 0 rgba(0,0,0,.18),2px 2px 4px rgba(0,0,0,.28);overflow:visible;flex-shrink:0}.xp-start-item .xp-ico,.xp-titlebar .xp-ico{width:20px;height:19px;margin:0;border-radius:3px}.i-computer{background:linear-gradient(160deg,#c8dff8,#7ab2e8,#3a7fd4)}.i-computer:before{content:"";position:absolute;inset:4px 5px 7px 5px;background:#0a2a6e;border:1.5px solid #6e96cc}.i-folder{background:linear-gradient(155deg,#ffe87a,#f0b830,#c8820a);border-radius:0 5px 5px 5px!important}.i-folder:before{content:"";position:absolute;top:-7px;left:3px;width:16px;height:8px;background:#ffe87a;border-radius:4px 4px 0 0;border:1.5px solid #c8820a;border-bottom:none}.i-play{background:linear-gradient(135deg,#88ee66,#33aa11)}.i-play:after{content:"▶";font-size:14px;color:#fff}.i-globe{background:linear-gradient(135deg,#55aaff,#1155cc);border-radius:50%!important}.i-globe:after{content:"e";font-size:18px;font-weight:900;font-style:italic;font-family:Times New Roman;color:#fff}.i-hire{background:linear-gradient(135deg,#66dd44,#1a8811)}.i-hire:after{content:"@";font-size:18px;font-weight:700;color:#fff}.i-cmd{background:linear-gradient(135deg,#111,#333)}.i-cmd:after{content:">_";font-family:monospace;font-size:11px;color:#00ff44}.i-note{background:linear-gradient(135deg,#f8f8ee,#ddddbc);border:1px solid #aaa!important}.i-note:after{content:"≡";font-size:16px;color:#666;font-weight:900}.i-ctrl{background:linear-gradient(135deg,#ccc,#999)}.i-ctrl:after{content:"⚙";font-size:16px;color:#444}.i-bin{background:linear-gradient(135deg,#b8d8ff,#4488cc)}.i-bin:after{content:"♻";font-size:14px;color:#fff}.xp-window{position:absolute;display:flex;flex-direction:column;min-width:290px;min-height:200px;background:#ece9d8;border:1px solid #0a246a;border-radius:7px 7px 0 0;box-shadow:4px 8px 22px rgba(0,0,0,.38);overflow:hidden}.xp-titlebar{height:30px;background:linear-gradient(#2d8cff 0,#1f60d4 16%,#1852c1 70%,#0b3da4 100%);color:#fff;display:flex;align-items:center;gap:6px;padding:0 7px;font-size:12px;font-weight:700;text-shadow:1px 1px #14316f;cursor:move}.xp-titlebar button{width:22px;height:22px;border:1px solid rgba(255,255,255,.7);border-radius:3px;background:linear-gradient(#83b6ff,#2d65d8);display:grid;place-items:center;color:#fff}.xp-titlebar button.close{background:linear-gradient(#ff9d8d,#d84023)}.xp-menubar{height:26px;background:#ece9d8;display:flex;align-items:center;gap:5px;padding:0 7px;border-bottom:1px solid #c8c0a8;font-size:12px}.xp-menubar button{border:0;background:transparent;padding:2px 5px;text-align:left}.xp-menubar button:hover{background:#316ac5;color:white}.xp-body{flex:1;overflow:auto;background:#fff;padding:12px}.xp-status{height:24px;background:#ece9d8;border-top:1px solid #c8c0a8;padding:4px 9px;color:#555;font-size:11px}.xp-taskbar{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#2c8bff,#095bd8 12%,#0646b1);z-index:100;display:flex;align-items:center}.xp-start-btn{height:34px;min-width:98px;margin-right:6px;border:0;border-radius:0 12px 12px 0;background:linear-gradient(#7be067,#2a9f20 45%,#0d7716);color:#fff;font-size:16px;font-style:italic;font-weight:800;text-shadow:1px 1px #064d0d;box-shadow:inset 0 1px 1px rgba(255,255,255,.8),2px 0 4px rgba(0,0,0,.35);padding:0 12px}.xp-task{height:30px;max-width:160px;min-width:90px;border:1px solid #8db8ff;border-radius:3px;background:linear-gradient(#5aa3ff,#1d5fd4);color:#fff;text-align:left;padding:0 8px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}.xp-task.active{background:linear-gradient(#fff,#d8e7ff);color:#113f9e}.xp-tray{height:100%;display:flex;align-items:center;gap:6px;background:linear-gradient(#18a9ef,#0a79cc);border-left:1px solid #6bc7ff;color:#fff;padding:0 10px;font-weight:700}.xp-start{position:absolute;left:0;bottom:40px;width:390px;background:#fff;border:1px solid #0a3ca2;border-radius:7px 7px 0 0;box-shadow:6px 0 24px rgba(0,0,0,.45);z-index:150;overflow:hidden}.xp-start-head{height:70px;background:linear-gradient(#4b9cff,#0b4fc1);color:#fff;display:flex;align-items:center;gap:12px;padding:9px 14px;font-size:18px;font-weight:700}.xp-start-head img{width:50px;height:50px;border:2px solid #fff;border-radius:5px;object-fit:cover}.xp-start-item{width:100%;border:0;background:transparent;display:flex;gap:9px;align-items:center;text-align:left;padding:7px 8px;border-radius:3px;min-height:40px}.xp-start-item:hover{background:#316ac5;color:#fff}.about-outer{background:linear-gradient(180deg,#6bb8ff 0% 48%,#4ea030 48% 100%);min-height:100%;padding:14px;position:relative;overflow:hidden}.ab-sticker{position:absolute;background:#fff;border:2.5px solid #1746b8;padding:4px 11px;font-weight:800;font-size:12px;box-shadow:2px 2px 0 rgba(0,0,0,.15);z-index:20}.ab-sticker:before{content:"☑ ";color:#1746b8}.cap-card{background:#fff;border:2.5px solid #d0d0d0;box-shadow:0 8px 28px rgba(0,0,0,.22);max-width:620px;margin:0 auto;position:relative;z-index:10}.cap-head{background:#1746b8;color:#fff;padding:15px 18px}.cap-name{display:inline-block;background:#1746b8;color:#fff;border:3px solid #fff;padding:3px 14px;font-size:26px;font-weight:900;letter-spacing:3px;margin:2px 0}.mini-paint{border:2px solid #999;box-shadow:3px 3px 0 rgba(0,0,0,.18)}.mpbar{background:linear-gradient(#000080,#1084d0);color:#fff;font-size:10px;font-weight:700;padding:3px 6px;display:flex;justify-content:space-between}@media(max-width:980px){.xp-window{left:6px!important;top:104px!important;width:calc(100vw - 12px)!important;height:calc(100vh - 154px)!important}.xp-start{width:100vw}.xp-desktop-icon{width:72px}.xp-body{font-size:12px}}
.i-paint{background:linear-gradient(135deg,#ff88cc,#cc44ff)}.i-paint:after{content:"P";font-size:18px;font-weight:900;color:#fff}.i-games{background:linear-gradient(135deg,#f6d365,#fda085)}.i-games:after{content:"☺";font-size:18px;font-weight:900;color:#5b2500}.identity-mark{width:138px;height:138px;display:grid;place-items:center;background:linear-gradient(135deg,#1746b8 0 48%,#e21a1a 48% 52%,#fff 52%);border:4px solid #111;box-shadow:8px 8px 0 rgba(0,0,0,.25);font-weight:900;font-size:42px;letter-spacing:-3px;color:#111}.identity-mark.small{width:62px;height:62px;font-size:22px;border-width:3px;box-shadow:3px 3px 0 rgba(0,0,0,.25)}.identity-mark.dark{margin:auto;background:linear-gradient(135deg,#fff 0 50%,#000 50%);border-color:#fff;color:#e00000}.xp-wall{background-image:url("${XP_WALLPAPER_URL}")!important;background-size:cover!important;background-position:center!important}.xp-wall:before,.xp-wall .cloud{display:none!important}.xp-tray button{border:0;background:transparent;color:#fff}.xp-context{position:absolute;z-index:250;width:205px;background:#fff;border:1px solid #777;box-shadow:3px 5px 16px rgba(0,0,0,.35);padding:4px}.xp-context span{display:block;padding:3px 8px;font-size:10px;color:#777;text-transform:uppercase}.xp-context button,.xp-context a{display:block;width:100%;border:0;background:transparent;padding:6px 8px;text-align:left;color:#111;text-decoration:none;font-size:12px}.xp-context button:hover,.xp-context a:hover{background:#316ac5;color:#fff}.xp-dialog{position:absolute;left:50%;top:50%;z-index:300;width:min(380px,calc(100vw - 24px));transform:translate(-50%,-50%);background:#ece9d8;border:1px solid #0a246a;box-shadow:6px 8px 22px rgba(0,0,0,.45)}.spark{position:absolute;z-index:260;pointer-events:none;padding:2px 5px;background:#fff;color:#1746b8;border:2px solid #1746b8;font-size:11px;font-weight:900;animation:sparkpop 1.1s ease-out forwards}@keyframes sparkpop{to{transform:translateY(-24px) rotate(8deg);opacity:0}}.screensaver{position:absolute;inset:0;z-index:280;background:#02040b;color:#7eb4ff;display:grid;place-items:center}.ss-badge{font-size:42px;font-weight:900;text-align:center;text-shadow:0 0 18px currentColor;animation:ssmove 6s linear infinite alternate}.ss-badge span{font-size:18px}.xp-explorer-layout{display:grid;grid-template-columns:190px 1fr;min-height:100%;background:#fff}.xp-task-pane{background:linear-gradient(#d7e7ff,#f6fbff);border-right:1px solid #9eb6d8;padding:12px}.xp-task-pane h3{margin:0 0 7px;color:#1746b8;font-size:12px}.xp-task-pane button{display:block;width:100%;border:0;background:transparent;text-align:left;color:#1746b8;padding:5px 2px;font-size:12px}.xp-task-pane button:hover{text-decoration:underline}.xp-system-main{padding:18px}.xp-system-head{display:flex;align-items:center;gap:18px;border-bottom:1px solid #d0d0d0;padding-bottom:15px}.xp-system-head h1{margin:0;color:#1746b8;font-size:34px;font-weight:900}.xp-system-head p{margin:3px 0 0;color:#555}.xp-section-title{margin:18px 0 8px;color:#1746b8;font-weight:800;font-size:13px}.xp-file-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.xp-file-tile{display:flex;align-items:center;gap:10px;border:1px solid #ddd;background:#fff;padding:10px;text-align:left}.xp-file-tile:hover{background:#eaf2ff}.xp-file-tile .xp-ico{margin:0}.xp-file-tile small{display:block;color:#666}.xp-details-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.xp-details-grid div{border:1px solid #ddd;background:#f8fbff;padding:10px}.xp-details-grid b{display:block;color:#1746b8;font-size:22px}.xp-details-grid span{font-size:11px;color:#555}.xp-note{margin-top:14px;border-left:4px solid #1746b8;background:#eef4ff;padding:10px;font-size:12px;color:#444}.reel-card{overflow:hidden;border:1px solid #9eb6d8;background:#fff;text-align:left;box-shadow:1px 1px 0 #fff}.reel-card:hover{border-color:#316ac5;background:#eef4ff}.reel-thumb{display:block;aspect-ratio:9/16;background:linear-gradient(135deg,#111,#1d5fd4);overflow:hidden}.reel-thumb span{display:grid;height:100%;place-items:center;color:#fff;font-size:42px}.reel-thumb-design{display:grid!important;place-items:center!important;align-content:center!important;gap:8px!important;padding:12px!important;text-align:center!important;background:linear-gradient(135deg,#111,#1746b8 55%,#e21a1a)!important}.reel-thumb-design b{font-size:46px;line-height:1}.reel-thumb-design small{font-size:11px;line-height:1.25;font-weight:900;text-transform:uppercase;color:#fff}.reel-player-frame{flex:1;background:#000;display:grid;place-items:center;overflow:hidden}.reel-player-frame iframe{width:100%;height:100%;border:0;aspect-ratio:9/16}.ie-design-panel{display:grid;place-items:center;align-content:center;gap:16px;min-height:300px;border:1px solid #888;background:#ece9d8;padding:16px;text-align:center}.paint-wrap{display:grid;grid-template-columns:46px 1fr;height:100%;min-height:360px}.paint-sidebar{background:#d4d0c8;border-right:1px solid #888;display:flex;flex-direction:column;padding:4px;align-items:center;gap:4px}.paint-tool-btn{width:34px;height:32px;border:2px solid transparent;background:#d4d0c8;border-radius:2px;font-size:13px;font-weight:900}.paint-tool-btn:hover{background:#bbb}.paint-tool-btn.active{background:#316ac5;border-color:#1a4fa0;color:#fff}.paint-sidebar input[type=color]{width:28px;height:28px;border:2px solid #888}.paint-canvas-area{display:flex;flex-direction:column;background:#808080;min-width:0}.paint-options{display:flex;align-items:center;gap:8px;padding:4px 8px;background:#d4d0c8;border-bottom:1px solid #888;font-size:11px;flex-wrap:wrap}.paint-options input[type=range]{width:80px}.paint-canvas-area canvas{display:block;background:#fff;cursor:crosshair;flex:1;width:100%;height:100%;touch-action:none}.games-grid{display:grid;gap:12px}.games-grid section{border:1px solid #b6b6b6;background:#fff;padding:12px}.games-grid h2{margin:0 0 8px;color:#1746b8;font-size:18px;font-weight:900}.game-arena{position:relative;height:160px;background:#e7efff;border:1px inset #aaa;overflow:hidden}.game-arena button{position:absolute;border:2px outset #ddd;background:#ece9d8;padding:6px 10px}.buzz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.buzz-grid button,.bsod-btn{border:2px outset #ddd;background:#ece9d8;padding:7px}.fake-bsod{position:absolute;inset:0;z-index:400;background:#001a8e;color:#fff;font-family:monospace;padding:60px;font-size:24px}.fake-bsod b{font-size:72px}
.i-danger{background:linear-gradient(135deg,#ffefef,#ff3b30 55%,#8a0000)}.i-danger:after{content:"!";font-size:24px;font-weight:900;color:#fff;text-shadow:1px 1px #580000}.danger-icon{position:relative;z-index:540}.danger-icon span{font-weight:900}
.profile-photo{width:220px;aspect-ratio:3/4;object-fit:cover;border:4px solid #111;background:#fff;box-shadow:8px 8px 0 rgba(0,0,0,.28)}.profile-photo.small{width:58px;border-width:2px;box-shadow:3px 3px 0 rgba(0,0,0,.28)}.profile-photo.stamp{border-color:#f4ead6;border-radius:2px}.guide-app{display:grid;gap:14px}.guide-head{display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:center}.guide-head .profile-photo{width:110px}.guide-head h1{margin:0;color:#1746b8;font-size:34px;font-weight:900}.guide-head p,.guide-app li{font-size:13px;line-height:1.6;color:#333}.guide-actions{display:flex;flex-wrap:wrap;gap:7px}.dont-touch{position:absolute;left:50%;top:18px;z-index:40;transform:translateX(-50%);border:2px outset #ffd1d1;background:#b50000;color:#fff;padding:8px 14px;font-size:12px;font-weight:900;text-transform:uppercase;box-shadow:4px 4px 0 rgba(0,0,0,.28)}.dont-touch.armed{background:#fff;color:#b50000}.chaos-warning{position:absolute;width:178px;background:#ece9d8;border:1px solid #0a246a;box-shadow:4px 6px 16px rgba(0,0,0,.35);font-size:11px}.chaos-warning div{display:flex;justify-content:space-between;background:linear-gradient(#2d8cff,#0b3da4);color:#fff;padding:3px 5px;font-weight:900}.chaos-warning div button{border:0;background:#c33;color:#fff}.chaos-warning p{margin:0;padding:8px;color:#111}.chaos-warning .border{margin:0 6px 6px}.formal-photo-card{display:grid;grid-template-columns:220px 1fr;gap:22px;align-items:end;border:1px solid rgba(255,255,255,.22);background:#fff;color:#000;padding:18px;box-shadow:18px 18px 0 #b00000}.formal-photo-card h3{font-size:36px;line-height:.95;font-weight:900;letter-spacing:-.04em}.formal-photo-card p{margin-top:12px;color:rgba(0,0,0,.68);line-height:1.65;font-size:14px}@media(max-width:760px){.formal-photo-card,.guide-head{grid-template-columns:1fr}.profile-photo{width:160px}.dont-touch{top:82px}}
.formal-photo-card{align-self:start}
`;

export default function XPExperience() {
  const [screen, setScreen] = useState("matrix");
  const goHome = () => { window.location.href = "/"; };
  const goFormal = () => { window.location.href = "/formal"; };
  return <AnimatePresence mode="wait">
    {screen === "gate" && <motion.div key="gate" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><ModeGate startXP={()=>setScreen("matrix")} startFormal={()=>setScreen("formalboot")}/></motion.div>}
    {screen === "matrix" && <motion.div key="matrix"><MatrixBoot onDone={()=>setScreen("xpboot")}/></motion.div>}
    {screen === "xpboot" && <motion.div key="xpboot"><XPBoot onDone={()=>setScreen("welcome")}/></motion.div>}
    {screen === "welcome" && <motion.div key="welcome"><XPWelcome onLogin={()=>setScreen("desktop")} goGate={goHome}/></motion.div>}
    {screen === "desktop" && <motion.div key="desktop"><XPDesktop goGate={goHome} openFormal={goFormal}/></motion.div>}
    {screen === "formalboot" && <motion.div key="formalboot"><FormalBoot onDone={goFormal}/></motion.div>}
    {screen === "formal" && <motion.div key="formal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><FormalDossier goGate={goHome}/></motion.div>}
  </AnimatePresence>;
}
