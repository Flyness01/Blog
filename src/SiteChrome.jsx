import React, { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  ["Home", "/"],
  ["Research", "/research"],
  ["Projects", "/projects"],
  ["Blog", "/blog"],
  ["Résumé", "/resume"],
  ["About", "/about"],
];

export function SiteHeader({ route, onNavigate, onSubscribe }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (path) => {
    setMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="nav">
      <button className="wordmark" onClick={() => go("/")} aria-label="Go home">
        F<span>✦</span>N
      </button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
        {navigation.map(([label, path]) => (
          <button className={route === path ? "active" : ""} key={path} onClick={() => go(path)}>{label}</button>
        ))}
        <button className={route === "/subscribe" ? "active" : ""} onClick={() => { setMenuOpen(false); onSubscribe(); }}>Subscribe</button>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}

export function SiteFooter({ onNavigate, onSubscribe, onArticle }) {
  return (
    <footer className="site-footer" id="disclaimer">
      <div className="footer-main">
        <div className="footer-intro">
          <button className="wordmark" onClick={() => onNavigate("/")} aria-label="Go to home">F<span>✦</span>N</button>
          <p>Learning carefully, one systems question at a time.</p>
        </div>
        <nav className="footer-nav" aria-label="Portfolio navigation">
          <span>Explore</span>
          <button onClick={() => onNavigate("/research")}>Research</button>
          <button onClick={() => onNavigate("/projects")}>Projects</button>
          <button onClick={() => onNavigate("/notes")}>Notes</button>
          <button onClick={() => onNavigate("/blog")}>Blog</button>
          <button onClick={() => onNavigate("/resume")}>Résumé</button>
          <button onClick={onSubscribe}>Subscribe</button>
        </nav>
        <nav className="footer-nav" aria-label="Featured links">
          <span>Elsewhere</span>
          <button onClick={onArticle}>The hidden human in system design</button>
          <a href="https://github.com/Flyness01" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
          <a href="https://medium.com/@flynessnamatama" target="_blank" rel="noreferrer">Medium <ArrowUpRight size={13} /></a>
        </nav>
      </div>
      <div className="footer-bottom"><p>Posts reflect an evolving learning process.</p><p>© 2026 Flyness Namatama</p></div>
    </footer>
  );
}
