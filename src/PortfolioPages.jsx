import React from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Cpu, Gauge, Network } from "lucide-react";
import CommentsSection from "./CommentsSection";
import { notes, projects, researchInterests } from "./portfolioData";

export function ProfessionalHomePage({ onNavigate }) {
  return (
    <main className="professional-home">
      <section className="profile-hero">
        <figure><img src={`${import.meta.env.BASE_URL}images/flyness-namatama.jpg`} alt="Flyness Namatama seated in a blue chair beside a window" /></figure>
        <div className="profile-intro">
          <span className="kicker">Flyness Namatama</span>
          <h1>Software engineer studying<br /><em>how systems scale.</em></h1>
          <p className="profile-lede">I am interested in how systems make effective use of parallel and heterogeneous hardware, and in the execution, memory, communication, and synchronization costs that shape real performance.</p>
          <p>My interests grew from operating-systems and parallel-processing coursework, research on multi-sample LLM hallucination detection, and performance problems I encountered in industry. This profile collects the work; my blog keeps the learning process visible.</p>
          <div className="profile-actions"><button onClick={() => onNavigate("/blog")}>Visit my learning blog <ArrowRight size={16} /></button><button className="quiet-action" onClick={() => onNavigate("/resume")}>Résumé</button><a href="https://github.com/Flyness01" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a></div>
        </div>
      </section>

      <section className="profile-interests">
        <div><span className="kicker">Current focus</span><h2>Research<br /><em>interests</em></h2></div>
        <div className="profile-interest-simple"><span>Parallel &amp; heterogeneous computing</span><span>Operating systems &amp; performance</span><span>Distributed systems</span></div>
      </section>

    </main>
  );
}

export function LearningBlogPage({ onNavigate, onArticle }) {
  return (
    <main>
      <section className="hero" id="home">
        <div className="eyebrow"><span /> Notes from a curious mind</div>
        <h1>I’m learning in public.<br /><em>Come sit with me.</em></h1>
        <p className="hero-copy">This is the less polished side of my work: systems questions, project trails, class notes, experiments, corrections, and ideas in progress.</p>
        <div className="doodle" aria-hidden="true">curious<br />about it all <span>↝</span></div>
      </section>

      <section className="learning-collection">
        <div className="collection-label"><span className="kicker">Latest writing</span></div>
        <FeaturedWriting onArticle={onArticle} compact />
        <div className="previous-writing">
          <span className="kicker">Previous writing</span>
          <div className="learning-links">
            <button onClick={() => onNavigate("/projects/selfcheckgpt")}><span>What does SelfCheckGPT cost to run locally?</span><ArrowRight /></button>
            <button onClick={() => onNavigate("/notes/systems-basics")}><span>When parallel work pays off</span><ArrowRight /></button>
            <button onClick={() => onNavigate("/writing/partitioned-cache")}><span>What changes when an in-memory cache becomes distributed?</span><ArrowRight /></button>
            <button onClick={() => onNavigate("/writing/network-propagation")}><span>Can topology slow network propagation?</span><ArrowRight /></button>
          </div>
        </div>
      </section>
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
          <article><span>Ongoing research exploration</span><h3>What does SelfCheckGPT cost to run locally?</h3><p>Measuring repeated local inference and investigating when shared prompt-prefix state can reduce latency without changing generated output.</p><button onClick={() => onNavigate("/projects/selfcheckgpt")}>Read the project notebook <ArrowRight size={15} /></button></article>
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
      <WritingBackButton onNavigate={onNavigate} />
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

export function ProjectDetailPage({ onNavigate }) {
  return (
    <main className="portfolio-page project-detail-page">
      <WritingBackButton onNavigate={onNavigate} />
      <PageIntro kicker="Project notebook" title={<>What does SelfCheckGPT<br /><em>cost to run locally?</em></>} copy="An early repository for asking a systems question about hallucination detection: what does it cost to generate and compare multiple model responses locally?" />
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

export function PartitionedCachePage({ onNavigate }) {
  return (
    <main className="portfolio-page project-detail-page">
      <WritingBackButton onNavigate={onNavigate} />
      <PageIntro kicker="Distributed systems notebook" title={<>What changes when an in-memory<br /><em>cache becomes distributed?</em></>} copy="A working prototype that combines concurrent C++ cache nodes with a Python partition-aware client, then measures lookup latency, throughput, and memory behavior across independent processes." />
      <section className="project-notebook">
        <article><span>01 / Architecture</span><h2>Partition locally, shard across nodes</h2><p>Each C++ cache node stores string key/value data in configurable hash partitions protected by POSIX read–write locks. A Python client uses stable SHA-256 routing to distribute keys across independent server processes. The endpoints can be placed on different hosts; the controlled experiment uses two localhost nodes so lock scope can be isolated before adding network variability.</p><blockquote>Distribution adds another boundary: a key must be placed on a node before a thread can synchronize access within that node.</blockquote></article>
        <article><span>02 / What exists now</span><h2>A working distributed prototype</h2><p>The system implements <code>put</code>, <code>get</code>, and <code>erase</code>, persistent TCP connections, concurrent request handling, deterministic key placement, cross-node correctness tests, and a mixed read/write workload driver.</p><div className="setup-grid"><div><small>Cache nodes</small><strong>C++17 · POSIX Threads</strong></div><div><small>Distributed client</small><strong>Python · SHA-256 routing</strong></div><div><small>Measurements</small><strong>Throughput · p50 · p95</strong></div><div><small>Node state</small><strong>Entries · peak RSS</strong></div></div></article>
        <article><span>03 / Correctness</span><h2>Verify routing before timing it</h2><p>The local test still verifies 16,000 concurrent write-and-read operations. A second integration test launches two independent cache servers, routes 100 keys across both nodes, and retrieves every value from the same deterministic destination.</p></article>
        <article><span>04 / Controlled comparison</span><h2>More partitions barely changed this workload</h2><p>Five alternating-order trials compared two nodes with one lock domain each against two nodes with sixteen partitions each. With eight client threads and 16,000 operations per trial, mean throughput was <strong>29,500 ops/s</strong> for one partition and <strong>29,781 ops/s</strong> for sixteen. Mean p95 latency was <strong>0.546 ms</strong> and <strong>0.541 ms</strong>, respectively.</p><p className="measurement-note">The difference was small relative to trial variation. On this localhost workload, protocol and network-path costs—or simply short critical sections—likely dominated lock contention. Partitioning did not produce a material performance improvement.</p></article>
        <article><span>05 / Memory behavior</span><h2>Extra lock domains had a small footprint here</h2><p>Peak RSS stayed around 1.66–1.70 MB per one-partition node and 1.70–1.75 MB per sixteen-partition node. These measurements describe this executable and workload; they do not establish a general memory cost for partitioning.</p></article>
        <article><span>06 / The boundary</span><h2>Distributed does not yet mean resilient</h2><p>The client can shard data across remote endpoints, but the prototype has no replication, failover, persistence, discovery, authentication, encryption, or automatic rebalancing. Modulo routing also remaps many keys when membership changes. Those are not footnotes—they are the mechanisms that turn distributed placement into a reliable distributed system.</p></article>
        <article><span>07 / Next experiments</span><h2>Create contention, then study resilience</h2><ul className="lesson-list"><li>Increase concurrency and critical-section work to expose lock contention.</li><li>Add Zipfian access and identify hot partitions.</li><li>Compare global mutexes, partitioned mutexes, and read–write locks.</li><li>Replace modulo routing with consistent hashing.</li><li>Measure cross-host behavior and network failure.</li><li>Add replication and define consistency semantics.</li></ul></article>
        <div className="repository-card"><div><span className="kicker">Repository</span><h2>Nodes, client, tests, and repeated measurements</h2><p>The repository includes the C++ server, Python sharding client, local and distributed correctness tests, per-trial results, and an explicit limitations section.</p></div><a href="https://github.com/Flyness01/Distributed-In-Memory-Cache" target="_blank" rel="noreferrer">Open on GitHub <ArrowUpRight size={17} /></a></div>
      </section>
    </main>
  );
}

export function NetworkPropagationPage({ onNavigate }) {
  return (
    <main className="portfolio-page project-detail-page">
      <WritingBackButton onNavigate={onNavigate} />
      <PageIntro kicker="Ongoing systems research" title={<>Can containment act<br /><em>before malware spreads?</em></>} copy="This project asks whether a system can predict propagation risk, restructure a network, and coordinate that intervention quickly enough to matter during an ongoing attack. A safe graph simulation provides the first transparent baseline for the larger research question." />
      <section className="project-notebook">
        <article><span>01 / The systems question</span><h2>Useful containment has a deadline</h2><p>My supervised research began with infectious-disease transmission and moved toward computer-virus propagation. The question that drew me toward systems was not only whether an intervention could reduce spread, but whether prediction, decision-making, and network restructuring could finish before the attack outran them.</p><blockquote>Containment is useful only when its benefit survives the cost and delay of carrying it out.</blockquote></article>
        <article><span>02 / The proposed research direction</span><h2>Connect prediction to an executable intervention</h2><p>I proposed investigating a neural network trained with a Levenberg–Marquardt approach to predict propagation and guide node splitting. The intervention would redistribute connections from highly connected nodes across additional virtual nodes. This learned predictor and a real Software-Defined Networking deployment remain under investigation; they are not presented here as completed components.</p></article>
        <article><span>03 / A transparent first baseline</span><h2>Isolate the mechanism before adding a learned model</h2><p>The implemented simulator generates a preferential-attachment network and runs a seeded SIR-style propagation process. Degree centrality identifies the most connected nodes. That is a visible heuristic baseline—not AI. Each selected hub is replaced by virtual nodes that divide its incident edges while preserving the graph’s total edge count.</p><div className="setup-grid"><div><small>Network</small><strong>Preferential attachment</strong></div><div><small>Propagation</small><strong>Seeded SIR-style model</strong></div><div><small>Risk baseline</small><strong>Node degree</strong></div><div><small>Intervention</small><strong>Virtual-node segmentation</strong></div></div></article>
        <article><span>04 / Time-aware experiment</span><h2>The intervention has a shrinking window</h2><p>I extended the simulator so propagation can run before the topology changes. Across 200 paired trials, immediate node splitting changed the infected fraction by <strong>-5.31%</strong> relative to the baseline. At a two-step delay the change was <strong>-3.46%</strong>; at four steps it was <strong>+2.14%</strong>. Virtual replicas were mapped back to their original logical node so a larger represented graph could not manufacture the result.</p><p className="measurement-note">For immediate splitting, the paired mean difference in infected fraction was -0.0283 with an approximate 95% confidence interval of [-0.0580, +0.0014]. Because the interval includes zero, this sweep does not establish that splitting reduces total infection.</p></article>
        <article><span>05 / Competing baselines</span><h2>Stronger containment caused greater disruption</h2><p>Immediate rate limiting reduced the infected fraction by <strong>42.33%</strong> while removing 56 edges. Immediate quarantine reduced it by <strong>65.28%</strong> while removing 83. Their effects weakened as intervention was delayed, but remained larger than node splitting in this configuration.</p><p className="measurement-note">This is not evidence that disconnecting a network is a good operational policy. It exposes the trade-off the next model must measure: propagation prevented versus connectivity, availability, and reconfiguration cost.</p></article>
        <article><span>06 / The abstraction boundary</span><h2>A graph transformation is not a running system</h2><p>The virtual replicas are isolated from one another, which models segmentation rather than transparent virtualization. Delay is currently expressed in simulation steps, not wall-clock controller time. The simulator does not yet measure predictor latency, rule-installation delay, state migration, traffic capacity, failures, or application semantics. Those costs form the central systems evaluation: end-to-end response time, propagation prevented, coordination overhead, and disruption introduced.</p></article>
        <article><span>07 / Connection to my interests</span><h2>Coordination, communication, and time-bounded response</h2><p>This work extends my systems questions beyond one machine. Instead of asking only how threads share memory or how accelerators divide computation, it asks how a distributed system observes risk, coordinates a topology change, and acts under a deadline. Decomposition can create independently managed paths, but prediction, communication, migration, and control overhead decide whether the intervention is useful.</p></article>
        <article><span>08 / Next experiments</span><h2>Measure the entire containment path</h2><ul className="lesson-list"><li>Define the prediction target and compare a learned model with degree-based and non-learned baselines.</li><li>Measure prediction, controller-decision, rule-installation, and state-migration latency separately and end to end.</li><li>Vary network size, density, transmission rate, workload skew, and intervention timing.</li><li>Attach traffic and availability costs to disrupted connections.</li><li>Report containment benefit alongside service disruption and coordination overhead.</li><li>Test whether any observed benefit persists when controller and migration delays are included.</li></ul></article>
        <div className="repository-card"><div><span className="kicker">Repository</span><h2>Safe simulator, tests, and recorded results</h2><p>The repository contains no malware. It includes the graph model, propagation simulator, paired experiment, JSON results, tests, limitations, and follow-up questions.</p></div><a href="https://github.com/Flyness01/Network-Propagation-Containment" target="_blank" rel="noreferrer">Open on GitHub <ArrowUpRight size={17} /></a></div>
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
        <div className="resume-name"><h2>Flyness Namatama</h2><p>Computer systems · software engineering</p></div>
        <div className="resume-row"><h3>Research interests</h3><div><p>Computer systems, operating systems, parallel and heterogeneous runtimes, hardware–software co-design, concurrency, and systems reliability.</p></div></div>
        <div className="resume-row"><h3>Education</h3><div className="resume-stack">
          <div className="resume-entry"><strong>Grambling State University</strong><span>B.S. Computer Science · Expected May 2027 · GPA 3.94/4.0</span><p>Selected coursework includes Operating Systems, Parallel Processing, Computer Architecture, Database Management, Big Data &amp; Cloud Security, Applied Cryptography, Data Structures &amp; Algorithms, Discrete Structures, and Calculus I.</p></div>
          <div className="resume-entry"><strong>eCornell</strong><span>Machine Learning Certificate</span></div>
        </div></div>
        <div className="resume-row"><h3>Research &amp; technical work</h3><div className="resume-stack">
          <div className="resume-entry"><strong>Parallel computing &amp; systems performance</strong><span>CUDA C · C++ · Spring 2026</span><p>Implemented and benchmarked CUDA kernels on NVIDIA Tesla T4 GPUs, comparing CPU and GPU execution while examining thread configuration, memory transfers, launch overhead, workload scaling, and measurement boundaries.</p></div>
          <div className="resume-entry"><strong>Distributed in-memory data processing &amp; caching engine</strong><span>C++ · POSIX Threads · Python · Spring–Fall 2026</span><p>Developed concurrent C++ cache nodes and a Python partition-aware client that shards keys across independent processes. Verified cross-node routing and evaluated one versus sixteen lock domains using repeated throughput, latency, and peak-memory measurements.</p></div>
          <div className="resume-entry"><strong>Local LLM inference profiling &amp; KV-cache benchmarking</strong><span>Python · MLX-LM · Hugging Face · Spring 2026</span><p>Profiled repeated local inference for a 4-bit Llama 3.2 3B model, measuring prompt-processing throughput, autoregressive generation throughput, and peak memory. Built a controlled shared-prefix KV-cache benchmark and studied potential latency, throughput, and memory trade-offs in multi-sample, SelfCheckGPT-style hallucination detection.</p></div>
        </div></div>
        <div className="resume-row"><h3>Experience</h3><div className="resume-stack">
          <div className="resume-entry"><strong>Software Engineering Intern · Salesforce (Slack)</strong><span>Admin &amp; Trust Infrastructure · May–August 2026</span><p>Contributed to concurrency and performance work for bulk operations, tested larger action batches, and investigated runtime bottlenecks and reliability before rollout.</p></div>
          <div className="resume-entry"><strong>Backend Software Engineering Intern · Salesforce (Slack)</strong><span>Enterprise Tools &amp; Frameworks · May–August 2025</span><p>Built backend infrastructure involving public APIs, asynchronous I/O, structured logging, validation, defensive programming, testing, and production-facing debugging.</p></div>
          <div className="resume-entry"><strong>Emerging Leaders Engineering Fellow · Goldman Sachs</strong><span>October 2024–January 2025</span><p>Collaborated on a quantitative tool for modeling historical mutual-fund returns and participated in engineering sessions on architecture, testing, and algorithms.</p></div>
          <div className="resume-entry"><strong>Discovery Intern · Deloitte</strong><span>June–July 2024</span><p>Analyzed operational workflows, translated constraints into technical requirements, and communicated solution recommendations and design trade-offs.</p></div>
        </div></div>
        <div className="resume-row"><h3>Technical skills</h3><div className="resume-skills"><p><b>Languages</b> C/C++, CUDA C, Hack (HHVM), Python, JavaScript, SQL</p><p><b>Systems</b> GPU programming, memory hierarchies, synchronization, parallel work distribution, concurrency, backend reliability</p><p><b>Tools</b> Git, Linux/Unix, CI/CD, feature flags, PyTorch, Hugging Face Transformers, NumPy, pandas, scikit-learn</p></div></div>
        <div className="resume-row"><h3>Honors</h3><div><p>Top 5 Finalist, Future Tech Challenge at Apple Campus (2026) · 3rd Place, Entrepreneurship Pelican Cup (2026) · 3rd Place, Bayou Classic BizTech Challenge (2025–2026) · NSBE Highest Academic Achievement Award (2025) · Presidential Academic Scholarship · President’s List · Tapia 2024 Scholar</p></div></div>
        <div className="resume-row"><h3>Leadership</h3><div><p>NSBE Programs Chair (2024–2025) · Women in Technology Events Coordinator · African Students Association Secretary · ColorStack and Rewriting the Code fellow and participant</p></div></div>
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

function WritingBackButton({ onNavigate }) {
  return <div className="writing-back-wrap"><button className="back-link" onClick={() => onNavigate("/blog")}><ArrowLeft size={16} /> Back to the blog</button></div>;
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
