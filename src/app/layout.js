export const metadata = {
  title: "Ascension Architect — Awakening the World one Soul at a time",
  description:
    "Free books, the 13 Moon calendar, the Post-Awakening Integration Toolkit, the Discord sanctuary, and The Codex. Everything in one place.",
  openGraph: {
    title: "Ascension Architect",
    description: "Awakening the World one Soul at a time.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0908" }}>
        {children}
      </body>
    </html>
  );
}
