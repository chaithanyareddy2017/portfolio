import { useState, useEffect } from "react";
import portfolioData from "./data.json";

/* ----------------------------------------------------------------------
   DATA CONTRACT — read this before pointing an agent at data.json

   data.json shape:
   {
     "skills": [
       { "id": string (unique, slug-like), "title": string,
         "icon": one of ICON_KEYS below, "body": string (1-3 sentences) }
     ],
     "projects": [
       { "id": string (unique), "title": string, "tagline": string,
         "description": string, "stack": string[],
         "github": string (URL or ""), "demo": string (URL or ""),
         "status": one of "open source" | "in progress" | "live demo",
         "media": string (URL/path to .mp4/.webm/.mov or image, or "" for none) }
     ]
   }

   Rules for whatever writes this file (script, agent, you by hand):
   - "icon" MUST be one of: "target", "layers", "code", "network", "database".
     Anything else silently falls back to "code" — it won't crash the page,
     but pick a real one so the icon matches the skill.
   - "status" MUST be one of: "open source", "in progress", "live demo".
     Anything else falls back to "in progress" styling.
   - "media" should point to an actual screen recording or screenshot of
     the project running — not a stock image or generic graphic. Empty
     string renders a quiet "preview coming soon" placeholder instead of
     a broken image icon, so it's always safe to leave blank.
   - "id" values must stay unique within their array (used as React keys).
   - Empty string for github/demo renders "coming soon" — never use a
     placeholder URL like "#", that breaks the link instead of hiding it.
   - This file is imported directly (`import portfolioData from "./data.json"`),
     so on a static host (Vercel/Netlify) editing it requires a rebuild —
     it is NOT fetched at runtime. If you later want zero-redeploy updates,
     swap the import for a fetch() call against an API/database, the
     component code below does not need to change, only how data loads in.
----------------------------------------------------------------------- */

/* ---------------- Icon set (closed list — agent picks from these keys) ---------------- */

const ICONS = {
  target: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  ),
  layers: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  code: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  network: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.2 7.3 10 16M15.8 7.3 14 16M8.5 6h7" />
    </svg>
  ),
  database: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  ),
};

function getIcon(key) {
  return ICONS[key] || ICONS.code;
}

const IconGithub = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);
const IconExternalLink = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ---------------- Skills (Option C, data-driven) ---------------- */

export function Skills() {
  const skills = portfolioData.skills || [];

  if (skills.length === 0) {
    return (
      <section id="skills" className="py-14 px-6" style={{ backgroundColor: "#2D5D7C" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl text-white mb-2">Skills</h2>
          <p className="text-white/70 text-sm">
            No skills added yet — add entries to data.json to populate this section.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-14 px-6" style={{ backgroundColor: "#2D5D7C" }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl text-white text-center mb-2">
          Skills
        </h2>
        <p className="text-center text-white/80 text-sm mb-12">
          What I actually use, and where.
        </p>
        <div
          className="grid gap-10"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
          }}
        >
          {skills.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <div key={s.id} className="text-center">
                <div className="w-16 h-16 rounded-full bg-white text-[#D98E3C] flex items-center justify-center mx-auto mb-4">
                  <Icon />
                </div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-white/85 text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer (data-driven "currently" line + sign-off) ---------------- */

export function Footer() {
  const currently = portfolioData.currently || "";
  return (
    <footer className="relative py-10 px-6 border-t border-white/10 text-center">
      {currently && (
        <p className="text-[#8589A0] text-xs sm:text-sm mb-3 max-w-md mx-auto leading-relaxed">
          <span className="text-[#5B8FD6]">Currently:</span> {currently}
        </p>
      )}
      <p className="font-mono text-[11px] text-[#4A4F5C]">
        © {new Date().getFullYear()} Chaithanya Reddy
      </p>
    </footer>
  );
}

/* ---------------- Project card media (video or image, auto-detected) ---------------- */

function ProjectMedia({ src, alt }) {
  if (!src) {
    // No media yet — quiet placeholder, not a broken image icon
    return (
      <div className="w-full h-44 bg-gradient-to-br from-white/5 to-white/[0.02] border-b border-white/10 flex items-center justify-center">
        <span >
          preview:"./portfolio.mp4",
        </span>
      </div>
    );
  }
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  return isVideo ? (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-44 object-cover border-b border-white/10"
    />
  ) : (
    <img
      src={src}
      alt={alt}
      className="w-full h-44 object-cover border-b border-white/10"
    />
  );
}

function StatusBadge({ status }) {
  const styles = {
    "open source": { text: "open source", color: "#5FD49C" },
    "in progress": { text: "in progress", color: "#D98E3C" },
    "live demo": { text: "live demo", color: "#5B8FD6" },
  };
  const s = styles[status] || styles["in progress"];
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-wide border rounded px-2 py-1 shrink-0"
      style={{ color: s.color, borderColor: `${s.color}55` }}
    >
      {s.text}
    </span>
  );
}

export function Projects() {
  const projects = portfolioData.projects || [];

  return (
    <section id="projects" className="relative py-16 px-5 sm:px-8 bg-[#0A0E14]">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl text-[#EDEDEF] tracking-tight mb-10">
          Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-[#8589A0] text-sm">
            No projects added yet — add entries to data.json to populate this section.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <div
                key={p.id}
                className="border border-white/10 bg-white/[0.03] rounded-lg overflow-hidden hover:border-white/20 transition-colors flex flex-col"
              >
                <ProjectMedia src={p.media} alt={p.title} />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg text-[#EDEDEF] tracking-tight">
                      {p.title}
                    </h3>
                    <StatusBadge status={p.status} />
                  </div>

                  <p
                    className="text-sm mt-1 bg-clip-text text-transparent inline-block"
                    style={{ backgroundImage: "linear-gradient(90deg, #5B8FD6, #A36BD0)" }}
                  >
                    {p.tagline}
                  </p>

                  <p className="text-[#8589A0] text-sm mt-3 leading-relaxed flex-1">
                    {p.description}
                  </p>

                  {p.stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[10px] uppercase tracking-wide text-[#8589A0] border border-white/10 rounded px-1.5 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 mt-5">
                    {p.github ? (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-[#8589A0] hover:text-[#EDEDEF] transition-colors"
                      >
                        <IconGithub /> Code
                      </a>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-mono text-[#4A4F5C]">
                        <IconGithub /> Code soon
                      </span>
                    )}
                    {p.demo ? (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-[#8589A0] hover:text-[#EDEDEF] transition-colors"
                      >
                        <IconExternalLink /> Live demo
                      </a>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-mono text-[#4A4F5C]">
                        <IconExternalLink /> Demo soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}