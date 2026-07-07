const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const navLinks = [...document.querySelectorAll(".nav a")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const active = `.nav a[href="#${entry.target.id}"]`;
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      document.querySelector(active)?.setAttribute("aria-current", "page");
    }
  },
  { rootMargin: "-34% 0px -56% 0px", threshold: 0.01 },
);

navSections.forEach((section) => navObserver.observe(section));

const revealTargets = [
  ...document.querySelectorAll(
    ".hero-copy, .profile-panel, .focus-strip article, .section-heading, .project-console, .progress-panel, .repo-panel, .skill, .timeline-item, .contact > div",
  ),
];

revealTargets.forEach((target) => target.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.14 },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const topics = ["知识图谱构建", "GraphRAG 检索", "AI4SE 工具", "VLA 动作分支", "多模态匹配", "系统架构实验"];
const topicRotator = document.querySelector("#topic-rotator");
let topicIndex = 0;

if (topicRotator && !prefersReducedMotion) {
  window.setInterval(() => {
    topicRotator.classList.add("is-changing");
    window.setTimeout(() => {
      topicIndex = (topicIndex + 1) % topics.length;
      topicRotator.textContent = topics[topicIndex];
      topicRotator.classList.remove("is-changing");
    }, 180);
  }, 2300);
}

const counters = [...document.querySelectorAll("[data-count]")];
const formatCount = (value) => new Intl.NumberFormat("zh-CN").format(value);

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatCount(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.72 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const projectData = {
  agri: {
    kicker: "Knowledge Graph / Evaluation",
    title: "基于知识图谱的农业大模型评测方法",
    summary:
      "面向农业大模型评测场景，从明白卡和专家知识中抽象实体、关系、属性与约束规则，构建可迁移的农业多学科 Schema，并围绕语料清洗、结构化抽取、图谱导入和可视化查询搭建流程。",
    detail:
      "采用 GPT-4o 两阶段 Prompt 策略：先依据 Schema 约束输出实体，再结合关系集合与实体对约束生成三元组。Neo4j 图谱包含 3,275 个实体节点和 13,055 条语义关系，覆盖作物、病虫害、技术措施等核心类型。",
    metrics: ["230 实体类型", "506 关系类型", "555 属性字段", "30M+ 清洗语料"],
    side: [
      ["Role", "Schema / extraction / graph import"],
      ["Graph", "3,275 nodes / 13,055 relations"],
      ["Status", "Evaluation pipeline"],
    ],
    tags: ["Knowledge Graph", "GPT-4o", "Neo4j", "Schema"],
    links: [],
  },
  openvla: {
    kicker: "VLA / Autonomous Driving",
    title: "OpenVLA for Drive 动作决策分支",
    summary:
      "围绕 OpenVLA for Drive 中的 action branch 独立搭建实验环境，先验证从 BEV 感知特征到驾驶动作分类的关键模块，为后续完整视觉-语言-动作自动驾驶模型打基础。",
    detail:
      "当前采用 12 类“纵向控制 + 横向控制”组合动作标签，已完成 baseline、多任务 head、weighted CE、label smoothing、warmup、balanced softmax 等训练策略对比，并推进 rich_text 场景语义融合。",
    metrics: ["62.13% Exact Acc", "约 90% 横向准确率", "29.43% Macro F1", "69.48% Blended Score"],
    side: [
      ["Pipeline", "BEV -> LightBEVQFormer -> classifier"],
      ["Output", "12-class driving action"],
      ["Next", "Text-fusion with rich_text"],
    ],
    tags: ["OpenVLA", "BEV", "LightBEVQFormer", "Action Classification"],
    links: [],
  },
  heritage: {
    kicker: "GraphRAG / Cultural Heritage",
    title: "基于 GraphRAG 的古建筑知识网络",
    summary:
      "面向古建筑历史资料数字化利用，设计建筑实体与关系 Schema，完成文本清洗、关系抽取、结果后处理、CSV/JSON 导出、知识网络构建和查询交互测试。",
    detail:
      "文本处理流程拆为三阶段：句子补全和指代消解、规则与大模型按固定 Schema 抽取关系、标签规范化与重复关系合并。图谱覆盖 153 栋建筑和 671 条关系 / 属性记录，并探索图片特征与本地向量检索。",
    metrics: ["153 栋建筑", "671 条关系 / 属性", "三阶段抽取链路", "多模态检索探索"],
    side: [
      ["Pipeline", "Completion -> extraction -> normalization"],
      ["Model", "Qwen / GraphRAG"],
      ["Review", "needs_review 标记"],
    ],
    tags: ["GraphRAG", "Qwen", "python-docx", "Vector Search"],
    image: "./assets/historical-kg-network.png",
    imageAlt: "古建筑知识图谱关系网络截图",
    links: [],
  },
  ai4se: {
    kicker: "AI4SE / Developer Tooling",
    title: "Smart Code Reviewer",
    summary:
      "一个 TypeScript VSCode 插件，支持审查选中代码、当前文件和 Git diff，调用 OpenAI-compatible Chat Completions API 输出合并建议、问题列表、测试建议和总结。",
    detail:
      "围绕智能软件工程课程实验，覆盖数据集构建、Merge Prediction、CodeBERT/CodeT5、LLM 代码审查和插件化交互，把模型输出连接到开发者真实工作流。",
    metrics: ["VSCode Extension", "Git diff review", "LLM suggestions", "AI4SE experiment"],
    side: [
      ["Language", "TypeScript"],
      ["Surface", "VSCode command / panel"],
      ["Use case", "Code review assistant"],
    ],
    tags: ["AI4SE", "TypeScript", "VSCode Extension", "LLM"],
    links: [{ label: "Repository", href: "https://github.com/salfranio/2023111471-SongZihan-AI4SE" }],
  },
  systems: {
    kicker: "Systems / Middleware",
    title: "计算层与数据层架构实验",
    summary:
      "使用 Nginx、ShardingSphere-JDBC、MySQL、Redis、Jedis 和 Docker Compose 完成负载均衡、分库分表和缓存架构实验。",
    detail:
      "项目把应用层、代理层、数据库分片和缓存组合起来，适合作为软件架构课程中可运行、可复现实验环境的一组样例。",
    metrics: ["Nginx load balancing", "ShardingSphere-JDBC", "Redis cache", "Docker Compose"],
    side: [
      ["Language", "Java"],
      ["Database", "MySQL / Redis"],
      ["Status", "Public runnable lab"],
    ],
    tags: ["Nginx", "Redis", "MySQL", "Docker"],
    links: [{ label: "Repository", href: "https://github.com/salfranio/SWStruct-Lab2" }],
  },
};

const projectTabs = [...document.querySelectorAll(".project-tab")];
const projectSpotlight = document.querySelector("#project-spotlight");

const renderProject = (projectKey) => {
  const project = projectData[projectKey];
  if (!projectSpotlight || !project) return;

  const metrics = project.metrics.map((metric) => `<span>${metric}</span>`).join("");
  const side = project.side
    .map(
      ([label, value]) => `
        <div class="project-side-item">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join("");
  const tags = project.tags.map((tag) => `<span>${tag}</span>`).join("");
  const links = project.links.length
    ? `<div class="project-actions">${project.links
        .map((link) => `<a href="${link.href}">${link.label}</a>`)
        .join("")}</div>`
    : "";
  const visual = project.image
    ? `<figure class="project-visual">
        <img src="${project.image}" alt="${project.imageAlt}" loading="lazy" />
        <figcaption>古建筑知识网络可视化样例</figcaption>
      </figure>`
    : "";

  projectSpotlight.innerHTML = `
    <div class="project-hero">
      <div class="project-body">
        <span class="project-kicker">${project.kicker}</span>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="project-metrics">${metrics}</div>
        <p>${project.detail}</p>
        <div class="tags">${tags}</div>
        ${links}
        ${visual}
      </div>
      <div class="project-side">${side}</div>
    </div>
  `;
};

projectTabs.forEach((button) => {
  button.addEventListener("click", () => {
    projectTabs.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderProject(button.dataset.project);
  });
});

renderProject("agri");

const featuredProgress = [
  {
    name: "农业大模型知识图谱评测",
    status: "Graph imported",
    progress: 82,
    summary: "完成农业多学科 Schema、30M+ 语料清洗、GPT-4o 两阶段抽取和 Neo4j 图谱导入。",
  },
  {
    name: "OpenVLA for Drive Action Branch",
    status: "Text-fusion next",
    progress: 62,
    summary: "完成 12 类驾驶动作分类、训练评估脚本和多种 loss 策略对比。",
  },
  {
    name: "古建筑 GraphRAG 知识网络",
    status: "Prototype",
    progress: 74,
    summary: "完成三阶段文本处理链路、153 栋建筑知识网络和图谱查询展示。",
  },
  {
    name: "SWStruct-Lab2",
    status: "Public repo",
    progress: 90,
    summary: "公开仓库包含 Nginx 负载均衡、ShardingSphere-JDBC 分片和 Redis 缓存实验。",
  },
];

let githubRepos = [];
let activeLanguage = "all";

const repoCopy = {
  "SWStruct-Lab2": "计算层与数据层架构实验，覆盖 Nginx 负载均衡、ShardingSphere-JDBC 分库分表、Redis 缓存、Docker Compose 和 Maven/Java 实践。",
  salfranio: "GitHub Profile README 仓库，维护中英文个人介绍、项目经历、技术栈和联系方式。",
  "salfranio.github.io": "个人 GitHub Pages 站点，包含动态作品集、项目进度驾驶舱和公开仓库浏览。",
  "2023111471-SongZihan-AI4SE": "智能软件工程代码审查课程实验，包含数据集构建、Merge Prediction、CodeBERT/CodeT5、LLM 代码审查和 VSCode 插件。",
};

const progressList = document.querySelector("#progress-list");
const repoGrid = document.querySelector("#repo-grid");
const repoStatus = document.querySelector("#repo-status");
const repoSearch = document.querySelector("#repo-search");
const repoSort = document.querySelector("#repo-sort");
const languageStrip = document.querySelector("#language-strip");

const renderProgress = () => {
  if (!progressList) return;
  progressList.innerHTML = featuredProgress
    .map(
      (item) => `
        <article class="progress-card">
          <div class="progress-meta">
            <span>${item.status}</span>
            <span>${item.progress}%</span>
          </div>
          <h4>${item.name}</h4>
          <p>${item.summary}</p>
          <div class="progress-bar" style="--progress: ${item.progress}%"><span></span></div>
        </article>
      `,
    )
    .join("");
};

const repoDescription = (repo) =>
  repoCopy[repo.name] || repo.description || "这个公开仓库还没有填写 description，适合后续补一段更清楚的项目简介。";

const sortRepos = (repos) => {
  const mode = repoSort?.value || "updated";
  return [...repos].sort((a, b) => {
    if (mode === "name") return a.name.localeCompare(b.name);
    if (mode === "stars") return b.stargazers_count - a.stargazers_count;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
};

const renderLanguages = (repos) => {
  if (!languageStrip) return;
  const counts = repos.reduce(
    (acc, repo) => {
      const language = repo.language || "Mixed";
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    },
    { all: repos.length },
  );

  const entries = Object.entries(counts).sort((a, b) => {
    if (a[0] === "all") return -1;
    if (b[0] === "all") return 1;
    return b[1] - a[1];
  });

  languageStrip.innerHTML = entries
    .map(([language, count]) => {
      const label = language === "all" ? "All" : language;
      const active = activeLanguage === language ? " is-active" : "";
      return `<button class="${active}" type="button" data-language="${language}">${label} · ${count}</button>`;
    })
    .join("");

  languageStrip.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeLanguage = button.dataset.language;
      filterRepos();
    });
  });
};

const renderRepos = (repos) => {
  if (!repoGrid) return;
  if (!repos.length) {
    repoGrid.innerHTML = `<article class="repo-card"><h3>没有匹配仓库</h3><p>换一个关键词或语言筛选试试。</p></article>`;
    return;
  }

  repoGrid.innerHTML = repos
    .map((repo) => {
      const updated = new Date(repo.updated_at).toLocaleDateString("zh-CN");
      const homepage = repo.homepage ? `<a href="${repo.homepage}">Live</a>` : "";
      return `
        <article class="repo-card">
          <div>
            <h3>${repo.name}</h3>
            <p>${repoDescription(repo)}</p>
          </div>
          <div>
            <div class="repo-meta">
              <span>${repo.language || "Mixed"}</span>
              <span>★ ${repo.stargazers_count}</span>
              <span>Updated ${updated}</span>
            </div>
            <div class="repo-links">
              <a href="${repo.html_url}">Repository</a>
              ${homepage}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
};

const filterRepos = () => {
  const query = repoSearch?.value.trim().toLowerCase() ?? "";
  const filtered = githubRepos.filter((repo) => {
    const language = repo.language || "Mixed";
    const languageMatched = activeLanguage === "all" || language === activeLanguage;
    const haystack = [repo.name, repo.description, language, ...(repo.topics || [])].join(" ").toLowerCase();
    return languageMatched && haystack.includes(query);
  });
  renderLanguages(githubRepos);
  renderRepos(sortRepos(filtered));
};

const loadRepos = async () => {
  if (!repoGrid || !repoStatus) return;
  try {
    const response = await fetch("https://api.github.com/users/salfranio/repos?sort=updated&per_page=100", {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    githubRepos = (await response.json()).filter((repo) => !repo.fork);
    repoStatus.textContent = `${githubRepos.length} 个公开仓库`;
    filterRepos();
  } catch (error) {
    repoStatus.textContent = "GitHub 暂时不可用";
    githubRepos = [
      {
        name: "SWStruct-Lab2",
        description: "计算层与数据层架构实验：Nginx、ShardingSphere-JDBC、Redis、Docker Compose。",
        language: "Java",
        stargazers_count: 0,
        updated_at: new Date().toISOString(),
        html_url: "https://github.com/salfranio/SWStruct-Lab2",
        homepage: "",
        topics: [],
      },
    ];
    filterRepos();
  }
};

renderProgress();
loadRepos();
repoSearch?.addEventListener("input", filterRepos);
repoSort?.addEventListener("change", filterRepos);

const canvas = document.querySelector("#knowledge-canvas");
const ctx = canvas?.getContext("2d");
const pointer = { x: 0, y: 0, active: false };
let canvasWidth = 0;
let canvasHeight = 0;
let nodes = [];
let animationFrame = 0;

const colors = ["#0070f3", "#00b8a9", "#6d28d9", "#e11d74", "#f59e0b"];

const resizeCanvas = () => {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvas.width = Math.max(1, Math.floor(canvasWidth * ratio));
  canvas.height = Math.max(1, Math.floor(canvasHeight * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(22, Math.min(56, Math.floor(canvasWidth / 28)));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.26,
    vy: (Math.random() - 0.5) * 0.26,
    r: 1.7 + Math.random() * 2,
    color: colors[index % colors.length],
  }));
};

const drawNetwork = () => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > canvasWidth) node.vx *= -1;
    if (node.y < 0 || node.y > canvasHeight) node.vy *= -1;

    if (pointer.active) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 160) {
        node.x -= dx * 0.0014;
        node.y -= dy * 0.0014;
      }
    }
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > 145) continue;
      ctx.strokeStyle = `rgba(23, 23, 23, ${0.13 * (1 - distance / 145)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  for (const node of nodes) {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  }

  animationFrame = requestAnimationFrame(drawNetwork);
};

if (canvas && ctx && !prefersReducedMotion) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
} else if (animationFrame) {
  cancelAnimationFrame(animationFrame);
}
