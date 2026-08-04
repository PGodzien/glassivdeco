"use client"

import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

const ITEMS = [
  {
    number: "01",
    title: "Sitodruk emaliami mineralnymi i organicznymi",
    body: "Zdobienie opakowań szklanych sitodrukiem przy użyciu farb mineralnych daje ogromne możliwości estetyczne. Farba mineralna jest nieagresywna, nietrująca i nieszkodliwa dla środowiska, a zarazem odporna chemicznie i mechanicznie.",
  },
  {
    number: "02",
    title: "Satynowanie i kolorowanie butelek",
    body: "Pokrywamy całe opakowania szklane kolorem litym, przezroczystym lub transparentnym, uzyskując również efekt zmrożenia. Technologia łączy wysoką odporność mechaniczną z bogatą paletą kolorów.",
  },
  {
    number: "03",
    title: "Sitodruk połączony z pokrywaniem powierzchni",
    body: "Połączenie sitodruku i satynowania pozwala uzyskać wielowarstwowy, wyrazisty efekt. Precyzyjnie kontrolowana kolejność warstw daje szerokie możliwości kolorystyczne i projektowe.",
  },
  {
    number: "04",
    title: "Sitodruk UV na powierzchniach o różnych przekrojach",
    body: "Farby utwardzane światłem UV umożliwiają zastosowanie szerokiej palety barw i złożonej grafiki na powierzchniach o różnych kształtach. Stosowane farby UV nie zawierają metali ciężkich.",
  },
  {
    number: "05",
    title: "Pokrycia z metali szlachetnych",
    body: "Emalie zawierające miedź, srebro, złoto i platynę pozwalają uzyskać eleganckie, świetliste wykończenia oraz wyjątkowo szlachetny charakter dekorowanego opakowania.",
  },
  {
    number: "06",
    title: "Maskowanie selektywne pokryć",
    body: "Precyzyjne okno widokowe eksponuje zawartość i najważniejszy element produktu. Właściwości optyczne szkła wzmacniają detal i nadają opakowaniu rozpoznawalny charakter.",
  },
]

export default function OfferTechnologyIndex() {
  const [active, setActive] = useState(0)
  const selected = ITEMS[active]

  return (
    <section id="technologie" className="overflow-hidden bg-[#f2f0ea] py-20 text-black md:py-28">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-8 md:mb-14">
          <h2 className="max-w-3xl text-2xl font-extrabold uppercase leading-[1.15] md:text-4xl">
            Oferta /<br />Nasze technologie
          </h2>
          <p className="hidden max-w-md text-right text-sm leading-relaxed text-black/45 md:block">
            Sześć specjalistycznych procesów. Jeden cel: szkło, które wyróżnia produkt i wzmacnia charakter marki.
          </p>
        </div>

        <div className="grid min-h-[610px] border-y border-black/20 lg:grid-cols-[58%_42%]">
          <div className="order-2 lg:pl-12">
            {ITEMS.map((item, index) => {
              const isActive = index === active
              return (
                <button
                  key={item.number}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className="group relative flex min-h-[101px] w-full items-center gap-5 border-b border-black/15 py-4 text-left last:border-b-0"
                >
                  <span className={`w-9 shrink-0 text-xs font-semibold tracking-[0.18em] transition-colors ${isActive ? "text-[#9b7b37]" : "text-black/30"}`}>
                    {item.number}
                  </span>
                  <span className={`max-w-2xl text-xs font-bold uppercase leading-relaxed transition-all duration-300 md:text-sm ${isActive ? "translate-x-2 text-black" : "text-black/48 group-hover:text-black/70"}`}>
                    {item.title}
                  </span>
                  <span className={`ml-auto shrink-0 text-xl transition-all duration-300 ${isActive ? "translate-x-0 text-[#9b7b37] opacity-100" : "-translate-x-2 text-black/20 opacity-0"}`}>→</span>
                  <motion.span
                    className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-[#d7b66d]"
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </button>
              )
            })}
          </div>

          <div className="relative order-1 hidden min-h-[610px] overflow-hidden border-r border-black/20 bg-[#11110f] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#d7b66d]/12 blur-[100px]" />
            <span className="relative text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b66d]">Szczegóły technologii</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.number}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="relative"
              >
                <span className="mb-8 block text-[clamp(5rem,9vw,9rem)] font-light leading-none text-[#d7b66d]/18">{selected.number}</span>
                <h3 className="mb-7 max-w-xl text-lg font-bold uppercase leading-relaxed md:text-xl">{selected.title}</h3>
                <p className="max-w-lg text-base leading-[1.75] text-white/58">{selected.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="relative flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <span className="h-px w-10 bg-[#d7b66d]/60" /> GlassivDeco
            </div>
          </div>
        </div>

        <div className="min-h-[290px] bg-[#11110f] p-7 text-white lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={selected.number} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <span className="mb-6 block text-5xl font-light text-[#d7b66d]/30">{selected.number}</span>
              <h3 className="mb-5 text-sm font-bold uppercase leading-relaxed">{selected.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{selected.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
