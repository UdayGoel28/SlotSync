"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Review = {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url: string;
};

export function Reviews3DStack({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 relative overflow-hidden" onClick={handleNext}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F7C4BC]/10 to-transparent pointer-events-none" />
      <h3 className="text-xl font-serif text-[#2C2C2C] mb-8 font-light z-10">What Clients Say</h3>
      
      <div className="relative w-full max-w-md h-[250px] flex justify-center items-center cursor-pointer perspective-[1000px]" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="popLayout">
          {reviews.map((review, i) => {
            const isFront = i === index;
            const isBehind1 = i === (index + 1) % reviews.length;
            const isBehind2 = i === (index + 2) % reviews.length;

            if (!isFront && !isBehind1 && !isBehind2) return null;

            let zIndex = 30;
            let scale = 1;
            let y = 0;
            let rotateX = 0;
            let opacity = 1;

            if (isBehind1) {
              zIndex = 20;
              scale = 0.9;
              y = -20;
              rotateX = 10;
              opacity = 0.6;
            } else if (isBehind2) {
              zIndex = 10;
              scale = 0.8;
              y = -40;
              rotateX = 20;
              opacity = 0.3;
            }

            return (
              <motion.div
                key={review.author_name + review.time}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{
                  opacity,
                  y,
                  scale,
                  rotateX,
                  zIndex,
                }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute w-full max-w-sm bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-2xl origin-bottom"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={review.profile_photo_url} alt={review.author_name} className="w-12 h-12 rounded-full shadow-sm object-cover" />
                  <div>
                    <div className="font-medium text-[#2C2C2C] text-sm">{review.author_name}</div>
                    <div className="flex text-yellow-500 text-xs mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx}>{idx < review.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#2C2C2C]/80 text-sm italic leading-relaxed line-clamp-4">"{review.text}"</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <p className="text-xs text-[#2C2C2C]/40 mt-8 z-10 font-medium">Tap to view more reviews</p>
    </div>
  );
}
