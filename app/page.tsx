"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useState } from "react"

const DepthGallery = dynamic(() => import("./components/DepthGallery"), { ssr: false })
const Prism = dynamic(() => import("./components/Prism"), { ssr: false })

const NAV_LINKS = [
  { label: "Realizacje", href: "#realizacje" },
  { label: "O nas", href: "#o-nas" },
  { label: "Oferta / Technologie", href: "#technologie" },
]

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

function scrollTo(href: string) {
  const id = href.replace("#", "")
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth" })
}

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
            <a className="inline-flex items-center gap-3 text-xl text-white font-medium font-heading" href="#">
              <Image src="/sygnet.svg" alt="" width={44} height={44} />
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
                <li key={item.label} className={i < NAV_LINKS.length - 1 ? "mr-12" : ""}>
                  <a className="text-white/70 hover:text-white transition-colors cursor-pointer" onClick={e => { e.preventDefault(); scrollTo(item.href) }}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center pl-16 py-8 border-l border-white/20">
            <div className="flex items-center">
              <a className="inline-block text-sm text-white hover:underline font-heading cursor-pointer" onClick={e => { e.preventDefault(); scrollTo("#kontakt") }}>Kontakt</a>
            </div>
          </div>
        </nav>

        {/* HERO BODY */}
        <div className="container mx-auto px-4">
          <div className="relative flex items-center" style={{ minHeight: "720px", paddingTop: "80px", paddingBottom: "80px" }}>


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
            <div className="relative max-w-6xl mx-auto w-full" style={{ zIndex: 2 }}>
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
                href="#technologie"
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
                  <li key={item.label} className="mb-10">
                    <a className="flex items-center cursor-pointer" onClick={e => { e.preventDefault(); setMobileOpen(false); scrollTo(item.href) }}>
                      <span className="mr-3 text-lg text-white">{item.label}</span>
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
      <section id="realizacje" className="bg-white py-24">
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
            {/* Scroll hint */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none" style={{ zIndex: 90 }}>
              {/* Mouse icon */}
              <svg width="18" height="26" viewBox="0 0 18 26" fill="none" style={{ opacity: 0.45 }}>
                <rect x="1" y="1" width="16" height="24" rx="8" stroke="white" strokeWidth="1.2"/>
                <rect x="8" y="5" width="2" height="5" rx="1" fill="white"/>
              </svg>
              <span style={{
                fontFamily: "var(--font-archivo), sans-serif",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}>
                scroll
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section id="o-nas" className="py-20 md:py-32 overflow-hidden relative" style={{ background: "radial-gradient(ellipse at 20% 60%, #001a3a 0%, #00060f 50%, #000 80%)" }}>
        {/* Sygnet tło */}
        <div className="absolute pointer-events-none select-none" style={{ right: "-8%", bottom: "-10%", width: "55%", opacity: 0.07, zIndex: 0 }}>
          <Image src="/sygnet.svg" alt="" width={900} height={788} style={{ width: "100%", height: "auto" }} />
        </div>
        <div className="container mx-auto px-4 relative" style={{ zIndex: 1 }}>

          {/* Header */}
          <div className="mb-20">
            <p
              className="uppercase text-white"
              style={{
                fontFamily: "var(--font-unbounded), sans-serif",
                fontWeight: 700,
                fontSize: "42px",
                lineHeight: "46px",
              }}
            >
              Precyzja i jakość<br />
              w każdym detalu<br />
              zdobienia szkła
            </p>
          </div>

          {/* Features — 4 karty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Jakość zdobienia",
                desc: "Utrzymujemy pozycję lidera w branży dzięki połączeniu światowej klasy wiedzy technicznej i najwyższej jakości nadrukom na szkle.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1313ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                ),
              },
              {
                title: "Konkurencyjna cena",
                desc: "Stosujemy konkurencyjne ceny oraz upusty dla stałych klientów, by jak najlepiej odpowiadać Państwa potrzebom biznesowym.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1313ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                    <path d="M16 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H8"/>
                    <path d="M12 18v-2M12 8V6"/>
                  </svg>
                ),
              },
              {
                title: "Czas realizacji",
                desc: "Najkrótsze terminy realizacji powierzonych nam zadań są naszym priorytetem. Dotrzymujemy terminów bez kompromisów.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1313ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
              },
              {
                title: "Obsługa klienta",
                desc: "W trosce o naszych klientów dbamy o poufność i bezpieczeństwo danych oraz służymy pomocą w zakresie świadczonej usługi.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1313ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="p-10 flex flex-col gap-6 feature-card" style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.4)",
                transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.35s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = "translateY(-6px)"
                el.style.boxShadow = "0 16px 48px rgba(19,19,186,0.35), 0 2px 8px rgba(0,0,0,0.5)"
                el.style.borderColor = "rgba(19,19,186,0.5)"
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = "translateY(0)"
                el.style.boxShadow = "0 2px 24px rgba(0,0,0,0.4)"
                el.style.borderColor = "transparent"
              }}
              >
                <div className="w-12 h-12 flex items-center justify-center" style={{ background: "rgba(19,19,186,0.15)", border: "1px solid rgba(19,19,186,0.4)" }}>
                  {icon}
                </div>
                <h3 className="text-white font-bold uppercase" style={{ fontFamily: "var(--font-unbounded), sans-serif", fontSize: "13px", letterSpacing: "0.05em" }}>
                  {title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGIES SECTION ─── */}
      <section id="technologie" className="bg-white py-24 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="uppercase text-black mb-16" style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 700, fontSize: "42px", lineHeight: "46px" }}>
            Nasze<br />technologie
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
            {[
              {
                n: "01",
                title: "Sitodruk emaliami mineralnymi i organicznymi",
                body: "Zdobienie opakowań szklanych sitodrukiem przy użyciu farb mineralnych daje ogromne możliwości estetyczne. Farba mineralna jest nieagresywna, nietrująca i nieszkodliwa dla środowiska, a zarazem odporna chemicznie i mechanicznie.",
              },
              {
                n: "02",
                title: "Satynowanie i kolorowanie butelek",
                body: "Opracowaliśmy technologię pokrywania całych opakowań szklanych kolorem litym, przezroczystym lub transparentnym oraz uzyskania niespotykanej imitacji zmrożenia butelek. Wysoka odporność mechaniczna i bogata paleta kolorów.",
              },
              {
                n: "03",
                title: "Sitodruk połączony z pokrywaniem powierzchni",
                body: "Połączenie metody sitodruku i satynowania pozwala uzyskać oryginalny i piękny wygląd zdobionego szkła. Posiadany automat daje nieograniczone możliwości kolorystyczne w technologicznie dopuszczalnej kolejności warstw.",
              },
              {
                n: "04",
                title: "Sitodruk UV na powierzchniach o różnych przekrojach",
                body: "Szkło malowane metodą UV — farby utwardzane falami ultrafioletowymi. Główna zaleta to możliwość wybrania znacznie większej liczby kolorów niż w tradycyjnym sitodruku. Stosowane farby UV nie zawierają metali ciężkich.",
              },
              {
                n: "05",
                title: "Pokrycia z metali szlachetnych",
                body: "Pokrycie emaliami z zawartością metali szlachetnych pozwala osiągnąć eleganckie efekty. Do drukowania tą metodą używamy miedzi, srebra, złota i platyny — jako zamienniki klasycznych emalii mineralnych.",
              },
              {
                n: "06",
                title: "Maskowanie selektywne pokryć",
                body: "Wprowadziliśmy możliwość wstawienia tzw. okna widokowego, które oprócz walorów estetycznych nadaje oryginalność produktowi. Podkreśla główny element poprzez jego powiększenie dzięki właściwościom optycznym pokrycia.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="bg-white p-10 flex flex-col gap-5 group hover:bg-black transition-colors duration-300">
                <span className="text-xs font-semibold" style={{ color: "#1313ba", fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "0.15em" }}>{n}</span>
                <h3 className="text-base font-bold uppercase text-black group-hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-unbounded), sans-serif", lineHeight: 1.4, fontSize: "13px" }}>
                  {title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed transition-colors duration-300" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section id="kontakt" className="bg-black overflow-hidden border-t border-white/10">
        <div className="flex flex-wrap items-stretch">

          {/* Left — info */}
          <div className="w-full md:w-1/2 px-4 border-b md:border-b-0 md:border-r border-white/10">
            <div className="max-w-md mx-auto py-16 md:py-24">
              <div className="mb-12">
                <span className="inline-block mb-5">
                  <svg width="27" height="34" viewBox="0 0 27 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.53923 5.0709C8.57209 -0.348133 17.1109 -0.722452 22.612 4.23495C28.1139 9.19271 28.4928 17.6049 23.4607 23.0239L13.4996 33.7485L3.53923 23.0239C-1.17974 17.942 -1.17974 10.1521 3.53923 5.0709ZM5.93178 20.8678L13.4996 29.0166L21.0678 20.8678C24.8913 16.7503 24.6032 10.3593 20.4229 6.5918C16.2431 2.82463 9.75528 3.10984 5.93178 7.22628C2.34514 11.0872 2.34514 17.0062 5.93178 20.8678ZM16.4639 14.0467C16.4639 12.4342 15.1365 11.1266 13.4996 11.1266C11.8627 11.1266 10.5345 12.4342 10.5345 14.0467C10.5345 15.6599 11.8627 16.9675 13.4996 16.9675C15.1365 16.9675 16.4639 15.6599 16.4639 14.0467Z" fill="#1313ba"/>
                  </svg>
                </span>
                <h3 className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#1313ba", fontFamily: "var(--font-archivo), sans-serif" }}>Adres</h3>
                <p className="text-2xl text-white font-bold uppercase" style={{ fontFamily: "var(--font-unbounded), sans-serif", lineHeight: 1.3 }}>
                  ul. Zbożowa 10<br />
                  37-500 Jarosław
                </p>
              </div>
              <div>
                <span className="inline-block mb-5">
                  <svg width="33" height="28" viewBox="0 0 33 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="31" height="26" rx="2" stroke="#1313ba" strokeWidth="1.5"/>
                    <path d="M1 5l15.5 11L32 5" stroke="#1313ba" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <h3 className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#1313ba", fontFamily: "var(--font-archivo), sans-serif" }}>Kontakt</h3>
                <a className="block text-2xl text-white font-bold uppercase hover:text-blue-400 transition-colors" href="mailto:maciej@glassivdeco.com" style={{ fontFamily: "var(--font-unbounded), sans-serif" }}>
                  maciej@glassivdeco.com
                </a>
                <p className="text-2xl text-white font-bold uppercase mt-1" style={{ fontFamily: "var(--font-unbounded), sans-serif" }}>
                  +48 660 788 125
                </p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="w-full md:w-1/2 px-4">
            <div className="max-w-md mx-auto py-16 md:py-24">
              <h2 className="mb-8 text-3xl text-white uppercase font-bold" style={{ fontFamily: "var(--font-unbounded), sans-serif" }}>
                Formularz kontaktowy
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  className="w-full py-3 outline-none bg-transparent"
                  type="email"
                  placeholder="Adres e-mail"
                  style={{
                    borderBottom: "1px solid #1313ba",
                    fontFamily: "var(--font-unbounded), sans-serif",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                />
                <textarea
                  className="w-full h-36 py-3 outline-none resize-none bg-transparent"
                  placeholder="Twoja wiadomość..."
                  style={{
                    borderBottom: "1px solid #1313ba",
                    fontFamily: "var(--font-unbounded), sans-serif",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                />
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 accent-blue-600" />
                  <span style={{ fontFamily: "var(--font-unbounded), sans-serif", fontSize: "10px", letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)" }}>
                    Akceptuję{" "}
                    <a className="hover:underline" style={{ color: "rgba(255,255,255,0.7)" }} href="#">politykę prywatności</a>{" "}
                    i wyrażam zgodę na przetwarzanie danych.
                  </span>
                </label>
                <a
                  className="inline-flex items-center py-5 px-10 rounded-full transition-all duration-300 self-start"
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
                  <span className="text-base uppercase font-heading text-white tracking-widest">Wyślij wiadomość</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 bg-black border-t border-white/10 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="w-full md:w-auto mb-6 md:mb-0">
              <a className="inline-flex items-center gap-3 text-xl text-white font-medium font-heading" href="#">
                <Image src="/sygnet.svg" alt="" width={32} height={32} />
                Glassiv Deco
              </a>
            </div>
            <div className="w-full md:w-auto">
              <ul className="flex flex-wrap gap-8">
                {NAV_LINKS.map(item => (
                  <li key={item.label}>
                    <a className="text-sm text-white/60 uppercase hover:text-white transition-colors font-heading cursor-pointer" onClick={e => { e.preventDefault(); scrollTo(item.href) }} style={{ fontFamily: "var(--font-unbounded), sans-serif", fontSize: "11px", letterSpacing: "0.1em" }}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-500 text-sm" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
              Wszelkie prawa zastrzeżone © Glassiv Deco 2026
            </p>
          </div>
        </div>
      </footer>

    </main>
  )
}
