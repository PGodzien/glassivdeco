"use client"

import dynamic from "next/dynamic"

const DepthGallery = dynamic(() => import("./components/DepthGallery"), { ssr: false })

export default function Home() {
  return (
    <main className="bg-black">
      {/* Hero */}
      <section
        className="min-h-screen"
        style={{ background: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)" }}
      />

      {/* Galeria */}
      <section className="bg-black py-24">
        <div className="container mx-auto px-6 lg:px-8">

          {/* Nagłówek */}
          <p
            className="uppercase text-white mb-12"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "64px",
              lineHeight: "58px",
            }}
          >
            Zapraszamy do<br />
            świata szkła
          </p>

          {/* Galeria 3D */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/7", background: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)" }}>
            <DepthGallery />
          </div>

        </div>
      </section>
    </main>
  )
}
