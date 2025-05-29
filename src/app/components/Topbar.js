import React from "react";

export default function Topbar({ titulo }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        background: "#0B8ADD",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(11, 138, 221, 0.08)",
        minHeight: "36px",
      }}
    >
      <h1
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          fontSize: "2rem",
          fontWeight: "bold",
          margin: 0,
          pointerEvents: "none",
        }}
      >
        {titulo}
      </h1>
    </header>
  );
}