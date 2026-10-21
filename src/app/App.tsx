import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BookOpen,
  ChevronRight,
  Flower2,
  Menu,
  Search,
  ShieldCheck,
  Sprout,
  Wallet,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Plant } from "../components/Plant";
import { connectWallet, getEntry, submitEntry } from "../genlayer/client";
import { isConfigured, network } from "../genlayer/config";
import { useGarden } from "../hooks/useGarden";
import type { Submission, TxPhase, WordEntry } from "../types";
import { GardenWorld } from "../components/GardenWorld";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }
  render() {
    return this.state.failed ? (
      <main className="error-page">
        <Flower2 />
        <h1>A branch caught on something.</h1>
        <p>The garden is still safe. Reload to return to the path.</p>
        <button onClick={() => location.reload()}>Reload garden</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
const short = (a: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");

function Shell({
  wallet,
  onWallet,
  children,
}: {
  wallet: string;
  onWallet: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header>
        <Link className="brand" to="/" aria-label="WordGarden home">
          <span className="brand-mark">
            <Sprout size={21} />
          </span>
          <span>
            Word<span>Garden</span>
          </span>
        </Link>
        <button
          className="menu"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "open" : ""} aria-label="Primary">
          <NavLink to="/">Garden</NavLink>
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/plant">Plant a word</NavLink>
          <NavLink to="/mine">My contributions</NavLink>
        </nav>
        <button className="wallet" onClick={onWallet}>
          <Wallet size={16} />
          {wallet ? short(wallet) : "Connect wallet"}
        </button>
      </header>
      {children}
      <footer>
        <div className="brand">
          Word<span>Garden</span>
        </div>
        <p>
          Documentation can be strong without claiming a single, absolute
          linguistic truth.
        </p>
        <span>Rooted on GenLayer · {network.name}</span>
      </footer>
    </>
  );
}

function Status({ entry }: { entry: WordEntry }) {
  return (
    <span className={`status ${entry.assessment_status.toLowerCase()}`}>
      {entry.assessment_status}
    </span>
  );
}
function PlantCard({ entry }: { entry: WordEntry }) {
  return (
    <Link className="plant-card" to={`/plant/${entry.id}`}>
      <div className="plant-stage">
        <Plant id={entry.id} word={entry.word} language={entry.language_name} />
      </div>
      <div>
        <span className="eyebrow">
          {entry.language_name} · {entry.usage_category}
        </span>
        <h3>{entry.word}</h3>
        <p>{entry.definition}</p>
        <div className="card-meta">
          <Status entry={entry} />
          <span>{entry.documentation_level} evidence</span>
        </div>
      </div>
    </Link>
  );
}

function LegacyGarden() {
  const { entries, loading, error } = useGarden();
  const [query, setQuery] = useState(""),
    [language, setLanguage] = useState("All languages");
  const languages = useMemo(
    () => ["All languages", ...new Set(entries.map((e) => e.language_name))],
    [entries],
  );
  const shown = entries.filter(
    (e) =>
      (language === "All languages" || e.language_name === language) &&
      `${e.word} ${e.definition}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <span className="kicker">A living archive of human expression</span>
          <h1>
            Every word carries
            <br />
            <em>a whole world.</em>
          </h1>
          <p>
            Explore culturally significant words, lovingly documented and
            assessed through independent GenLayer consensus.
          </p>
          <div className="hero-actions">
            <Link className="primary" to="/plant">
              Plant a word <ChevronRight />
            </Link>
            <a className="text-link" href="#garden">
              Wander the garden ↓
            </a>
          </div>
          <div className="proof-note">
            <ShieldCheck />
            <span>
              <strong>Consensus, with humility.</strong> We assess documentation
              quality—not absolute linguistic truth.
            </span>
          </div>
        </div>
        <div className="hero-grove" aria-hidden="true">
          <div className="sun" />
          <Plant
            id="murmur"
            language="Yorùbá"
            word="Àṣẹ"
            size={280}
            decorative
          />
          <Plant
            id="wonder"
            language="Japanese"
            word="Komorebi"
            size={220}
            decorative
          />
          <span className="butterfly">✦</span>
        </div>
      </section>
      <section className="garden-section" id="garden">
        <div className="section-head">
          <div>
            <span className="kicker">The living collection</span>
            <h2>Words in bloom</h2>
          </div>
          <p>
            Every plant grows deterministically from its record. Reload
            tomorrow: its form remains its own.
          </p>
        </div>
        <div className="filters">
          <label>
            <Search />
            <span className="sr-only">Search words</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search words and meanings…"
            />
          </label>
          <select
            aria-label="Filter by language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        {!isConfigured && (
          <Notice title="Waiting for the production registry">
            This interface never substitutes samples for on-chain records. Add
            the deployed registry address to{" "}
            <code>VITE_GENLAYER_CONTRACT_ADDRESS</code> to open the living
            collection.
          </Notice>
        )}
        {isConfigured && loading && (
          <div className="loading" role="status">
            <Sprout /> Listening to the roots…
          </div>
        )}
        {error && (
          <Notice title="The registry could not be reached">{error}</Notice>
        )}
        {!loading && isConfigured && !error && shown.length === 0 && (
          <div className="empty">
            <Plant id="empty" language="" word="" />
            <h3>The first bed is ready.</h3>
            <p>No accepted records match this view yet.</p>
            <Link className="primary" to="/plant">
              Plant the first word
            </Link>
          </div>
        )}
        <div className="plant-grid">
          {shown.map((e) => (
            <PlantCard entry={e} key={e.id} />
          ))}
        </div>
      </section>
      <section className="how">
        <span className="kicker">How a word takes root</span>
        <div className="steps">
          <article>
            <b>01</b>
            <Sprout />
            <h3>Plant</h3>
            <p>Share a word, its use, cultural context and bounded evidence.</p>
          </article>
          <article>
            <b>02</b>
            <ShieldCheck />
            <h3>Assess</h3>
            <p>
              Independent validators examine the same sources and substantive
              claims.
            </p>
          </article>
          <article>
            <b>03</b>
            <Flower2 />
            <h3>Bloom</h3>
            <p>
              Accepted documentation joins the public garden after protocol
              finality.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
function Garden() {
  const { entries, loading, error } = useGarden();
  return <GardenWorld entries={entries} loading={loading} error={error} />;
}
void LegacyGarden;
function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="notice" role="status">
      <Flower2 />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}

function Detail() {
  const { id = "" } = useParams(),
    [entry, setEntry] = useState<WordEntry | null>(),
    [error, setError] = useState("");
  useEffect(() => {
    getEntry(id)
      .then(setEntry)
      .catch((e) => setError(String(e)));
  }, [id]);
  if (error)
    return (
      <main id="main" className="page">
        <Notice title="Unable to read this record">{error}</Notice>
      </main>
    );
  if (entry === undefined)
    return (
      <main id="main" className="page loading">
        Reading the herbarium…
      </main>
    );
  if (!entry)
    return (
      <main id="main" className="page">
        <h1>Plant not found</h1>
        <Link to="/">Return to the garden</Link>
      </main>
    );
  return (
    <main id="main" className="detail">
      <Link className="back" to="/">
        ← Back to the garden
      </Link>
      <section className="specimen">
        <div className="specimen-art">
          <span>Living specimen · {entry.id.slice(0, 8)}</span>
          <Plant
            id={entry.id}
            word={entry.word}
            language={entry.language_name}
            size={360}
          />
        </div>
        <article>
          <span className="kicker">
            {entry.language_name}
            {entry.region_optional && ` · ${entry.region_optional}`}
          </span>
          <h1>{entry.word}</h1>
          {entry.pronunciation && (
            <p className="pronunciation">/{entry.pronunciation}/</p>
          )}
          <p className="definition">{entry.definition}</p>
          <blockquote>“{entry.usage_example}”</blockquote>
          <h2>Context carried with it</h2>
          <p>{entry.cultural_context}</p>
          <div className="record-panel">
            <Status entry={entry} />
            <strong>{entry.documentation_level} documentation</strong>
            <p>{entry.assessment_reason}</p>
            <small>Rubric {entry.assessment_version}</small>
          </div>
          <dl>
            <div>
              <dt>Contributor</dt>
              <dd>{short(entry.contributor)}</dd>
            </div>
            <div>
              <dt>Record</dt>
              <dd>{entry.id.slice(0, 12)}…</dd>
            </div>
          </dl>
          {entry.evidence_urls.length > 0 && (
            <>
              <h2>Evidence</h2>
              <ul className="sources">
                {entry.evidence_urls.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {new URL(url).hostname} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </section>
    </main>
  );
}

const blank: Submission = {
  word: "",
  language_name: "",
  language_code_optional: "",
  pronunciation: "",
  definition: "",
  usage_example: "",
  cultural_context: "",
  usage_category: "everyday",
  region_optional: "",
  evidence_urls: [],
};
function PlantForm({
  wallet,
  onWallet,
}: {
  wallet: string;
  onWallet: () => void;
}) {
  const [form, setForm] = useState(blank),
    [evidence, setEvidence] = useState(""),
    [phase, setPhase] = useState<TxPhase>("idle"),
    [hash, setHash] = useState(
      localStorage.getItem("wordgarden:pending") || "",
    ),
    [error, setError] = useState("");
  const navigate = useNavigate();
  const set = (key: keyof Submission, value: string) =>
    setForm((v) => ({ ...v, [key]: value }));
  const valid =
    form.word.trim() &&
    form.language_name.trim() &&
    form.definition.trim() &&
    form.usage_example.trim() &&
    form.cultural_context.trim();
  async function send() {
    if (!valid) return;
    setError("");
    if (!wallet) {
      onWallet();
      return;
    }
    try {
      setPhase("confirming");
      const payload = {
        ...form,
        evidence_urls: evidence
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean)
          .slice(0, 3),
      };
      await submitEntry(payload, (h) => {
        setHash(h);
        localStorage.setItem("wordgarden:pending", h);
        setPhase("consensus");
      });
      setPhase("finalized");
      localStorage.removeItem("wordgarden:pending");
      setTimeout(() => navigate("/mine"), 1500);
    } catch (e) {
      setPhase("failed");
      setError(e instanceof Error ? e.message : "Submission failed.");
    }
  }
  return (
    <main id="main" className="studio">
      <div className="studio-intro">
        <span className="kicker">Contribution studio</span>
        <h1>Plant a word.</h1>
        <p>
          Document what it means, how it lives in speech, and the context a
          translation cannot carry alone.
        </p>
      </div>
      <div className="studio-grid">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <fieldset disabled={phase === "consensus" || phase === "confirming"}>
            <legend>1 · The word</legend>
            <div className="two">
              <Field
                label="Word or expression"
                value={form.word}
                max={100}
                onChange={(v) => set("word", v)}
              />
              <Field
                label="Language name"
                value={form.language_name}
                max={100}
                onChange={(v) => set("language_name", v)}
              />
            </div>
            <div className="two">
              <Field
                label="Pronunciation (optional)"
                value={form.pronunciation}
                max={160}
                onChange={(v) => set("pronunciation", v)}
              />
              <label>
                Usage category
                <select
                  value={form.usage_category}
                  onChange={(e) => set("usage_category", e.target.value)}
                >
                  {[
                    "everyday",
                    "ceremony",
                    "historical",
                    "kinship",
                    "place",
                    "proverb",
                    "slang",
                    "other",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>2 · Meaning in context</legend>
            <Area
              label="Definition"
              value={form.definition}
              max={1200}
              onChange={(v) => set("definition", v)}
            />
            <Area
              label="Usage example"
              value={form.usage_example}
              max={800}
              onChange={(v) => set("usage_example", v)}
            />
            <Area
              label="Cultural context"
              value={form.cultural_context}
              max={2000}
              onChange={(v) => set("cultural_context", v)}
            />
          </fieldset>
          <fieldset>
            <legend>3 · Supporting paths</legend>
            <label>
              Evidence URLs · one per line, up to 3
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="https://…"
              />
              <small>
                Oral-language contributions may have limited online evidence.
                They can be considered, but will not be described as
                independently verified.
              </small>
            </label>
          </fieldset>
          <div className="warning">
            <ShieldCheck />
            <p>
              <strong>Public and irreversible.</strong> Do not include private
              personal information. Sources are treated as untrusted evidence,
              never instructions.
            </p>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {hash && (
            <p className="tx">
              Transaction: <code>{hash}</code>
            </p>
          )}
          <button
            className="primary submit"
            disabled={!valid || phase === "consensus" || phase === "confirming"}
          >
            {phase === "idle" || phase === "failed"
              ? wallet
                ? "Review & plant"
                : "Connect wallet to continue"
              : phase === "confirming"
                ? "Confirm in wallet…"
                : phase === "consensus"
                  ? "Validators are assessing…"
                  : "Finalized — returning to your garden"}
          </button>
        </form>
        <aside className="preview">
          <span className="kicker">Botanical preview</span>
          <div className="preview-pot">
            <Plant
              id={form.word || "seed"}
              language={form.language_name}
              word={form.word}
              size={300}
            />
          </div>
          <h2>{form.word || "Your word"}</h2>
          <p>
            {form.language_name || "Language"} · {form.usage_category}
          </p>
          <small>
            This preview is deterministic, but it is not a finalised record.
          </small>
        </aside>
      </div>
    </main>
  );
}
function Field({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: string;
  max: number;
  onChange: (v: string) => void;
}) {
  return (
    <label>
      {label}
      <input
        required={label.indexOf("optional") < 0}
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
      />
      <small>
        {value.length}/{max}
      </small>
    </label>
  );
}
function Area(p: {
  label: string;
  value: string;
  max: number;
  onChange: (v: string) => void;
}) {
  return (
    <label>
      {p.label}
      <textarea
        required
        value={p.value}
        maxLength={p.max}
        onChange={(e) => p.onChange(e.target.value)}
      />
      <small>
        {p.value.length}/{p.max}
      </small>
    </label>
  );
}
function Collections() {
  const { entries } = useGarden();
  const grouped = Object.entries(
    entries.reduce<Record<string, WordEntry[]>>(
      (a, e) => ((a[e.language_name] ??= []).push(e), a),
      {},
    ),
  );
  return (
    <main id="main" className="page">
      <span className="kicker">Language collections</span>
      <h1>Paths through the garden</h1>
      <p className="lede">
        Browse finalised, accepted records by the language named by their
        contributors.
      </p>
      {grouped.length === 0 ? (
        <Notice title="No collections have bloomed yet">
          Collections appear from accepted on-chain records only.
        </Notice>
      ) : (
        <div className="collection-grid">
          {grouped.map(([name, items]) => (
            <section key={name}>
              <BookOpen />
              <h2>{name}</h2>
              <p>
                {items.length} documented{" "}
                {items.length === 1 ? "word" : "words"}
              </p>
              {items.slice(0, 3).map((e) => (
                <Link to={`/plant/${e.id}`} key={e.id}>
                  {e.word} →
                </Link>
              ))}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
function Mine({ wallet, onWallet }: { wallet: string; onWallet: () => void }) {
  const { entries, loading, error } = useGarden(wallet || undefined, true);
  if (!wallet)
    return (
      <main id="main" className="page center">
        <Wallet size={42} />
        <h1>Your contribution plot</h1>
        <p>
          Connect the wallet you used to plant words. Nothing is inferred from
          browser storage.
        </p>
        <button className="primary" onClick={onWallet}>
          Connect wallet
        </button>
      </main>
    );
  return (
    <main id="main" className="page">
      <span className="kicker">Your contribution plot</span>
      <h1>Planted by {short(wallet)}</h1>
      {loading && <p>Reading your records…</p>}
      {error && <Notice title="Unable to read your records">{error}</Notice>}
      <div className="ledger">
        {entries.map((e) => (
          <Link to={`/plant/${e.id}`} key={e.id}>
            <Plant
              id={e.id}
              word={e.word}
              language={e.language_name}
              size={90}
            />
            <div>
              <h2>{e.word}</h2>
              <p>
                {e.language_name} · {e.documentation_level}
              </p>
            </div>
            <Status entry={e} />
          </Link>
        ))}
      </div>
      {!loading && !error && !entries.length && (
        <Notice title="No finalised contributions">
          Submitted transactions appear here after their state can be read from
          the contract.
        </Notice>
      )}
    </main>
  );
}
export function App() {
  const [wallet, setWallet] = useState("");
  async function connect() {
    try {
      setWallet(await connectWallet());
    } catch (e) {
      alert(e instanceof Error ? e.message : "Wallet connection failed.");
    }
  }
  return (
    <ErrorBoundary>
      <Shell wallet={wallet} onWallet={() => void connect()}>
        <Routes>
          <Route path="/" element={<Garden />} />
          <Route
            path="/plant"
            element={
              <PlantForm wallet={wallet} onWallet={() => void connect()} />
            }
          />
          <Route path="/plant/:id" element={<Detail />} />
          <Route path="/collections" element={<Collections />} />
          <Route
            path="/mine"
            element={<Mine wallet={wallet} onWallet={() => void connect()} />}
          />
          <Route
            path="*"
            element={
              <main id="main" className="page">
                <h1>This path has gone wild.</h1>
                <Link to="/">Return to the garden</Link>
              </main>
            }
          />
        </Routes>
      </Shell>
    </ErrorBoundary>
  );
}
