"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ChevronDown, Heart, Pause, Play, Volume2, X } from "lucide-react";
import {
  closingNotes,
  memories,
  Memory,
  SurpriseIcon,
  timeline,
} from "@/lib/memories";
import { useLenis } from "@/hooks/use-lenis";

const fadeUp = {
  hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function CinematicExperience() {
  useLenis();

  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [surprise, setSurprise] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef(false);
  const fadeTimeoutRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, 1.13]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.25]);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!heroRef.current || !ready) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-title span",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        },
      );
      gsap.fromTo(
        ".hero-photo",
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
      );
    }, heroRef);

    return () => context.revert();
  }, [ready]);

  const progressLabel = useMemo(
    () => (ready ? "The memory box is open" : "Preparing the story"),
    [ready],
  );

  const fadeAudioTo = useCallback((targetVolume: number, duration = 1500) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    const startVolume = audio.volume;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        fadeTimeoutRef.current = window.setTimeout(
          () => requestAnimationFrame(tick),
          16,
        );
      } else {
        fadeTimeoutRef.current = null;
      }
    };

    requestAnimationFrame(tick);
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.muted = false;
    audio.loop = true;
    audio.volume = audio.volume || 0.01;

    try {
      await audio.play();
      fadeAudioTo(0.72, 1400);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [fadeAudioTo]);

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    fadeAudioTo(0, 900);
    window.setTimeout(() => {
      audio.pause();
      audio.volume = 0;
    }, 920);
    setIsPlaying(false);
  }, [fadeAudioTo]);

  const startAutoplay = useCallback(() => {
    if (userPausedRef.current) {
      return;
    }

    void playMusic();
  }, [playMusic]);

  const handleAudioPlay = () => {
    if (!userPausedRef.current) {
      fadeAudioTo(0.72, 1400);
    }
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.01;
    }

    const attemptAutoplay = () => {
      startAutoplay();
    };

    const unlockOnInteraction = () => {
      if (!userPausedRef.current && audioRef.current?.paused) {
        void playMusic();
      }
    };

    attemptAutoplay();
    const timer = window.setTimeout(attemptAutoplay, 350);
    window.addEventListener("pointerdown", unlockOnInteraction, { once: true });
    window.addEventListener("keydown", unlockOnInteraction, { once: true });
    window.addEventListener("click", unlockOnInteraction, { once: true });
    window.addEventListener("touchstart", unlockOnInteraction, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", unlockOnInteraction);
      window.removeEventListener("keydown", unlockOnInteraction);
      window.removeEventListener("click", unlockOnInteraction);
      window.removeEventListener("touchstart", unlockOnInteraction);
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
      audio?.pause();
    };
  }, [playMusic, startAutoplay]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!audio.paused) {
      userPausedRef.current = true;
      pauseMusic();
      return;
    }

    userPausedRef.current = false;
    playMusic();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-night text-white">
      <audio
        ref={audioRef}
        src="/music/mera-pehla-pehla-pyaar.mp3"
        autoPlay
        loop
        playsInline
        preload="auto"
        onCanPlay={startAutoplay}
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        className="hidden"
      />
      <AmbientParticles />
      <AnimatePresence>
        {!ready && <Loader label={progressLabel} />}
      </AnimatePresence>

      <section
        ref={heroRef}
        className="relative grid min-h-screen place-items-center px-5 py-10 sm:px-8"
      >
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <Image
            src="/photos/first-evening.jpg"
            alt="A smiling couple under night lights"
            fill
            priority
            className="hero-photo ken-burns object-cover opacity-70"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(246,166,201,0.08),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.22),#050505_92%)]" />
        </motion.div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/72 backdrop-blur-xl"
          >
            A cinematic memory box
          </motion.p>
          <h1 className="hero-title max-w-5xl overflow-hidden font-serif text-[clamp(4rem,12vw,10.5rem)] leading-[0.82] text-balance">
            <span className="inline-block">Our</span>{" "}
            <span className="inline-block italic text-blush">Story</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 1.05 }}
            className="mt-7 max-w-2xl text-base leading-8 text-white/74 sm:text-lg"
          >
            Ek asli kahani do dilon ki... jo shayad shuru alag hue the, par bane
            hamesha ek dusre ke liye the.
          </motion.p>
        </div>

        <motion.a
          href="#story"
          aria-label="Scroll to story"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-7 z-10 grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-xl transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-blush/70"
        >
          <ChevronDown size={20} />
        </motion.a>
      </section>

      <nav className="fixed right-4 top-4 z-40 flex gap-2 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
          className="glass grid size-11 place-items-center rounded-full text-white/82 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blush/70"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          onClick={() => {
            const audio = audioRef.current;
            if (audio) {
              audio.volume = audio.volume > 0.2 ? 0.18 : 0.72;
            }
          }}
          aria-label="Change soundtrack volume"
          className="glass hidden size-11 place-items-center rounded-full text-white/82 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blush/70 sm:grid"
        >
          <Volume2 size={18} />
        </button>
      </nav>

      <section
        id="story"
        className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:py-32"
      >
        <SectionIntro kicker="Side A" title="Five scenes, one feeling" />
        <div className="mt-16 grid gap-24">
          {memories.map((memory, index) => (
            <StoryScene
              key={memory.id}
              memory={memory}
              index={index}
              onOpen={() => setSelected(memory)}
            />
          ))}
        </div>
      </section>

      <section className="relative px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionIntro kicker="Timeline" title="How the heart remembers" />
          <div className="mt-14 grid gap-4 md:grid-cols-5">
            {timeline.map(({ label, text, Icon }, index) => (
              <motion.article
                key={label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-90px" }}
                variants={fadeUp}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className="glass rounded-2xl p-5"
              >
                <Icon className="mb-10 text-blush" size={24} />
                <h3 className="font-serif text-2xl">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <LoveLetter onSurprise={() => setSurprise(true)} surprise={surprise} />
      <MemoryCloud onOpen={setSelected} />

      <footer className="px-5 py-12 text-center text-sm text-white/45">
        Made like a short film, kept like a promise.
      </footer>

      <AnimatePresence>
        {selected && (
          <MemoryModal memory={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function Loader({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(16px)" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      className="fixed inset-0 z-50 grid place-items-center bg-night"
    >
      <div className="w min-w-[18rem] text-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-7 grid size-16 place-items-center rounded-full border border-blush/30 bg-white/8 shadow-blush"
        >
          <Heart className="fill-blush/40 text-blush" size={25} />
        </motion.div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">
          {label}
        </p>
        <div className="mt-5 h-px overflow-hidden rounded-full bg-white/12">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.65, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blush via-lavender to-ice"
          />
        </div>
      </div>
    </motion.div>
  );
}

function SectionIntro({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-blush/80">
        {kicker}
      </p>
      <h2 className="mt-4 font-serif text-5xl leading-none text-balance sm:text-7xl">
        {title}
      </h2>
    </motion.div>
  );
}

function StoryScene({
  memory,
  index,
  onOpen,
}: {
  memory: Memory;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });
  const reverse = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.85 }}
      className={`grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 text-left shadow-glow focus:outline-none focus:ring-2 focus:ring-blush/70"
        aria-label={`Open ${memory.title}`}
      >
        <Image
          src={memory.src}
          alt={memory.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="ken-burns object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/12 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <span className="rounded-full border border-white/16 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
            {memory.date}
          </span>
          <span className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-xl">
            <Heart size={17} />
          </span>
        </div>
      </button>

      <div className="glass rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="mb-7 h-px w-24" style={{ background: memory.accent }} />
        <p className="text-xs uppercase tracking-[0.35em] text-white/45">
          Scene {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-4 font-serif text-4xl leading-tight text-balance sm:text-6xl">
          {memory.title}
        </h3>
        <p className="mt-6 text-lg leading-8 text-white/78">{memory.line}</p>
        <p className="mt-5 text-sm leading-7 text-white/55">{memory.detail}</p>
      </div>
    </motion.article>
  );
}

function LoveLetter({
  onSurprise,
  surprise,
}: {
  onSurprise: () => void;
  surprise: boolean;
}) {
  return (
    <section className="px-5 py-24 sm:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeUp}
        transition={{ duration: 0.9 }}
        className="glass mx-auto max-w-4xl rounded-[2rem] p-7 sm:p-12"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-lavender/80">
          Love letter
        </p>
        <h2 className="mt-5 font-serif text-5xl leading-none text-balance sm:text-7xl">
          For every version of us
        </h2>
        <div className="mt-8 space-y-5 font-serif text-2xl leading-10 text-white/82 sm:text-3xl sm:leading-[3rem]">
          <p>
            Bas ye dikhne mein ek choti si kahanai par aisi kahani bar bar nahi
            aati hai , jabse dekha tabse leke aajtak isko 02.09.♾️ kar diya. Jab
            dekha tha tab kuch dene ko toh tha nahi par har cheese sath bante
            hue dekha har movements, bolta nahi hoon par dil ke sabse kareeb tum
            hai, kab friends , se gf aur gf se faimily ban gye kabhi socha hi
            nahi. Par itna pta hai ki han ye jagah shayad aur kisiko nahi de
            sakta ye bas tumhari hai. Wo chand ko dekh ke promise kiya tha na
            toh nibhana toh padega hi.
          </p>
          <p>PS: I love you ♾️</p>
        </div>
        <button
          type="button"
          onClick={onSurprise}
          aria-label="Reveal hidden note"
          className="mt-9 inline-grid size-12 place-items-center rounded-full border border-blush/30 bg-blush/10 text-blush shadow-blush transition hover:bg-blush/18 focus:outline-none focus:ring-2 focus:ring-blush/70"
        >
          <SurpriseIcon size={19} />
        </button>
        <AnimatePresence>
          {surprise && (
            <motion.p
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-5 rounded-2xl border border-white/12 bg-white/8 p-5 text-sm leading-7 text-white/70"
            >
              Secret note: the best part of this memory box is that it is still
              unfinished.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function MemoryCloud({ onOpen }: { onOpen: (memory: Memory) => void }) {
  return (
    <section className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          kicker="Memory cloud"
          title="All the photos, still floating"
        />
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {memories.map((memory, index) => (
            <motion.button
              key={memory.id}
              type="button"
              onClick={() => onOpen(memory)}
              initial={{ opacity: 0, y: 40, rotate: index % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 1 : -1 }}
              whileHover={{ y: -10, rotate: 0, scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: index * 0.06 }}
              className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/12 bg-white/8 shadow-glow focus:outline-none focus:ring-2 focus:ring-blush/70"
              aria-label={`Preview ${memory.title}`}
            >
              <Image
                src={memory.src}
                alt={memory.alt}
                fill
                sizes="(min-width: 640px) 20vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 left-3 right-3 text-left font-serif text-xl leading-6 text-white">
                {memory.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemoryModal({
  memory,
  onClose,
}: {
  memory: Memory;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/78 p-4 backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.96 }}
        transition={{ duration: 0.45 }}
        className="glass relative grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.2fr_0.8fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative min-h-[22rem] lg:min-h-[38rem]">
          <Image
            src={memory.src}
            alt={memory.alt}
            fill
            sizes="80vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-blush/80">
            {memory.date}
          </p>
          <h2 className="mt-5 font-serif text-5xl leading-none text-balance">
            {memory.title}
          </h2>
          <p className="mt-7 text-base leading-8 text-white/68">
            {memory.detail}
          </p>
          <div className="mt-8 grid gap-3">
            {closingNotes.slice(0, 2).map((note) => (
              <p
                key={note}
                className="rounded-2xl border border-white/12 bg-white/8 p-4 text-sm text-white/62"
              >
                {note}
              </p>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/15 bg-black/35 text-white/74 backdrop-blur-xl transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blush/70"
        >
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}

function AmbientParticles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute left-[8%] top-[14%] h-72 w-72 rounded-full bg-blush/10 blur-3xl" />
      <div className="absolute right-[7%] top-[20%] h-80 w-80 rounded-full bg-ice/10 blur-3xl" />
      <div className="absolute bottom-[12%] left-[36%] h-80 w-80 rounded-full bg-lavender/10 blur-3xl" />
      {Array.from({ length: 26 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute size-1 rounded-full bg-white/45"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 19) % 100}%`,
          }}
          animate={{ y: [0, -26, 0], opacity: [0.18, 0.7, 0.18] }}
          transition={{
            duration: 5 + (index % 6),
            repeat: Infinity,
            delay: index * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
