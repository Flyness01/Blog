import { ArrowLeft, ExternalLink } from "lucide-react";

export default function ArticlePage({ onBack }) {
  return (
    <main className="article-page">
      <header className="article-header">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={16} /> All writing
        </button>
        <div className="article-meta"><span>Operating Systems · HCI</span> July 2026 · 4 min read</div>
        <h1>The ‘Hidden’ Human in System Design: Why is it still so hard to write safe parallel code?</h1>
        <p className="article-deck">
          How developer expectations, API behavior, and hidden reference-counting
          operations collide inside the Linux kernel.
        </p>
        <div className="article-byline">
          <div className="byline-mark">FN</div>
          <div><strong>Flyness Namatama</strong><span>Published July 2026</span></div>
        </div>
      </header>

      <article className="article-body">
        <p>
          I am a researcher and student focused on the intersection of operating
          systems, parallel processing, and Human-Computer Interaction (HCI). In
          this space, I explore a critical question: how can we make high-performance,
          concurrent systems more intuitive and safer for the humans who build them?
        </p>

        <p>
          Why is it still so hard to write safe parallel code? The answer often lies
          not in the hardware, but in the widening gap between complex system
          architecture and human cognitive limits. In modern computer systems research,
          the “Developer Experience” (DX) is finally being recognized as a central
          challenge. Building highly concurrent operating systems isn’t just about
          hardware and math—it’s about designing interfaces that align with a
          programmer’s mental model.
        </p>

        <p>
          To understand how API design becomes an HCI problem, let’s look at one of
          the most heavily scrutinized operating systems in the world: the Linux kernel.
        </p>

        <h2>The HCI Problem Disguised as a Systems Issue</h2>

        <p>
          In{" "}
          <a href="https://dl.acm.org/doi/10.1145/3600006.3613162" target="_blank" rel="noreferrer">
            a comprehensive study presented at SOSP 2023 <ExternalLink size={14} />
          </a>
          , researchers analyzed 1,033 reference counting (refcounting) bugs across
          753 versions of the Linux kernel.
        </p>

        <p>
          Refcounting is a fundamental technique used to safely manage shared resources
          in parallel environments by tracking how many threads are actively using a
          memory block. If a programmer misses a decrement operation, the memory is
          never freed, causing a memory leak. If they miss an increment or decrement
          too early, the system might try to use deleted data, causing a severe
          Use-After-Free (UAF) vulnerability. The researchers found that 71.7% of the
          analyzed bugs led to memory leaks, while 28.3% led to UAF vulnerabilities.
        </p>

        <p>
          But why do developers keep missing these operations? Instead of blaming “bad
          programmers,” the study explicitly identified the root causes at the
          developer’s side (human factors). When the design of low-level OS APIs
          violates a developer’s expectations, massive vulnerabilities follow.
        </p>

        <p>Here are two core “micro-lessons” from the Linux kernel that illustrate this.</p>

        <h2>Micro-Lesson 1: The “Return-Error” Mental Model Mismatch</h2>

        <p>
          Standard programming intuition dictates that if a function fails and returns
          an error, the operation was aborted and no resources were permanently
          allocated. However, when an API incorporates “subtle deviations” from this
          standard mental model, it causes massive confusion.
        </p>

        <p>
          Take the Linux power management API <code>pm_runtime_get_sync()</code>. This
          specific API increments the reference counter even when it encounters an
          error and returns an error code.
        </p>

        <p>
          Because this violates the standard mental model, developers naturally jump
          to the error-handling path and forget to decrement the counter, causing a
          memory leak. This single, counter-intuitive API behavior was responsible for
          over 100 bugs across the kernel.
        </p>

        <p>Here is exactly what that mistake looks like in C:</p>

        <pre><code>{`// Example from drivers/crypto/stm32/stm32-crc32.c
static int stm32_crc_remove(...) {
    int ret = pm_runtime_get_sync(); // Increments refcount EVEN ON ERROR

    if (ret < 0) {
        return ret; // BUG! The programmer bails out but misses the decrement (put)
    }
}`}</code></pre>

        <figure>
          <img
            src={`${import.meta.env.BASE_URL}images/cognitive-model-memory-management.png`}
            alt="Comparative flowchart showing a developer's expected memory-allocation behavior beside the system's actual behavior when an error preserves a partial state."
          />
          <figcaption>
            The expected mental model compared with the system behavior that can leave
            a reference count incremented after an error.
          </figcaption>
        </figure>

        <h2>Micro-Lesson 2: Hidden Refcounting in Macros</h2>

        <p>
          The second major issue occurs when kernel developers attempt to make code more
          concise by hiding refcounting operations inside macros or “find-like” APIs.
        </p>

        <p>
          Consider the <code>for_each_matching_node</code> macro used in the kernel.
          To a developer, this looks like a standard loop iterating over a list. Behind
          the scenes, however, the macro automatically increments the refcount at the
          start of an iteration and decrements it at the end.
        </p>

        <p>
          When a developer finds what they are looking for and uses a <code>break</code>
          {" "}statement to exit the loop early, they completely bypass the hidden
          decrement operation. Because the API name (<code>foreach</code>) has no
          semantic similarity to refcounting terms (like <code>get</code>,{" "}
          <code>put</code>, <code>inc</code>, or <code>dec</code>), the developer has
          no visual cue that manual memory management is required.
        </p>

        <p>The resulting code looks harmless but is deeply flawed:</p>

        <pre><code>{`// Example from drivers/soc/bcm/brcmstb/pm/pm-arm.c
static int brcmstb_pm_probe(...) {

    // Macro hides the INC (get) and DEC (put)
    for_each_matching_node(...) {

        if (condition) {
            break; // BUG! Exiting early misses the hidden DEC (put)
        }

    }
}`}</code></pre>

        <h2>The Takeaway: API Design is UX Design</h2>

        <p>
          The ultimate lesson here is that in systems engineering, API design is User
          Experience (UX) design. When operating system primitives fail to account for
          human mental models—by creating functions with unexpected side-effects or
          hiding critical safety operations inside macros—the resulting cognitive load
          directly translates into insecure, unstable parallel systems.
        </p>

        <p>
          As we look toward the future of highly concurrent systems, we have to stop
          treating developers as flawless compilers. To write safe parallel code, we
          need to build abstractions that are not only mathematically sound but
          human-centric.
        </p>

        <div className="article-source">
          <span>Originally published on Medium</span>
          <a
            href="https://medium.com/@flynessnamatama/the-hidden-human-in-system-design-why-is-it-still-so-hard-to-write-safe-parallel-code-bd5985225faf"
            target="_blank"
            rel="noreferrer"
          >
            View the original <ExternalLink size={14} />
          </a>
        </div>
      </article>
    </main>
  );
}
