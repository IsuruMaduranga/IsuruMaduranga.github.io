// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "Blog posts by Isuru Wijesiri on NLP, agentic AI, code generation, and machine learning research.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Research publications by Isuru Wijesiri on NLP, federated graph learning, anomaly detection, and agentic AI systems.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Projects by Isuru Wijesiri including WSO2 Integrator Copilot, federated GNN, code retrieval models, and agentic AI frameworks.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "CV of Isuru Wijesiri - AI researcher and engineer with experience in NLP, code generation, and graph ML at WSO2 and University of Moratuwa.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Open-source projects and GitHub contributions by Isuru Wijesiri - AI tools, NLP frameworks, and research code.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Teaching and mentoring by Isuru Wijesiri - university courses, private tutoring, and conference presentations on AI and integration.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "post-appendix-d-retries-rate-limits-and-streaming",
        
          title: "Appendix D: Retries, Rate Limits, and Streaming",
        
        description: "The unglamorous plumbing: retries, rate limits, and how streaming actually works on the wire.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-appendix-d-retries/";
          
        },
      },{id: "post-appendix-c-modes-and-plan-mode",
        
          title: "Appendix C: Modes and Plan Mode",
        
        description: "Harness-enforced operating states: Ask, Edit, and Plan modes, and why plan mode exists.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-appendix-c-modes/";
          
        },
      },{id: "post-appendix-b-worktrees-and-isolation",
        
          title: "Appendix B: Worktrees and Isolation",
        
        description: "Giving parallel agents separate copies of the world with git worktrees and isolation.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-appendix-b-worktrees/";
          
        },
      },{id: "post-appendix-a-one-harness-many-brains",
        
          title: "Appendix A: One Harness, Many Brains",
        
        description: "Running one harness over several models: model routing, prompt tiers, and cost engineering.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-appendix-a-model-routing/";
          
        },
      },{id: "post-epilogue-build-your-own",
        
          title: "Epilogue: Build Your Own",
        
        description: "The complete toy harness, about 300 lines of dependency-free Python, annotated end to end.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-16-epilogue/";
          
        },
      },{id: "post-chapter-15-rag-was-a-harness-pattern-all-along",
        
          title: "Chapter 15: RAG Was a Harness Pattern All Along",
        
        description: "Retrieval-augmented generation was a harness pattern all along: a thousand names for putting the right bytes in the array.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-15-rag/";
          
        },
      },{id: "post-chapter-14-case-study-coding-agents",
        
          title: "Chapter 14: Case Study: Coding Agents",
        
        description: "A case study in how specialized the body needs to be, using coding agents as the worked example.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-14-coding-agents/";
          
        },
      },{id: "post-chapter-13-reflexes-and-guardrails",
        
          title: "Chapter 13: Reflexes and Guardrails",
        
        description: "The loop will eventually try something dumb. Permissions, sandboxes, and reflexes that decide which of the brain&#39;s requests actually run.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-13-guardrails/";
          
        },
      },{id: "post-chapter-12-debugging-the-array",
        
          title: "Chapter 12: Debugging the Array",
        
        description: "You cannot fix the prompt you cannot see. Reading and diffing the raw array to debug agent behavior.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-12-debugging/";
          
        },
      },{id: "post-chapter-11-extending-the-body-mcp-skills-deferred-loading-hooks",
        
          title: "Chapter 11: Extending the Body: MCP, Skills, Deferred Loading, Hooks",
        
        description: "Capabilities that do not fit in the array: MCP servers, skills, deferred tool loading, and hooks.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-11-extending-the-body/";
          
        },
      },{id: "post-chapter-10-every-framework-is-a-wrapper-around-chapter-1",
        
          title: "Chapter 10: Every Framework Is a Wrapper Around Chapter 1",
        
        description: "Abstraction anxiety, cured. Every agent framework is a wrapper around the JSON-array loop from chapter 1.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-10-frameworks/";
          
        },
      },{id: "post-chapter-9-background-work-and-time",
        
          title: "Chapter 9: Background Work and Time",
        
        description: "The loop is synchronous; the world is not. Running long tasks in the background and waking the agent when they finish.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-09-background-work/";
          
        },
      },{id: "post-chapter-8-steering-the-running-loop",
        
          title: "Chapter 8: Steering the Running Loop",
        
        description: "The brain drifts mid-task. How a harness injects new instructions into a loop that is already running.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-08-steering/";
          
        },
      },{id: "post-chapter-7-subagents-fork-the-context",
        
          title: "Chapter 7: Subagents: Fork the Context",
        
        description: "One array cannot hold all the work. Forking a fresh context for a sub-task and returning only its result to the parent.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-07-subagents/";
          
        },
      },{id: "post-chapter-6-context-is-a-budget-not-a-bag",
        
          title: "Chapter 6: Context Is a Budget, Not a Bag",
        
        description: "The context window fills up. Treating context as a budget to spend, not a bag to fill, and what actually consumes a coding agent&#39;s window.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-06-context-budget/";
          
        },
      },{id: "post-chapter-5-caching-why-order-is-load-bearing",
        
          title: "Chapter 5: Caching: Why Order Is Load-Bearing",
        
        description: "Resending the whole array every turn gets expensive. Prompt prefix caching, and why the order of the array is load-bearing for cost.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-05-caching/";
          
        },
      },{id: "post-chapter-4-the-agent-loop",
        
          title: "Chapter 4: The Agent Loop",
        
        description: "One tool call is not enough. Wrapping the model in a loop that keeps calling tools until the task is done turns a chat box into an agent.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-04-agent-loop/";
          
        },
      },{id: "post-chapter-3-tools-json-mapped-to-functions",
        
          title: "Chapter 3: Tools: JSON Mapped to Functions",
        
        description: "Tool calling is JSON mapped to functions: how the brain asks the harness to touch the world, and how results return to the array.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-03-tools/";
          
        },
      },{id: "post-chapter-2-the-brain-a-next-token-black-box",
        
          title: "Chapter 2: The Brain: A Next-Token Black Box",
        
        description: "What sits on the other end of the POST, and why knowing how a next-token model was trained predicts most of its strange behavior.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-02-the-brain/";
          
        },
      },{id: "post-chapter-1-it-39-s-just-a-json-array",
        
          title: "Chapter 1: It&#39;s Just a JSON Array",
        
        description: "An LLM API is a stateless HTTP POST: a JSON array of role-tagged messages in, one continuation out. Everything the field calls agents is patches to that one loop.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-01-json-array/";
          
        },
      },{id: "post-harness-engineering-101",
        
          title: "Harness Engineering 101",
        
        description: "A blog series about building AI agents from first principles. An LLM API is stateless: every turn you send the whole conversation as a JSON array and get text back. A harness is the program that builds, maintains, and protects that array; everything the field calls agents is a set of patches to that one loop.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/harness-engineering-101/";
          
        },
      },{id: "post-context-beats-the-model-building-a-domain-specific-coding-agent",
        
          title: "Context Beats the Model: Building a Domain-Specific Coding Agent",
        
        description: "How we built WSO2 Integrator Copilot, a domain-specific coding agent with 23 tools, 4 subagents, an on-demand knowledge graph, and a caching strategy that hits 81-90% prompt cache reuse.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/building-claude-code-style-agent/";
          
        },
      },{id: "news-released-lightweight-code-retrieval-models-22m-33m-parameters-on-hugging-face-l6-and-l12-achieving-97-recall-10-for-domain-specific-code-search",
          title: 'Released lightweight code retrieval models (22M/33M parameters) on Hugging Face: L6 and L12...',
          description: "",
          section: "News",},{id: "news-presented-a-technical-deep-dive-on-blockchain-architecture-consensus-algorithms-and-distributed-ledger-mechanisms-at-wso2-technology-conference-2025-watch-the-talk",
          title: 'Presented a technical deep-dive on blockchain architecture, consensus algorithms, and distributed ledger mechanisms...',
          description: "",
          section: "News",},{id: "news-started-as-lead-research-collaborator-at-university-of-moratuwa-on-google-funded-research-on-automatic-post-editing-for-low-resource-languages-sinhala-tamil",
          title: 'Started as Lead Research Collaborator at University of Moratuwa on Google-funded research on...',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-findings-of-emnlp-2026-first-author-confident-but-wrong-a-constrained-decoding-diagnostic-for-low-resource-automatic-post-editing",
          title: 'Paper accepted to Findings of EMNLP 2026 (first author): “Confident but Wrong: A...',
          description: "",
          section: "News",},{id: "news-published-harness-engineering-101-a-blog-series-on-building-llm-agents-and-harnesses-from-first-principles",
          title: 'Published Harness Engineering 101, a blog series on building LLM agents and harnesses...',
          description: "",
          section: "News",},{id: "projects-ai-cookbooks",
          title: 'AI Cookbooks',
          description: "Curated collection of Colab/Jupyter notebooks for real-world AI tasks. Includes training pipelines, model fine-tuning, and custom implementations that go beyond the defaults.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/0_ai_cookbooks/";
            },},{id: "projects-wso2-integrator-copilot",
          title: 'WSO2 Integrator Copilot',
          description: "Cursor/Claude Code style coding agent for WSO2 Micro Integrator with 700+ daily active users",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_mi_copilot/";
            },},{id: "projects-toolflow",
          title: 'Toolflow',
          description: "Lightweight research framework for LLM-based agents with structured output guarantees and automatic tool invocation",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_toolflow/";
            },},{id: "projects-lightweight-code-retrieval-models",
          title: 'Lightweight Code Retrieval Models',
          description: "MiniLM-based sentence-transformer models (22M/33M parameters) fine-tuned for domain-specific code retrieval achieving 97% Recall@10",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_code_retrieval/";
            },},{id: "projects-naturalpy",
          title: 'Naturalpy',
          description: "Natural-language-driven programming interface for Python using LLM-backed function invocation",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_naturalpy/";
            },},{id: "projects-mi-generative-ai-module",
          title: 'MI Generative AI Module',
          description: "Low-code agent framework for rapid deployment of NLP applications in enterprise environments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_mi_agent_framework/";
            },},{id: "projects-distributed-transaction-counter",
          title: 'Distributed Transaction Counter',
          description: "Scalable transaction counting for high-throughput API gateways handling 10,000+ TPS with sub-millisecond latency",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_transaction_counter/";
            },},{id: "projects-federated-gnn-for-distributed-link-prediction",
          title: 'Federated GNN for Distributed Link Prediction',
          description: "Memory-efficient federated graph convolutional network training on commodity hardware (IEEE Big Data 2020)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_federated_gnn/";
            },},{id: "projects-anomaly-detection-for-autonomous-drones",
          title: 'Anomaly Detection for Autonomous Drones',
          description: "Self-supervised multimodal anomaly detection using deep reconstruction and forecasting (IEEE SPC 2020 runner-up)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_anomaly_detection/";
            },},{id: "projects-one-code",
          title: 'One Code',
          description: "The full Claude Code workflow on any model or provider",
          section: "Projects",handler: () => {
              window.location.href = "/projects/one_code/";
            },},{id: "teachings-programming-fundamentals-cs1033",
          title: 'Programming Fundamentals (CS1033)',
          description: "Lab assistant for the introductory programming course at the Department of Computer Science and Engineering, University of Moratuwa. Guided students through practical exercises in C programming, data types, control structures, and basic algorithms.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/programming-fundamentals/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%69%6D%77%69%6A%65%73%69%72%69@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/IsuruMaduranga", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/isuruwijesiri", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=7FchZzsAAAAJ", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/imwije", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
