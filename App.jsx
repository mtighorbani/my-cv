import { useState, useEffect, useRef, useMemo } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  ArrowDown,
  ArrowUpRight,
  Plus,
  Check,
} from "lucide-react";

/**
 * Mehdi Ghorbani — personal site (v2)
 * ------------------------------------------------------------
 * Design language: "built, not printed" — a warm near-black
 * canvas, an architectural arch motif (a nod to Tehran and to
 * "building things"), and a two-tone accent that stands for the
 * two halves of how Mehdi works: violet for systems/architecture,
 * coral for the human/product side of the same thinking.
 *
 * PHOTOS
 * portrait.png (hero) and workspace.png (projects) live in /public.
 * Vite/CRA/Next serve that folder at the site root.
 * ------------------------------------------------------------
 */

const HERO_PHOTO = "/portrait.png";
const SIDE_PHOTO = "/workspace.png";

const NAV = [
  { id: "hero", label: "About" },
  { id: "services", label: "View resume" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
  { id: "bozhan", label: "Bozhan Projects" },
];

const BOZHAN_PROJECTS = [
  {
    title: "Why We Can Talk to Machines Today",
    note: "How conversation with a machine became possible.",
    done: true,
    file: "/mehdi-ghorbani-project1.pdf",
  },
  {
    title: "Prompt Engineering",
    note: "Shaping what a model does by shaping what you ask.",
    done: false,
  },
  {
    title: "A Support Assistant for a Real Problem",
    note: "Built with Metis, for a real support topic.",
    done: false,
  },
  {
    title: "A Personal Site on the Web",
    note: "This site — name, path, work, and a way to get in touch.",
    done: true,
  },
];

const JOURNEY = [
  {
    date: "May 2022 — Apr 2023",
    place: "Flightio, Tehran",
    role: "Software Help Desk Specialist",
    lede: "Where I learned to see technology through the eyes of whoever depends on it.",
    bullets: [
      "Analyzed and resolved reported issues, and coordinated fixes with developers.",
      "Queried production databases with SQL to turn requested reports into real answers.",
      "Monitored provider APIs to keep the system stable end to end.",
      "Read and interpreted error logs to track problems back to their source.",
    ],
  },
  {
    date: "Mar 2023 — Sep 2025",
    place: "Flightio, Tehran",
    role: "Mid-level Frontend Developer",
    lede: "Moved from fixing what exists to shaping what gets built next.",
    bullets: [
      "Built responsive interfaces across B2B, web and app products with React, Next.js and TypeScript.",
      "Redesigned the B2B platform UI around a modular, component-driven architecture.",
      "Shipped an offline tour-booking flow and a new loyalty-club experience.",
      "Wrote custom Next.js middleware for date-based rules and referrer-aware routing.",
    ],
  },
  {
    date: "Sep 2025 — Mar 2026",
    place: "Telecommunications Company, Tehran",
    role: "Senior Frontend Developer",
    lede: "Built the architecture that other products get built on.",
    bullets: [
      "Lead frontend architecture inside a Turborepo monorepo powering 5+ independent applications.",
      "Built a shared design system on Base UI, shadcn/ui and Tailwind, used across every product.",
      "Architected a reusable component ecosystem following Atomic Design principles.",
      "Optimized monorepo build and CI/CD performance with caching and dependency-graph management.",
    ],
  },
  {
    date: "Mar 2026 — Present",
    place: "Tehran Site, Tehran",
    role: "Technical Product Manager",
    lede: "Where the question shifts from how to build it to what is worth building.",
    current: true,
    bullets: [
      "Own the product roadmap and keep scope tied to the problem that actually matters.",
      "Turn business goals into technical plans design and engineering can ship.",
      "Write specs that connect user problems to system decisions, not feature lists.",
      "Align stakeholders, design and delivery so the work stays pointed at growth.",
    ],
  },
];

const PROJECTS = [
  {
    title: "A shared foundation for five products",
    tag: "Architecture",
    problem:
      "Five applications, five different UI patterns, and duplicated logic slowing every team down.",
    decision:
      "Built a shared foundation inside a Turborepo monorepo — design tokens, a Base UI + shadcn/ui + Tailwind system, and Atomic Design components.",
    impact:
      "Consistent experience across products, faster CI/CD, and apps that ship independently while sharing one core.",
  },
  {
    title: "Rebuilding a B2B booking platform",
    tag: "Product",
    problem:
      "A legacy interface was slowing down how partners searched, booked and managed trips.",
    decision:
      "Rebuilt the UI around a modular, component-driven architecture and wrote custom middleware for dynamic, date-based routing logic.",
    impact:
      "A faster, more maintainable platform — plus a new offline tour-booking flow for partners without a live connection.",
  },
];

const SKILLS = [
  {
    group: "Languages",
    use: "What I write interfaces and product logic in.",
    items: ["JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    group: "Frontend",
    use: "How a product decision becomes something people can use.",
    items: ["React", "Next.js", "jQuery"],
  },
  {
    group: "Design systems",
    use: "One shared UI so every product feels like the same system.",
    items: [
      "Tailwind",
      "shadcn/ui",
      "MUI",
      "Ant Design",
      "Bootstrap",
      "Sass",
      "Figma",
    ],
  },
  {
    group: "State & data",
    use: "How screens stay in sync with the data behind them.",
    items: [
      "Redux Toolkit",
      "React Context",
      "React Query",
      "Axios",
      "SSR",
      "SSE",
    ],
  },
  {
    group: "Tooling",
    use: "How several apps ship from one codebase.",
    items: ["Git", "GitHub", "Turborepo", "PNPM Workspaces", "Azure"],
  },
  {
    group: "Product",
    use: "How I decide what is worth building before it gets built.",
    items: [
      "Roadmapping",
      "Agile",
      "Technical specs",
      "Stakeholder alignment",
      "Backlog prioritization",
    ],
  },
];

const TICKER = [...SKILLS.flatMap((s) => s.items)];

const PATH_NODES = [
  { key: "frontend", label: "Frontend", note: "Where I started" },
  {
    key: "architecture",
    label: "Architecture",
    note: "Where I spend most of my time now",
  },
  { key: "product", label: "Product", note: "Why before how" },
  { key: "business", label: "Business", note: "Where I'm headed" },
];

/* ---------------- helpers ---------------- */

function useActiveSection(ids) {
  const [active, setActive] = useState([ids[0]]);
  useEffect(() => {
    const onScroll = () => {
      const line = 88;
      const inside = [];
      let lastPassed = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line) lastPassed = id;
        if (rect.top <= line && rect.bottom > line) inside.push(id);
      });
      const next = inside.length ? inside : [lastPassed];
      setActive((prev) =>
        prev.length === next.length && prev.every((id, i) => id === next[i])
          ? prev
          : next,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function scrollToId(id) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

let pendingScroll = null;

function useHashPage() {
  const read = () => (location.hash === "#bozhan" ? "bozhan" : "home");
  const [page, setPage] = useState(read);
  useEffect(() => {
    const onHash = () => setPage(read());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (page === "bozhan") {
      pendingScroll = null;
      window.scrollTo(0, 0);
      return;
    }
    if (!pendingScroll) return;
    const id = pendingScroll;
    pendingScroll = null;
    requestAnimationFrame(() => scrollToId(id));
  }, [page]);
  return page;
}

function openPage(id) {
  if (id === "bozhan") {
    pendingScroll = null;
    if (location.hash !== "#bozhan") location.hash = "bozhan";
    else window.scrollTo(0, 0);
    return;
  }
  if (location.hash) {
    pendingScroll = id;
    history.replaceState(null, "", location.pathname + location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  scrollToId(id);
}

/* ---------------- small interactive pieces ---------------- */

function Magnetic({ children, strength = 24, className = "" }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        setT({ x, y });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{ transform: `translate(${t.x}px, ${t.y}px)` }}
    >
      {children}
    </span>
  );
}

function PathDiagram({ size = "lg" }) {
  const [hovered, setHovered] = useState(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);
  const w = 520,
    h = 220;
  const xs = [56, 190, 330, 468];
  const ys = [162, 118, 78, 40];
  return (
    <div className={`path-diagram path-diagram--${size}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="path-svg" aria-hidden="true">
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-warm)" />
          </linearGradient>
        </defs>
        <polyline
          points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")}
          className={`path-line ${drawn ? "is-drawn" : ""}`}
        />
        {PATH_NODES.map((n, i) => (
          <g
            key={n.key}
            transform={`translate(${xs[i]}, ${ys[i]})`}
            className={`path-node ${hovered === i ? "is-active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <circle r="7" />
            <text x="0" y={ys[i] < 100 ? -20 : 28} textAnchor="middle">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="path-note" aria-live="polite">
        {hovered !== null
          ? PATH_NODES[hovered].note
          : "Hover a stage of the path"}
      </p>
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function Grain() {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id="grainFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grainFilter)" />
    </svg>
  );
}

/* ---------------- section components ---------------- */

function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className="section hero">
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="section-inner">
        <div className="hero-grid">
          <div className={`hero-copy stagger ${loaded ? "is-in" : ""}`}>
            <p className="eyebrow eyebrow-violet">
              Software engineer, frontend-rooted, Technical product manager
            </p>
            <h1 className="display">
              <span>I build software,</span>
              <span className="em">but I start with why.</span>
            </h1>
            <p className="hero-sub">
              Frontend engineer turned systems thinker, now a technical product
              manager. I care about architecture, scale and business impact as
              much as the implementation itself — and lately, about what AI
              changes for all three.
            </p>
            <div className="hero-actions">
              <Magnetic>
                <button
                  className="btn-primary"
                  onClick={() => scrollToId("services")}
                >
                  View resume
                </button>
              </Magnetic>
              <button
                className="btn-ghost"
                onClick={() => scrollToId("contact")}
              >
                Get in touch <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div
            className={`hero-visual ${loaded ? "is-in" : ""}`}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTilt({
                x: ((e.clientY - r.top) / r.height - 0.5) * -6,
                y: ((e.clientX - r.left) / r.width - 0.5) * 8,
              });
            }}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div className="arch-frame">
              <div
                className="portrait"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
              >
                <img
                  className="portrait-img"
                  src={HERO_PHOTO}
                  alt="Mehdi Ghorbani"
                />
                <div className="portrait-vignette" />
              </div>
            </div>
          </div>
        </div>

        <button
          className="scroll-cue"
          onClick={() => scrollToId("services")}
          aria-label="Scroll down"
        >
          <ArrowDown size={18} />
        </button>
      </div>
    </section>
  );
}

function About() {
  const [open, setOpen] = useState(3);
  return (
    <section id="services" className="section about">
      <div className="about-grid">
        <div id="journey">
          <Reveal>
            <p className="kicker kicker-duo">Journey</p>
            <h2 className="h2">Four roles, one direction</h2>
          </Reveal>

          <div className="timeline">
            <div className="timeline-rail" />
            {JOURNEY.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.role} className="timeline-item">
                  <button
                    className={`timeline-row ${isOpen ? "is-open" : ""}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className="timeline-dot"
                      data-current={item.current || undefined}
                    />
                    <span className="timeline-heading">
                      <span className="timeline-role">{item.role}</span>
                      <span className="timeline-meta">
                        <span className="timeline-place">{item.place}</span>
                        {" · "}
                        {item.date}
                      </span>
                      <span className="timeline-lede">{item.lede}</span>
                    </span>
                    <Plus size={16} className="timeline-toggle" />
                  </button>
                  <div className="timeline-detail" data-open={isOpen}>
                    <ul>
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div id="think">
          <Reveal className="think-inner">
            <p className="kicker kicker-coral">How I think</p>
            <p className="lead">
              “Before I build anything, I try to understand why it needs to
              exist and what problem it's actually solving.”
            </p>
            <p className="body-text">
              I don't see AI as a shortcut for writing code faster — I see it as
              a chance to rethink how products and processes get built in the
              first place. Instead of chasing every trend, I try to understand
              deeply what's actually worth building. My path has been about
              moving from <em>how do I build this</em> to{" "}
              <em>what should I build, and why</em>.
            </p>
            <p className="body-text">
              The goal is a point where I understand technology deeply enough to
              shape it, and business well enough to know where it should go —
              technology not just as a tool for building, but as the engine
              behind a product's growth.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="projects" className="section projects">
      <Reveal>
        <p className="kicker kicker-violet">Projects</p>
        <h2 className="h2">Problem, decision, impact</h2>
      </Reveal>

      <div className="project-list">
        {PROJECTS.map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <Reveal key={p.title} className="project">
              <button
                className={`project-head ${isOpen ? "is-open" : ""}`}
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span className="project-tag">{p.tag}</span>
                <span className="project-title">{p.title}</span>
                <Plus size={16} className="project-toggle" />
              </button>
              <div className="project-body" data-open={isOpen}>
                <div className="project-step">
                  <span className="project-step-label">Problem</span>
                  <p>{p.problem}</p>
                </div>
                <div className="project-step">
                  <span className="project-step-label">Decision</span>
                  <p>{p.decision}</p>
                </div>
                <div className="project-step">
                  <span className="project-step-label">Impact</span>
                  <p>{p.impact}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="side-photo-frame">
        <img className="side-photo" src={SIDE_PHOTO} alt="Working at a desk" />
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section skills">
      <Reveal>
        <p className="kicker kicker-coral">Skills</p>
        <h2 className="h2">The toolkit behind the thinking</h2>
      </Reveal>
      <div className="skills-grid">
        {SKILLS.map((s) => (
          <Reveal key={s.group} className="skill-col">
            <p className="skill-group">{s.group}</p>
            <p className="skill-use">{s.use}</p>
            <ul className="skill-items">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function BozhanProjects() {
  return (
    <section className="section bozhan">
      <p className="kicker kicker-violet">Bozhan Projects</p>
      <h1 className="h2">Four projects, checked off as they ship</h1>
      <p className="body-text bozhan-lead">
        A short list of the builds in this track. A tick means it is done.
      </p>
      <ol className="bozhan-list">
        {BOZHAN_PROJECTS.map((project, i) => (
          <li key={project.title} className={project.done ? "is-done" : ""}>
            <span
              className="bozhan-check"
              aria-label={project.done ? "Done" : "Not done"}
            >
              {project.done ? <Check size={14} strokeWidth={2.5} /> : null}
            </span>
            <div>
              <p className="bozhan-index">Project {i + 1}</p>
              <h2 className="bozhan-title">{project.title}</h2>
              <p className="bozhan-note">{project.note}</p>
              {project.file ? (
                <a className="bozhan-download" href={project.file} download>
                  Download PDF <ArrowDown size={14} />
                </a>
              ) : null}
            </div>
            <span className="bozhan-status">
              {project.done ? "Done" : "Not done"}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal>
        <p className="kicker kicker-duo">Contact</p>
        <h2 className="h2">Let's talk about what's worth building.</h2>
        <div className="contact-links">
          <Magnetic>
            <a className="contact-link" href="mailto:Maehdighorbani@gmail.com">
              <Mail size={18} /> Maehdighorbani@gmail.com
            </a>
          </Magnetic>
          <Magnetic>
            <a className="contact-link" href="tel:+989198929896">
              <Phone size={18} /> +98 919 892 9896
            </a>
          </Magnetic>
          <Magnetic>
            <a
              className="contact-link"
              href="https://github.com/Maehdighorbani"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={18} /> Maehdighorbani
            </a>
          </Magnetic>
          <Magnetic>
            <a
              className="contact-link"
              href="https://www.linkedin.com/in/maehdighorbani/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={18} /> maehdighorbani
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- app shell ---------------- */

export default function App() {
  const ids = useMemo(
    () => NAV.filter((n) => n.id !== "bozhan").map((n) => n.id),
    [],
  );
  const active = useActiveSection(ids);
  const page = useHashPage();
  const navActive = page === "bozhan" ? ["bozhan"] : active;

  return (
    <div className="mg-site">
      <Grain />
      <nav className="nav" dir="ltr">
        <div className="nav-inner">
          <div className="nav-start">
            <div className="nav-links">
              {NAV.filter((n) => n.id !== "bozhan").map((n) => (
                <button
                  key={n.id}
                  className={`nav-link ${navActive.includes(n.id) ? "is-active" : ""}`}
                  onClick={() => openPage(n.id)}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <button
            className={`nav-badge ${navActive.includes("bozhan") ? "is-active" : ""}`}
            onClick={() => openPage("bozhan")}
          >
            Bozhan Projects
          </button>
        </div>
      </nav>

      {page === "bozhan" ? (
        <BozhanProjects />
      ) : (
        <>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </>
      )}

      <footer className="footer">
        {page === "home" ? <PathDiagram size="lg" /> : null}
        <p>Mehdi Ghorbani — built with React.</p>
      </footer>

      <style>{`
        .mg-site {
          --bg: #14121a;
          --bg-soft: #1b1822;
          --bg-elevated: #221e2b;
          --border: rgba(255,255,255,0.09);
          --text: #f3eee9;
          --text-muted: #ab9fb5;
          --text-faint: #6b6377;
          --accent: #7b6ef6;
          --accent-soft: rgba(123,110,246,0.16);
          --accent-warm: #ff6b4a;
          --accent-warm-soft: rgba(255,107,74,0.16);

          --section-gap: 64px;
          --content: 940px;
          --gutter: 32px;

          position: relative;
          padding-top: 68px;
          background: var(--bg);
          color: var(--text);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          line-height: 1.55;
          overflow-x: hidden;
        }
        .mg-site * { box-sizing: border-box; }
        .mg-site h1, .mg-site h2 {
          font-family: "Fraunces", Georgia, "Times New Roman", serif;
          font-weight: 500;
          margin: 0;
        }
        .mg-site em { font-style: italic; color: var(--accent-warm); }
        .mg-site button { font-family: inherit; cursor: pointer; }

        .grain {
          position: fixed; inset: 0; width: 100%; height: 100%;
          opacity: 0.05; mix-blend-mode: overlay; pointer-events: none; z-index: 60;
        }

        .section {
          display: flex; flex-direction: column;
          max-width: var(--content); margin: 0 auto; padding: 40px var(--gutter); position: relative;
        }
        .section > :last-child { margin-bottom: 0; }
        .section-inner { width: 100%; position: relative; z-index: 1; }

        /* floating blobs for hero depth */
        .blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
        .blob-a { width: 420px; height: 420px; background: var(--accent-soft); top: -120px; left: -140px; }
        .blob-b { width: 340px; height: 340px; background: var(--accent-warm-soft); bottom: -80px; right: -100px; }

        /* nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          background: rgba(20,18,26,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          direction: ltr;
          display: flex; align-items: center; justify-content: space-between;
          max-width: var(--content); margin: 0 auto; padding: 18px var(--gutter);
        }
        .nav-start { display: flex; align-items: center; gap: 28px; }
        .nav-name { background: none; border: none; color: var(--text); font-family: "IBM Plex Mono", monospace; font-size: 14px; letter-spacing: 0.04em; }
        .nav-links { display: flex; gap: 22px; flex-wrap: wrap; justify-content: flex-start; }
        .nav-badge {
          background: linear-gradient(120deg, var(--accent), var(--accent-warm));
          color: #fff; border: none; border-radius: 999px; padding: 7px 14px;
          font-size: 13px; font-weight: 700; letter-spacing: 0.01em;
          box-shadow: 0 8px 22px -8px var(--accent-warm);
        }
        .nav-badge.is-active { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent-warm); }
        .nav-link {
          background: none; border: none; color: var(--text-faint); font-size: 14px; font-weight: 500;
          padding: 6px 0 10px; position: relative;
        }
        .nav-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent-warm));
          transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease;
        }
        .nav-link.is-active { color: var(--text); font-weight: 600; }
        .nav-link.is-active::after { transform: scaleX(1); }

        /* hero */
        .hero { max-width: none; width: 100%; padding-left: 0; padding-right: 0; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
        .hero .section-inner { max-width: var(--content); margin: 0 auto; padding: 0 var(--gutter); }
        .hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 56px; align-items: center; position: relative; z-index: 1; }
        .eyebrow { font-size: 14px; margin: 0 0 18px; font-weight: 600; }
        .eyebrow-violet { color: var(--accent); }
        .kicker { font-size: 14px; margin: 0 0 16px; font-weight: 600; }
        .kicker-violet { color: var(--accent); }
        .kicker-coral { color: var(--accent-warm); }
        .kicker-duo {
          background: linear-gradient(90deg, var(--accent), var(--accent-warm));
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .display { font-size: clamp(36px, 5.6vw, 58px); line-height: 1.12; display: flex; flex-direction: column; }
        .display .em { font-style: italic; color: var(--accent-warm); }
        .stagger span { display: block; opacity: 0; transform: translateY(20px) scale(0.98); transition: opacity 0.7s cubic-bezier(.2,.7,.3,1), transform 0.7s cubic-bezier(.2,.7,.3,1); }
        .stagger.is-in span:nth-child(1) { opacity: 1; transform: none; transition-delay: 0.05s; }
        .stagger.is-in span:nth-child(2) { opacity: 1; transform: none; transition-delay: 0.22s; }
        .hero-sub { max-width: 46ch; color: var(--text-muted); font-size: 17px; margin: 24px 0 32px; }
        .hero-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .btn-primary {
          background: linear-gradient(120deg, var(--accent), var(--accent-warm)); color: #fff; border: none; padding: 14px 24px;
          border-radius: 999px; font-size: 15px; font-weight: 700; display: inline-block;
          transition: transform 0.3s cubic-bezier(.2,.8,.3,1.4), box-shadow 0.3s ease;
        }
        .btn-primary:hover { box-shadow: 0 10px 30px -8px var(--accent-soft); }
        .btn-ghost {
          background: none; border: none; color: var(--text); font-size: 15px;
          display: inline-flex; align-items: center; gap: 6px; padding: 13px 4px;
          border-bottom: 1px solid var(--border);
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .btn-ghost:hover { color: var(--accent-warm); border-color: var(--accent-warm); }
        .magnetic { display: inline-block; transition: transform 0.25s cubic-bezier(.2,.8,.2,1); }

        .hero-visual { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s; perspective: 900px; position: relative; z-index: 1; }
        .hero-visual.is-in { opacity: 1; transform: none; }

        .arch-frame {
          position: relative; transform-style: preserve-3d;
        }
        .arch-frame::before {
          content: ""; position: absolute; inset: 12px -12px -12px 12px;
          border: 1px solid var(--accent); border-radius: 18px;
          opacity: 0.55; pointer-events: none;
        }
        .portrait { transition: transform 0.15s ease-out; transform-style: preserve-3d; position: relative; }
        .portrait-img {
          width: 100%; aspect-ratio: 4/5; object-fit: cover; object-position: center 18%;
          display: block; border-radius: 18px;
          filter: saturate(1.06) contrast(1.04);
        }
        .portrait-vignette {
          position: absolute; inset: 0; border-radius: 18px;
          background: linear-gradient(to top, rgba(20,18,26,0.28), transparent 36%);
          pointer-events: none;
        }
        .scroll-cue {
          position: relative; margin: 36px auto 0;
          background: none; border: 1px solid var(--border); border-radius: 50%;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); animation: bob 2.2s ease-in-out infinite; z-index: 1;
        }
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }

        /* path diagram */
        .path-svg { width: 100%; height: auto; overflow: visible; }
        .path-line { fill: none; stroke: url(#pathGrad); stroke-width: 2; stroke-dasharray: 900; stroke-dashoffset: 900; transition: stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1); }
        .path-line.is-drawn { stroke-dashoffset: 0; }
        .path-node circle { fill: var(--bg); stroke: var(--text-faint); stroke-width: 1.5; transition: stroke 0.25s, fill 0.25s, r 0.25s; }
        .path-node text { fill: var(--text-muted); font-size: 13px; font-family: "IBM Plex Mono", monospace; transition: fill 0.2s; }
        .path-node.is-active circle { stroke: var(--accent-warm); fill: var(--accent-warm-soft); r: 9; }
        .path-node.is-active text { fill: var(--accent-warm); }
        .path-note { margin-top: 12px; color: var(--text-faint); font-size: 13px; min-height: 18px; }
        .path-diagram--lg { width: min(100%, var(--content)); max-width: var(--content); margin: 0 auto 28px; }
        .footer .path-note { font-size: 16px; margin-top: 20px; }

        /* reveal */
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.is-in { opacity: 1; transform: none; }

        /* about: journey left, how I think right */
        .about { max-width: none; width: 100%; background: var(--bg-soft); padding-left: 0; padding-right: 0; }
        .about-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 28px 56px; align-items: start; max-width: var(--content); margin: 0 auto; width: 100%; padding: 0 var(--gutter); }
        #hero, #services, #projects, #skills, #contact { scroll-margin-top: 84px; }
        #think { border-left: 1px solid var(--border); padding-left: 40px; }
        .about .kicker { font-size: 12px; margin-bottom: 10px; }
        .about .h2 { font-size: 22px; line-height: 1.25; margin-top: 0; margin-bottom: 12px; }
        .think-inner > :last-child { margin-bottom: 0; }
        .lead { font-family: "Fraunces", Georgia, serif; font-style: italic; font-size: 17px; line-height: 1.45; margin: 0 0 14px; color: var(--text); }
        .body-text { color: var(--text-muted); font-size: 14px; line-height: 1.6; margin: 0 0 12px; max-width: none; }
        .h2 { font-size: clamp(24px, 3vw, 32px); margin-top: 6px; margin-bottom: 40px; }

        /* journey */
        .timeline { position: relative; margin-top: 4px; }
        .timeline-rail { position: absolute; left: 5px; top: 10px; bottom: 10px; width: 2px; background: linear-gradient(180deg, var(--accent), var(--accent-warm)); opacity: 0.4; }
        .timeline-item { margin-bottom: 4px; }
        .timeline-row {
          width: 100%; background: none; border: none; text-align: left; color: var(--text);
          display: grid; grid-template-columns: 12px 1fr 20px; gap: 14px; align-items: start;
          padding: 14px 0; border-bottom: 1px solid var(--border);
        }
        .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--bg); border: 2px solid var(--text-faint); margin-top: 5px; transition: border-color 0.2s, background 0.2s; }
        .timeline-row:hover .timeline-dot { border-color: var(--accent); }
        .timeline-dot[data-current] { border-color: var(--accent-warm); background: var(--accent-warm); }
        .timeline-heading { display: flex; flex-direction: column; gap: 4px; }
        .timeline-role { font-size: 15px; font-weight: 600; line-height: 1.35; }
        .timeline-meta { font-family: "IBM Plex Mono", monospace; font-size: 11.5px; color: var(--text-faint); }
        .timeline-place { color: var(--text); font-weight: 600; }
        .timeline-lede { color: var(--text-muted); font-size: 13px; line-height: 1.45; margin-top: 2px; }
        .timeline-toggle { color: var(--text-faint); margin-top: 4px; transition: transform 0.3s cubic-bezier(.2,.8,.2,1.4); }
        .timeline-row.is-open .timeline-toggle { transform: rotate(45deg); color: var(--accent-warm); }
        .timeline-detail {
          max-height: 0; overflow: hidden; transition: max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease;
          opacity: 0; padding-left: 32px;
        }
        .timeline-detail[data-open="true"] { max-height: 320px; opacity: 1; padding-bottom: 20px; }
        .timeline-detail ul { margin: 8px 0 0; padding-left: 18px; color: var(--text-muted); font-size: 14.5px; }
        .timeline-detail li { margin-bottom: 8px; }

        /* projects */
        .project-list { display: flex; flex-direction: column; gap: 4px; }
        .project { border-bottom: 1px solid var(--border); }
        .project-head {
          width: 100%; background: none; border: none; color: var(--text); text-align: left;
          display: grid; grid-template-columns: auto 1fr 20px; gap: 16px; align-items: center; padding: 22px 0;
        }
        .project-tag {
          font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--accent);
          border: 1px solid var(--accent-soft); border-radius: 999px; padding: 3px 10px;
        }
        .project-title { font-size: 18px; font-weight: 600; }
        .project-toggle { color: var(--text-faint); transition: transform 0.3s cubic-bezier(.2,.8,.2,1.4); }
        .project-head.is-open .project-toggle { transform: rotate(45deg); color: var(--accent-warm); }
        .project-body {
          max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.4s ease, opacity 0.3s ease;
          display: grid; gap: 16px;
        }
        .project-body[data-open="true"] { max-height: 420px; opacity: 1; padding-bottom: 24px; }
        .project-step-label { font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--accent-warm); display: block; margin-bottom: 4px; }
        .project-step p { margin: 0; color: var(--text-muted); font-size: 15px; max-width: 60ch; }
        .side-photo-frame { margin: 56px auto 0; position: relative; max-width: 560px; }
        .side-photo-frame::before {
          content: ""; position: absolute; inset: -12px -12px auto -12px; height: 72%;
          border: 1.5px solid var(--accent-warm); border-bottom: none; border-radius: 28px 28px 0 0; opacity: 0.4; pointer-events: none;
        }
        .side-photo {
          width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; object-position: center;
          border-radius: 16px; display: block; filter: saturate(1.05) contrast(1.03);
        }

        /* skills */
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 32px; margin-top: 8px; }
        .skill-group { font-size: 14px; color: var(--text-faint); margin: 0 0 6px; }
        .skill-use { margin: 0 0 12px; color: var(--text-muted); font-size: 13px; line-height: 1.45; }
        .skill-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .skill-items li { font-size: 15px; color: var(--text); position: relative; padding-left: 14px; transition: color 0.2s, padding-left 0.2s; }
        .skill-items li::before { content: ""; position: absolute; left: 0; top: 9px; width: 6px; height: 1px; background: var(--accent); transition: width 0.2s, background 0.2s; }
        .skill-items li:hover { color: var(--accent-warm); padding-left: 18px; }
        .skill-items li:hover::before { width: 10px; background: var(--accent-warm); }

        .marquee { margin-top: 56px; overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 18px 0; }
        .marquee-track { display: flex; gap: 40px; white-space: nowrap; width: max-content; animation: scroll-left 26s linear infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        .marquee-track span { font-family: "IBM Plex Mono", monospace; font-size: 13px; color: var(--text-faint); }
        @keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* contact */
        .bozhan-lead { margin-top: 8px; }
        .bozhan-list { list-style: none; margin: 12px 0 0; padding: 0; }
        .bozhan-list li {
          display: grid; grid-template-columns: 28px 1fr auto; gap: 16px; align-items: center;
          padding: 22px 0; border-bottom: 1px solid var(--border);
        }
        .bozhan-check {
          width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--text-faint);
          display: flex; align-items: center; justify-content: center; color: #14121a;
        }
        .bozhan-list li.is-done .bozhan-check {
          background: linear-gradient(120deg, var(--accent), var(--accent-warm));
          border-color: transparent;
        }
        .bozhan-index { margin: 0 0 4px; font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--accent); }
        .bozhan-title { margin: 0; font-size: 20px; font-weight: 600; font-family: "Fraunces", Georgia, serif; }
        .bozhan-note { margin: 6px 0 0; color: var(--text-muted); font-size: 14.5px; }
        .bozhan-download {
          margin-top: 12px; display: inline-flex; align-items: center; gap: 6px;
          color: #fff; font-size: 13px; font-weight: 700; text-decoration: none;
          background: linear-gradient(120deg, var(--accent), var(--accent-warm));
          border-radius: 999px; padding: 8px 14px;
        }
        .bozhan-status { font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--text-faint); }
        .bozhan-list li.is-done .bozhan-status { color: var(--accent-warm); }

        .contact { text-align: left; }
        .contact-links { display: flex; flex-direction: column; gap: 18px; margin-top: 36px; align-items: flex-start; }
        .contact-link { color: var(--text); text-decoration: none; display: inline-flex; align-items: center; gap: 10px; font-size: 17px; border-bottom: 1px solid var(--border); padding-bottom: 4px; transition: color 0.2s ease, border-color 0.2s ease; }
        .contact-link:hover { color: var(--accent-warm); border-color: var(--accent-warm); }

        .footer {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: var(--section-gap) var(--gutter); color: var(--text-faint); font-size: 13px;
          border-top: 1px solid var(--border); position: relative; z-index: 1;
        }

        @media (max-width: 800px) {
          .mg-site { --section-gap: 48px; --gutter: 20px; padding-top: 72px; }
          .nav-inner { display: flex; align-items: center; gap: 12px; padding: 12px var(--gutter); }
          .nav-start { min-width: 0; flex: 1; }
          .nav-badge { flex: none; padding: 6px 12px; }
          .nav-links {
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 16px;
            padding-bottom: 2px;
            scrollbar-width: none;
          }
          .nav-links::-webkit-scrollbar { display: none; }
          .nav-link { white-space: nowrap; font-size: 13px; }
          .hero-grid, .about-grid { grid-template-columns: 1fr; gap: 28px; }
          .hero-visual { width: 100%; max-width: 360px; margin: 0 auto; }
          .arch-frame::before { inset: 8px -8px -8px 8px; }
          .display { font-size: 34px; }
          .hero-sub { font-size: 15.5px; }
          .scroll-cue { margin-top: 20px; }
          .hero, .about { padding-left: 0; padding-right: 0; }
          #think { border-left: none; padding-left: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mg-site * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
