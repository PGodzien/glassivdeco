"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

const TECHNOLOGIES = [
  {
    number: "01",
    name: "Sitodruk mineralny",
    detail: "Precyzyjny detal i wysoka odporność",
    photos: [
      ["/catalog/all/product-001-01.jpg", "Butelki Pepsi"],
      ["/catalog/all/product-005-01.jpg", "Butelka Mirinda"],
      ["/catalog/all/product-007-01.jpg", "Butelka Wyborowa"],
      ["/catalog/all/product-011-01.jpg", "Butelka Smirnoff"],
      ["/catalog/all/product-021-01.jpg", "Butelka JML Cognac"],
      ["/catalog/all/product-028-01.jpg", "Butelka Pravda"],
    ],
  },
  {
    number: "02",
    name: "Technologia organiczna / UV",
    detail: "Intensywny kolor i swoboda projektowa",
    photos: [
      ["/catalog/all/product-043-01.jpg", "Butelka Lekko"],
      ["/catalog/all/product-002-01.jpg", "Czerwona butelka"],
      ["/catalog/all/product-027-01.jpg", "Butelka Aro"],
      ["/catalog/all/product-033-01.jpg", "Butelka Voda"],
      ["/catalog/all/product-037-01.jpg", "Zielona butelka wody"],
      ["/catalog/all/product-042-01.jpg", "Butelka Wonders"],
    ],
  },
  {
    number: "03",
    name: "Technologia organiczna",
    detail: "Pełne pokrycie i szlachetne wykończenie",
    photos: [
      ["/catalog/all/product-029-01.jpg", "Niebieska smukła butelka"],
      ["/catalog/all/product-009-01.jpg", "Brązowa butelka"],
      ["/catalog/all/product-010-01.jpg", "Czarna prostokątna butelka"],
      ["/catalog/all/product-010-02.jpg", "Czarna butelka"],
      ["/catalog/all/product-044-01.jpg", "Słoiczek kosmetyczny"],
    ],
  },
  {
    number: "04",
    name: "Powierzchnia + sitodruk",
    detail: "Wielowarstwowy efekt i wyrazisty detal",
    photos: [
      ["/catalog/all/product-015-01.jpg", "Butelka Le Grand"],
      ["/catalog/all/product-017-01.jpg", "Butelka Palace Vodka Pepper"],
      ["/catalog/all/product-019-01.jpg", "Biała butelka z motywem miecza"],
      ["/catalog/all/product-023-01.jpg", "Biała butelka z grafiką"],
      ["/catalog/all/product-034-01.jpg", "Butelka z motywem matrioszki"],
      ["/catalog/all/product-035-01.jpg", "Butelka Granat Rozrywkowy"],
    ],
  },
]

export default function TechnologyShowcase() {
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const technology = TECHNOLOGIES[active]
  const activePhoto = modalIndex === null ? null : technology.photos[modalIndex]

  const moveModal = (step: number) => {
    setModalIndex((current) => current === null ? 0 : (current + step + technology.photos.length) % technology.photos.length)
  }

  useEffect(() => {
    if (modalIndex === null) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalIndex(null)
      if (event.key === "ArrowRight") moveModal(1)
      if (event.key === "ArrowLeft") moveModal(-1)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKey)
    }
  }, [modalIndex, technology.photos.length])

  useEffect(() => {
    if (isPaused || modalIndex !== null) return
    const interval = window.setInterval(() => setActive((current) => (current + 1) % TECHNOLOGIES.length), 4200)
    return () => window.clearInterval(interval)
  }, [isPaused, modalIndex])

  const cardStatus = (index: number) => {
    const diff = (index - active + TECHNOLOGIES.length) % TECHNOLOGIES.length
    if (diff === 0) return "active"
    if (diff === 1) return "next"
    if (diff === TECHNOLOGIES.length - 1) return "prev"
    return "hidden"
  }

  return (
    <section className="overflow-hidden bg-white py-12 md:py-14" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-16">
        <div className="mb-7 flex items-end justify-between gap-8 md:mb-9 lg:w-[40%]">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b66d]">Wybrane realizacje</p>
            <h2 id="showcase-title" className="max-w-3xl text-2xl font-extrabold uppercase leading-[1.12] text-black md:text-3xl lg:text-[32px]">
              <span className="block whitespace-nowrap">Jedno szkło.</span>
              <span className="block whitespace-nowrap">Wiele możliwości.</span>
            </h2>
          </div>
        </div>

        <div
          className="relative flex min-h-[650px] flex-col overflow-visible bg-white lg:h-[clamp(500px,62vh,620px)] lg:min-h-0 lg:flex-row"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative z-20 flex min-h-[340px] w-full flex-col justify-center overflow-hidden rounded-[2.5rem] bg-[#f3f1eb] px-7 py-10 lg:h-auto lg:w-[40%] lg:rounded-[3.25rem] lg:px-10 xl:px-12">
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#d7b66d]/16 blur-[90px]" />
            <div className="relative z-10 flex flex-col gap-3">
            {TECHNOLOGIES.map((item, index) => {
              const isActive = index === active
              return (
                <button
                  key={item.number}
                  type="button"
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className={`group relative flex w-fit max-w-full items-center gap-4 rounded-full border px-5 py-3 text-left transition-all duration-500 md:px-7 ${isActive ? "border-[#d7b66d] bg-[#d7b66d] text-black shadow-[0_12px_35px_rgba(143,116,64,.22)]" : "border-black/15 bg-white/55 text-black/48 hover:border-black/30 hover:text-black"}`}
                  aria-pressed={isActive}
                >
                  <span className={`w-7 shrink-0 text-[10px] font-semibold tracking-[0.18em] ${isActive ? "text-black/65" : "text-black/30"}`}>
                    {item.number}
                  </span>
                  <span className="min-w-0 whitespace-nowrap">
                    <span className="block text-xs font-bold uppercase leading-snug tracking-[0.04em] md:text-sm">
                      {item.name}
                    </span>
                  </span>
                </button>
              )
            })}
            </div>
          </div>

          <div className="relative flex min-h-[500px] flex-1 items-center justify-center overflow-visible bg-white px-6 py-10 md:px-12 lg:-mt-[132px] lg:h-[calc(100%+132px)] lg:min-h-0 lg:px-8 lg:py-0">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(215,182,109,.14),transparent_50%)]" />
            <div className="relative aspect-[4/5] w-full max-w-[430px] lg:h-full lg:max-h-none lg:w-auto">
              {TECHNOLOGIES.map((item, index) => {
                const status = cardStatus(index)
                const isActive = status === "active"
                const isPrev = status === "prev"
                const isNext = status === "next"
                return (
                  <motion.button
                    key={item.number}
                    type="button"
                    initial={false}
                    animate={{
                      x: isActive ? 0 : isPrev ? -82 : isNext ? 82 : 0,
                      y: isActive ? 0 : 12,
                      scale: isActive ? 1 : isPrev || isNext ? 0.86 : 0.72,
                      opacity: isActive ? 1 : isPrev || isNext ? 0.3 : 0,
                      rotate: isPrev ? -3.5 : isNext ? 3.5 : 0,
                      zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 250, damping: 27, mass: 0.85 }}
                    className={`absolute inset-0 overflow-hidden rounded-[2rem] bg-[#e9e7e2] text-left shadow-[0_28px_70px_rgba(0,0,0,.22)] md:rounded-[2.5rem] ${isActive ? "cursor-zoom-in" : "pointer-events-none"}`}
                    onClick={() => isActive && setModalIndex(0)}
                    aria-label={isActive ? `Otwórz galerię: ${item.name}` : undefined}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <Image src={item.photos[0][0]} alt={item.photos[0][1]} fill className="object-cover" sizes="(max-width: 1024px) 80vw, 420px" />
                    {isActive && (
                      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 bottom-0 z-10 border-t border-white/30 bg-black/25 px-7 pb-8 pt-6 shadow-[0_-16px_45px_rgba(0,0,0,.12),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-xl md:px-9 md:pb-10 md:pt-7">
                        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
                          {item.number} • {item.name}
                        </span>
                        <p className="max-w-xs text-lg font-medium leading-snug text-white drop-shadow-sm md:text-xl">{item.detail}</p>
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020713]/80 p-4 backdrop-blur-2xl md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`Galeria: ${technology.name}`}
            onClick={(event) => { if (event.target === event.currentTarget) setModalIndex(null) }}
          >
            <div className="pointer-events-none absolute -left-[15vw] -top-[25vh] h-[65vh] w-[65vh] rounded-full bg-[#d7b66d]/20 blur-[130px]" />
            <div className="pointer-events-none absolute -bottom-[30vh] -right-[10vw] h-[70vh] w-[70vh] rounded-full bg-[#8f7440]/15 blur-[150px]" />
            <button onClick={() => setModalIndex(null)} className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/50 text-2xl text-white transition-colors hover:border-[#d7b66d] md:right-8 md:top-8" aria-label="Zamknij galerię">×</button>
            <button onClick={() => moveModal(-1)} className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/60 text-xl text-white transition-colors hover:border-[#d7b66d] md:left-8" aria-label="Poprzednie zdjęcie">←</button>
            <motion.div
              key={`${active}-${modalIndex}`}
              initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28 }}
              className="relative h-[78vh] w-[86vw] max-w-6xl overflow-hidden rounded-3xl bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_40px_120px_rgba(0,0,0,.5)] backdrop-blur-3xl"
            >
              <div className="absolute inset-4 flex items-center justify-center md:inset-8">
                {/* Natural image bounds make the rounding follow the visible photo, not its contain box. */}
                <img
                  src={activePhoto[0]}
                  alt={activePhoto[1]}
                  className="max-h-full max-w-full rounded-[1.75rem] object-contain md:rounded-[2.25rem]"
                />
              </div>
            </motion.div>
            <button onClick={() => moveModal(1)} className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/60 text-xl text-white transition-colors hover:border-[#d7b66d] md:right-8" aria-label="Następne zdjęcie">→</button>
            <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-xs font-semibold tracking-[0.18em] text-white/65 md:bottom-7">
              {(modalIndex ?? 0) + 1} / {technology.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
