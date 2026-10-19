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
    <section className="py-12 sm:py-16 lg:py-20 bg-[#121110] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[340px] sm:h-[460px] md:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#181614] group"
        >
          {/* Looping Gemini-Generated Video */}
          <video
            ref={videoRef}
            src="/gemini_generated_video_627ad510.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
          />

          {/* Background Dark Overlay Layers for Readability & Depth */}
          <div className="absolute inset-0 bg-black/55 backdrop-contrast-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-black/40 to-[#121110]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />

          {/* Centered One-Line Content Overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 max-w-4xl mx-auto space-y-3 sm:space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#ABC438] drop-shadow-md"
            >
              Live Barista Counter
            </motion.span>

            {/* Little Text - Exactly One Line */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight sm:leading-snug drop-shadow-2xl"
            >
              Every shot pulled with precision, ready the moment you arrive.
            </motion.h2>
          </div>

          {/* Subtle Video Controls (Play/Pause & Sound) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 ${
                isMuted
                  ? "bg-black/60 hover:bg-black/85 text-white/80 hover:text-white"
                  : "bg-[#8DA419] text-[#121110] shadow-[#8DA419]/30"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
