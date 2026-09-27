import React from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Cpu, Gauge, Network } from "lucide-react";
import CommentsSection from "./CommentsSection";
import { notes, projects, researchInterests } from "./portfolioData";

export function HomePage({ onNavigate, onArticle }) {
  return (
    <main>
      <section className="hero" id="home">
        <div className="eyebrow"><span /> Notes from a curious mind</div>
        <h1>I’m learning in public.<br /><em>Come sit with me.</em></h1>
        <p className="hero-copy">I’m Flyness Namatama. This is my research notebook and personal portfolio—a place for systems questions, project trails, classwork, and ideas in progress.</p>
        <button className="primary-button" onClick={() => onNavigate("/research")}>Follow the questions <span>→</span></button>
        <div className="doodle" aria-hidden="true">curious<br />about it all <span>↝</span></div>
      </section>

      <section className="portfolio-map">
        <div className="section-heading light-heading">
          <div><span className="kicker">A small map of this space</span><h2>Research, with<br /><em>room in the margins</em></h2></div>
          <p>The polished work lives beside the questions, experiments, and class notes that helped shape it.</p>
        </div>
        <div className="map-grid">
          <button className="map-card-no-icon" onClick={() => onNavigate("/research")}><span>Research</span><small>The areas and questions guiding my work.</small><ArrowRight /></button>
          <button className="map-card-no-icon" onClick={() => onNavigate("/projects")}><span>Projects</span><small>Research, coursework, and engineering work.</small><ArrowRight /></button>
          <button onClick={() => onNavigate("/blog")}><BookOpen /><span>Blog</span><small>Articles, research notes, and ideas still taking shape.</small><ArrowRight /></button>
        </div>
      </section>

      <FeaturedWriting onArticle={onArticle} />
      <CommentsSection postSlug="general" kicker="In the margins" description="Questions, reflections, suggestions, and thoughts about this space are welcome here." />
    </main>
  );
}

export function ResearchPage({ onNavigate }) {
  return (
    <main className="portfolio-page research-page">
      <PageIntro kicker="Research interests" title={<>Systems that make<br /><em>parallel work worthwhile</em></>} copy="I am interested in how systems use parallel and heterogeneous hardware as workloads grow, and in the execution, memory, communication, and synchronization costs that keep theoretical speedup from becoming real performance." />
      <section className="interest-list">
        {researchInterests.map((interest, index) => {
          const Icon = [Cpu, Gauge, Network][index];
          return <article key={interest.number}><span>{interest.number}</span><Icon /><h2>{interest.title}</h2><p>{interest.description}</p></article>;
        })}
      </section>
      <section className="selected-research">
        <div className="section-heading light-heading"><div><span className="kicker">Selected work</span><h2>How I am exploring<br /><em>these interests</em></h2></div><p>I am early in this work, so I separate ongoing research, technical writing, and coursework rather than presenting all of it as publication.</p></div>
        <div className="selected-research-grid">
          <article><span>Ongoing research exploration</span><h3>Efficient multi-sample hallucination detection</h3><p>Measuring repeated local inference and investigating when shared prompt-prefix state can reduce latency without changing generated output.</p><button onClick={() => onNavigate("/projects/selfcheckgpt")}>Read the project notebook <ArrowRight size={15} /></button></article>
          <article><span>Foundational notebook</span><h3>When parallel work pays off</h3><p>Connecting CUDA thread mapping, transfer overhead, timing boundaries, and correctness checks to the systems questions I now carry into new work.</p><button onClick={() => onNavigate("/notes/systems-basics")}>Read Systems Basics <ArrowRight size={15} /></button></article>
        </div>
      </section>
      <PageCta text="See how these interests became projects" label="View projects" onClick={() => onNavigate("/projects")} />
    </main>
  );
}

export function ProjectsPage({ onNavigate }) {
  return (
    <main className="portfolio-page projects-page">
      <PageIntro kicker="Projects" title={<>Work I can<br /><em>open up and show</em></>} copy="Projects live here when there is something concrete to inspect: code, a technical note, a research record, or a clear account of what I learned." />
      <section className="project-list">
        {projects.map((project, index) => (
          <article key={project.title}>
            <div className="project-index">0{index + 1}</div>
            <div className="project-details">
              <h2>{project.title}</h2><p>{project.description}</p>
              <div className="project-actions">
                <button onClick={() => onNavigate(`/projects/${project.slug}`)}>Read the project notes <ArrowRight size={16} /></button>
                <a href={project.repository} target="_blank" rel="noreferrer">View the code <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function NotesPage({ onNavigate }) {
  return (
    <main className="portfolio-page explorations-page">
      <PageIntro kicker="Notes" title={<>The basics, the roadblocks,<br /><em>and what I think so far</em></>} copy="These are learning notes rather than résumé entries: concepts in my own words, observations from experiments, misunderstandings I had to correct, and questions I still cannot neatly answer." />
      <section className="exploration-notes">
        {notes.map((item, index) => <article key={item.title} className={`exploration-note note-${(index % 3) + 1}`}><span>{item.marker}</span><h2>{item.title}</h2><p>{item.description}</p>{item.path && <button className="note-link" onClick={() => onNavigate(item.path)}>Open the notebook <ArrowRight size={15} /></button>}</article>)}
      </section>
      <PageCta text="Some questions eventually become essays" label="Read the blog" onClick={() => onNavigate("/blog")} />
    </main>
  );
}

export function SystemsBasicsPage({ onNavigate }) {
  return (
    <main className="portfolio-page systems-basics-page">
      <PageIntro kicker="Systems basics · learning notebook" title={<>Parallelism is a promise.<br /><em>Overhead sends the invoice.</em></>} copy="These notes grew from CUDA coursework on a Colab Tesla T4. I am keeping the mechanics, measurements, and questions together because knowing how to launch parallel work is different from knowing when that work is worthwhile." />

      <section className="basics-notebook">
        <article className="basics-opening">
          <span>01 / The foundation</span>
          <h2>Parallelizable does not mean profitable</h2>
          <p>A loop is a good candidate for data parallelism when each iteration can operate independently. SAXPY, vector addition, array squaring, and per-pixel Julia-set computation all have that shape: one output element does not need the result of its neighbor.</p>
          <div className="thought-equation"><code>out[i] = a * x[i] + y[i]</code><small>Independent indices make concurrency possible. They do not make its overhead disappear.</small></div>
          <p>The research question starts one level above correctness: after identifying independent work, what does the system spend to expose and execute that parallelism?</p>
        </article>

        <article>
          <span>02 / Mapping work</span>
          <h2>A thread needs both a job and a boundary</h2>
          <p>CUDA turns coordinates in a launch configuration into data indices. The global index combines the block, the size of each block, and the thread’s position inside it:</p>
          <pre><code>{`int i = blockIdx.x * blockDim.x + threadIdx.x;
if (i < n) {
    out[i] = a * x[i] + y[i];
}`}</code></pre>
          <p>The bounds check is part of the algorithm, not cleanup. Ceiling division launches enough threads to cover the array, which can also produce extra threads. Correct parallel code has to describe useful work and safely exclude work that does not exist.</p>
          <aside className="margin-question"><small>Question in the margin</small><p>How much performance reasoning should an abstraction hide before it also hides the conditions required for correctness?</p></aside>
        </article>

        <article>
          <span>03 / The whole path</span>
          <h2>The kernel is only one part of the program</h2>
          <div className="systems-flow" aria-label="Host to GPU execution flow"><div>Allocate</div><b>→</b><div>Copy to device</div><b>→</b><div>Launch</div><b>→</b><div>Synchronize</div><b>→</b><div>Copy back</div></div>
          <p>CUDA events measured device work because kernels launch asynchronously; ordinary CPU wall-clock timing can stop before the GPU finishes unless execution is synchronized. But kernel-only timing answers a narrower question than end-to-end timing. A fast kernel can live inside a slow data-movement path.</p>
          <div className="comparison-callout"><div><small>Kernel question</small><strong>How fast did the GPU execute?</strong></div><div><small>Systems question</small><strong>How long until the application had the result?</strong></div></div>
        </article>

        <article>
          <span>04 / What I measured</span>
          <h2>The crossover moved depending on what I counted</h2>
          <p>In one repeated vector-addition exercise, kernel-only timing on the T4 first edged past the CPU around <strong>N = 1,000</strong> and peaked at <strong>172.94×</strong> at N = 300,000. That is evidence about the kernel benchmark, not a universal GPU crossover.</p>
          <p>A separate SAXPY exercise made the distinction sharper. At N = 10,000,000, the kernel took 0.4626 ms while the full GPU path took 43.8740 ms; the CPU took 43.5054 ms. At N = 50,000,000, the full GPU path was again slower than the CPU even though the kernel alone was much faster.</p>
          <div className="basics-measures">
            <div><small>Workload</small><strong>SAXPY · N = 10M</strong></div>
            <div><small>Kernel only</small><strong>0.4626 ms</strong></div>
            <div><small>GPU end to end</small><strong>43.8740 ms</strong></div>
            <div><small>CPU</small><strong>43.5054 ms</strong></div>
          </div>
          <p className="measurement-note">These are coursework observations from individual Colab T4 runs. They may include warm-up and platform variation, so I use them to motivate better experiments, not to claim a general hardware ranking.</p>
        </article>

        <article>
          <span>05 / A visual case</span>
          <h2>Workload shape matters</h2>
          <p>A Julia-set image offered a more compute-heavy example: one million pixels, each independently iterating the same complex-number rule up to 200 times. That regular, high-volume structure gave the GPU enough work to amortize more of its setup cost.</p>
          <p>The useful comparison was not merely that the GPU ran faster. The CPU and GPU implementations also had to produce the same image. Performance without an equivalence check would leave open the possibility that the “faster” version simply did different work.</p>
          <blockquote>Speedup is meaningful only after the outputs and the work required to produce them are comparable.</blockquote>
        </article>

        <article>
          <span>06 / What I think now</span>
          <h2>My checklist before believing a speedup</h2>
          <ol className="research-checklist">
            <li><strong>Find independence.</strong><p>Which operations can proceed without waiting on one another?</p></li>
            <li><strong>Define the boundary.</strong><p>Am I timing a kernel, a transfer, or the complete user-visible operation?</p></li>
            <li><strong>Verify equivalence.</strong><p>Did both implementations perform the same work and produce acceptable results?</p></li>
            <li><strong>Repeat and vary scale.</strong><p>Does the result survive warm-up, noise, different N values, and different launch configurations?</p></li>
            <li><strong>Look for the new bottleneck.</strong><p>If computation became cheaper, did memory bandwidth, transfer, or synchronization take its place?</p></li>
          </ol>
        </article>

        <article>
          <span>07 / Where I carried this forward</span>
          <h2>The concepts became ways of seeing real systems</h2>
          <p>The coursework gave me vocabulary for performance problems I had already encountered and a method for investigating new ones. I did not take a CUDA kernel and transplant it into every setting; I carried forward the questions behind it.</p>
          <div className="concept-bridges">
            <div><small>Independent work</small><h3>Bulk backend operations</h3><p>When repeated work in a request path began timing out for larger workloads, I separated the per-item operations, moved them into asynchronous execution, and used concurrency to keep the blocking path within its runtime limit.</p></div>
            <div><small>Amortizing repeated setup</small><h3>Multi-sample LLM inference</h3><p>SelfCheckGPT-style evaluation repeats the same prompt to obtain several responses. That made redundant prompt processing look like the same class of systems question: what can be shared, what must remain independent, and when does reuse materially reduce end-to-end latency?</p></div>
            <div><small>Communication structure</small><h3>Distributed-system resilience</h3><p>Exploring malware propagation and software-defined networking extended the question beyond one processor: how do communication patterns and changes to network topology affect coordination, containment, and system behavior?</p></div>
          </div>
          <aside className="margin-question"><small>The connective idea</small><p>Parallelism is not one technique. It is a recurring decision about decomposition, placement, communication, and the cost of coordination.</p></aside>
        </article>

        <article className="basics-next">
          <span>08 / Questions I am carrying forward</span>
          <h2>From CUDA foundations to systems research</h2>
          <div className="question-stack"><p>Can data remain near the accelerator long enough to amortize transfer cost across several operations?</p><p>How do batching and concurrent execution change latency, throughput, memory pressure, and correctness?</p><p>When does the best launch configuration change with hardware, workload size, or resource use?</p><p>Which metric best represents the experience of the application rather than one isolated component?</p></div>
          <button className="note-link" onClick={() => onNavigate("/projects/selfcheckgpt")}>See these questions in my inference project <ArrowRight size={15} /></button>
        </article>
      </section>
    </main>
  );
}

export function ProjectDetailPage() {
  return (
    <main className="portfolio-page project-detail-page">
      <PageIntro kicker="Project notebook" title={<>Replica-<br /><em>SelfCheckGPT</em></>} copy="An early repository for asking a systems question about hallucination detection: what does it cost to generate and compare multiple model responses locally?" />
      <section className="project-notebook">
        <article>
          <span>01 / Research question</span><h2>From factuality to systems cost</h2>
          <p>SelfCheckGPT-style detection asks a model for multiple candidate responses and checks whether they support one another. I began with the factuality problem, then became interested in the machinery underneath it: how much repeated generation costs in prompt-processing latency, decode throughput, and memory.</p>
          <blockquote>What changes when a factuality method needs several generations instead of one?</blockquote>
        </article>
        <article>
          <span>02 / Baseline setup</span><h2>A small local experiment</h2>
          <p>I ran a 4-bit quantized Llama 3.2 3B model with MLX-LM on an Apple Silicon M4 machine with 16 GB unified memory. The prompt asked who won the 2024 Nobel Prize in Physics. Each of three sequential runs was limited to 50 generated tokens.</p>
          <div className="setup-grid"><div><small>Model</small><strong>Llama 3.2 3B · 4-bit</strong></div><div><small>Runtime</small><strong>MLX-LM · Python 3.12</strong></div><div><small>Execution</small><strong>3 sequential runs</strong></div><div><small>Hardware</small><strong>Apple Silicon M4 · 16 GB</strong></div></div>
        </article>
        <article>
          <span>03 / Debugging trail</span><h2>The sampling argument was at the wrong layer</h2>
          <p>My first script passed <code>temp=</code> and then <code>temperature=</code> directly to the generation function. Both reached a lower-level function that did not accept those keywords. Removing them produced a clean greedy baseline; the corrected benchmark now constructs a sampler explicitly.</p>
          <pre><code>{`sampler = make_sampler(temp=temperature, top_p=top_p)\n\nstream_generate(\n    model, tokenizer, prompt,\n    max_tokens=max_tokens,\n    sampler=sampler,\n)`}</code></pre>
        </article>
        <article>
          <span>04 / Recorded measurements</span><h2>The first prompt pass stood apart</h2>
          <div className="metrics-table" role="table" aria-label="Recorded inference measurements">
            <div className="metrics-head" role="row"><span>Run</span><span>Prompt tok/s</span><span>Generation tok/s</span><span>Peak memory</span></div>
            <div role="row"><span>01</span><strong>26.104</strong><strong>44.241</strong><strong>1.864 GB</strong></div>
            <div role="row"><span>02</span><strong>139.774</strong><strong>47.914</strong><strong>1.864 GB</strong></div>
            <div role="row"><span>03</span><strong>123.265</strong><strong>46.966</strong><strong>1.864 GB</strong></div>
          </div>
          <p>The two later prompt-processing runs averaged 131.519 tokens per second—about 5.04 times the first run—while generation averaged 46.374 tokens per second across all three. The difference is real in this run; its cause is not yet isolated.</p>
        </article>
        <article>
          <span>05 / Controlled follow-up</span><h2>The 34% result did not survive a fairer test</h2>
          <p>My first cache experiment appeared to reduce latency by roughly 34%. On inspection, however, the cached and uncached paths were not doing exactly the same work: one token was generated during “prefill,” the last prompt token was reused incorrectly, and the timing boundaries differed. I rewrote the benchmark before treating that number as a result.</p>
          <p>The corrected sweep requests equal output-token counts, alternates which strategy runs first, repeats each condition five times, and checks that both paths produce identical greedy outputs. The cached path reuses only the shared prompt prefix; the four continuations still run sequentially.</p>
          <div className="metrics-table cache-results" role="table" aria-label="Controlled shared-prefix cache results">
            <div className="metrics-head" role="row"><span>Tokens / branch</span><span>All-run mean</span><span>After warm-up</span><span>Outputs match</span></div>
            <div role="row"><span>30</span><strong>10.68%</strong><strong>6.64%</strong><strong>Yes</strong></div>
            <div role="row"><span>40</span><strong>8.28%</strong><strong>7.51%</strong><strong>Yes</strong></div>
            <div role="row"><span>100</span><strong>2.62%</strong><strong>3.99%</strong><strong>Yes</strong></div>
          </div>
          <p className="measurement-note">Values are latency reductions from shared-prefix reuse on this model, prompt, and machine. Negative individual trials also occurred, which is why I report repeated means rather than the best run.</p>
          <blockquote>Prefix reuse helped modestly, but its share of the total cost shrank as token-by-token decoding grew longer.</blockquote>
        </article>
        <article>
          <span>06 / Factuality result</span><h2>A reproducible wrong answer</h2>
          <p>Greedy decoding produced the same response all three times: the model said the 2024 prize had not yet been awarded. The official Nobel record names John J. Hopfield and Geoffrey Hinton. The prompt therefore exposed a knowledge-boundary failure, but three identical greedy responses are not the diverse samples SelfCheckGPT requires.</p>
          <a className="inline-source" href="https://www.nobelprize.org/prizes/physics/2024/summary/" target="_blank" rel="noreferrer">Check the official result <ArrowUpRight size={15} /></a>
        </article>
        <article>
          <span>07 / Lessons learned</span><h2>What measurement changed in my thinking</h2>
          <ul className="lesson-list"><li>Equivalent workloads matter more than an impressive headline number.</li><li>Prompt ingestion and token decoding need separate measurements.</li><li>A cold-versus-warm difference shows a stateful effect, not proof of a particular cache mechanism.</li><li>Repeated trials reveal variance that a single favorable run hides.</li><li>Repeating greedy decoding is a systems baseline, not stochastic sampling.</li><li>Performance and factuality should eventually be evaluated together.</li></ul>
        </article>
        <article>
          <span>08 / Where I am going next</span><h2>Cache reuse is one piece, not the whole system</h2>
          <p>The controlled result is encouraging but deliberately narrow: one model, one prompt, one Apple Silicon machine, and four sequential branches. Next I want to test a broader prompt set, stochastic sampling, longer contexts, and per-process memory behavior before comparing sequential, batched, and genuinely concurrent generation.</p>
          <p>This remains an active investigation. The aim is not simply to make repeated generation faster, but to understand when a systems optimization preserves the diverse evidence that hallucination detection actually needs.</p>
        </article>
        <div className="repository-card"><div><span className="kicker">Repository</span><h2>Code, raw metrics, and the longer research log</h2><p>The repository now includes a configurable benchmark, preserved results, an analyzer, tests, limitations, and proposed follow-up experiments. It still distinguishes surviving evidence from work that was considered but not preserved.</p></div><a href="https://github.com/Flyness01/Replica-SelfCheckGPT" target="_blank" rel="noreferrer">Open on GitHub <ArrowUpRight size={17} /></a></div>
      </section>
    </main>
  );
}

export function WritingPage({ onArticle, onNavigate }) {
  return (
    <main className="portfolio-page writing-page">
      <PageIntro kicker="Blog" title={<>A research diary,<br /><em>with room to think</em></>} copy="Technical essays, learning notes, experiments, and questions about systems, parallelism, and the humans who build them." />
      <FeaturedWriting onArticle={onArticle} compact />
      <section className="blog-notes-link"><div><span className="kicker">From the notebook</span><h2>Systems basics: when parallel work pays off</h2><p>What CUDA coursework taught me about independent work, overhead, measurement boundaries, and why the fastest kernel is not automatically the fastest program.</p></div><button onClick={() => onNavigate("/notes/systems-basics")}>Read the research note <ArrowRight size={16} /></button></section>
    </main>
  );
}

export function ResumePage() {
  return (
    <main className="portfolio-page resume-page">
      <PageIntro kicker="Résumé" title={<>Research questions,<br /><em>engineering practice</em></>} copy="A concise view of the experiences currently shaping my work." />
      <section className="resume-sheet">
        <div className="resume-name"><h2>Flyness Namatama</h2><p>Systems research &amp; software engineering</p></div>
        <div className="resume-row"><h3>Research focus</h3><div><strong>Efficient multi-sample hallucination detection</strong><span>February 2026–present</span><p>Studying the latency, throughput, memory, and accuracy trade-offs involved in distributing multi-sample detection.</p></div></div>
        <div className="resume-row"><h3>Experience</h3><div><strong>Software Engineering Intern · Slack</strong><span>Summers 2025 &amp; 2026</span><p>Worked on workload-dependent latency and backend execution problems, including asynchronous and concurrent approaches for operations at scale.</p></div></div>
        <div className="resume-row"><h3>Selected coursework</h3><div><strong>Operating systems · Parallel processing</strong><p>Coursework that shaped my interests in execution, synchronization, memory behavior, heterogeneous hardware, and systems performance.</p></div></div>
        <p className="resume-note">This web résumé includes only details currently documented on this site.</p>
      </section>
    </main>
  );
}

export function AboutPage() {
  return (
    <main className="portfolio-page about-page">
      <section className="about about-standalone">
        <figure className="portrait"><img src={`${import.meta.env.BASE_URL}images/flyness-namatama.jpg`} alt="Flyness Namatama seated in a blue chair beside a window" /></figure>
        <div className="about-copy">
          <span className="kicker">A little about me</span><h2>Hello, I’m Flyness.</h2>
          <p className="large">I’m interested in what prevents parallel and heterogeneous systems from delivering the performance their hardware seems to promise.</p>
          <p>My questions grew out of operating-systems and parallel-processing coursework, research on LLM hallucination detection, and performance problems I encountered in industry. I use this space to document that continued learning carefully, including paths that are still unfinished.</p>
          <div className="about-research-interests"><span className="kicker">Research interests</span><ul><li>Parallel and heterogeneous computing</li><li>Operating systems and systems performance</li><li>Distributed systems</li></ul></div>
        </div>
      </section>
    </main>
  );
}

function PageIntro({ kicker, title, copy }) {
  return <section className="page-intro"><span className="kicker">{kicker}</span><h1>{title}</h1><p>{copy}</p></section>;
}

function PageCta({ text, label, onClick }) {
  return <section className="page-cta"><p>{text}</p><button onClick={onClick}>{label}<ArrowRight size={18} /></button></section>;
}

function FeaturedWriting({ onArticle, compact = false }) {
  return (
    <section className={compact ? "featured featured-standalone" : "featured"}>
      {!compact && <div className="section-heading"><div><span className="kicker">Latest writing</span><h2>Ideas I keep<br /><em>coming back to</em></h2></div><p>Technical writing about systems, parallelism, and the humans who build them.</p></div>}
      <article className="lead-post">
        <div className="lead-art"><div className="paper-note"><span>QUESTION № 01</span><p>Why is safe parallel code still so difficult to write?</p><small>— a question I’m exploring</small></div><div className="flower" aria-hidden="true">✿</div></div>
        <div className="lead-content"><div className="post-meta"><span>Published article</span> July 2026 · 4 min read</div><h3>The hidden human in system design</h3><p>How developer expectations, API behavior, and hidden reference-counting operations collide inside the Linux kernel.</p><button className="article-link" onClick={onArticle}>Read the full article <ArrowUpRight size={17} /></button></div>
      </article>
    </section>
  );
}
