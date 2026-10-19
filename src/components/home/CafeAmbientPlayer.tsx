"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Radio } from "lucide-react";
import { cafeAudio, CAFE_PRESETS } from "@/lib/cafe-audio";

export default function CafeAmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  useEffect(() => {
    if (!cafeAudio) return;
    setIsPlaying(cafeAudio.getIsPlaying());
    setVolume(cafeAudio.getVolume());
    setActivePreset(cafeAudio.getPresetIndex());

    const unsubPlay = cafeAudio.subscribe((playing) => setIsPlaying(playing));
    const unsubVol = cafeAudio.subscribeVolume((vol) => setVolume(vol));
    const unsubPreset = cafeAudio.subscribePreset((presetIdx) =>
      setActivePreset(presetIdx)
    );

    return () => {
      unsubPlay();
      unsubVol();
      unsubPreset();
    };
  }, []);

  const handleTogglePlay = () => {
    if (!cafeAudio) return;
    cafeAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) setIsMuted(false);
    if (cafeAudio) cafeAudio.setVolume(val);
  };

  const handleToggleMute = () => {
    if (!cafeAudio) return;
    if (isMuted) {
      cafeAudio.setVolume(volume || 0.5);
      setIsMuted(false);
    } else {
      cafeAudio.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSelectPreset = (idx: number) => {
    if (!cafeAudio) return;
    cafeAudio.setPreset(idx);
    setActivePreset(idx);
    if (!isPlaying) {
      cafeAudio.start();
    }
  };

  const presets = CAFE_PRESETS;
  const currentPreset = presets[activePreset] || presets[0];

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-black/60 rounded-2xl p-4 sm:p-5 shadow-2xl text-left transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Play/Pause button + Track Info */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Animated Glow Play Button */}
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
            className={`relative group shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
              isPlaying
                ? "bg-[#8DA419] text-[#181614] shadow-[#8DA419]/40 ring-4 ring-[#8DA419]/30"
                : "bg-white/10 hover:bg-[#8DA419] text-white hover:text-[#181614]"
            }`}
          >
            {/* Pulsing ring when playing */}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full bg-[#8DA419] animate-ping opacity-30" />
            )}
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current relative z-10" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5 relative z-10" />
            )}
          </button>

          {/* Equalizer Visualizer Bars + Track Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#8DA419]/20 text-[10px] font-bold tracking-wider text-[#ABC438] uppercase">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                {isPlaying ? "Live Café Stream" : "Pour Club Radio"}
              </span>

              {/* Bouncing Audio Bars */}
              <div className="flex items-end gap-1 h-3.5 px-1">
                <span
                  className={`w-0.5 rounded-full bg-[#ABC438] transition-all duration-200 ${
                    isPlaying ? "h-3.5 animate-pulse" : "h-1 opacity-40"
                  }`}
                />
                <span
                  className={`w-0.5 rounded-full bg-[#ABC438] transition-all duration-300 ${
                    isPlaying ? "h-2.5 animate-bounce" : "h-1 opacity-40"
                  }`}
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className={`w-0.5 rounded-full bg-[#ABC438] transition-all duration-200 ${
                    isPlaying ? "h-3.5 animate-pulse" : "h-1 opacity-40"
                  }`}
                  style={{ animationDelay: "300ms" }}
                />
                <span
                  className={`w-0.5 rounded-full bg-[#ABC438] transition-all duration-300 ${
                    isPlaying ? "h-2 animate-bounce" : "h-1 opacity-40"
                  }`}
                  style={{ animationDelay: "450ms" }}
                />
              </div>
            </div>

            <h4 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate mt-0.5">
              {currentPreset.title}
            </h4>
            <p className="text-xs text-white/70 truncate">
              {currentPreset.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Sound Presets + Volume Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto pt-2 sm:pt-0 min-w-0">
          {/* Mood Presets Pill Selector */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-black/40 p-1 rounded-xl text-xs overflow-x-auto no-scrollbar flex-nowrap shrink min-w-0">
            {presets.map((preset, idx) => (
              <button
                key={preset.title}
                onClick={() => handleSelectPreset(idx)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium text-[10px] sm:text-[11px] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activePreset === idx
                    ? "bg-[#8DA419] text-[#181614] font-semibold shadow-xs"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {idx === 0 ? "🌧️ Rainy Lo-Fi" : idx === 1 ? "☕ Sunset Jazz" : "🌙 Midnight"}
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 pl-1">
            <button
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#ABC438]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Adjust volume"
              className="w-14 sm:w-20 accent-[#8DA419] h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Helpful subtle hint when paused */}
      {!isPlaying && (
        <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-white/60">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ABC438]" />
            Tap Play to experience our outlet’s live ambient acoustic vibe while browsing.
          </span>
          <span className="hidden sm:inline text-white/40 font-mono">
            WebAudio • Zero Latency
          </span>
        </div>
      )}
    </div>
  );
}
