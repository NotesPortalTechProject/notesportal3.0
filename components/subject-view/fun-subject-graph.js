"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AddSubjectModal from "../edit-subjects/add-sub";

const REPEL_STRENGTH = 0.9;
const DAMPING = 0.9;
const SLEEP_THRESHOLD = 0.02;
const NEIGHBORS_PER_NODE = 2;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function nodeDiameter(count) {
  return clamp(640 / Math.sqrt(count + 2), 56, 112);
}

function scatterLayout(subjects, width, height, radius) {
  const n = subjects.length;
  const cols = Math.max(1, Math.round(Math.sqrt((n * width) / height)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const cellW = width / cols;
  const cellH = height / rows;

  return subjects.map((subject, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = (Math.random() - 0.5) * cellW * 0.5;
    const jitterY = (Math.random() - 0.5) * cellH * 0.5;
    return {
      subject,
      x: clamp(cellW * (col + 0.5) + jitterX, radius, Math.max(width - radius, radius)),
      y: clamp(cellH * (row + 0.5) + jitterY, radius, Math.max(height - radius, radius)),
      vx: 0,
      vy: 0,
      dragging: false,
    };
  });
}

function nearestNeighborEdges(nodes, k) {
  const edgeKeys = new Set();
  const edges = [];
  nodes.forEach((a, i) => {
    const ranked = nodes
      .map((b, j) => ({ j, dist: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter(({ j }) => j !== i)
      .sort((x, y) => x.dist - y.dist)
      .slice(0, k);
    ranked.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeKeys.has(key)) {
        edgeKeys.add(key);
        edges.push({
          key,
          a: nodes[i].subject,
          b: nodes[j].subject,
          ax: nodes[i].x,
          ay: nodes[i].y,
          bx: nodes[j].x,
          by: nodes[j].y,
        });
      }
    });
  });
  return edges;
}

export default function FunSubjectGraph({ subjects, id }) {
  const containerRef = useRef(null);
  const elRefs = useRef({});
  const edgeElRefs = useRef({});
  const incidentEdges = useRef({});
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const rafRef = useRef(null);
  const dragRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [edges, setEdges] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const router = useRouter();
  const diameter = useMemo(() => nodeDiameter(subjects.length), [subjects.length]);
  const radius = diameter / 2;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handler = (e) => setReducedMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const next = { width: entry.contentRect.width, height: entry.contentRect.height };
      sizeRef.current = next;
      setSize(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const applyEdgesFor = useCallback((subject) => {
    const incident = incidentEdges.current[subject];
    if (!incident) return;
    incident.forEach(({ key, end }) => {
      const line = edgeElRefs.current[key];
      const node = nodesRef.current.find((n) => n.subject === subject);
      if (!line || !node) return;
      if (end === "a") {
        line.setAttribute("x1", node.x);
        line.setAttribute("y1", node.y);
      } else {
        line.setAttribute("x2", node.x);
        line.setAttribute("y2", node.y);
      }
    });
  }, []);

  const applyTransform = useCallback((subject) => {
    const node = nodesRef.current.find((n) => n.subject === subject);
    const el = elRefs.current[subject];
    if (node && el) {
      el.style.transform = `translate(${node.x - radius}px, ${node.y - radius}px)`;
    }
    applyEdgesFor(subject);
  }, [radius, applyEdgesFor]);

  const wake = useCallback(() => {
    if (reducedMotion || rafRef.current || sizeRef.current.width === 0) return;
    const tick = () => {
      const nodes = nodesRef.current;
      const { width, height } = sizeRef.current;
      let maxSpeed = 0;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.dragging) continue;
        let fx = 0;
        let fy = 0;

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const minDist = radius * 2.3;
          if (dist < minDist) {
            const force = ((minDist - dist) / minDist) * REPEL_STRENGTH;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }

        a.vx = (a.vx + fx) * DAMPING;
        a.vy = (a.vy + fy) * DAMPING;
        a.x = clamp(a.x + a.vx, radius, Math.max(width - radius, radius));
        a.y = clamp(a.y + a.vy, radius, Math.max(height - radius, radius));

        maxSpeed = Math.max(maxSpeed, Math.abs(a.vx) + Math.abs(a.vy));
        applyTransform(a.subject);
      }

      if (maxSpeed > SLEEP_THRESHOLD) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [applyTransform, radius, reducedMotion]);

  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;
    const existing = new Map(nodesRef.current.map((n) => [n.subject, n]));
    const isFreshLayout = nodesRef.current.length === 0;

    if (isFreshLayout) {
      nodesRef.current = scatterLayout(subjects, size.width, size.height, radius);
    } else {
      const carried = subjects.map((subject) => existing.get(subject)).filter(Boolean);
      const newSubjects = subjects.filter((subject) => !existing.has(subject));
      const added = scatterLayout(newSubjects, size.width, size.height, radius);
      nodesRef.current = [...carried, ...added];
    }

    const newEdges = nearestNeighborEdges(nodesRef.current, NEIGHBORS_PER_NODE);
    edgesRef.current = newEdges;
    setEdges(newEdges);

    const incident = {};
    newEdges.forEach(({ key, a, b }) => {
      (incident[a] ||= []).push({ key, end: "a" });
      (incident[b] ||= []).push({ key, end: "b" });
    });
    incidentEdges.current = incident;

    requestAnimationFrame(() => {
      nodesRef.current.forEach((n) => applyTransform(n.subject));
    });
    wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, size, radius]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePointerDown = (subject) => (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const node = nodesRef.current.find((n) => n.subject === subject);
    if (!node) return;
    node.dragging = true;
    node.vx = 0;
    node.vy = 0;
    dragRef.current = {
      subject,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
      moved: false,
    };
  };

  const handlePointerMove = (subject) => (e) => {
    const drag = dragRef.current;
    if (!drag || drag.subject !== subject) return;
    const node = nodesRef.current.find((n) => n.subject === subject);
    if (!node) return;

    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    if (Math.abs(e.clientX - drag.startX) > 3 || Math.abs(e.clientY - drag.startY) > 3) {
      drag.moved = true;
    }

    node.x = clamp(node.x + dx, radius, Math.max(size.width - radius, radius));
    node.y = clamp(node.y + dy, radius, Math.max(size.height - radius, radius));
    applyTransform(subject);

    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    node.vx = reducedMotion ? 0 : (dx / dt) * 12;
    node.vy = reducedMotion ? 0 : (dy / dt) * 12;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.lastT = now;
  };

  const handlePointerUp = (subject) => () => {
    const drag = dragRef.current;
    const node = nodesRef.current.find((n) => n.subject === subject);
    if (node) node.dragging = false;
    dragRef.current = null;
    wake();
    if (drag && !drag.moved) {
      router.push(`/subject/${subject}`);
    }
  };

  if (subjects.length === 0) {
    return (
      <div className="w-full h-[280px] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-white/70 text-lg font-semibold">No subjects found.</p>
        <AddSubjectModal id={id} subjectList={subjects} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] sm:h-[480px] md:h-[560px]"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {edges.map(({ key, ax, ay, bx, by }) => (
          <line
            key={key}
            ref={(el) => {
              edgeElRefs.current[key] = el;
            }}
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            style={{ stroke: "rgb(var(--theme-glow-500) / 0.3)" }}
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {subjects.map((subject) => (
        <div
          key={subject}
          ref={(el) => {
            elRefs.current[subject] = el;
          }}
          className="absolute flex items-center justify-center rounded-full select-none touch-none cursor-pointer active:cursor-grabbing"
          style={{ width: diameter, height: diameter, left: 0, top: 0, willChange: "transform", zIndex: 1 }}
          onPointerDown={handlePointerDown(subject)}
          onPointerMove={handlePointerMove(subject)}
          onPointerUp={handlePointerUp(subject)}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center text-center px-2 border border-white/10 backdrop-blur-sm bg-white/5 shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition-colors duration-200 hover:border-[rgb(var(--theme-glow-500)/0.6)]">
            <span className="text-[11px] sm:text-sm font-medium text-white/90 leading-snug line-clamp-2 break-words">
              {subject}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
