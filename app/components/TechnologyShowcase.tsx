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

  return (
    <section className="overflow-hidden bg-black py-20 md:py-28" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-8 md:mb-14">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b66d]">Wybrane realizacje</p>
            <h2 id="showcase-title" className="max-w-3xl text-2xl font-extrabold uppercase leading-[1.15] text-white md:text-4xl">
              Jedno szkło.<br />Wiele możliwości.
            </h2>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-white/35 md:block">Najedź, aby odkryć</span>
        </div>

        <div className="grid min-h-[610px] grid-cols-1 overflow-hidden border-y border-white/15 lg:grid-cols-[42%_58%]">
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:border-r lg:border-white/15 lg:pr-12">
            {TECHNOLOGIES.map((item, index) => {
              const isActive = index === active
              return (
                <button
                  key={item.number}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="group relative flex min-h-[118px] w-full items-center gap-5 border-b border-white/10 py-5 text-left last:border-b-0 lg:min-h-[132px]"
                  aria-pressed={isActive}
                >
                  <motion.span
                    animate={{ color: isActive ? "#d7b66d" : "rgba(255,255,255,.35)" }}
                    className="w-8 shrink-0 text-xs font-semibold tracking-[0.18em]"
                  >
                    {item.number}
                  </motion.span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-bold uppercase leading-snug transition-colors duration-300 md:text-base ${isActive ? "text-white" : "text-white/45 group-hover:text-white/75"}`}>
                      {item.name}
                    </span>
                    <span className={`mt-2 block text-sm transition-all duration-300 ${isActive ? "translate-y-0 text-white/50 opacity-100" : "translate-y-1 text-white/30 opacity-0"}`}>
                      {item.detail}
                    </span>
                  </span>
                  <motion.span
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-[#d7b66d]"
                  />
                </button>
              )
            })}
          </div>

          <div className="relative order-1 h-[430px] overflow-hidden bg-white lg:order-2 lg:h-auto">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={technology.number}
                initial={{ opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.42 }, scale: { duration: 0.8, ease: "easeOut" } }}
                className="absolute inset-0 cursor-zoom-in overflow-hidden bg-white"
                onClick={() => setModalIndex(0)}
                role="button"
                tabIndex={0}
                aria-label={`Otwórz galerię: ${technology.name}`}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setModalIndex(0) }}
              >
                <Image src={technology.photos[0][0]} alt={technology.photos[0][1]} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 58vw" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between md:bottom-8 md:left-8 md:right-8">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">GlassivDeco / {technology.number}</span>
              <span className="text-5xl font-light text-white/20 md:text-7xl">{technology.number}</span>
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
