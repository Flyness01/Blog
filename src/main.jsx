import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, Menu, X, Sparkles, Mail } from "lucide-react";
import "./styles.css";

const posts = [
  {
    date: "May 18, 2026",
    read: "6 min read",
    category: "Research Notes",
    title: "What community gardens teach us about belonging",
    excerpt:
      "A field note on shared space, informal care networks, and why the smallest acts of stewardship can become a kind of civic language.",
    color: "sage",
  },
  {
    date: "April 02, 2026",
    read: "4 min read",
    category: "Field Notes",
    title: "Listening is a research method, too",
    excerpt:
      "Reflections from twelve interviews, three cups of terrible coffee, and one reminder that good questions need room to breathe.",
    color: "rose",
  },
  {
    date: "March 11, 2026",
    read: "5 min read",
    category: "Things I’m Learning",
    title: "In defense of changing your mind",
    excerpt:
      "On intellectual humility, annotated margins, and treating uncertainty as an invitation rather than a flaw.",
    color: "lilac",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [comments, setComments] = useState([
    { name: "A fellow curious mind", text: "I loved the reminder that listening is part of the work, not just something around it." }
  ]);
  const [comment, setComment] = useState({ name: "", text: "" });

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="nav">
        <button className="wordmark" onClick={() => scrollTo("home")} aria-label="Go home">
          M<span>✦</span>B
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
            I’m Maya—a researcher, essayist, and future graduate student thinking about
            communities, culture, and the quiet systems that shape how we live.
          </p>
          <button className="primary-button" onClick={() => scrollTo("writing")}>
            Read my latest notes <span>↓</span>
          </button>
          <div className="doodle" aria-hidden="true">curious<br />about it all <span>↝</span></div>
        </section>

        <section className="featured" id="writing">
          <div className="section-heading">
            <div>
              <span className="kicker">01 / Selected writing</span>
              <h2>Ideas I keep<br /><em>coming back to</em></h2>
            </div>
            <p>A small archive of questions, observations, and works in progress.</p>
          </div>

          <article className="lead-post">
            <div className="lead-art">
              <div className="paper-note">
                <span>FIELD NOTE № 12</span>
                <p>“Pay attention to what people make room for.”</p>
                <small>— scribbled in the margin</small>
              </div>
              <div className="flower" aria-hidden="true">✿</div>
            </div>
            <div className="lead-content">
              <div className="post-meta"><span>Essay</span> June 04, 2026 · 8 min read</div>
              <h3>The spaces between the data</h3>
              <p>
                Numbers can tell us what happened. But sometimes the most meaningful part of
                research lives in a pause, a side comment, or the story someone tells after
                the recorder is switched off.
              </p>
              <a href="#post">Read the essay <ArrowUpRight size={17} /></a>
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
                  Keep reading <ArrowUpRight size={16} />
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
            <h2>Hello, I’m Maya.</h2>
            <p className="large">
              I care about the stories hidden inside systems—and the people we overlook
              when we only look at outcomes.
            </p>
            <p>
              My work sits at the intersection of social research, public policy, and
              community life. When I’m not reading or writing, I’m probably rearranging
              my bookshelves, walking without a destination, or making an unnecessarily
              elaborate cup of tea.
            </p>
            <div className="tiny-list">
              <span><Sparkles size={15} /> Currently researching: collective care</span>
              <span><Sparkles size={15} /> Currently reading: <em>Emergent Strategy</em></span>
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
            <h2>A thoughtful email, when I have something worth sharing.</h2>
          </div>
          <a className="newsletter-button" href="mailto:hello@example.com?subject=Subscribe%20me">
            Subscribe <ArrowUpRight size={16} />
          </a>
        </section>
      </main>

      <footer>
        <div className="wordmark">M<span>✦</span>B</div>
        <p>Made with care, curiosity, and probably too much tea.</p>
        <p id="disclaimer"><a href="#disclaimer">Disclaimer</a>: Views are my own. · © 2026 Maya Bennett</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
