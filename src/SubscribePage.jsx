import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { supabase } from "./supabase";

export default function SubscribePage({ onBack }) {
  const [subscriber, setSubscriber] = useState({ name: "", email: "" });
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!subscriber.name.trim()) {
      setStatus({
        type: "error",
        message: "Tell me what to call you first.",
      });
      return;
    }

    if (!subscriber.email.trim()) {
      setStatus({
        type: "error",
        message: "Add your email so the notes know where to land.",
      });
      return;
    }

    if (website) {
      setSubscriber({ name: "", email: "" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("subscribers").insert({
      name: subscriber.name.trim(),
      email: subscriber.email.trim().toLowerCase(),
      source: "website",
    });
    setSubmitting(false);

    if (error?.code === "23505") {
      setStatus({
        type: "success",
        message: "You’re already on the list. Very prepared of you.",
      });
      setSubscriber({ name: "", email: "" });
      return;
    }

    if (error) {
      setStatus({
        type: "error",
        message: "I couldn’t save that just now. Please try again in a moment.",
      });
      return;
    }

    const welcomeResponse = await fetch("/api/send-welcome-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: subscriber.email.trim().toLowerCase(),
      }),
    });

    setSubscriber({ name: "", email: "" });
    setStatus({
      type: "success",
      message: welcomeResponse.ok
        ? "You’re on the list. A welcome note is on its way."
        : "You’re on the list. The welcome note may take a moment.",
    });
  };

  return (
    <main className="subscribe-page">
      <section className="newsletter newsletter-page">
        <button className="back-link subscribe-back" onClick={onBack}>
          <ArrowLeft size={16} /> Home
        </button>
        <div className="newsletter-card">
          <div className="newsletter-copy">
            <span className="kicker">Subscribe</span>
            <h1>New notes,<br /><em>sent softly.</em></h1>
            <p>
              A small inbox note when I publish something new — usually about
              systems, safety, memory, parallelism, and the human side of computing.
            </p>
          </div>
          <div className="newsletter-panel">
            <div className="newsletter-stamp" aria-hidden="true">✦</div>
            <h2>Notes from Flyness</h2>
            <p>
              Careful little essays from the place where operating systems meet
              human expectation — fewer hot takes, more annotated curiosity, with
              a little blush in the margins.
            </p>
            <form className="newsletter-form" onSubmit={subscribe}>
              <label>
                Name
                <input
                  maxLength="80"
                  value={subscriber.name}
                  onChange={(event) => setSubscriber({ ...subscriber, name: event.target.value })}
                  placeholder="What should I call you?"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  maxLength="254"
                  value={subscriber.email}
                  onChange={(event) => setSubscriber({ ...subscriber, email: event.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label className="comment-honeypot" aria-hidden="true">
                Website
                <input tabIndex="-1" autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </label>
              {status.message && (
                <p className={`comment-status ${status.type}`} role="status">
                  {status.message}
                </p>
              )}
              <button className="newsletter-button" type="submit" disabled={submitting}>
                {submitting ? "Subscribing…" : "Subscribe for new notes"} <Mail size={16} />
              </button>
            </form>
            <small>No spam. No content confetti. Just new essays when they exist.</small>
          </div>
        </div>
      </section>
    </main>
  );
}
