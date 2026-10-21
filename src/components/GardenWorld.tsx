import { useMemo, useRef, useState } from "react";
import { Focus, Leaf, Minus, Plus, Route as PathIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WordEntry } from "../types";
const beds = [
  { name: "Meaning", x: 24, y: 55, note: "Decorative discovery bed" },
  { name: "Origins", x: 72, y: 31, note: "Decorative garden terrace" },
  { name: "Relationships", x: 79, y: 62, note: "Decorative specimen path" },
  { name: "Culture", x: 48, y: 22, note: "Decorative conservatory" },
];
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
export function GardenWorld({
  entries,
  loading,
  error,
}: {
  entries: WordEntry[];
  loading: boolean;
  error: string;
}) {
  const navigate = useNavigate(),
    stage = useRef<HTMLDivElement>(null),
    points = useRef(new Map<number, { x: number; y: number }>()),
    drag = useRef({ x: 0, y: 0, cx: 0, cy: 0, d: 0 });
  const [cam, setCam] = useState({ x: 0, y: 0, scale: 1 }),
    [selected, setSelected] = useState(""),
    [hint, setHint] = useState(true);
  const accepted = entries.filter((e) => e.assessment_status === "ACCEPTED"),
    entry = accepted.find((e) => e.id === selected);
  const specimens = useMemo(
    () =>
      accepted.map((entry, i) => ({
        entry,
        x: 24 + (i % 4) * 16,
        y: 57 + (i % 2) * 9,
      })),
    [accepted],
  );
  const scale = (n: number) =>
    setCam((c) => ({ ...c, scale: clamp(n, 0.86, 2.25) }));
  function down(e: React.PointerEvent) {
    stage.current?.setPointerCapture(e.pointerId);
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, d: 0 };
    setHint(false);
  }
  function move(e: React.PointerEvent) {
    if (!points.current.has(e.pointerId)) return;
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...points.current.values()];
    if (p.length === 2) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (drag.current.d) scale((cam.scale * d) / drag.current.d);
      drag.current.d = d;
      return;
    }
    setCam((c) => ({
      ...c,
      x: clamp(drag.current.cx + e.clientX - drag.current.x, -520, 520),
      y: clamp(drag.current.cy + e.clientY - drag.current.y, -230, 230),
    }));
  }
  function up(e: React.PointerEvent) {
    points.current.delete(e.pointerId);
    drag.current.d = 0;
  }
  function focus(x: number, y: number, id = "") {
    setSelected(id);
    setCam({ x: (50 - x) * 7, y: (48 - y) * 4, scale: 1.42 });
    setHint(false);
  }
  function keys(e: React.KeyboardEvent) {
    const d = 30;
    if (e.key === "ArrowLeft") setCam((c) => ({ ...c, x: c.x + d }));
    if (e.key === "ArrowRight") setCam((c) => ({ ...c, x: c.x - d }));
    if (e.key === "ArrowUp") setCam((c) => ({ ...c, y: c.y + d }));
    if (e.key === "ArrowDown") setCam((c) => ({ ...c, y: c.y - d }));
    if (e.key === "+" || e.key === "=") scale(cam.scale + 0.14);
    if (e.key === "-") scale(cam.scale - 0.14);
  }
  return (
    <section className="garden-world">
      <div className="garden-heading">
        <span>A BOTANICAL MUSEUM OF LANGUAGE</span>
        <h1>Wander until a word finds you.</h1>
      </div>
      <div
        ref={stage}
        className="garden-stage"
        tabIndex={0}
        onKeyDown={keys}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onWheel={(e) => {
          e.preventDefault();
          scale(cam.scale + (e.deltaY < 0 ? 0.12 : -0.12));
          setHint(false);
        }}
      >
        <div
          className="garden-scene"
          style={{
            transform: `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.scale})`,
          }}
        >
          <img
            src="/garden-world.jpg"
            draggable={false}
            alt="A luminous conservatory with winding paths, bridges and flowering terraces"
          />
          <div className="garden-light" aria-hidden="true" />
          {beds.map((b, i) => (
            <button
              className={`bed-marker bed-${i}`}
              key={b.name}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(b.x, b.y)}
            >
              <span>{b.name}</span>
              <small>{b.note}</small>
            </button>
          ))}
          {specimens.map(({ entry, x, y }) => (
            <button
              className="word-specimen"
              key={entry.id}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                filter: `hue-rotate(${(parseInt(entry.id.slice(0, 3), 16) % 50) - 25}deg)`,
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(x, y, entry.id)}
            >
              <i />
              <span>{entry.word}</span>
              <small>{entry.language_name} · documented specimen</small>
            </button>
          ))}
        </div>
        {hint && (
          <div className="garden-hint">
            <PathIcon /> Drag the paths · scroll or pinch to wander
          </div>
        )}
        <div className="garden-controls">
          <button onClick={() => scale(cam.scale + 0.16)} aria-label="Zoom in">
            <Plus />
          </button>
          <button onClick={() => scale(cam.scale - 0.16)} aria-label="Zoom out">
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
          className="garden-map"
          onClick={() => setCam({ x: 0, y: 0, scale: 1 })}
          aria-label="Reset garden camera"
        >
          <img src="/garden-world.jpg" alt="" />
          <span
            style={{
              transform: `translate(${-cam.x / 18}px,${-cam.y / 14}px) scale(${1 / cam.scale})`,
            }}
          />
        </button>
        <div className="garden-proof">
          <Leaf />
          <div>
            <strong>
              {loading
                ? "Listening to the roots…"
                : error
                  ? "The registry path is quiet"
                  : `${accepted.length} documented ${accepted.length === 1 ? "word" : "words"}`}
            </strong>
            <small>Only labelled specimens are finalised records.</small>
          </div>
        </div>
        {entry && (
          <article className="specimen-popover">
            <button onClick={() => setSelected("")} aria-label="Close specimen">
              ×
            </button>
            <span>
              {entry.language_name} · {entry.documentation_level}
            </span>
            <h2>{entry.word}</h2>
            <blockquote>“{entry.definition}”</blockquote>
            <p>{entry.cultural_context}</p>
            <button onClick={() => navigate(`/plant/${entry.id}`)}>
              Open field journal →
            </button>
          </article>
        )}
      </div>
    </section>
  );
}
