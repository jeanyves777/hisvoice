"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;

      for (const star of stars) {
        const pulse = Math.sin(time * star.speed + star.x) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${star.opacity * pulse})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

export function CinematicHero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080604]">
      <Starfield />

      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* Title with shimmer */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-wider mb-6"
          style={{
            background: "linear-gradient(90deg, #C9A96E 0%, #F5C842 25%, #C9A96E 50%, #F5C842 75%, #C9A96E 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}
        >
          HIS VOICE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="font-heading text-xl sm:text-2xl text-[#E8D5A3] mb-4"
        >
          Every Word He Spoke
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="text-[#8A7D65] text-lg mb-12 font-body"
        >
          From the first promise to the last word — the most comprehensive
          interactive harmony of Jesus Christ across all world traditions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          <Link
            href="/timeline"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#C9A96E] to-[#F5C842] text-[#080604] rounded-lg font-heading text-lg tracking-wide hover:opacity-90 transition-opacity shadow-lg shadow-[#C9A96E]/20"
          >
            BEGIN THE JOURNEY
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 1 }}
          className="mt-12"
        >
          <p className="text-[#8A7D65] text-sm font-body italic">
            &ldquo;In the beginning was the Word, and the Word was with God,
            and the Word was God.&rdquo;
          </p>
          <p className="text-[#8A7D65]/60 text-xs font-ui mt-1">
            — John 1:1
          </p>
        </motion.div>
      </div>

      {/* Skip hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link
          href="/timeline"
          className="text-[#8A7D65]/40 text-xs font-ui hover:text-[#8A7D65] transition-colors"
        >
          Skip to Timeline
        </Link>
      </motion.div>

      {/* CSS Shimmer keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
