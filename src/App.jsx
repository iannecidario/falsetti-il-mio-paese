import React, { useEffect, useMemo, useRef, useState } from "react";
import { autore, copertina, poesie, traccePlaylist } from "./data/catalogo.js";

const markdownFiles = import.meta.glob("./poesie/*.md", {
  query: "?raw",
  import: "default",
  eager: true
});

const routeFromLocation = () => {
  if (window.location.hash.startsWith("#/")) {
    return window.location.hash.slice(1);
  }
  return window.location.pathname || "/";
};

const mediaUrl = (path) => encodeURI(path || "");

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setMeta(name, content, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function App() {
  const [route, setRoute] = useState(routeFromLocation());

  useEffect(() => {
    const onPopState = () => setRoute(routeFromLocation());
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onPopState);
    };
  }, []);

  const currentId = route.startsWith("/poesie/") ? route.split("/")[2] : "";
  const currentPoem = poesie.find((poesia) => poesia.id === currentId);

  useEffect(() => {
    const title = currentPoem
      ? `${currentPoem.titolo} - Il mio paese - Pietro Falsetti`
      : "Il mio paese - Pietro Falsetti";
    const description = currentPoem
      ? `Leggi ${currentPoem.titolo}, poesia dal libro multimediale Il mio paese di Pietro Falsetti.`
      : "Il mio paese, libro poetico digitale multimediale di Pietro Falsetti.";
    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:image", currentPoem?.immagine || copertina.immagine, "property");
  }, [currentPoem]);

  const page = useMemo(() => {
    if (route === "/" || route === "") return <CoverPage />;
    if (route === "/indice") return <IndexPage currentId={currentId} />;
    if (route === "/playlist") return <PlaylistPage />;
    if (route === "/autore") return <AuthorPage />;
    if (route.startsWith("/poesie/")) return <PoemPage id={currentId} />;
    return <NotFoundPage />;
  }, [route, currentId]);

  return (
    <>
      <Header />
      <main>{page}</main>
      <Footer />
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["/", "Copertina"],
    ["/indice", "Indice"],
    ["/playlist", "Playlist"],
    ["/autore", "L'autore"]
  ];

  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate("/")} aria-label="Vai alla copertina">
        <span>Il mio paese</span>
        <small>Pietro Falsetti</small>
      </button>
      <button
        className="menu-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label="Apri menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav id="main-navigation" className={open ? "open" : ""} aria-label="Navigazione principale">
        {links.map(([path, label]) => (
          <button
            key={path}
            onClick={() => {
              setOpen(false);
              navigate(path);
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function CoverPage() {
  return (
    <section className="cover-page">
      <img src={mediaUrl(copertina.immagine)} alt={copertina.alt} />
      <div className="cover-copy">
        <p className="eyebrow">Libro poetico digitale</p>
        <h1>Il mio paese</h1>
        <p className="author-line">Pietro Falsetti</p>
        <p>
          Un libro illustrato e musicale da sfogliare online: poesie, dipinti e brani audio
          compongono un percorso luminoso tra memoria, paesaggio e appartenenza.
        </p>
        <button className="primary-button" onClick={() => navigate("/indice")}>
          Leggi
        </button>
      </div>
    </section>
  );
}

function IndexPage({ currentId }) {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filtered = poesie.filter((poesia) =>
    poesia.titolo.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="book-layout">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
        Indice
      </button>
      <BookSidebar currentId={currentId} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="index-content">
        <div className="section-heading">
          <p className="eyebrow">Sfoglia il libro</p>
          <h1>Indice</h1>
        </div>
        <div className="index-tools">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca una poesia"
            aria-label="Cerca una poesia per titolo"
          />
          <button onClick={() => navigate("/playlist")}>Playlist</button>
          <button onClick={() => navigate("/autore")}>Autore</button>
        </div>
        <div className="index-list">
          {filtered.map((poesia) => (
            <article
              key={poesia.id}
              className="poem-row"
              role="button"
              tabIndex="0"
              onClick={() => navigate(`/poesie/${poesia.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/poesie/${poesia.id}`);
                }
              }}
            >
              <img src={mediaUrl(poesia.immagine)} alt={`Immagine per ${poesia.titolo}`} />
              <div>
                <h2>{poesia.titolo}</h2>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookSidebar({ currentId, open, onClose }) {
  return (
    <aside className={open ? "book-sidebar open" : "book-sidebar"}>
      <button className="close-sidebar" onClick={onClose} aria-label="Chiudi indice">
        Chiudi
      </button>
      <h2>Indice</h2>
      <nav aria-label="Indice delle poesie">
        {poesie.map((poesia) => (
          <button
            key={poesia.id}
            className={currentId === poesia.id ? "active" : ""}
            onClick={() => {
              onClose();
              navigate(`/poesie/${poesia.id}`);
            }}
          >
            {poesia.titolo}
          </button>
        ))}
      </nav>
      <div className="sidebar-links">
        <button onClick={() => navigate("/playlist")}>Playlist</button>
        <button onClick={() => navigate("/autore")}>L'autore</button>
      </div>
    </aside>
  );
}

function PoemPage({ id }) {
  const index = poesie.findIndex((poesia) => poesia.id === id);
  const poesia = poesie[index];
  if (!poesia) return <NotFoundPage />;
  const previous = poesie[index - 1];
  const next = poesie[index + 1];
  const text = markdownFiles[`./poesie/${poesia.testo}`] || "";

  return (
    <article className="poem-page">
      <h1>{poesia.titolo}</h1>
      <div className="poem-shell">
        <aside className="poem-media">
          {poesia.immagine ? (
            <figure>
              <img src={mediaUrl(poesia.immagine)} alt={`Opera collegata a ${poesia.titolo}`} />
              {poesia.didascalia && <figcaption>{poesia.didascalia}</figcaption>}
            </figure>
          ) : (
            <div className="empty-state">Immagine non ancora disponibile.</div>
          )}
          <AudioPanel poesia={poesia} />
        </aside>
        <section className="poem-reading" aria-label={`Testo della poesia ${poesia.titolo}`}>
          <div className="poem-text">{text || "Testo non ancora disponibile."}</div>
        </section>
      </div>
      <nav className="reader-nav" aria-label="Navigazione tra poesie">
        <button disabled={!previous} onClick={() => previous && navigate(`/poesie/${previous.id}`)}>
          Testo precedente
        </button>
        <button onClick={() => navigate("/indice")}>Torna all'indice</button>
        <button disabled={!next} onClick={() => next && navigate(`/poesie/${next.id}`)}>
          Testo successivo
        </button>
      </nav>
    </article>
  );
}

function AudioPanel({ poesia }) {
  const [missing, setMissing] = useState(false);
  if (!poesia.audio || missing) return <div className="empty-state">Audio non ancora disponibile.</div>;

  return (
    <section className="audio-block" aria-label={`Audio ${poesia.titolo}`}>
      <p>{poesia.titolo}</p>
      <audio controls preload="metadata" src={mediaUrl(poesia.audio)} onError={() => setMissing(true)}>
        Il tuo browser non supporta il player audio.
      </audio>
    </section>
  );
}

function PlaylistPage() {
  const tracks = [...poesie.filter((poesia) => poesia.audio), ...traccePlaylist];
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const track = tracks[current] || tracks[0];

  useEffect(() => {
    setProgress(0);
    setDuration(0);
    if (playing && audioRef.current) {
      audioRef.current.play().catch(() => setPlaying(false));
    }
  }, [current, playing]);

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setPlaying(true);
  };
  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlaying(false);
  };
  const nextTrack = () => setCurrent((value) => (value + 1) % tracks.length);
  const previousTrack = () => setCurrent((value) => (value - 1 + tracks.length) % tracks.length);

  if (!track) return <section className="playlist-page">Audio non ancora disponibile.</section>;

  return (
    <section className="playlist-page">
      <div className="section-heading">
        <p className="eyebrow">Ascolta la raccolta</p>
        <h1>Playlist</h1>
      </div>
      <div className={track.immagine ? "main-player" : "main-player main-player-audio-only"}>
        {track.immagine && <img src={mediaUrl(track.immagine)} alt={`Miniatura ${track.titolo}`} />}
        <div>
          <p>{track.tipo === "playlist" ? "Traccia musicale" : "Poesia"}</p>
          <h2>{track.titolo}</h2>
          <audio
            ref={audioRef}
            src={mediaUrl(track.audio)}
            preload="metadata"
            onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            onEnded={nextTrack}
          />
          <div className="player-buttons">
            <button onClick={previousTrack} aria-label="Brano precedente">←</button>
            <button onClick={play}>Play</button>
            <button onClick={pause}>Pausa</button>
            <button onClick={nextTrack} aria-label="Brano successivo">→</button>
          </div>
          <label className="progress-label">
            <span>{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={(event) => {
                const value = Number(event.target.value);
                setProgress(value);
                if (audioRef.current) audioRef.current.currentTime = value;
              }}
              aria-label="Avanzamento del brano"
            />
            <span>{formatTime(duration)}</span>
          </label>
        </div>
      </div>
      <div className="track-list">
        {tracks.map((poesia, index) => (
          <button
            key={poesia.id}
            className={[
              "track",
              !poesia.immagine ? "track-audio-only" : "",
              index === current ? "active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setCurrent(index);
              setPlaying(true);
            }}
          >
            {poesia.immagine && <img src={mediaUrl(poesia.immagine)} alt="" />}
            <span>
              <strong>{poesia.titolo}</strong>
              <small>{poesia.tipo === "playlist" ? "Traccia musicale" : "Poesia"}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AuthorPage() {
  return (
    <section className="author-page">
      <div className="section-heading">
        <p className="eyebrow">Pagina finale</p>
        <h1>L'autore</h1>
      </div>
      <div className="author-panel">
        <div>
          <AuthorPhoto />
          <h2>{autore.nome}</h2>
          <p>{autore.biografia}</p>
          <p>{autore.notaLibro}</p>
        </div>
      </div>
    </section>
  );
}

function AuthorPhoto() {
  const [available, setAvailable] = useState(Boolean(autore.foto));
  if (!autore.foto || !available) return null;

  return (
    <img
      className="author-photo"
      src={mediaUrl(autore.foto)}
      alt={`Fotografia di ${autore.nome}`}
      onError={() => setAvailable(false)}
    />
  );
}

function NotFoundPage() {
  return (
    <section className="not-found">
      <h1>Pagina non trovata</h1>
      <button className="primary-button" onClick={() => navigate("/indice")}>
        Torna all'indice
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <p>Il mio paese - Pietro Falsetti</p>
    </footer>
  );
}

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
