"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: "#5046E5" }}>Something went wrong</div>
        <p style={{ color: "#76746E", marginTop: 8 }}>An unexpected error occurred.</p>
        <button
          onClick={reset}
          style={{
            marginTop: 20,
            height: 40,
            padding: "0 18px",
            border: "none",
            borderRadius: 9,
            background: "#5046E5",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
