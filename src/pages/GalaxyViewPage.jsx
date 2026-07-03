import React, { useEffect, useState } from "react";
import GalaxyScene from "../components/GalaxyScene";
import { loadMemories, loadIntro } from "../data/galaxyMemories";

export default function GalaxyViewPage() {
  const [memories, setMemories] = useState([]);
  const [intro, setIntro] = useState("");

  useEffect(() => {
    setMemories(loadMemories());
    setIntro(loadIntro());
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
