"use client"

import { useEffect, useRef } from "react"
import { Engine } from "./Engine"

export default function DepthGallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const stickyEl = stickyRef.current
    const scrollerEl = scrollerRef.current
    if (!canvas || !stickyEl || !scrollerEl) return

    const engine = new Engine(canvas, stickyEl, scrollerEl)
    engine.init().catch(console.error)

    return () => engine.dispose()
  }, [])

  return (
    <>
      <style>{`
        .depth-label-overlay {
          position: absolute;
          inset: 0;
          z-index: 80;
          pointer-events: none;
          transition: opacity 260ms ease;
          font-family: 'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 11px;
          line-height: 1.2;
        }
        .depth-label-left {
          position: absolute;
          left: clamp(2.5rem, 8vw, 12rem);
          top: 50%;
          display: grid;
          gap: 0.75rem;
        }
        .depth-label-index { margin: 0; font-size: 9px; opacity: 0.6; }
        .depth-label-word { margin: 0; font-size: clamp(9px, 0.78vw, 13px); font-weight: 500; }
        .depth-label-chip { width: 18px; height: 18px; border-radius: 50%; display: inline-block; box-shadow: 0 0 0 1px rgba(255,255,255,0.14); }
        .depth-label-right { position: absolute; right: clamp(2.5rem, 7vw, 10rem); top: 50%; }
        .depth-label-spec { margin: 0; font-size: clamp(9px, 0.72vw, 11px); opacity: 0.7; }
      `}</style>

      {/* Tall scroller — definiuje ile scrolla potrzeba na animację */}
      <div ref={scrollerRef} style={{ position: "relative" }}>

        {/* Sticky canvas — pełny ekran, zostaje w miejscu podczas scrolla */}
        <div
          ref={stickyRef}
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100svh",
            background: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)",
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Tytuł nad canvasem */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ zIndex: 10, padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 5vw, 4rem)" }}>
            <p
              className="uppercase text-white"
              style={{
                fontFamily: "var(--font-syncopate), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(22px, 3.5vw, 42px)",
                lineHeight: 1.1,
              }}
            >
              Zapraszamy do<br />
              świata szkła
            </p>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none" style={{ zIndex: 90 }}>
            <svg width="18" height="26" viewBox="0 0 18 26" fill="none" style={{ opacity: 0.45 }}>
              <rect x="1" y="1" width="16" height="24" rx="8" stroke="white" strokeWidth="1.2"/>
              <rect x="8" y="5" width="2" height="5" rx="1" fill="white"/>
            </svg>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              scroll
            </span>
          </div>
        </div>

        {/* Extra wysokość = długość animacji galerii */}
        <div style={{ height: "3000px" }} />
      </div>
    </>
  )
}
