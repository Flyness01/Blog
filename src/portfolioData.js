export const researchInterests = [
  {
    number: "01",
    title: "Parallel & heterogeneous computing",
    description: "How systems can use CPUs, GPUs, and other hardware effectively as workloads grow.",
  },
  {
    number: "02",
    title: "Operating systems & performance",
    description: "How execution structure, memory behavior, and synchronization shape performance and reliability.",
  },
  {
    number: "03",
    title: "Distributed systems",
    description: "How computation and communication can be coordinated across machines under changing workloads.",
  },
];

export const projects = [
  {
    slug: "selfcheckgpt",
    title: "Replica-SelfCheckGPT",
    description: "An early research repository for testing local model behavior and thinking about the systems cost of multi-sample hallucination detection.",
    repository: "https://github.com/Flyness01/Replica-SelfCheckGPT",
  },
];

export const notes = [
  {
    marker: "Foundations 01",
    title: "Systems basics: when parallel work pays off",
    description: "Notes from CUDA coursework on independent work, thread mapping, memory movement, timing, and why the fastest kernel is not automatically the fastest program.",
    path: "/notes/systems-basics",
  },
  {
    marker: "Foundations 02",
    title: "What an operating system is coordinating",
    description: "An operating system sits between programs and hardware, managing processes, memory, devices, and shared resources. I am especially interested in the abstractions it provides—and the important behavior those abstractions can hide.",
  },
  {
    marker: "Performance note",
    title: "A GPU is not automatically faster",
    description: "Small workloads may spend more time launching work and transferring data than computing. Larger workloads with enough independent operations have a better chance of repaying that overhead.",
  },
  {
    marker: "Roadblock",
    title: "The sequential part does not disappear",
    description: "Amdahl’s Law gave me a useful correction: speeding up one part of a program cannot remove the limit imposed by the work that remains sequential.",
  },
  {
    marker: "Systems thought",
    title: "The human hidden in an API",
    description: "An interface can look safe while asking its users to carry an incomplete mental model of the system underneath it. That gap can become a correctness problem, not just a usability problem.",
  },
  {
    marker: "Open question",
    title: "Inference after the first run",
    description: "Repeated local inference raised questions about why prompt-processing behavior changed while generation speed remained comparatively stable—and what should be measured before calling an optimization successful.",
  },
];
