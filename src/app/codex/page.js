"use client";

import dynamic from "next/dynamic";

// Load the Codex client-side only (it uses browser APIs)
const ArchitectsCodex = dynamic(() => import("../../components/ArchitectsCodex"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0908",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#d4af37",
        fontFamily: "monospace",
        fontSize: "11px",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}
    >
      Aligning with the field
    </div>
  ),
});

export default function CodexPage() {
  return <ArchitectsCodex />;
}
