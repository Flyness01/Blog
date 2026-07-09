import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "./supabase";

export default function CommentsSection({
  postSlug,
  kicker = "Discuss this article",
  description = "Questions, reflections, and respectful disagreements are welcome here.",
}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ name: "", text: "" });
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentStatus, setCommentStatus] = useState({ type: "", message: "" });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [website, setWebsite] = useState("");
  const storageKey = `pendingComments:${postSlug}`;
  const cooldownKey = `lastCommentSubmission:${postSlug}`;
  const [pendingComments, setPendingComments] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let active = true;

    const loadComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, author_name, body, created_at")
        .eq("post_slug", postSlug)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setCommentStatus({
          type: "error",
          message: "Comments are temporarily unavailable.",
        });
      } else {
        setComments(data ?? []);
        setPendingComments((current) => {
          const stillPending = current.filter(
            (pending) =>
              !(data ?? []).some(
                (published) =>
                  published.author_name === pending.author_name &&
                  published.body === pending.body,
              ),
          );
          window.localStorage.setItem(storageKey, JSON.stringify(stillPending));
          return stillPending;
        });
      }
      setCommentsLoading(false);
    };

    loadComments();
    return () => {
      active = false;
    };
  }, [postSlug, storageKey]);

  const submitComment = async (event) => {
    event.preventDefault();
    setCommentStatus({ type: "", message: "" });

    if (website) {
      setComment({ name: "", text: "" });
      return;
    }

    const lastSubmission = Number(window.localStorage.getItem(cooldownKey) || 0);
    if (Date.now() - lastSubmission < 60_000) {
      setCommentStatus({
        type: "error",
        message: "Please wait a minute before submitting another comment.",
      });
      return;
    }

    setSubmittingComment(true);
    const { error } = await supabase.from("comments").insert({
      post_slug: postSlug,
      author_name: comment.name.trim(),
      body: comment.text.trim(),
    });
    setSubmittingComment(false);

    if (error) {
      setCommentStatus({
        type: "error",
        message: "Your comment could not be saved. Please try again.",
      });
      return;
    }

    window.localStorage.setItem(cooldownKey, String(Date.now()));
    const pendingComment = {
      id: `pending-${Date.now()}`,
      author_name: comment.name.trim(),
      body: comment.text.trim(),
      created_at: new Date().toISOString(),
    };
    const updatedPending = [pendingComment, ...pendingComments].slice(0, 5);
    setPendingComments(updatedPending);
    window.localStorage.setItem(storageKey, JSON.stringify(updatedPending));
    setComment({ name: "", text: "" });
    setCommentStatus({
      type: "success",
      message: "Your comment was saved.",
    });
  };

  return (
    <section className="comments" id="comments">
      <div className="comments-intro">
        <span className="kicker">{kicker}</span>
        <h2>Leave a thought<br /><em>in the margins.</em></h2>
        <p>{description}</p>
      </div>
      <div>
        <div className="comment-list">
          {commentsLoading && <p className="no-comments">Loading comments…</p>}
          {!commentsLoading && comments.length === 0 && pendingComments.length === 0 && !commentStatus.message && (
            <p className="no-comments">No comments yet. You can start the conversation.</p>
          )}
          {comments.map((item) => (
            <article className="comment" key={item.id}>
              <div className="comment-avatar">{item.author_name.slice(0, 1).toUpperCase()}</div>
              <div>
                <strong>{item.author_name}</strong>
                <time dateTime={item.created_at}>
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(item.created_at))}
                </time>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
          {pendingComments.map((item) => (
            <article className="comment" key={item.id}>
              <div className="comment-avatar">{item.author_name.slice(0, 1).toUpperCase()}</div>
              <div>
                <strong>{item.author_name}</strong>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
        <form className="comment-form" onSubmit={submitComment}>
          <label>
            Your name
            <input required minLength="2" maxLength="60" value={comment.name} onChange={(event) => setComment({ ...comment, name: event.target.value })} placeholder="How should I call you?" />
          </label>
          <label>
            Your comment
            <textarea required minLength="2" maxLength="1000" value={comment.text} onChange={(event) => setComment({ ...comment, text: event.target.value })} placeholder="Add to the conversation…" rows="4" />
          </label>
          <label className="comment-honeypot" aria-hidden="true">
            Website
            <input tabIndex="-1" autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </label>
          {commentStatus.message && (
            <p className={`comment-status ${commentStatus.type}`} role="status">
              {commentStatus.message}
            </p>
          )}
          <button type="submit" disabled={submittingComment}>
            {submittingComment ? "Saving…" : "Leave comment"} <ArrowUpRight size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
