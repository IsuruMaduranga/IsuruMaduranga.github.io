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
  },{id: "nav-writings",
          title: "writings",
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
        },{id: "nav-experience",
          title: "experience",
          description: "Experience of Isuru Wijesiri - AI research and engineering at WSO2, an external volunteer research collaboration with the University of Moratuwa, and earlier work in graph learning and machine learning.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/experience/";
          },
        },{id: "nav-github",
          title: "github",
          description: "Open-source projects and GitHub contributions by Isuru Wijesiri - AI tools, NLP frameworks, and research code.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-talks",
          title: "talks",
          description: "Conference talks and presentations by Isuru Wijesiri on blockchain, distributed systems, agentic AI, and enterprise integration.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/talks/";
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
          title: 'Released lightweight code retrieval models (22M/33M parameters) on Hugging Face: L6 and L12,...',
          description: "",
          section: "News",},{id: "news-presented-a-technical-deep-dive-on-blockchain-architecture-consensus-algorithms-and-distributed-ledger-mechanisms-at-wso2-technology-conference-2025-the-recording-is-up-slides-and-all-on-youtube",
          title: 'Presented a technical deep-dive on blockchain architecture, consensus algorithms, and distributed ledger mechanisms...',
          description: "",
          section: "News",},{id: "news-started-as-an-external-volunteer-researcher-with-the-university-of-moratuwa-working-on-google-funded-research-on-automatic-post-editing-for-low-resource-languages-sinhala-tamil",
          title: 'Started as an external volunteer researcher with the University of Moratuwa, working on...',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-findings-of-emnlp-2026-first-author-confident-but-wrong-a-constrained-decoding-diagnostic-for-low-resource-automatic-post-editing",
          title: 'Paper accepted to Findings of EMNLP 2026 (first author): “Confident but Wrong: A...',
          description: "",
          section: "News",},{id: "news-published-harness-engineering-101-a-blog-series-on-building-llm-agents-and-harnesses-from-first-principles-sixteen-chapters-one-json-array",
          title: 'Published Harness Engineering 101, a blog series on building LLM agents and harnesses...',
          description: "",
          section: "News",},{id: "projects-ai-cookbooks",
          title: 'AI Cookbooks',
          description: "Colab and Jupyter notebooks for training, fine-tuning, and other AI tasks I keep running into.",
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
          description: "Claude Code with the model slot left open. The full workflow, open source, on any model or provider.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/one_code/";
            },},{id: "talks-blockchain-architecture-consensus-and-distributed-ledgers",
          title: 'Blockchain Architecture, Consensus, and Distributed Ledgers',
          description: "A technical deep dive into blockchain architecture, consensus algorithms, and distributed ledger mechanisms, presented at WSO2 Technology Conference 2025.",
          section: "Talks",handler: () => {
              window.location.href = "/talks/wso2-techconf-2025/";
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
