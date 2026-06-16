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
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section className="py-20 md:py-32 bg-black overflow-x-hidden">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="max-w-md mx-auto mb-20 text-center">
            <span className="text-lg font-semibold" style={{ color: "#1313ba", fontFamily: "var(--font-archivo), sans-serif" }}>
              Dlaczego my
            </span>
            <h2 className="mt-6 mb-6 text-2xl text-white uppercase font-heading font-bold" style={{ fontFamily: "var(--font-unbounded), sans-serif" }}>
              Precyzja i jakość w każdym detalu zdobienia szkła.
            </h2>
            <p className="text-lg text-gray-500" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
              Łączymy wieloletnie doświadczenie z nowoczesnymi technologiami, aby każde opakowanie szklane było dziełem sztuki.
            </p>
          </div>

          {/* Features — 4 karty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {[
              {
                title: "Jakość zdobienia",
                desc: "Utrzymujemy pozycję lidera w branży dzięki połączeniu światowej klasy wiedzy technicznej i najwyższej jakości nadrukom na szkle.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 25 32" fill="none">
                    <path d="M24.9007 6.86123C24.9028 6.86123 24.9045 6.85952 24.9045 6.85741C24.9046 6.18186 24.9312 5.49873 24.9045 4.82321C24.9045 4.81556 24.9045 4.80792 24.9045 4.80027C24.9045 4.44467 24.6636 4.17318 24.3424 4.0623C23.0194 3.60345 21.6926 3.14461 20.3696 2.68577C18.2819 1.96309 16.198 1.23659 14.1102 0.513918C13.6476 0.353323 13.1887 0.169787 12.7184 0.032134C12.4852 -0.0366923 12.3246 0.016839 12.1219 0.0856654C11.8848 0.169786 11.6439 0.250084 11.4069 0.334205C9.40709 1.02629 7.41113 1.71838 5.41134 2.41047C3.84746 2.95343 2.28739 3.49257 0.723507 4.03553C0.696741 4.04318 0.673799 4.05465 0.647033 4.0623C0.325844 4.17318 0.0849514 4.44849 0.0849514 4.80027V11.8856C0.0849514 13.3768 0.0811277 14.868 0.0849514 16.3593C0.0887751 17.6249 0.310549 18.8982 0.731154 20.0912C1.59148 22.5498 3.15537 24.7102 5.0175 26.5111C6.8567 28.2892 9.00943 29.7766 11.3189 30.8701C11.5828 30.9925 11.8466 31.111 12.1104 31.2257C12.2023 31.264 12.2443 31.2793 12.2825 31.2908C12.4648 31.3401 12.666 31.3141 12.8673 31.2313C15.2139 30.2338 17.3767 28.835 19.2722 27.1573C21.184 25.4635 22.8703 23.4025 23.8797 21.0433C24.3998 19.8235 24.7439 18.5617 24.8586 17.2387C24.9198 16.5313 24.8968 15.8163 24.8968 15.1051V6.86506C24.8968 6.86295 24.8986 6.86123 24.9007 6.86123ZM19.2837 11.5567C18.9663 11.8741 18.6489 12.1915 18.3316 12.5088C16.955 13.8853 15.5823 15.258 14.2058 16.6346C13.3378 17.5025 12.466 18.3743 11.5981 19.2423C11.1583 19.682 10.4127 19.682 9.97682 19.2423C9.80093 19.0664 9.62504 18.8905 9.44915 18.7147C8.21793 17.4834 6.9867 16.2522 5.75165 15.0172C5.29663 14.5621 5.33105 13.8548 5.75165 13.3959C6.17226 12.9409 6.94846 12.9715 7.37289 13.3959C7.54878 13.5718 7.72467 13.7515 7.90056 13.9274C8.81188 14.8387 9.72321 15.7569 10.6345 16.669C10.7147 16.7492 10.8448 16.7492 10.9251 16.669C12.3016 15.2925 13.6743 13.9159 15.0509 12.5394C15.9188 11.6714 16.7906 10.7996 17.6586 9.93165C18.1136 9.47663 18.8248 9.51105 19.2798 9.93165C19.7387 10.3523 19.7081 11.1323 19.2837 11.5567Z" fill="#1313ba"/>
                  </svg>
                ),
              },
              {
                title: "Konkurencyjna cena",
                desc: "Stosujemy konkurencyjne ceny oraz upusty dla stałych klientów, by jak najlepiej odpowiadać Państwa potrzebom biznesowym.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 33" fill="none">
                    <path d="M2.89084 3.01913C-0.963286 6.87325 -0.963286 13.1683 2.89084 17.0224C5.63154 19.7632 9.74261 20.6624 13.3398 19.2921L15.7807 21.733C15.9948 21.9472 16.2946 22.0756 16.5944 22.0756H19.0781V24.5594C19.0781 24.8592 19.2066 25.1589 19.4207 25.373L20.6198 26.5721C20.8339 26.7862 21.1337 26.9147 21.4334 26.9147H23.9172V29.3985C23.9172 29.6982 24.0457 29.998 24.2598 30.2121L25.7158 31.6681C25.9299 31.8822 26.2297 32.0107 26.4866 32.0107L30.7262 32.1392C31.0259 32.1392 31.3685 32.0535 31.6255 31.7966C31.8396 31.5825 31.968 31.2399 31.968 30.8973L31.8396 26.6577C31.8396 26.358 31.6683 26.101 31.497 25.8869L19.121 13.5537C20.4485 9.91373 19.592 5.84549 16.8513 3.10478C13.04 -0.834988 6.74496 -0.834988 2.89084 3.01913ZM15.0527 8.71467L10.1708 13.8535C9.9139 14.1533 9.52849 14.3246 9.10025 14.3246C8.67202 14.3246 8.32943 14.1533 8.02966 13.8535L5.33178 10.9843C4.77507 10.3848 4.8179 9.48549 5.3746 8.92879C5.97413 8.37208 6.87343 8.4149 7.43013 8.97161L9.10025 10.7274L12.9544 6.70196C13.5111 6.10243 14.4532 6.10243 15.0099 6.65914C15.5666 7.21584 15.6094 8.11514 15.0527 8.71467Z" fill="#1313ba"/>
                  </svg>
                ),
              },
              {
                title: "Czas realizacji",
                desc: "Najkrótsze terminy realizacji powierzonych nam zadań są naszym priorytetem. Dotrzymujemy terminów bez kompromisów.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="#1313ba" strokeWidth="2.5"/>
                    <path d="M16 8v8l5 3" stroke="#1313ba" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: "Obsługa klienta",
                desc: "W trosce o naszych klientów dbamy o poufność i bezpieczeństwo danych oraz służymy pomocą w zakresie świadczonej usługi.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 33 32" fill="none">
                    <path d="M29.6028 0H3.39722C1.93556 0 0.787109 1.14857 0.787109 2.61024V29.39C0.787109 30.8517 1.93556 32 3.39722 32H29.6028C31.0644 32 32.2129 30.8517 32.2129 29.39V2.61024C32.2129 1.14857 31.0122 0 29.6028 0ZM29.0807 28.868H3.91925V3.13226H29.0807V28.868Z" fill="#1313ba"/>
                    <path d="M26.7316 9.13559C26.7316 10.023 26.053 10.7017 25.1655 10.7017H7.83438C6.99914 10.7017 6.26831 10.023 6.26831 9.13559C6.26831 8.24815 6.99914 7.56952 7.83438 7.56952H25.1655C26.0008 7.56952 26.7316 8.24815 26.7316 9.13559Z" fill="#1313ba"/>
                    <path d="M13.7332 16.0263C13.7332 16.9137 13.0546 17.5923 12.1672 17.5923H7.83438C6.99914 17.5923 6.26831 16.9137 6.26831 16.0263C6.26831 15.1388 6.99914 14.4602 7.83438 14.4602H12.1672C13.0546 14.4602 13.7332 15.1388 13.7332 16.0263Z" fill="#1313ba"/>
                    <path d="M13.7332 22.9691C13.7332 23.8566 13.0546 24.5352 12.1672 24.5352H7.83438C6.99914 24.5352 6.26831 23.8566 6.26831 22.9691C6.26831 22.0817 6.99914 21.4031 7.83438 21.4031H12.1672C13.0546 21.4031 13.7332 22.0817 13.7332 22.9691Z" fill="#1313ba"/>
                    <path d="M26.314 17.4879L20.8328 22.917C20.5196 23.2302 20.102 23.3868 19.7366 23.3868C19.3189 23.3868 18.9535 23.2302 18.6403 22.917L16.5522 20.8289C15.9258 20.2025 15.9258 19.2106 16.5522 18.6364C17.1786 18.01 18.1705 18.01 18.7447 18.6364L19.7366 19.6282L24.0693 15.2954C24.6958 14.669 25.6876 14.669 26.2618 15.2954C26.8883 15.8697 26.8883 16.8615 26.314 17.4879Z" fill="#1313ba"/>
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="bg-black p-10 flex flex-col gap-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10">
                  {icon}
                </div>
                <h3 className="text-white text-base font-bold uppercase" style={{ fontFamily: "var(--font-unbounded), sans-serif", fontSize: "13px", letterSpacing: "0.05em" }}>
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
