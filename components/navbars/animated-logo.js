"use client";
import { useEffect, useState } from "react";

export default function AnimatedLogo() {
    const text = "notesportal";
    const animationLength = 5;

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => {
                return (prev + 1) % text.length;
            });
        }, 180);

        return () => clearInterval(interval);
    }, [text.length]);

    return (
        <div className="flex-shrink-0 select-none cursor-pointer overflow-hidden">
            <p className="flex items-center font-bold tracking-tight leading-none text-xl sm:text-2xl md:text-3xl">

                {text.split("").map((char, idx) => {

                    const isActive = [...Array(animationLength)].some(
                        (_, i) => (activeIndex + i) % text.length === idx
                    );

                    return (
                        <span
                            key={idx}
                            style={{
                                color: isActive ? "#9333ea" : "#ffffff",
                                transition: "color 0.9s linear",
                                display: "inline-block",
                                willChange: "color",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}

            </p>
        </div>
    );
}