"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function CraftVideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#121110]">
      {/* Looping Gemini-Generated Video - Full Bleed Cover */}
      <video
        ref={videoRef}
        src="/gemini_generated_video_627ad510.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Background Dark Overlay Layers for Cinematic Readability & Seamless Transition */}
      <div className="absolute inset-0 bg-black/60 backdrop-contrast-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-[#121110]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#121110]/90 via-black/30 to-[#121110]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* Centered One-Line Content Overlay */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-24 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#ABC438] drop-shadow-md"
        >
          Live Barista Counter
        </motion.span>

        {/* Little Text - Exactly One Line */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-normal tracking-tight leading-[1.12] sm:leading-[1.1] drop-shadow-2xl max-w-5xl"
        >
          Every shot pulled with precision, ready the moment you arrive.
        </motion.h2>
      </div>

      {/* Subtle Video Controls (Play/Pause & Sound) */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-2.5">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="p-3 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-xl active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>

        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className={`p-3 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xl active:scale-95 ${
            isMuted
              ? "bg-black/60 hover:bg-black/85 text-white/80 hover:text-white"
              : "bg-[#8DA419] text-[#121110] shadow-[#8DA419]/40"
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </section>
  );
}
