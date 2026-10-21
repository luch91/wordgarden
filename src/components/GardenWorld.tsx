import { useMemo, useRef, useState } from "react";
import { Focus, Leaf, Minus, Plus, Route as PathIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WordEntry } from "../types";
type Cam = { x: number; y: number; scale: number };
const WORLD = { w: 1800, h: 1050 },
  clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const beds = [
  ["Meaning", 350, 620, 0],
  ["Origins", 1370, 350, 1],
  ["Relationships", 1390, 720, 2],
  ["Culture", 900, 250, 3],
  ["Memory", 570, 790, 4],
  ["Kinship", 1120, 790, 5],
] as const;
export function GardenWorld({
  entries,
  loading,
  error,
}: {
  entries: WordEntry[];
  loading: boolean;
  error: string;
}) {
  const nav = useNavigate(),
    stage = useRef<HTMLDivElement>(null),
    pts = useRef(new Map<number, { x: number; y: number }>()),
    g = useRef({ cx: 0, cy: 0, x: 0, y: 0, d: 0 });
  const [cam, setCam] = useState<Cam>({ x: 0, y: 0, scale: 1 }),
    [sel, setSel] = useState(""),
    [hint, setHint] = useState(true);
  const accepted = entries.filter((e) => e.assessment_status === "ACCEPTED"),
    entry = accepted.find((e) => e.id === sel),
    specimens = useMemo(
      () =>
        accepted.map((entry, i) => ({
          entry,
          x: 760 + (i % 4) * 210,
          y: 570 + Math.floor(i / 4) * 180,
          s: i % 6,
        })),
      [accepted],
    );
  const bound = (c: Cam) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return c;
    const mx = Math.max(0, (WORLD.w * c.scale - r.width) / 2),
      my = Math.max(0, (WORLD.h * c.scale - r.height) / 2);
    return { ...c, x: clamp(c.x, -mx, mx), y: clamp(c.y, -my, my) };
  };
  const zoom = (z: number, x: number, y: number) =>
    setCam((c) => {
      const r = stage.current?.getBoundingClientRect();
      if (!r) return c;
      const s = clamp(z, 0.72, 2.25),
        px = x - r.left - r.width / 2,
        py = y - r.top - r.height / 2;
      return bound({
        scale: s,
        x: px - ((px - c.x) * s) / c.scale,
        y: py - ((py - c.y) * s) / c.scale,
      });
    });
  function down(e: React.PointerEvent) {
    try { stage.current?.setPointerCapture(e.pointerId); } catch { /* synthetic touch */ }
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    g.current = { cx: cam.x, cy: cam.y, x: e.clientX, y: e.clientY, d: 0 };
    setHint(false);
  }
  function move(e: React.PointerEvent) {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    if (p.length === 2) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y),
        x = (p[0].x + p[1].x) / 2,
        y = (p[0].y + p[1].y) / 2;
      if (g.current.d) zoom((cam.scale * d) / g.current.d, x, y);
      g.current.d = d;
      return;
    }
    setCam((c) =>
      bound({
        ...c,
        x: g.current.cx + e.clientX - g.current.x,
        y: g.current.cy + e.clientY - g.current.y,
      }),
    );
  }
  function up(e: React.PointerEvent) {
    pts.current.delete(e.pointerId);
    g.current.d = 0;
  }
  const focus = (x: number, y: number, id: string) => {
      setSel(id);
      setCam(
        bound({
          scale: 1.5,
          x: (WORLD.w / 2 - x) * 1.5,
          y: (WORLD.h / 2 - y) * 1.5,
        }),
      );
    },
    tr = (d: number) =>
      `translate3d(${cam.x * d}px,${cam.y * d}px,0) scale(${1 + (cam.scale - 1) * d})`;
  return (
    <section className="garden-world layered-garden">
      <div className="garden-heading">
        <span>A BOTANICAL MUSEUM OF LANGUAGE</span>
        <h1>Every word carries a world. Wander until one finds you.</h1>
      </div>
      <div
        ref={stage}
        className="garden-stage"
        tabIndex={0}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onWheel={(e) =>
          zoom(cam.scale + (e.deltaY < 0 ? 0.12 : -0.12), e.clientX, e.clientY)
        }
        onKeyDown={(e) => {
          const d = 50;
          if (e.key === "ArrowLeft") setCam((c) => bound({ ...c, x: c.x + d }));
          if (e.key === "ArrowRight")
            setCam((c) => bound({ ...c, x: c.x - d }));
          if (e.key === "ArrowUp") setCam((c) => bound({ ...c, y: c.y + d }));
          if (e.key === "ArrowDown") setCam((c) => bound({ ...c, y: c.y - d }));
        }}
      >
        <div
          className="garden-depth garden-sky"
          style={{ transform: tr(0.12) }}
        />
        <div
          className="garden-depth garden-paths"
          style={{ transform: tr(0.35) }}
        />
        <div
          className="garden-scene garden-object-plane"
          style={{
            width: WORLD.w,
            height: WORLD.h,
            transform: `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.scale})`,
          }}
        >
          {beds.map(([name, x, y, s], i) => (
            <button
              key={name}
              className={`plant-object decorative-plant ${sel === `d${i}` ? "is-selected" : ""}`}
              style={{ left: x, top: y }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(x, y, `d${i}`)}
            >
              <i className={`plant-sprite plant-${s}`} />
              <span>{name}</span>
              <small>Decorative collection</small>
            </button>
          ))}
          {specimens.map(({ entry, x, y, s }) => (
            <button
              key={entry.id}
              className={`plant-object word-specimen ${sel === entry.id ? "is-selected" : ""}`}
              style={{ left: x, top: y }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(x, y, entry.id)}
            >
              <i className={`plant-sprite plant-${s}`} />
              <span>{entry.word}</span>
              <small>{entry.language_name} · documented</small>
            </button>
          ))}
        </div>
        <div
          className="garden-depth garden-foreground"
          style={{ transform: tr(1.12) }}
        />
        {hint && (
          <div className="garden-hint">
            <PathIcon />
            Drag · zoom at pointer · pinch
          </div>
        )}
        <div className="garden-controls">
          <button
            onClick={(e) => zoom(cam.scale + 0.18, e.clientX, e.clientY)}
            aria-label="Zoom in"
          >
            <Plus />
          </button>
          <button
            onClick={(e) => zoom(cam.scale - 0.18, e.clientX, e.clientY)}
            aria-label="Zoom out"
          >
            <Minus />
          </button>
          <button
            onClick={() => setCam({ x: 0, y: 0, scale: 1 })}
            aria-label="Reset garden"
          >
            <Focus />
          </button>
        </div>
        <button
          className="garden-map live-garden-map"
          onClick={() => setCam({ x: 0, y: 0, scale: 1 })}
          aria-label="Reset garden camera"
        >
          {beds.map((o) => (
            <i
              key={o[0]}
              style={{
                left: `${(o[1] / WORLD.w) * 100}%`,
                top: `${(o[2] / WORLD.h) * 100}%`,
              }}
            />
          ))}
          <span
            style={{
              width: `${Math.min(92, 100 / cam.scale)}%`,
              height: `${Math.min(88, 100 / cam.scale)}%`,
              transform: `translate(calc(-50% + ${-cam.x / 18}px),calc(-50% + ${-cam.y / 14}px))`,
            }}
          />
        </button>
        <div className="garden-proof">
          <Leaf />
          <div>
            <strong>
              {loading
                ? "Reading garden…"
                : error
                  ? "Garden signal interrupted"
                  : `${accepted.length} documented words`}
            </strong>
            <small>Only labelled specimens are finalised records.</small>
          </div>
        </div>
        {entry && (
          <article className="specimen-card">
            <button onClick={() => setSel("")} aria-label="Close specimen">
              ×
            </button>
            <span>
              {entry.language_name} · {entry.documentation_level}
            </span>
            <h2>{entry.word}</h2>
            <p>{entry.definition}</p>
            <button onClick={() => nav(`/word/${entry.id}`)}>
              Open field journal →
            </button>
          </article>
        )}
      </div>
    </section>
  );
}
