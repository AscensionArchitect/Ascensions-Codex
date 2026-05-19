"use client";
import { useState, useEffect } from "react";

// =====================================================
// THE HUB
// Homepage at /. Beacons replacement.
// Links to /codex (the sanctuary) and external products.
// =====================================================

const PRODUCTS = [
  {
    id: 1,
    title: "If Things Feel Different and You Can't Explain Why",
    description:
      "A short, grounded guide for people whose inner world shifted quietly and nothing replaced it yet.",
    url: "https://ascensionarchitect.gumroad.com/l/nootx",
    format: "PDF",
    label: "Start here",
  },
  {
    id: 2,
    title: "Awareness: The Architecture Of Reality",
    description: "The book that wrote itself after I died.",
    url: "https://ascensionarchitect.gumroad.com/l/xssyqq",
    format: "Book · PDF",
    label: "The book",
  },
  {
    id: 3,
    title: "The Post-Awakening Integration Toolkit",
    description:
      "A complete 7-pillar system for navigating the aftershocks of awakening, integrating your new identity, and embodying the shift.",
    url: "https://ascensionarchitect.gumroad.com/l/fblhz",
    format: "PDF",
    label: "The toolkit",
  },
  {
    id: 4,
    title: "The Doorways",
    description:
      "A practitioner's guide to out-of-body experience, astral travel, remote viewing, and the Focus States. The real map — not the seven-days-to-astral-flight version. Built on Monroe's framework, written from the practitioner side.",
    url: "https://ascensionarchitect.gumroad.com/l/bnyqo",
    format: "PDF · Practitioner's guide",
    label: "The doorways",
  },
  {
    id: 5,
    title: "13 Moon Calendar & Synchronicity Tracker 2026–2027",
    description:
      "221-page premium PDF system for living in natural time. Complete 13 Moon Calendar (2026–2027).",
    url: "https://ascensionarchitect.gumroad.com/l/xiuhbg",
    format: "PDF · 221 pages",
    label: "The calendar",
  },
  {
    id: 6,
    title: "The 13:20 Activation Guide",
    description:
      "The 7-day protocol I used to shift from chaos to synchronicity after my 2019 near-death experience.",
    url: "https://ascensionarchitect.gumroad.com/l/qkzksa",
    format: "PDF · 7-day protocol",
    label: "The protocol",
  },
  {
    id: 7,
    title: "God Talks, You Forgot How To Listen — The 7 Languages of Divine Communication",
    description:
      "A 13-page guide teaching you to recognize the seven languages God uses to communicate every day — through synchronicities, intuition, dreams, people, nature, body sensations, and divine downloads. Stop navigating life blind. Start hearing the conversation that never stopped.",
    url: "https://ascensionarchitect.gumroad.com/l/zdbrm",
    format: "PDF · 13 pages",
    label: "The languages",
  },
];

const SOCIALS = [
  {
    name: "Instagram",
    handle: "@ascension_architect",
    url: "https://www.instagram.com/ascension_architect",
    icon: "IG",
  },
  {
    name: "TikTok",
    handle: "@the.ascension.arc",
    url: "https://www.tiktok.com/@the.ascension.arc",
    icon: "TT",
  },
  {
    name: "YouTube",
    handle: "@theascensionarchitect",
    url: "https://youtube.com/@theascensionarchitect",
    icon: "YT",
  },
  {
    name: "Facebook",
    handle: "Ascension Architect",
    url: "https://www.facebook.com/profile.php?id=61581511754283",
    icon: "FB",
  },
];

const DISCORD_INVITE = "5qZf8V8ms";
const DISCORD_URL = `https://discord.gg/${DISCORD_INVITE}`;
const BMC_URL = "https://buymeacoffee.com/contactascw";
const CONTACT_EMAIL = "Contact.ascensionarchitect@gmail.com";

// =====================================================
// SUB-COMPONENTS
// =====================================================

function Starfield() {
  const [stars] = useState(() =>
    Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.4 + 0.3,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 5,
    }))
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#d4af37",
            boxShadow: `0 0 ${s.size * 3}px #d4af37`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

function Mandala({ size = 280 }) {
  const [breath, setBreath] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreath((b) => (b + 0.01) % (Math.PI * 2));
      setRotation((r) => (r + 0.04) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const scale = 1 + Math.sin(breath) * 0.025;
  const opacity = 0.55 + Math.sin(breath) * 0.18;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.15;

  const positions = [{ x: cx, y: cy }];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    positions.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  }
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + Math.PI / 6;
    positions.push({
      x: cx + Math.cos(angle) * radius * 1.732,
      y: cy + Math.sin(angle) * radius * 1.732,
    });
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        transform: `scale(${scale})`,
        transition: "transform 0.05s linear",
      }}
    >
      <defs>
        <radialGradient id="hubGoldGrad">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        <filter id="hubGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.45}
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.3"
          opacity={opacity * 0.2}
          strokeDasharray="2 8"
        />
      </g>

      <circle
        cx={cx}
        cy={cy}
        r={size * 0.42}
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.5"
        opacity={opacity * 0.4}
      />

      <polygon
        points={Array.from({ length: 12 }, (_, i) => {
          const angle = (i * Math.PI) / 6 - Math.PI / 2;
          const r = size * 0.38;
          return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
        }).join(" ")}
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.5"
        opacity={opacity * 0.5}
      />

      {positions.map((pos, i) => (
        <circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r={radius}
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.7"
          opacity={opacity * (0.5 + Math.sin(breath + i * 0.5) * 0.2)}
          filter="url(#hubGlow)"
        />
      ))}

      <g transform={`rotate(${rotation * 0.3} ${cx} ${cy})`}>
        <polygon
          points={Array.from({ length: 26 }, (_, i) => {
            const angle = (i * Math.PI) / 13 - Math.PI / 2;
            const r = i % 2 === 0 ? size * 0.16 : size * 0.08;
            return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
          }).join(" ")}
          fill="url(#hubGoldGrad)"
          stroke="#d4af37"
          strokeWidth="0.5"
          opacity={opacity}
        />
      </g>

      <circle
        cx={cx}
        cy={cy}
        r="3"
        fill="#d4af37"
        opacity={opacity}
        filter="url(#hubGlow)"
      />
    </svg>
  );
}

function RevealText({ text, delay = 0, charDelay = 30 }) {
  return (
    <span>
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: 0,
            animation: `letterReveal 0.8s ${
              delay + i * charDelay
            }ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// =====================================================
// MAIN HUB
// =====================================================

export default function Hub() {
  const [discordOnline, setDiscordOnline] = useState(null);

  useEffect(() => {
    const fetchDiscord = async () => {
      try {
        const res = await fetch(
          `https://discord.com/api/guilds/widget.json?invite=${DISCORD_INVITE}`,
          { signal: AbortSignal.timeout(3000) }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.presence_count !== undefined) {
            setDiscordOnline(data.presence_count);
          }
        }
      } catch (e) {
        // Silent fallback
      }
    };

    fetchDiscord();
    const interval = setInterval(fetchDiscord, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>
      <Starfield />
      <div style={styles.bgGradient} />
      <div style={styles.bgNoise} />

      <main style={styles.main}>
        {/* HERO */}
        <section style={styles.hero}>
          <div style={styles.heroMandalaWrap}>
            <Mandala size={320} />
          </div>

          <div style={styles.heroContent}>
            <div style={styles.brandMark}>✦</div>

            <div style={styles.heroEyebrow}>
              <RevealText
                text="ASCENSION ARCHITECT"
                delay={400}
                charDelay={40}
              />
            </div>

            <h1 style={styles.heroTitle}>
              <RevealText
                text="Awakening the World"
                delay={1200}
                charDelay={45}
              />
              <br />
              <span style={styles.heroTitleAccent}>
                <RevealText
                  text="one Soul at a time."
                  delay={2200}
                  charDelay={45}
                />
              </span>
            </h1>

            <p style={styles.heroBio}>
              In 2019 I died. When I came back I wasn't the same. Now I spend
              my time teaching, serving, learning, healing — helping who I
              can, when I can.
              <span style={styles.heroBioHeart}> ❤️</span>
            </p>

            <a href="/codex" style={styles.heroCTA} className="primaryCTA">
              <span style={styles.heroCTAText}>Enter The Codex</span>
              <span style={styles.heroCTAArrow}>→</span>
            </a>
            <div style={styles.heroCTASubtitle}>
              The full experience · sanctuary, calendar, tracker, and more
            </div>
          </div>
        </section>

        {/* DISCORD / SANCTUARY */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>THE LIVING COMMUNITY</div>
            <h2 style={styles.sectionTitle}>The Sanctuary</h2>
          </div>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.discordCard}
            className="discordCardBtn"
          >
            <div style={styles.discordCardLeft}>
              <div style={styles.discordIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#d4af37">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <div>
                <div style={styles.discordTitle}>The Architects Sanctuary</div>
                <div style={styles.discordSubtitle}>
                  Voice rooms · daily reflections · live community
                </div>
              </div>
            </div>

            <div style={styles.discordStats}>
              <div style={styles.discordStat}>
                <div style={styles.discordStatVal}>
                  Growing
                </div>
                <div style={styles.discordStatLabel}>Daily</div>
              </div>
              {discordOnline !== null && (
                <>
                  <div style={styles.discordStatDivider} />
                  <div style={styles.discordStat}>
                    <div style={styles.discordStatLive}>
                      <span style={styles.livePulse} />
                      {discordOnline}
                    </div>
                    <div style={styles.discordStatLabel}>Online</div>
                  </div>
                </>
              )}
            </div>
          </a>
        </section>

        {/* PRODUCTS */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>THE OFFERINGS</div>
            <h2 style={styles.sectionTitle}>Free for all who walk the path</h2>
            <p style={styles.sectionSubtitle}>
              Pay what you feel called to. Or take freely.
            </p>
          </div>

          <div style={styles.productList}>
            {PRODUCTS.map((product, i) => (
              <a
                key={product.id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.productCard,
                  animationDelay: `${i * 80}ms`,
                }}
                className="productCardBtn"
              >
                <div style={styles.productCardInner} className="productCardInner">
                  <div style={styles.productNum} className="productNum">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={styles.productContent}>
                    <div style={styles.productLabelRow}>
                      <span style={styles.productLabel}>{product.label}</span>
                      <span style={styles.productFormat}>{product.format}</span>
                    </div>
                    <h3 style={styles.productTitle}>{product.title}</h3>
                    <p style={styles.productDesc}>{product.description}</p>
                  </div>
                  <div style={styles.productArrow} className="productArrow">→</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* SOCIALS */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>WHERE TO FIND ME</div>
            <h2 style={styles.sectionTitle}>The signal</h2>
          </div>

          <div style={styles.socialGrid}>
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialCard}
                className="socialCardBtn"
              >
                <div style={styles.socialIcon}>{social.icon}</div>
                <div style={styles.socialName}>{social.name}</div>
                <div style={styles.socialHandle}>{social.handle}</div>
              </a>
            ))}
          </div>
        </section>

        {/* SUPPORT */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>IF IT MOVES YOU</div>
            <h2 style={styles.sectionTitle}>Support the work</h2>
            <p style={styles.sectionSubtitle}>
              Everything I make is free. Tips fuel what comes next.
            </p>
          </div>

          <a
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.supportBtn}
            className="supportBtnHover"
          >
            <span style={styles.supportEmoji}>☕</span>
            <span>Buy me a coffee</span>
          </a>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div style={styles.footerOrnament}>✦</div>
          <a href={`mailto:${CONTACT_EMAIL}`} style={styles.footerEmail}>
            {CONTACT_EMAIL}
          </a>
          <div style={styles.footerCopyright}>
            © {new Date().getFullYear()} Ascension Architect · All rights
            reserved
          </div>
        </footer>
      </main>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0908;
    color: #e8e1d6;
    font-family: 'Cormorant Garamond', serif;
    overflow-x: hidden;
  }

  ::selection { background: #d4af37; color: #0a0908; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes letterReveal {
    from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(4px); }
    to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
  @keyframes breathePulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
  @keyframes livePulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.6; }
  }

  .primaryCTA {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    text-decoration: none;
  }
  .primaryCTA:hover {
    background: #d4af37 !important;
    color: #0a0908 !important;
    transform: translateY(-2px);
    box-shadow: 0 16px 40px -12px rgba(212, 175, 55, 0.4);
    letter-spacing: 0.4em !important;
  }
  .primaryCTA:hover span:last-child {
    transform: translateX(8px);
  }

  .productCardBtn {
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    display: block;
  }
  .productCardBtn:hover {
    border-color: rgba(212, 175, 55, 0.5) !important;
    background: rgba(212, 175, 55, 0.04) !important;
    transform: translateY(-2px);
    box-shadow: 0 12px 32px -16px rgba(212, 175, 55, 0.3);
  }
  .productCardBtn:hover .productArrow { transform: translateX(8px); }

  .socialCardBtn {
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .socialCardBtn:hover {
    border-color: rgba(212, 175, 55, 0.5) !important;
    background: rgba(212, 175, 55, 0.06) !important;
    transform: translateY(-2px);
  }

  .discordCardBtn {
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .discordCardBtn:hover {
    border-color: rgba(212, 175, 55, 0.5) !important;
    background: rgba(212, 175, 55, 0.06) !important;
    transform: translateY(-2px);
    box-shadow: 0 16px 40px -16px rgba(212, 175, 55, 0.3);
  }

  .supportBtnHover {
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .supportBtnHover:hover {
    background: rgba(212, 175, 55, 0.1) !important;
    border-color: #d4af37 !important;
    transform: translateY(-2px);
    letter-spacing: 0.35em !important;
  }

  a[href^="mailto:"]:hover { color: #d4af37 !important; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.4); }

  @media (max-width: 700px) {
    .productCardInner {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 16px !important;
    }
    .productArrow {
      align-self: flex-end;
      margin-top: -32px;
    }
  }
`;

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0a0908",
    color: "#e8e1d6",
    fontFamily: "'Cormorant Garamond', serif",
    position: "relative",
    overflow: "hidden",
  },
  bgNoise: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3CfeColorMatrix values='0 0 0 0 0.83 0 0 0 0 0.69 0 0 0 0 0.22 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    opacity: 0.2,
    mixBlendMode: "overlay",
    zIndex: 0,
  },
  bgGradient: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(ellipse at top, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(212, 175, 55, 0.025) 0%, transparent 50%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: 760,
    margin: "0 auto",
    padding: "60px 24px 40px",
  },

  hero: {
    position: "relative",
    paddingTop: 40,
    paddingBottom: 80,
    textAlign: "center",
  },
  heroMandalaWrap: {
    position: "absolute",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    opacity: 0.5,
    zIndex: 0,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
  },
  brandMark: {
    fontSize: 28,
    color: "#d4af37",
    marginBottom: 28,
    animation: "fadeIn 1s ease-out",
    textShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
  },
  heroEyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.5em",
    color: "#d4af37",
    marginBottom: 32,
    fontWeight: 400,
  },
  heroTitle: {
    fontSize: "clamp(36px, 7vw, 64px)",
    fontWeight: 300,
    fontStyle: "italic",
    lineHeight: 1.1,
    color: "#f5e9c8",
    marginBottom: 32,
    letterSpacing: "-0.01em",
  },
  heroTitleAccent: {
    color: "#d4af37",
  },
  heroBio: {
    fontSize: 17,
    lineHeight: 1.7,
    color: "#c9c0b3",
    maxWidth: 480,
    margin: "0 auto 48px",
    fontStyle: "italic",
    animation: "fadeIn 1.5s ease-out 3.5s both",
  },
  heroBioHeart: {
    fontStyle: "normal",
  },
  heroCTA: {
    display: "inline-flex",
    alignItems: "center",
    gap: 16,
    background: "transparent",
    color: "#d4af37",
    border: "1px solid #d4af37",
    padding: "18px 40px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    fontWeight: 500,
    cursor: "pointer",
    animation: "fadeInUp 1s ease-out 4s both",
  },
  heroCTAText: {
    transition: "all 0.4s ease",
  },
  heroCTAArrow: {
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    fontSize: 14,
  },
  heroCTASubtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.25em",
    color: "#7a736a",
    marginTop: 16,
    textTransform: "uppercase",
    animation: "fadeIn 1s ease-out 4.5s both",
  },

  section: {
    marginBottom: 80,
    animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: 40,
  },
  sectionEyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.4em",
    color: "#d4af37",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#f5e9c8",
    marginBottom: 12,
    letterSpacing: "-0.005em",
  },
  sectionSubtitle: {
    fontSize: 15,
    color: "#a89e8e",
    fontStyle: "italic",
    maxWidth: 440,
    margin: "0 auto",
    lineHeight: 1.6,
  },

  discordCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    background: "rgba(10, 9, 8, 0.5)",
    border: "1px solid rgba(212, 175, 55, 0.2)",
    padding: "28px 32px",
    color: "inherit",
    flexWrap: "wrap",
  },
  discordCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    flex: 1,
    minWidth: 240,
  },
  discordIcon: {
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    borderRadius: 4,
    flexShrink: 0,
  },
  discordTitle: {
    fontSize: 22,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#f5e9c8",
    marginBottom: 4,
    lineHeight: 1.2,
  },
  discordSubtitle: {
    fontSize: 13,
    color: "#a89e8e",
    fontStyle: "italic",
    lineHeight: 1.4,
  },
  discordStats: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  discordStat: {
    textAlign: "center",
  },
  discordStatVal: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#d4af37",
    lineHeight: 1,
  },
  discordStatLive: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#d4af37",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4ade80",
    boxShadow: "0 0 12px #4ade80",
    animation: "livePulse 2s ease-in-out infinite",
  },
  discordStatLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.3em",
    color: "#7a736a",
    marginTop: 6,
    textTransform: "uppercase",
  },
  discordStatDivider: {
    width: 1,
    height: 32,
    background: "rgba(212, 175, 55, 0.2)",
  },

  productList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  productCard: {
    display: "block",
    background: "rgba(10, 9, 8, 0.5)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    color: "inherit",
  },
  productCardInner: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "24px 28px",
  },
  productNum: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    letterSpacing: "0.2em",
    color: "#d4af37",
    flexShrink: 0,
    width: 28,
  },
  productContent: {
    flex: 1,
    minWidth: 0,
  },
  productLabelRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  productLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.3em",
    color: "#d4af37",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    padding: "3px 10px",
    textTransform: "uppercase",
  },
  productFormat: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#7a736a",
    textTransform: "uppercase",
  },
  productTitle: {
    fontSize: 19,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#f5e9c8",
    lineHeight: 1.3,
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 14,
    color: "#a89e8e",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  productArrow: {
    fontSize: 24,
    color: "#d4af37",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    flexShrink: 0,
    fontWeight: 300,
  },

  socialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  },
  socialCard: {
    background: "rgba(10, 9, 8, 0.5)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    padding: "20px 16px",
    textAlign: "center",
    color: "inherit",
  },
  socialIcon: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 16,
    letterSpacing: "0.15em",
    color: "#d4af37",
    marginBottom: 12,
    fontWeight: 500,
  },
  socialName: {
    fontSize: 15,
    color: "#f5e9c8",
    fontStyle: "italic",
    marginBottom: 4,
  },
  socialHandle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "#7a736a",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  supportBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    background: "transparent",
    color: "#d4af37",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    padding: "18px 32px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    fontWeight: 400,
    maxWidth: 320,
    margin: "0 auto",
  },
  supportEmoji: {
    fontSize: 16,
  },

  footer: {
    textAlign: "center",
    padding: "60px 20px 40px",
    borderTop: "1px solid rgba(212, 175, 55, 0.1)",
    marginTop: 40,
  },
  footerOrnament: {
    fontSize: 18,
    color: "rgba(212, 175, 55, 0.4)",
    marginBottom: 24,
  },
  footerEmail: {
    display: "inline-block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.05em",
    color: "#a89e8e",
    textDecoration: "none",
    marginBottom: 16,
    transition: "color 0.3s ease",
    textTransform: "lowercase",
  },
  footerCopyright: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.3em",
    color: "#5a544c",
    textTransform: "uppercase",
  },
};
