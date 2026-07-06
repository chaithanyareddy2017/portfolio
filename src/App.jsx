import { useState, useEffect, useRef } from "react";
import { Skills, Projects, Footer } from "./DataSections";

/* ---------------- Inline icons (no external icon package needed) ---------------- */

const IconGithub = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const IconLinkedin = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
  </svg>
);

const IconMail = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const IconExternalLink = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconSend = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconCheck = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ---------------- Data ---------------- */

/* SKILLS and PROJECTS now live in data.json — see DataSections.jsx for the
   components that read them, imported below as Skills / Projects. */

/* ---------------- Full-page depth-map gradient mesh (signature element) ---------------- */

function DepthMesh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let raf;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const far = [22, 38, 64];
    const mid = [98, 50, 130];
    const near = [196, 88, 50];

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const t = prefersReducedMotion ? 0 : frame * 0.0018;

      // base near-black wash so text stays readable everywhere
      ctx.fillStyle = "#08090D";
      ctx.fillRect(0, 0, w, h);

      // three slow-drifting radial blobs, like a depth/heatmap field
      // kept dim and low-opacity on purpose: this sits BEHIND body text
      const blobs = [
        { c: near, x: 0.2 + 0.1 * Math.sin(t * 0.8), y: 0.15 + 0.08 * Math.cos(t * 0.6), r: 0.5 },
        { c: mid, x: 0.75 + 0.08 * Math.cos(t * 0.5), y: 0.5 + 0.1 * Math.sin(t * 0.7), r: 0.55 },
        { c: far, x: 0.4 + 0.12 * Math.sin(t * 0.4), y: 0.85 + 0.06 * Math.cos(t * 0.9), r: 0.55 },
      ];

      blobs.forEach((b) => {
        const grad = ctx.createRadialGradient(
          w * b.x,
          h * b.y,
          0,
          w * b.x,
          h * b.y,
          Math.max(w, h) * b.r
        );
        grad.addColorStop(0, `rgba(${b.c.join(",")},0.16)`);
        grad.addColorStop(1, `rgba(${b.c.join(",")},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // dark scrim on top guarantees text contrast regardless of blob position
      ctx.fillStyle = "rgba(5,6,9,0.45)";
      ctx.fillRect(0, 0, w, h);

      frame++;
      if (!prefersReducedMotion) raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
}

/* ---------------- Scroll reveal wrapper ---------------- */

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- Letter-by-letter hero reveal ---------------- */

function LetterReveal({ text, className = "", delayStart = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-letterIn"
          style={{
            animationDelay: `${delayStart + i * 0.035}s`,
            animationFillMode: "forwards",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ---------------- Sections ---------------- */

function Nav() {
  const links = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#collaborate", label: "Contact" },
  ];
  return (
    <nav className="fixed top-0 inset-x-0 z-30 backdrop-blur-md bg-[#0A0E14]/80 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a
          href="#about"
          className="font-display text-lg sm:text-xl text-[#EDEDEF] tracking-tight"
        >
          Chaithanya Reddy
        </a>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#8589A0] hover:text-[#EDEDEF] transition-colors hidden sm:inline"
            >
              {l.label}
            </a>
          ))}
          {/* RESUME: replace href with your uploaded PDF path once provided */}
          <a
            href="/chaithanyareddy-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-4 py-1.5 rounded-md text-[#0A0E14] transition-transform hover:-translate-y-0.5"
            style={{ backgroundImage: "linear-gradient(90deg, #5B8FD6, #A36BD0, #E8693C)" }}
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}

function SocialCircle({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8589A0] hover:text-[#EDEDEF] hover:border-white/30 transition-colors"
    >
      {children}
    </a>
  );
}

function Hero() {
  return (
    <section
      id="about"
      className="relative flex items-center px-5 sm:px-8 pt-28 pb-16"
    >
      <div className="max-w-4xl mx-auto w-full">
        <p
          className="font-mono text-xs text-[#8589A0] mb-6 tracking-wide opacity-0 animate-fadeIn"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          Machine learning Engineer
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-10 items-start">
          {/* Photo column */}
          <div className="flex flex-col items-center sm:items-start opacity-0 animate-fadeIn" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            {/* PHOTO PLACEHOLDER: swap this div for an <img src="/your-photo.jpg" className="w-44 h-44 rounded-full object-cover border border-white/10" />
                once you upload your photo */}
            <img
              src="/photo.jpg"
              alt="Chaithanya Reddy"
              className="w-44 h-44 rounded-full object-cover border border-white/10"
            />
            <div className="flex gap-3 mt-5">
              <SocialCircle href="https://github.com/chaithanyareddy2017" label="GitHub">
                <IconGithub size={18} />
              </SocialCircle>
              {/* LINKEDIN: replace href with your real profile URL */}
              <SocialCircle href="https://www.linkedin.com/in/chaithanyareddy2017" label="LinkedIn">
                <IconLinkedin size={18} />
              </SocialCircle>
              <SocialCircle href="mailto:chaithanya@example.com" label="Email">
                <IconMail size={18} />
              </SocialCircle>
            </div>
          </div>

          {/* Bio column */}
          <div>
            <h1
              className="font-display text-4xl sm:text-5xl text-[#EDEDEF] tracking-tight leading-[1.05] opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              Chaithanya Reddy
            </h1>
            <p
              className="font-display text-lg sm:text-xl mt-2 bg-clip-text text-transparent inline-block opacity-0 animate-fadeIn"
              style={{
                backgroundImage: "linear-gradient(90deg, #5B8FD6 0%, #A36BD0 50%, #E8693C 100%)",
                animationDelay: "0.4s",
                animationFillMode: "forwards",
              }}
            >
              ML Engineer — B.Tech CSE (AI &amp; ML) Student
            </p>
            <p
              className="text-[#8589A0] text-sm sm:text-base mt-5 leading-relaxed opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
            
             I build ML systems that ship, not ones that stay in a notebook. AI Interview Auditor — Whisper transcription, Llama 3.3 70B rubric scoring, RAG-grounded feedback — is live on Hugging Face Spaces and validated across a 20-student pilot. RoomGen AI segments and inpaints individual furniture pieces with SAM 2 and Flux.1-dev, rather than regenerating an entire room from scratch.
              Third-year CS (AI & ML) student at St. Mary's Engineering College, CGPA 8.1, building toward an ML engineering role and an MS abroad. I'd rather be measured by what's deployed than what's claimed.
            </p>
            <p
              className="text-[#8589A0] text-sm sm:text-base mt-3 leading-relaxed opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.75s", animationFillMode: "forwards" }}
            >
              B.Tech, Computer Science — AI &amp; ML, St. Mary's Engineering
              College (JNTUH). CGPA 8.1.
            </p>


            <div
              className="flex gap-4 mt-8 opacity-0 animate-fadeIn"
              style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}
            >
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-md text-sm font-medium text-[#0A0E14] transition-transform hover:-translate-y-0.5"
                style={{ backgroundImage: "linear-gradient(90deg, #5B8FD6, #A36BD0, #E8693C)" }}
              >
                View projects
              </a>
              <a
                href="#collaborate"
                className="px-5 py-2.5 rounded-md text-sm font-medium text-[#EDEDEF] border border-white/15 hover:border-white/40 transition-colors"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Skills and Projects components now imported from ./DataSections —
   they read from data.json so you (or an agent) can update content
   without touching this file. */

function Collaborate() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.message.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const subject = encodeURIComponent(`Collaboration: ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:chaithanya@example.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="collaborate" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <h2 className="font-display text-3xl text-[#EDEDEF] tracking-tight mb-3">
            Collaborate
          </h2>
          <p className="text-[#8589A0] text-sm mb-8 max-w-md">
            Working on something in ML, generative systems, or developer
            tooling? Send a message and I'll get back to you.
          </p>
        </Reveal>

        <Reveal>
          <div
            className="rounded-lg p-[1px]"
            style={{ backgroundImage: "linear-gradient(135deg, #5B8FD6, #A36BD0, #E8693C)" }}
          >
            <div className="bg-[#0A0E14]/90 backdrop-blur-md rounded-lg p-6 sm:p-8">
              {sent ? (
                <div className="flex items-center gap-3 text-[#EDEDEF] py-6">
                  <IconCheck size={20} className="text-[#A36BD0]" />
                  <p className="text-sm">
                    Your mail client should be open with the message ready to send.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#8589A0] mb-1.5">name</label>
                      <input
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-[#EDEDEF] text-sm focus:outline-none focus:border-[#A36BD0]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#8589A0] mb-1.5">email</label>
                      <input
                        value={form.email}
                        onChange={set("email")}
                        placeholder="you@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-[#EDEDEF] text-sm focus:outline-none focus:border-[#A36BD0]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#8589A0] mb-1.5">message</label>
                    <textarea
                      value={form.message}
                      onChange={set("message")}
                      placeholder="What do you want to build together?"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-[#EDEDEF] text-sm focus:outline-none focus:border-[#A36BD0] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!valid}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-[#0A0E14] transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{ backgroundImage: "linear-gradient(90deg, #5B8FD6, #A36BD0, #E8693C)" }}
                  >
                    <IconSend size={15} />
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal className="flex gap-5 mt-10">
          <a href="https://github.com/chaithu2007" target="_blank" rel="noopener noreferrer" className="text-[#8589A0] hover:text-[#EDEDEF] transition-colors" aria-label="GitHub">
            <IconGithub size={18} />
          </a>
          <a href="#" className="text-[#8589A0] hover:text-[#EDEDEF] transition-colors" aria-label="LinkedIn">
            <IconLinkedin size={18} />
          </a>
          <a href="mailto:chaithanya@example.com" className="text-[#8589A0] hover:text-[#EDEDEF] transition-colors" aria-label="Email">
            <IconMail size={18} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

export default function PersonalSite() {
  return (
    <div className="relative bg-[#0A0E14] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        body { font-family: 'Inter', sans-serif; }

        @keyframes letterIn {
          from { opacity: 0; transform: translateY(0.4em); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-letterIn { animation: letterIn 0.5s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }

        a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid #A36BD0;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-letterIn, .animate-fadeIn { animation: none; opacity: 1; }
        }
      `}</style>
      <DepthMesh />
      <Nav />
      <Hero />
      <Skills />
      <Projects />
      <Collaborate />
      <Footer />
    </div>
  );
}
