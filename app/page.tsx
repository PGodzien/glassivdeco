"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useState } from "react"

const DepthGallery = dynamic(() => import("./components/DepthGallery"), { ssr: false })
const Prism = dynamic(() => import("./components/Prism"), { ssr: false })

const NAV_LINKS = ["Oferta", "Technologie", "Realizacje", "Kontakt"]

const ARROW_BLACK = (
  <svg className="mr-3" width="16" height="9" viewBox="0 0 16 9" fill="none">
    <path d="M12.01 3.16553H0V5.24886H12.01V8.37386L16 4.20719L12.01 0.0405273V3.16553Z" fill="black" />
  </svg>
)

const ARROW_YELLOW = (
  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
    <path d="M12.01 3.48047H0V5.57278H12.01V8.71124L16 4.52663L12.01 0.34201V3.48047Z" fill="#3B82F6" />
  </svg>
)

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <main className="bg-black">

      {/* ─── HERO SECTION ─── */}
      <section className="bg-black overflow-hidden relative">

        {/* Prism — pełne tło sekcji, pod nawem i hero */}
        <div className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: "screen", zIndex: 1 }}>
          <Prism
            animationType="rotate"
            timeScale={0.15}
            height={3.5}
            baseWidth={5.5}
            scale={5}
            hueShift={0}
            colorFrequency={0.6}
            noise={0}
            glow={0.4}
          />
        </div>

        {/* NAV */}
        <nav
          className="relative z-10 flex px-16 justify-between border-b border-white/10"
          style={{
            fontFamily: "var(--font-unbounded), sans-serif",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* Logo */}
          <div className="pr-14 py-8 lg:border-r border-white/20">
            <a className="inline-block text-xl text-white font-medium font-heading" href="#">
              Glassiv Deco
            </a>
          </div>

          {/* Hamburger mobile */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden self-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect y="6" width="24" height="2" fill="white" />
              <rect y="11" width="24" height="2" fill="white" />
              <rect y="16" width="24" height="2" fill="white" />
            </svg>
          </button>

          {/* Links centered */}
          <div className="hidden lg:block py-8 lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-y-1/2 lg:-translate-x-1/2">
            <ul className="flex justify-center">
              {NAV_LINKS.map((item, i) => (
                <li key={item} className={i < NAV_LINKS.length - 1 ? "mr-12" : ""}>
                  <a className="text-white/70 hover:text-white transition-colors" href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center pl-16 py-8 border-l border-white/20">
            <div className="flex items-center">
              <a className="inline-block text-sm text-white hover:underline font-heading" href="#">Kontakt</a>
            </div>
          </div>
        </nav>

        {/* HERO BODY */}
        <div className="container mx-auto px-4">
          <div className="relative pt-20 pb-56 md:pb-96">


            {/* Bottle — behind Prism */}
            <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ zIndex: 0 }}>
              <div className="relative bottle-float" style={{ width: "80%", height: "100%" }}>
                <Image src="/bottle.png" alt="" fill className="object-contain object-center" style={{ transform: "scale(1.8)", transformOrigin: "center center" }} priority />
              </div>
              {/* Shadow */}
              <div
                className="bottle-shadow"
                style={{
                  position: "absolute",
                  bottom: "32px",
                  left: "50%",
                  width: "38%",
                  height: "24px",
                  background: "radial-gradient(ellipse at center, rgba(100,160,255,0.5) 0%, transparent 70%)",
                  filter: "blur(10px)",
                  transformOrigin: "center",
                }}
              />
            </div>

            {/* Text content */}
            <div className="relative max-w-6xl mx-auto lg:mt-20" style={{ zIndex: 2 }}>
              <span className="block mb-4 md:absolute top-0 right-0 lg:text-lg font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-archivo), sans-serif", color: "#1313ba" }}>
                Technologia szkła
              </span>
              <h2 className="mb-6 md:mb-0 text-2xl sm:text-5xl md:text-6xl text-white uppercase font-heading font-bold">
                <span>Zdobnictwo</span>
                <span className="block">szklanych opakowań</span>
                <span className="block text-right">na poziomie</span>
              </h2>
              <a
                className="inline-flex items-center py-5 px-10 rounded-full transition-all duration-300"
                href="#"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "0 4px 32px rgba(59,130,246,0.18)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                <svg className="mr-3" width="18" height="10" viewBox="0 0 16 9" fill="none">
                  <path d="M12.01 3.16553H0V5.24886H12.01V8.37386L16 4.20719L12.01 0.0405273V3.16553Z" fill="white" />
                </svg>
                <span className="text-base uppercase font-heading text-white tracking-widest">Zobacz ofertę</span>
              </a>
            </div>

          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="fixed top-0 left-0 bottom-0 w-5/6 max-w-sm z-50">
            <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-gray-800 opacity-25" />
            <nav className="relative flex flex-col py-8 px-10 w-full h-full bg-black border-r overflow-y-auto">
              <a className="inline-block text-xl text-white font-medium font-heading mb-16 md:mb-32" href="#">
                Glassiv Deco
              </a>
              <ul className="mb-32">
                {NAV_LINKS.map((item) => (
                  <li key={item} className="mb-10">
                    <a className="flex items-center" href="#">
                      <span className="mr-3 text-lg text-white">{item}</span>
                      {ARROW_YELLOW}
                    </a>
                  </li>
                ))}
              </ul>
              <a className="flex mb-8 items-center justify-center py-4 px-6 rounded-full bg-blue-500 hover:bg-blue-600 transform duration-200" href="#">
                {ARROW_BLACK}
                <span className="text-sm font-medium uppercase tracking-wider">Zapytaj</span>
              </a>
              <a className="flex mb-10 items-center text-white hover:underline" href="#">
                <span className="mr-2 text-sm">Zaloguj</span>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path d="M12.01 3.95383H0V6.04614H12.01V9.1846L16 4.99998L12.01 0.815369V3.95383Z" fill="#3B82F6" />
                </svg>
              </a>
              <p className="text-sm text-gray-500">Wszelkie prawa zastrzeżone © Glassiv Deco 2026</p>
            </nav>
          </div>
        )}

      </section>

      {/* ─── GALLERY SECTION ─── */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <p
            className="uppercase text-black mb-12"
            style={{
              fontFamily: "var(--font-unbounded), sans-serif",
              fontWeight: 700,
              fontSize: "42px",
              lineHeight: "46px",
            }}
          >
            Zapraszamy do<br />
            świata szkła
          </p>
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16/7",
              background: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)",
            }}
          >
            <DepthGallery />
          </div>

          {/* 7. slot — CTA */}
          <div className="flex items-center justify-center mt-8 py-16 border border-black/10">
            <a
              href="#"
              className="inline-flex items-center gap-4 py-5 px-12 rounded-full border border-black/20 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              style={{ fontFamily: "var(--font-unbounded), sans-serif", fontSize: "14px", letterSpacing: "0.15em" }}
            >
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                <path d="M12.01 3.16553H0V5.24886H12.01V8.37386L16 4.20719L12.01 0.0405273V3.16553Z" fill="currentColor" />
              </svg>
              CAŁA OFERTA
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
