import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, Menu, X, Sparkles, Mail } from "lucide-react";
import "./styles.css";

const posts = [
  {
    date: "Topic in progress",
    read: "Reading notes",
    category: "Operating Systems",
    title: "Why is it still so hard to write safe parallel code?",
    excerpt:
      "Exploring race conditions, memory safety, and the gap between system behavior and a developer’s mental model.",
    color: "sage",
  },
  {
    date: "Topic in progress",
    read: "Reading notes",
    category: "Parallel Processing",
    title: "What makes parallel programs difficult to debug?",
    excerpt:
      "A closer look at nondeterminism, concurrency bugs, and the tools developers use to understand what went wrong.",
    color: "rose",
  },
  {
    date: "Topic in progress",
    read: "Reading notes",
    category: "Systems + HCI",
    title: "Can systems interfaces be designed for clearer mental models?",
    excerpt:
      "Notes on developer experience, system abstractions, and how interface design may affect correctness.",
    color: "lilac",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ name: "", text: "" });

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
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
          <span className="nav-divider" />
          <a href="#signin">Sign in</a>
          <a className="subscribe-link" href="#subscribe">Subscribe</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
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
              <span className="kicker">01 / Planned notes</span>
              <h2>Ideas I keep<br /><em>coming back to</em></h2>
            </div>
            <p>A small archive of questions, observations, and works in progress.</p>
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
              <div className="post-meta"><span>Starting point</span> Topic in progress</div>
              <h3>The hidden human in system design</h3>
              <p>
                My first set of notes asks how the design of operating-system abstractions
                and developer tools shapes our ability to reason about parallel code safely.
                Claims and examples will be supported by linked sources as each post is published.
              </p>
              <a href="#comments">Discuss this question <ArrowUpRight size={17} /></a>
            </div>
          </article>

          <div className="post-grid">
            {posts.map((post, i) => (
              <article className="post-card" key={post.title}>
                <div className={`card-number ${post.color}`}>0{i + 2}</div>
                <div className="post-meta"><span>{post.category}</span> {post.date} · {post.read}</div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <a href={`#post-${i + 2}`} aria-label={`Read ${post.title}`}>
                  Discuss this topic <ArrowUpRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="about" id="about">
          <div className="portrait" role="img" aria-label="Abstract warm-toned portrait placeholder">
            <span>your<br />photo<br />here</span>
          </div>
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

        <section className="account-note" id="signin">
          <span>Reader accounts</span>
          <p>Secure sign-in is coming soon.</p>
        </section>

        <section className="newsletter" id="subscribe">
          <Mail size={24} />
          <div>
            <span className="kicker">Notes, occasionally</span>
            <h2>New technical notes, shared when they’re ready.</h2>
          </div>
          <span className="newsletter-button unavailable">Subscriptions coming soon</span>
        </section>
      </main>

      <footer>
        <div className="wordmark">F<span>✦</span>N</div>
        <p>Learning carefully, one systems question at a time.</p>
        <p id="disclaimer"><a href="#disclaimer">Disclaimer</a>: Posts reflect an evolving learning process. · © 2026 Flyness Namatama</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
