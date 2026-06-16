"use client"

import { useEffect, useRef } from "react"
import { Engine } from "./Engine"

export default function DepthGallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const engine = new Engine(canvas, container)
    engine.init().catch(console.error)

    return () => {
      engine.dispose()
    }
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
        .depth-label-index {
          margin: 0;
          font-size: 9px;
          opacity: 0.6;
        }
        .depth-label-word {
          margin: 0;
          font-size: clamp(9px, 0.78vw, 13px);
          font-weight: 500;
        }
        .depth-label-chip {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.14);
        }
        .depth-label-right {
          position: absolute;
          right: clamp(2.5rem, 7vw, 10rem);
          top: 50%;
        }
        .depth-label-spec {
          margin: 0;
          font-size: clamp(9px, 0.72vw, 11px);
          opacity: 0.7;
        }
      `}</style>
      <div ref={containerRef} className="absolute inset-0 w-full h-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: "none" }}
        />
      </div>
    </>
  )
}
