"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";
function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

interface MarqueeRowProps {
  text: string;
  baseVelocity: number;
  scrollVelocity: ReturnType<typeof useSpring>;
}

function MarqueeRow({ text, baseVelocity, scrollVelocity }: MarqueeRowProps) {
  const x = useMotionValue(0);
  const directionFactor = useRef<number>(1);

  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    x.set(x.get() + moveBy);
  });

  const wrappedX = useTransform(x, (v) => `${wrap(-50, 0, v / 100)}%`);

  const items = [...Array(4)].flatMap(() => [text, "·"]);

  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div
        className="flex whitespace-nowrap"
        style={{ x: wrappedX }}
      >
        {[...Array(2)].map((_, i) => (
          <span key={i} className="flex items-center">
            {items.map((item, j) => (
              <span
                key={j}
                className={
                  item === "·"
                    ? "mx-6 text-amber-400/60 text-2xl"
                    : "text-5xl md:text-7xl font-light tracking-tight uppercase text-white/90"
                }
              >
                {item}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollMarquee() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  return (
    <section className="relative bg-neutral-950 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent pointer-events-none" />
      <div className="flex flex-col gap-8">
        <MarqueeRow
          text="Szkło architektoniczne"
          baseVelocity={-80}
          scrollVelocity={smoothVelocity}
        />
        <MarqueeRow
          text="Precyzja i jakość"
          baseVelocity={80}
          scrollVelocity={smoothVelocity}
        />
        <MarqueeRow
          text="Szkło hartowane"
          baseVelocity={-80}
          scrollVelocity={smoothVelocity}
        />
      </div>
    </section>
  );
}
