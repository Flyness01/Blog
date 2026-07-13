import { ArrowLeft, Mail } from "lucide-react";

export default function SubscribePage({ onBack }) {
  const newsletterSubscribeUrl = "";

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
            {newsletterSubscribeUrl ? (
              <a className="newsletter-button" href={newsletterSubscribeUrl} target="_blank" rel="noreferrer">
                Subscribe for new notes <Mail size={16} />
              </a>
            ) : (
              <div className="newsletter-actions" aria-label="Subscription options">
                <span className="newsletter-waitlist">
                  The tiny research salon is almost open.
                </span>
              </div>
            )}
            <small>No spam. No content confetti. Just new essays when they exist.</small>
          </div>
        </div>
      </section>
    </main>
  );
}
