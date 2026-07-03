import React, { useEffect, useState } from "react";
import GalaxyScene from "../components/GalaxyScene";
import {
  fetchGalaxy,
  loadMemories,
  loadIntro,
} from "../data/galaxyMemories";

export default function GalaxyViewPage() {
  const [memories, setMemories] = useState(() => loadMemories());
  const [intro, setIntro] = useState(() => loadIntro());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchGalaxy().then(({ intro: i, memories: m }) => {
      if (!alive) return;
      setIntro(i);
      setMemories(m);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050208",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      <GalaxyScene memories={memories} intro={intro} />

      {loading && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,227,242,0.4)",
          }}
        >
          Cargando universo...
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
          fontSize: 11,
          letterSpacing: 1.5,
          color: "rgba(255,227,242,0.55)",
          padding: "0 20px",
        }}
      >
        Desliza para mirar alrededor · pellizca para acercar o alejar · toca
        una foto 🩷
      </div>
    </div>
  );
}
