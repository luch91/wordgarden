import { useEffect, useMemo, useRef, useState } from "react";
import { Focus, Leaf, Minus, Plus, Route as PathIcon } from "lucide-react";
import { Link } from "react-router-dom";
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
const notes = [
  {
    title: "Meaning",
    kind: "Botanical note · interpretation",
    body: "Meanings grow through use, situation and community. This bed invites close reading rather than a single universal definition.",
    signal: "A prism garden",
  },
  {
    title: "Origins",
    kind: "Botanical note · movement",
    body: "Words travel between places, generations and languages. Etymology can trace movement without reducing a living word to one root.",
    signal: "A migrating bloom",
  },
  {
    title: "Relationships",
    kind: "Botanical note · connection",
    body: "Words gain texture from the expressions beside them: contrasts, metaphors, forms of address and shared references.",
    signal: "A climbing vine",
  },
  {
    title: "Culture",
    kind: "Botanical note · context",
    body: "Cultural context explains when language belongs, how it is used and why a literal gloss may be incomplete.",
    signal: "A many-seasoned bed",
  },
  {
    title: "Memory",
    kind: "Botanical note · transmission",
    body: "Language can carry stories through speech, ritual and family memory even when online documentation is limited.",
    signal: "A seed bank of voices",
  },
  {
    title: "Kinship",
    kind: "Botanical note · belonging",
    body: "Terms of relationship can express responsibility, affection and belonging in ways that resist one-to-one translation.",
    signal: "Interwoven roots",
  },
];
export function GardenWorld({
  entries,
  loading,
  error,
}: {
  entries: WordEntry[];
  loading: boolean;
  error: string;
}) {
  const stage = useRef<HTMLDivElement>(null),
    pts = useRef(new Map<number, { x: number; y: number }>()),
    g = useRef({ cx: 0, cy: 0, x: 0, y: 0, d: 0 });
  const [cam, setCam] = useState<Cam>({ x: 0, y: 0, scale: 1 }),
    [sel, setSel] = useState(""),
    [hint, setHint] = useState(true),
    [view, setView] = useState({ w: 1, h: 1 });
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const update = () => setView({ w: el.clientWidth, h: el.clientHeight });
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
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
    try {
      stage.current?.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic touch */
    }
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
    const remaining = [...pts.current.values()][0];
    if (remaining)
      g.current = {
        cx: cam.x,
        cy: cam.y,
        x: remaining.x,
        y: remaining.y,
        d: 0,
      };
  }
  const focus = (_x: number, _y: number, id: string) => {
      setSel(id);
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
          if (e.key === "Escape") setSel("");
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
              className={`plant-object record-specimen ${sel === entry.id ? "is-selected" : ""}`}
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
              width: `${clamp((view.w / (WORLD.w * cam.scale)) * 100, 4, 100)}%`,
              height: `${clamp((view.h / (WORLD.h * cam.scale)) * 100, 4, 100)}%`,
              left: `${clamp(((WORLD.w / 2 - view.w / (2 * cam.scale) - cam.x / cam.scale) / WORLD.w) * 100, 0, 100)}%`,
              top: `${clamp(((WORLD.h / 2 - view.h / (2 * cam.scale) - cam.y / cam.scale) / WORLD.h) * 100, 0, 100)}%`,
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
        {(entry || sel.startsWith("d")) && (
          <article
            className="specimen-card discovery-panel"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSel("")} aria-label="Close specimen">
              ×
            </button>
            {entry ? (
              <>
                <span>
                  {entry.language_name} · {entry.documentation_level}{" "}
                  documentation · {entry.assessment_status}
                </span>
                <h2>{entry.word}</h2>
                <p>{entry.definition}</p>
                <blockquote>“{entry.usage_example}”</blockquote>
                <p className="journal-context">{entry.cultural_context}</p>
                <Link
                  to={`/plant/${entry.id}`}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  Open field journal →
                </Link>
              </>
            ) : (
              (() => {
                const n = notes[Number(sel.slice(1))];
                return (
                  <>
                    <span>{n.kind}</span>
                    <h2>{n.title}</h2>
                    <p>{n.body}</p>
                    <small>{n.signal}</small>
                    <Link to="/collections">Follow this garden path →</Link>
                  </>
                );
              })()
            )}
          </article>
        )}
      </div>
    </section>
  );
}
