import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { content, type Photograph } from "./content";
import "./styles.css";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function EditorialTitle({
  text,
  lineBreak = false,
}: {
  text: string;
  lineBreak?: boolean;
}) {
  const split = text.lastIndexOf(" ");
  return (
    <>
      {text.slice(0, split)}
      {lineBreak ? <br /> : " "}
      <em>{text.slice(split + 1)}</em>
    </>
  );
}

function Photo({ item, eager = false }: { item: Photograph; eager?: boolean }) {
  const [missing, setMissing] = useState(false);
  return missing ? (
    <div
      className="photo-placeholder"
      role="img"
      aria-label="Het portret van Sanne wordt binnenkort toegevoegd"
    >
      <span
        className="placeholder-monogram"
        aria-hidden="true"
      >
        sr.
      </span>
      <span>Het portret volgt binnenkort</span>
    </div>
  ) : (
    <img
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      style={{ objectPosition: item.position }}
      onError={() => setMissing(true)}
    />
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (e: MouseEvent) => {
      if (
        !nav.current?.contains(e.target as Node) &&
        !button.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", closeOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <a
        className="wordmark"
        href="#start"
        aria-label="Sanne Roeland, naar het begin"
      >
        Sanne Roeland<span className="brand-dot">.</span>
      </a>
      <button
        ref={button}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Sluiten −" : "Menu +"}
      </button>
      <nav
        ref={nav}
        id="navigation"
        className={open ? "nav open" : "nav"}
        aria-label="Hoofdnavigatie"
      >
        {content.navigation.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
          >
            {link.label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
    </header>
  );
}

function Lightbox({
  index,
  onClose,
  onChange,
}: {
  index: number;
  onClose: () => void;
  onChange: (n: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const change = (delta: number) =>
    onChange(
      (index + delta + content.portfolio.length) % content.portfolio.length,
    );
  useEffect(() => {
    const element = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    element.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label="Fotoviewer"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          change(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          change(1);
        }
        if (e.key === "Tab") {
          const buttons = Array.from(
            dialog.current!.querySelectorAll<HTMLButtonElement>("button"),
          );
          const first = buttons[0],
            last = buttons[buttons.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }}
    >
      <button
        autoFocus
        className="lightbox-close"
        onClick={onClose}
        aria-label="Fotoviewer sluiten"
      >
        Sluiten <span aria-hidden="true">×</span>
      </button>
      <div
        className="lightbox-photo"
        key={index}
      >
        <Photo
          item={content.portfolio[index]}
          eager
        />
      </div>
      <div className="lightbox-bottom">
        <button
          onClick={() => change(-1)}
          aria-label="Vorige foto"
        >
          ←
        </button>
        <p aria-live="polite">
          {content.portfolio[index].caption}
          <small>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(content.portfolio.length).padStart(2, "0")}
            {content.portfolio[index].temporary ? " · Tijdelijk beeld" : ""}
          </small>
        </p>
        <button
          onClick={() => change(1)}
          aria-label="Volgende foto"
        >
          →
        </button>
      </div>
    </dialog>
  );
}

function InstagramLink({
  children,
  className = "button",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={content.contact.instagram}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <Arrow />
      <span className="sr-only"> (Instagram, opent in een nieuw tabblad)</span>
    </a>
  );
}

function App() {
  const [selected, setSelected] = useState<number | null>(null);
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!reduced.matches && window.innerWidth > 900)
          hero.current?.style.setProperty(
            "--parallax",
            `${Math.min(window.scrollY * 0.045, 22)}px`,
          );
        else hero.current?.style.setProperty("--parallax", "0px");
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
      >
        Ga naar inhoud
      </a>
      <Navigation />
      <main id="main">
        <section
          className="hero"
          id="start"
          ref={hero}
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">{content.label}</p>
            <h1 id="hero-title">
              <EditorialTitle
                text={content.heroTitle}
                lineBreak
              />
            </h1>
            <p className="intro">{content.intro}</p>
            <div className="hero-links">
              <a
                className="button"
                href="#werk"
              >
                {content.ui.heroPrimary} <Arrow />
              </a>
              <a
                className="text-link"
                href="#over"
              >
                {content.ui.heroSecondary}
              </a>
            </div>
          </div>
          <figure className="hero-photo">
            <div className="image-frame">
              <Photo
                item={content.portrait}
                eager
              />
            </div>
            <figcaption>
              <span>{content.ui.portraitCaption}</span>
              <span aria-hidden="true">01 / SR</span>
            </figcaption>
          </figure>
          <a
            className="scroll-cue"
            href="#werk"
          >
            <span>{content.ui.scroll}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </section>
        <section
          className="work section"
          id="werk"
          aria-labelledby="work-title"
        >
          <div className="section-heading reveal">
            <p className="eyebrow">{content.ui.workLabel}</p>
            <div>
              <h2 id="work-title">{content.workTitle}</h2>
              <p>{content.workIntro}</p>
            </div>
            <span
              className="section-mark"
              aria-hidden="true"
            >
              ↙
            </span>
          </div>
          <p className="temporary-note">{content.temporaryNote}</p>
          <div className="portfolio">
            {content.portfolio.map((item, index) => (
              <figure
                className={`portfolio-item item-${index + 1} reveal`}
                key={item.id}
              >
                <button
                  className="photo-button"
                  onClick={() => setSelected(index)}
                  aria-label={`Open ${item.caption} in fotoviewer`}
                >
                  <Photo item={item} />
                  <span
                    className="photo-open"
                    aria-hidden="true"
                  >
                    Bekijk foto ↗
                  </span>
                </button>
                <figcaption>
                  <span>{item.caption}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section
          className="about section"
          id="over"
          aria-labelledby="about-title"
        >
          <figure className="about-photo reveal">
            <Photo item={content.aboutImage} />
            <figcaption>{content.label}</figcaption>
          </figure>
          <div className="about-copy reveal">
            <p className="eyebrow">{content.ui.aboutLabel}</p>
            <h2 id="about-title">
              <EditorialTitle text={content.aboutTitle} />
            </h2>
            <p>{content.about}</p>
            <InstagramLink className="text-link">
              {content.ui.aboutButton}
            </InstagramLink>
          </div>
        </section>
        <section
          className="shoot section reveal"
          aria-labelledby="shoot-title"
        >
          <p className="eyebrow">{content.ui.shootLabel}</p>
          <h2 id="shoot-title">{content.shootTitle}</h2>
          <div>
            <p>{content.shoot}</p>
            <a
              className="button"
              href="#contact"
            >
              {content.ui.shootButton} <Arrow />
            </a>
          </div>
        </section>
        <section
          className="contact section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <p className="eyebrow">{content.ui.contactLabel}</p>
          <h2
            className="reveal"
            id="contact-title"
          >
            <EditorialTitle text={content.contactTitle} />
            <span aria-hidden="true">↗</span>
          </h2>
          <div className="contact-bottom">
            <p>{content.contactIntro}</p>
            <InstagramLink>{content.ui.contactButton}</InstagramLink>
          </div>
        </section>
      </main>
      <footer>
        <a
          className="wordmark"
          href="#start"
        >
          {content.name}.
        </a>
        <span>© {new Date().getFullYear()} Sanne Roeland</span>
        <InstagramLink className="footer-link">Instagram</InstagramLink>
      </footer>
      {selected !== null && (
        <Lightbox
          index={selected}
          onClose={() => setSelected(null)}
          onChange={setSelected}
        />
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
