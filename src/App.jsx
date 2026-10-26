import { useEffect, useRef, useState } from "react";
import { T } from "./i18n.js";

const PHONE = "+373 79 097 638";
const TEL = "tel:+37379097638";
const MAIL = "contact@meralselectric.com";

const Icon = ({ n }) => {
  const p = {
    solar: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
    shield: <><path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
    pin: <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    check: <path d="m5 12 5 5 9-10" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  }[n];
  return <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p}</svg>;
};

function useInView(opts = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, opts);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const [ref, seen] = useInView({ threshold: 0.15 });
  return <Tag ref={ref} className={`rv ${seen ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` }}>{children}</Tag>;
}

function Counter({ to, suffix }) {
  const [ref, seen] = useInView();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setV(to);
    let raf, t0;
    const tick = (t) => {
      t0 ??= t;
      const k = Math.min((t - t0) / 1400, 1);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function Tx({ children: text = "", as: Tag = "span", className = "", ...rest }) {
  const [shown, setShown] = useState(text);
  const [phase, setPhase] = useState("idle");
  const cur = useRef(text);
  useEffect(() => {
    if (text === cur.current) return;
    cur.current = text;
    setPhase("out");
    const t1 = setTimeout(() => { setShown(text); setPhase("in"); }, 560);
    const t2 = setTimeout(() => setPhase("idle"), 560 + 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [text]);
  const step = Math.min(24, 650 / Math.max(shown.length, 1));
  let n = 0;
  return (
    <Tag className={`tx ${phase} ${className}`} style={{ "--st": `${step}ms` }} aria-label={shown} {...rest}>
      {shown.split(" ").map((w, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="tw">{[...w].map((c, ci) => <span className="tc" key={ci} style={{ "--n": n++ }}>{c}</span>)}</span>{" "}
        </span>
      ))}
    </Tag>
  );
}

function Typer({ words }) {
  const [st, setSt] = useState({ cur: 0, prev: -1 });
  const [ghost, setGhost] = useState(null);
  const refs = useRef({ words, cur: 0 });
  refs.current.cur = st.cur;
  useEffect(() => {
    let t;
    if (refs.current.words !== words) {
      setGhost(refs.current.words[refs.current.cur % refs.current.words.length]);
      refs.current.words = words;
      t = setTimeout(() => setGhost(null), 1400);
    }
    setSt({ cur: 0, prev: -1 });
    const id = setInterval(() => setSt((x) => ({ cur: (x.cur + 1) % words.length, prev: x.cur })), 3600);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [words]);
  const phrase = (w, cls, k) => {
    let n = 0;
    return (
      <span key={k} className={`ph ${cls}`} aria-hidden={cls !== "on"}>
        {w.split(" ").map((word, wi) => (
          <span className="wd" key={wi}>
            {[...word].map((c, ci) => <span className="ch" key={ci} style={{ "--n": n++ }}>{c}</span>)}
            {"\u00a0"}
          </span>
        ))}
      </span>
    );
  };
  return (
    <span className="typer">
      {words.map((w, k) => phrase(w, `${k === st.cur ? "on" : ""} ${k === st.prev ? "out" : ""}`, k))}
      {ghost && phrase(ghost, "ghost", "g" + ghost)}
    </span>
  );
}

function Circuit() {
  return (
    <svg className="circuit" viewBox="0 0 520 520" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="glow"><stop offset="0" stopColor="#ffb703" stopOpacity=".9" /><stop offset="1" stopColor="#ffb703" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="260" cy="260" r="150" fill="url(#glow)" className="halo" />
      {[
        "M0 120H140L200 180H260V260",
        "M0 260H110L170 320H260",
        "M0 400H160L220 340H260V260",
        "M520 100H400L340 160H260V260",
        "M520 260H410L350 200H260",
        "M520 420H380L320 360H260V260",
        "M260 0V90L300 130H260",
        "M260 520V430L220 390H260",
      ].map((d, i) => (
        <g key={i}>
          <path d={d} className="trace" />
          <path d={d} className="pulse" style={{ animationDelay: `${0.8 + i * 0.35}s` }} pathLength="100" />
        </g>
      ))}
      {[[140,120],[110,260],[160,400],[400,100],[410,260],[380,420]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className="pad" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      <g className="core">
        <rect x="222" y="222" width="76" height="76" rx="16" />
        <path d="M265 236l-18 30h14l-4 22 20-32h-14l4-20z" />
      </g>
    </svg>
  );
}

const PHOTO = { solar: "solar.jpg", shield: "security.jpg", bolt: "electric.jpg" };
function ServiceArt({ kind }) {
  const src = `${import.meta.env.BASE_URL}images/${PHOTO[kind]}`;
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const im = new Image();
    im.onload = () => setOk(true);
    im.src = src;
  }, [src]);
  if (ok) return <div className="art"><div className="photo" style={{ backgroundImage: `url(${src})` }} /></div>;
  return (
    <div className="art" aria-hidden="true">
      {kind === "solar" && <div className="sun"><i /></div>}
      {kind === "shield" && <div className="scan"><i /></div>}
      {kind === "bolt" && <div className="zap"><i /><i /><i /></div>}
    </div>
  );
}

function Spot({ children, className = "" }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return <article className={`card ${className}`} onPointerMove={onMove}>{children}</article>;
}

function LogoMark() {
  return (
    <svg className="lm" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd45e" /><stop offset="1" stopColor="#ff9f1c" /></linearGradient>
      </defs>
      <circle className="lm-orbit" cx="24" cy="24" r="22" />
      <circle className="lm-arc" cx="24" cy="24" r="22" />
      <path className="lm-hex" d="M24 4 41.3 14v20L24 44 6.7 34V14z" fill="url(#lg)" stroke="url(#lg)" strokeWidth="4" strokeLinejoin="round" />
      <path className="lm-bolt" d="M27 11 14 26.5h9L21 38l13-16h-9z" fill="#08122e" />
    </svg>
  );
}

function Nav({ t, lang, setLang, active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const on = () => {
      setScrolled(scrollY > 24);
      const h = document.documentElement.scrollHeight - innerHeight;
      setProg(h > 0 ? scrollY / h : 0);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("lock", open);
    const k = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open]);
  const [lo, setLo] = useState(false);
  useEffect(() => {
    if (!lo) return;
    const c = (e) => !e.target.closest(".langbox") && setLo(false);
    addEventListener("pointerdown", c);
    return () => removeEventListener("pointerdown", c);
  }, [lo]);
  return (
    <>
      <header className={`nav ${scrolled ? "sc" : ""}`}>
        <div className="nav-in">
          <a href="#top" className="logo" onClick={() => setOpen(false)} aria-label="Instalenergo">
            <LogoMark /><span className="wm">Instal<b>energo</b></span>
          </a>
          <nav className="links" aria-label="Principal">
            {t.nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? "on" : ""}><Tx>{label}</Tx></a>
            ))}
          </nav>
          <div className="nav-r">
            <div className="langbox">
              <button className="lang" onClick={() => setLo(!lo)} aria-label="Language" aria-expanded={lo}><Icon n="globe" />{lang.toUpperCase()}</button>
              <ul className={`langmenu ${lo ? "open" : ""}`}>
                {[["ro", "Română"], ["ru", "Русский"], ["en", "English"]].map(([c, n]) => (
                  <li key={c}><button className={c === lang ? "cur" : ""} tabIndex={lo ? 0 : -1} onClick={() => { setLang(c); setLo(false); }}><b>{c.toUpperCase()}</b>{n}</button></li>
                ))}
              </ul>
            </div>
            <a href="#contact" className="btn sm hide-m"><Tx>{t.cta}</Tx></a>
            <button className={`burger ${open ? "x" : ""}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t.close : t.menu}>
              <i /><i />
            </button>
          </div>
        </div>
        <div className="bar" style={{ transform: `scaleX(${prog})` }} />
      </header>
      <div className={`sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav>
          {t.nav.map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} style={{ "--i": i }} tabIndex={open ? 0 : -1}><Tx>{label}</Tx></a>
          ))}
        </nav>
        <a href="#contact" className="btn wide" onClick={() => setOpen(false)} style={{ "--i": 5 }} tabIndex={open ? 0 : -1}><Tx>{t.cta}</Tx></a>
      </div>
      <a href={TEL} className="fab" aria-label={t.call}><Icon n="phone" /><span><Tx>{t.call}</Tx></span></a>
    </>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => { try { const l = localStorage.getItem("lang"); return T[l] ? l : "ro"; } catch { return "ro"; } });
  const [active, setActive] = useState("");
  const [status, setStatus] = useState("");
  const t = T[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch {}
  }, [lang]);

  useEffect(() => {
    const ids = ["despre", "servicii", "proces", "contact"];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const [n, m, b] = [f.get("name"), f.get("email"), f.get("message")].map((x) => String(x || "").trim());
    if (!n || !m || !b) return setStatus(t.err);
    setStatus(t.sent);
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent("Instalenergo – " + n)}&body=${encodeURIComponent(b + "\n\n" + n + " <" + m + ">")}`;
  };

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} active={active} />
      <main id="top">
        <section className="hero">
          <div className="wrap hero-g">
            <div className="hero-t">
              <h1>
                <span className="l l1"><Tx>{t.heroA}</Tx></span>
                <span className="l l2"><Tx>{t.heroB}</Tx></span>
                <span className="l l3"><Typer words={t.words} /></span>
              </h1>
              <p className="lead l4"><Tx>{t.heroP}</Tx></p>
              <div className="row l5">
                <a href="#contact" className="btn"><Tx>{t.cta}</Tx><Icon n="arrow" /></a>
                <a href="#servicii" className="btn ghost"><Tx>{t.heroCta2}</Tx></a>
              </div>
            </div>
            <div className="hero-v"><Circuit /></div>
          </div>
          <div className="wrap stats l6">
            {t.stats.map(([n, s, l]) => (
              <div key={l}><strong><Counter to={n} suffix={s} /></strong><span><Tx>{l}</Tx></span></div>
            ))}
          </div>
        </section>

        <section id="despre" className="sec light">
          <div className="wrap about">
            <Reveal><h2><Tx>{t.aboutT}</Tx></h2></Reveal>
            <div>
              <Reveal delay={100}><p className="lead dark"><Tx>{t.aboutP}</Tx></p></Reveal>
              <ul className="ticks">
                {t.aboutPoints.map((p, i) => (
                  <Reveal as="li" key={p} delay={200 + i * 120}><span className="tick"><Icon n="check" /></span><Tx>{p}</Tx></Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="servicii" className="sec">
          <div className="wrap">
            <Reveal><h2 className="center-m"><Tx>{t.servT}</Tx></h2></Reveal>
            <div className="bento">
              {t.serv.map(([title, text, ic], i) => (
                <Reveal key={title} delay={i * 130} className={`b b${i}`}>
                  <Spot className={`s-${ic}`}>
                    <ServiceArt kind={ic} />
                    <span className="chip"><Icon n={ic} /></span>
                    <h3><Tx>{title}</Tx></h3>
                    <p><Tx>{text}</Tx></p>
                  </Spot>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="proces" className="sec light">
          <div className="wrap">
            <Reveal><h2><Tx>{t.procT}</Tx></h2></Reveal>
            <ol className="steps">
              {t.steps.map(([h, p], i) => (
                <Reveal as="li" key={h} delay={i * 140}>
                  <span className="num">{i + 1}</span>
                  <h3><Tx>{h}</Tx></h3>
                  <p><Tx>{p}</Tx></p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section id="contact" className="sec dark">
          <div className="wrap contact">
            <div>
              <Reveal><h2><Tx>{t.contT}</Tx></h2><p className="lead"><Tx>{t.contP}</Tx></p></Reveal>
              <ul className="info">
                {[["pin", t.loc, "Pelivan, Moldova", null], ["phone", t.tel, PHONE, TEL], ["mail", t.mail, MAIL, `mailto:${MAIL}`]].map(([ic, k, v, href], i) => (
                  <Reveal as="li" key={k} delay={i * 100}>
                    <span className="chip sm"><Icon n={ic} /></span>
                    <div><small><Tx>{k}</Tx></small>{href ? <a href={href}>{v}</a> : <span>{v}</span>}</div>
                  </Reveal>
                ))}
              </ul>
              <Reveal delay={200} className="map">
                <iframe title="Map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Pelivan,Moldova&z=13&output=embed" />
                <a href="https://maps.google.com/?q=Pelivan,Moldova" target="_blank" rel="noreferrer"><Tx>{t.open}</Tx></a>
              </Reveal>
            </div>
            <Reveal delay={150}>
              <form className="form" onSubmit={submit} noValidate>
                <label><span><Tx>{t.name}</Tx></span><input name="name" autoComplete="name" placeholder={t.namePh} /></label>
                <label><span><Tx>{t.email}</Tx></span><input name="email" type="email" autoComplete="email" placeholder="ion@example.com" /></label>
                <label><span><Tx>{t.msg}</Tx></span><textarea name="message" rows="5" placeholder={t.msgPh} /></label>
                <button className="btn wide" type="submit"><Tx>{t.send}</Tx><Icon n="arrow" /></button>
                <p className="status" role="status"><Tx>{status}</Tx></p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="foot">
        <div className="wrap">
          <span>© {new Date().getFullYear()} Instalenergo. <Tx>{t.rights}</Tx></span>
          <a href={TEL}>{PHONE}</a>
        </div>
      </footer>
    </>
  );
}
