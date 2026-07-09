import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import ArticlePage from "./ArticlePage";
import "./styles.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewArticle, setViewArticle] = useState(window.location.hash === "#/writing/hidden-human");
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ name: "", text: "" });

  const scrollTo = (id) => {
    if (viewArticle) {
      window.location.hash = id;
      setViewArticle(false);
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 0);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const syncView = () => setViewArticle(window.location.hash === "#/writing/hidden-human");
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  const openArticle = () => {
    window.location.hash = "/writing/hidden-human";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeArticle = () => {
    window.location.hash = "writing";
    setViewArticle(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <header className="nav">
        <button className="wordmark" onClick={() => scrollTo("home")} aria-label="Go home">
          F<span>✦</span>N
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#disclaimer">Disclaimer</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {viewArticle ? (
        <ArticlePage onBack={closeArticle} />
      ) : <main>
        <section className="hero" id="home">
          <div className="eyebrow"><span /> Notes from a curious mind</div>
          <h1>I’m learning in public.<br /><em>Come sit with me.</em></h1>
          <p className="hero-copy">
            I’m Flyness Namatama. I use this space to learn in public and develop my
            thinking about operating systems, parallel processing, distributed systems, and HCI.
          </p>
          <button className="primary-button" onClick={() => scrollTo("writing")}>
            Read my latest notes <span>↓</span>
          </button>
          <div className="doodle" aria-hidden="true">curious<br />about it all <span>↝</span></div>
        </section>

        <section className="featured" id="writing">
          <div className="section-heading">
            <div>
              <span className="kicker">01 / Writing</span>
              <h2>Ideas I keep<br /><em>coming back to</em></h2>
            </div>
            <p>Technical writing about systems, parallelism, and the humans who build them.</p>
          </div>

          <article className="lead-post">
            <div className="lead-art">
              <div className="paper-note">
                <span>QUESTION № 01</span>
                <p>Why is safe parallel code still so difficult to write?</p>
                <small>— a question I’m exploring</small>
              </div>
              <div className="flower" aria-hidden="true">✿</div>
            </div>
            <div className="lead-content">
              <div className="post-meta"><span>Published article</span> July 2026 · 4 min read</div>
              <h3>The hidden human in system design</h3>
              <p>
                How developer expectations, API behavior, and hidden reference-counting
                operations collide inside the Linux kernel.
              </p>
              <button className="article-link" onClick={openArticle}>
                Read the full article <ArrowUpRight size={17} />
              </button>
            </div>
          </article>

        </section>

        <section className="about" id="about">
          <figure className="portrait">
            <img
              src={`${import.meta.env.BASE_URL}images/flyness-namatama.jpg`}
              alt="Flyness Namatama seated in a blue chair beside a window"
            />
          </figure>
          <div className="about-copy">
            <span className="kicker">02 / A little about me</span>
            <h2>Hello, I’m Flyness.</h2>
            <p className="large">
              I’m interested in how complex computer systems work—and how we can make
              them easier for people to understand, build, and debug.
            </p>
            <p>
              This blog is a learning space for technical notes on parallel processing
              and operating systems, with occasional connections to distributed systems
              and human-computer interaction. I’ll use it to work through one question
              at a time and explain what I learn clearly.
            </p>
            <div className="tiny-list">
              <span><Sparkles size={15} /> Core interests: parallel processing and operating systems</span>
              <span><Sparkles size={15} /> Also exploring: distributed systems and HCI</span>
            </div>
          </div>
        </section>

        <section className="comments" id="comments">
          <div className="comments-intro">
            <span className="kicker">03 / Join the conversation</span>
            <h2>Leave a thought<br /><em>in the margins.</em></h2>
            <p>Questions, reflections, respectful disagreements—all are welcome here.</p>
          </div>
          <div>
            <div className="comment-list">
              {comments.length === 0 && (
                <p className="no-comments">No comments yet. You can start the conversation.</p>
              )}
              {comments.map((item, index) => (
                <article className="comment" key={`${item.name}-${index}`}>
                  <div className="comment-avatar">{item.name.slice(0, 1).toUpperCase()}</div>
                  <div><strong>{item.name}</strong><p>{item.text}</p></div>
                </article>
              ))}
            </div>
            <form className="comment-form" onSubmit={(e) => {
              e.preventDefault();
              setComments([...comments, comment]);
              setComment({ name: "", text: "" });
            }}>
              <label>
                Your name
                <input required value={comment.name} onChange={(e) => setComment({ ...comment, name: e.target.value })} placeholder="How should I call you?" />
              </label>
              <label>
                Your comment
                <textarea required value={comment.text} onChange={(e) => setComment({ ...comment, text: e.target.value })} placeholder="Add to the conversation…" rows="4" />
              </label>
              <button type="submit">Leave comment <ArrowUpRight size={16} /></button>
            </form>
          </div>
        </section>

      </main>}

      <footer className="site-footer" id="disclaimer">
        <div className="footer-main">
          <div className="footer-intro">
            <button className="wordmark" onClick={() => scrollTo("home")} aria-label="Go to home">
              F<span>✦</span>N
            </button>
            <p>Learning carefully, one systems question at a time.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <span>Explore</span>
            <button onClick={() => scrollTo("home")}>Home</button>
            <button onClick={() => scrollTo("writing")}>Writing</button>
            <button onClick={() => scrollTo("about")}>About</button>
          </nav>
          <nav className="footer-nav" aria-label="Featured writing">
            <span>Featured</span>
            <button onClick={openArticle}>The hidden human in system design</button>
            <a
              href="https://medium.com/@flynessnamatama/the-hidden-human-in-system-design-why-is-it-still-so-hard-to-write-safe-parallel-code-bd5985225faf"
              target="_blank"
              rel="noreferrer"
            >
              Medium <ArrowUpRight size={13} />
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>Posts reflect an evolving learning process.</p>
          <p>© 2026 Flyness Namatama</p>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
