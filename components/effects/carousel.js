"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({
  items = [],
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = true,
  round = false,
  onRemove,
}) {
  const trackItemOffset = 100 + GAP;
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimatingWrap, setIsAnimatingWrap] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleResize = () => {
    if (containerRef.current) {
      x.set(-containerRef.current.offsetWidth * currentIndex);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        if (currentIndex === items.length - 1) {
          animateLoop("forward");
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, currentIndex, isHovered, pauseOnHover]);

  const animateLoop = (direction) => {
    if (isAnimatingWrap) return;
    setIsAnimatingWrap(true);

    const total = items.length;
    const step = direction === "forward" ? 1 : -1;
    const limit = direction === "forward" ? total : -1;
    let i = currentIndex;

    const interval = setInterval(() => {
      i += step;
      if (i === limit) {
        clearInterval(interval);
        setCurrentIndex(direction === "forward" ? 0 : total - 1);
        setIsAnimatingWrap(false);
      } else {
        setCurrentIndex(i);
      }
    }, 120);
  };

  const handleDragEnd = (_, info) => {
    if (isAnimatingWrap) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const isNext = offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD;
    const isPrev = offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD;

    if (isNext) {
      if (currentIndex === items.length - 1 && loop) {
        animateLoop("forward");
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
      }
    } else if (isPrev) {
      if (currentIndex === 0 && loop) {
        animateLoop("backward");
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = {
    dragConstraints: {
      left: -containerRef.current?.offsetWidth * (items.length - 1),
      right: 0,
    },
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full p-2">
      <motion.div
        className="flex w-full gap-4"
        drag="x"
        {...dragProps}
        style={{ x }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * (containerRef.current?.offsetWidth || 0)) }}
        transition={SPRING_OPTIONS}
      >
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const isLeft = index < currentIndex;
          const isRight = index > currentIndex;

          return (
            <motion.div
              key={index}
              onClick={() => router.push(item.href || "#")} // ✅ Whole card clickable
              className="shrink-0 flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60 backdrop-blur-md rounded-2xl border border-white/10 cursor-pointer active:cursor-grabbing"
              style={{ width: "100%" }}
              animate={{
                rotateY: isActive ? 0 : isLeft ? 90 : -90,
                opacity: isActive ? 1 : 0.5,
                scale: isActive ? 1 : 0.95,
              }}
              transition={SPRING_OPTIONS}
            >
              <div className="p-4">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-purple-700 via-fuchsia-600 to-purple-800 text-white shadow-md">
                  {item.icon}
                </div>
              </div>
              <div className="p-4 block">
                <div className="font-bold text-base text-purple-200 mb-1 truncate">
                  {item.title}
                </div>
                <p className="text-xs text-white/70 leading-snug">
                  {item.description}
                </p>

                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent navigation when removing
                      onRemove(item.title);
                    }}
                    className="mt-3 w-full text-xs text-red-400 border border-red-400/30 rounded-md px-2 py-1 bg-red-500/10"
                  >
                    Remove Subject
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {items.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-150 ${
              currentIndex === index ? "bg-purple-400" : "bg-purple-800/30"
            }`}
            animate={{ scale: currentIndex === index ? 1.2 : 1 }}
            onClick={() => setCurrentIndex(index)}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
