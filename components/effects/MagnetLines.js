"use client";
import { useRef, useEffect } from "react";

export default function MagnetLines({
  rows = 9,
  columns = 9,
  containerWidth = "100vw",
  containerHeight = "100vh",
  lineColor = "#efefef",
  lineWidth = "1vmin",
  lineHeight = "6vmin",
  baseAngle = -10,
  className = "",
  style = {},
}) {

  const containerRef = useRef(null);
  const pointerRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef(null);
  const anglesRef = useRef([]);
  const centersRef = useRef([]);

  const updateCenters = () => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll("span");
    centersRef.current = Array.from(items).map((item) => {
      const rect = item.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll("span");
    anglesRef.current = new Array(items.length).fill(baseAngle);

    // Wait for layout before getting centers
    const resizeObserver = new ResizeObserver(() => {
      updateCenters();
    });

    resizeObserver.observe(container);
    updateCenters();

    const onPointerMove = (e) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
    };

    const animate = () => {
      items.forEach((item, index) => {
        const { x, y } = centersRef.current[index] || { x: 0, y: 0 };
        const dx = pointerRef.current.x - x;
        const dy = pointerRef.current.y - y;

        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        let currentAngle = anglesRef.current[index];
        let delta = targetAngle - currentAngle;
        delta = ((delta + 180) % 360) - 180;
        currentAngle += delta * 0.1;

        anglesRef.current[index] = currentAngle;
        item.style.transform = `rotateZ(${currentAngle.toFixed(2)}deg)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [rows, columns, baseAngle]);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      style={{
        display: "block",
        backgroundColor: lineColor,
        width: lineWidth,
        height: lineHeight,
        transform: `rotateZ(${baseAngle}deg)`,
        transformOrigin: "center",
        willChange: "transform",
      }}
    />
  ));

  return (
    <div
      ref={containerRef}
      className={`grid ${className}`}
      style={{
  display: "grid",
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gridTemplateRows: `repeat(${rows}, 1fr)`,
  width: containerWidth,
  height: containerHeight,
  pointerEvents: "none",
  ...style,
}}

    >
      {spans}
    </div>
  );
}
