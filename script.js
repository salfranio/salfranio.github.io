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
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 },
);

navSections.forEach((section) => navObserver.observe(section));

const revealTargets = [
  ...document.querySelectorAll(
    ".hero-media, .hero-copy, .intro > div, .section-heading, .project, .skill-grid > div, .timeline-item, .contact > div",
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
  { threshold: 0.16 },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const topics = ["知识图谱", "GraphRAG", "AI4SE", "VLA 模型", "中间件架构", "多模态检索"];
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
  }, 2200);
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
  { threshold: 0.7 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const filterButtons = [...document.querySelectorAll(".filter-button")];
const projects = [...document.querySelectorAll(".project")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projects.forEach((project) => {
      const tracks = project.dataset.track?.split(" ") ?? [];
      const show = filter === "all" || tracks.includes(filter);
      project.classList.toggle("is-hidden", !show);
    });
  });
});

const featuredProgress = [
  {
    name: "农业大模型知识图谱评测",
    status: "Graph imported / evaluation pipeline",
    progress: 82,
    summary: "已完成农业多学科 Schema、30M+ 语料清洗、GPT-4o 两阶段抽取和 Neo4j 图谱导入。",
    tags: ["Knowledge Graph", "GPT-4o", "Neo4j"],
  },
  {
    name: "OpenVLA for Drive Action Branch",
    status: "BEV-only baseline / text-fusion next",
    progress: 62,
    summary: "完成 12 类驾驶动作分类、训练评估脚本和多种 loss 策略对比，正在推进 rich_text 融合。",
    tags: ["OpenVLA", "BEV", "LightBEVQFormer"],
  },
  {
    name: "古建筑 GraphRAG 知识网络",
    status: "GraphRAG prototype / multimodal retrieval",
    progress: 74,
    summary: "完成三阶段文本处理链路、153 栋建筑知识网络和图谱查询展示，探索图片向量检索。",
    tags: ["GraphRAG", "Qwen", "Vector Search"],
  },
  {
    name: "SWStruct-Lab2",
    status: "Public repository / runnable labs",
    progress: 90,
    summary: "公开仓库包含 Nginx 负载均衡、ShardingSphere-JDBC 分片和 Redis 缓存实验。",
    tags: ["Nginx", "Redis", "Docker"],
  },
];

const siteKnowledge = [
  {
    keys: ["农业", "大模型", "知识图谱", "schema", "neo4j", "gpt"],
    answer:
      "农业大模型评测项目围绕知识图谱构建展开：从明白卡和专家知识抽象 Schema，包含 230 个实体类型、506 个关系类型、555 个属性字段；处理 30M+ 农业语料；用 GPT-4o 两阶段抽取实体和三元组，并在 Neo4j 中导入 3,275 个实体节点和 13,055 条语义关系。",
  },
  {
    keys: ["openvla", "vla", "自动驾驶", "bev", "action", "drive", "lightbevqformer"],
    answer:
      "OpenVLA for Drive 当前聚焦 action branch：BEV features -> LightBEVQFormer -> action classifier -> 12-class driving action。已完成训练脚本、评估脚本和 baseline/weighted CE/label smoothing/warmup 等策略对比；阶段性候选结果为 Exact Accuracy 62.13%、Macro F1 29.43%、Blended Score 69.48%，下一步推进 rich_text 场景语义融合。",
  },
  {
    keys: ["古建筑", "graphrag", "qwen", "历史建筑", "向量", "多模态"],
    answer:
      "古建筑 GraphRAG 项目把历史建筑文本、表格和图片资料组织为知识网络。流程包括句子补全与指代消解、规则 + 大模型混合关系抽取、关系标签规范化/别名归并/needs_review 标记。当前覆盖 153 栋建筑和 671 条关系/属性记录，并探索图片向量检索与自然语言查询。",
  },
  {
    keys: ["github", "仓库", "项目", "repo", "swstruct", "代码"],
    answer:
      "这个页面的 GitHub Lab 会读取 @salfranio 的公开仓库并生成项目卡片。当前公开仓库里 SWStruct-Lab2 是计算层与数据层架构实验，包含 Nginx、ShardingSphere-JDBC、MySQL、Redis、Docker Compose 和 Maven/Java 实践。",
  },
  {
    keys: ["技能", "技术栈", "python", "java", "typescript", "pytorch"],
    answer:
      "主要技术栈包括 Python、C/C++、Java、TypeScript、SQL、LaTeX；AI/ML 方向包括 PyTorch、TensorFlow、LLM Prompting、Fine-tuning、CLIP、BEVFormer、VLA、GraphRAG；系统方向包括 Redis、MySQL、ShardingSphere-JDBC、Nginx、Docker、Maven 和 Neo4j。",
  },
  {
    keys: ["联系", "邮箱", "email"],
    answer: "可以通过 18945659789@163.com 联系，也可以访问 GitHub：github.com/salfranio。",
  },
];

let githubRepos = [];

const repoCopy = {
  "SWStruct-Lab2": "计算层与数据层架构实验，覆盖 Nginx 负载均衡、ShardingSphere-JDBC 分库分表、Redis 缓存、Docker Compose 和 Maven/Java 实践。",
  salfranio: "GitHub Profile README 仓库，维护中英文个人介绍、项目经历、技术栈和联系方式。",
  "salfranio.github.io": "个人 GitHub Pages 站点，包含动态作品集、项目进度驾驶舱、公开仓库浏览和全局 Profile Q&A。",
  "2023111471-SongZihan-AI4SE": "智能软件工程代码审查课程实验，包含数据集构建、Merge Prediction、CodeBERT/CodeT5、LLM 代码审查和 VSCode 插件。",
};

const progressList = document.querySelector("#progress-list");
const repoGrid = document.querySelector("#repo-grid");
const repoStatus = document.querySelector("#repo-status");
const repoSearch = document.querySelector("#repo-search");

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

const renderRepos = (repos) => {
  if (!repoGrid) return;
  if (!repos.length) {
    repoGrid.innerHTML = `<article class="repo-card"><h3>没有匹配仓库</h3><p>换一个关键词试试。</p></article>`;
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
    const haystack = [repo.name, repo.description, repo.language, ...(repo.topics || [])].join(" ").toLowerCase();
    return haystack.includes(query);
  });
  renderRepos(filtered);
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
    renderRepos(githubRepos);
  } catch (error) {
    repoStatus.textContent = "GitHub 暂时不可用";
    renderRepos([
      {
        name: "SWStruct-Lab2",
        description: "计算层与数据层架构实验：Nginx、ShardingSphere-JDBC、Redis、Docker Compose。",
        language: "Java",
        stargazers_count: 0,
        updated_at: new Date().toISOString(),
        html_url: "https://github.com/salfranio/SWStruct-Lab2",
        homepage: "",
      },
    ]);
  }
};

renderProgress();
loadRepos();
repoSearch?.addEventListener("input", filterRepos);

const chatLauncher = document.querySelector(".chat-launcher");
const chatPanel = document.querySelector("#chat-panel");
const chatClose = document.querySelector("#chat-close");
const chatLog = document.querySelector("#chat-log");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatConfigToggle = document.querySelector("#chat-config-toggle");
const chatConfig = document.querySelector("#chat-config");
const chatSaveConfig = document.querySelector("#chat-save-config");
const chatBaseUrl = document.querySelector("#chat-base-url");
const chatModel = document.querySelector("#chat-model");
const chatApiKey = document.querySelector("#chat-api-key");

const configKeys = {
  baseUrl: "salfranio.chat.baseUrl",
  model: "salfranio.chat.model",
  apiKey: "salfranio.chat.apiKey",
};

const appendMessage = (role, content) => {
  if (!chatLog) return;
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.textContent = content;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
};

const openChat = () => {
  chatPanel?.classList.add("is-open");
  chatPanel?.setAttribute("aria-hidden", "false");
  chatLauncher?.setAttribute("aria-expanded", "true");
  if (chatLog && !chatLog.children.length) {
    appendMessage("assistant", "你好，我可以基于这个主页和 GitHub 公开仓库回答项目、技能、进度和联系方式相关问题。");
  }
  window.setTimeout(() => chatInput?.focus(), 120);
};

const closeChat = () => {
  chatPanel?.classList.remove("is-open");
  chatPanel?.setAttribute("aria-hidden", "true");
  chatLauncher?.setAttribute("aria-expanded", "false");
};

const localAnswer = (question) => {
  const normalized = question.toLowerCase();
  const match = siteKnowledge.find((item) => item.keys.some((key) => normalized.includes(key.toLowerCase())));
  if (match) return match.answer;

  const repoMatch = githubRepos.find((repo) => normalized.includes(repo.name.toLowerCase()));
  if (repoMatch) {
    return `${repoMatch.name}：${repoDescription(repoMatch)}\n语言：${repoMatch.language || "Mixed"}\n地址：${repoMatch.html_url}`;
  }

  const projectList = featuredProgress.map((item) => `- ${item.name}：${item.status}，进度 ${item.progress}%`).join("\n");
  return `我目前能回答主页资料和公开 GitHub 信息。你可以问农业知识图谱、OpenVLA for Drive、古建筑 GraphRAG、SWStruct-Lab2、技术栈或联系方式。\n\n重点项目：\n${projectList}`;
};

const llmAnswer = async (question) => {
  const baseUrl = localStorage.getItem(configKeys.baseUrl)?.replace(/\/$/, "");
  const model = localStorage.getItem(configKeys.model) || "gpt-4o-mini";
  const apiKey = localStorage.getItem(configKeys.apiKey);
  if (!baseUrl || !apiKey) return null;

  const context = [
    "你是宋梓晗个人主页上的问答助手。回答要简洁、真实，不要编造未给出的训练结果或私有信息。",
    "个人：哈尔滨工业大学软件工程本科生，2027 届。",
    ...siteKnowledge.map((item) => item.answer),
    `公开仓库：${githubRepos.map((repo) => `${repo.name}(${repo.language || "Mixed"}): ${repoDescription(repo)}`).join("; ")}`,
  ].join("\n");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: context },
        { role: "user", content: question },
      ],
      temperature: 0.3,
    }),
  });
  if (!response.ok) throw new Error(`LLM API ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
};

chatLauncher?.addEventListener("click", () => {
  if (chatPanel?.classList.contains("is-open")) closeChat();
  else openChat();
});

chatClose?.addEventListener("click", closeChat);

chatConfigToggle?.addEventListener("click", () => {
  if (!chatConfig) return;
  chatConfig.hidden = !chatConfig.hidden;
});

chatSaveConfig?.addEventListener("click", () => {
  localStorage.setItem(configKeys.baseUrl, chatBaseUrl?.value.trim() || "");
  localStorage.setItem(configKeys.model, chatModel?.value.trim() || "");
  localStorage.setItem(configKeys.apiKey, chatApiKey?.value.trim() || "");
  appendMessage("assistant", "模型配置已保存在当前浏览器。");
});

if (chatBaseUrl) chatBaseUrl.value = localStorage.getItem(configKeys.baseUrl) || "";
if (chatModel) chatModel.value = localStorage.getItem(configKeys.model) || "";
if (chatApiKey) chatApiKey.value = localStorage.getItem(configKeys.apiKey) || "";

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = chatInput?.value.trim();
  if (!question) return;
  chatInput.value = "";
  appendMessage("user", question);
  appendMessage("assistant", "思考中...");
  const pending = chatLog?.lastElementChild;
  try {
    const answer = (await llmAnswer(question)) || localAnswer(question);
    if (pending) pending.textContent = answer;
  } catch (error) {
    if (pending) pending.textContent = `${localAnswer(question)}\n\n模型接口暂时不可用，已使用本地资料回答。`;
  }
});

const canvas = document.querySelector("#knowledge-canvas");
const ctx = canvas?.getContext("2d");
const pointer = { x: 0, y: 0, active: false };
let canvasWidth = 0;
let canvasHeight = 0;
let nodes = [];
let animationFrame = 0;

const colors = ["#315f8b", "#21483b", "#a64d3d", "#c99c42"];

const resizeCanvas = () => {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvas.width = Math.max(1, Math.floor(canvasWidth * ratio));
  canvas.height = Math.max(1, Math.floor(canvasHeight * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(18, Math.min(44, Math.floor(canvasWidth / 34)));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: 2 + Math.random() * 2.4,
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
      if (distance < 170) {
        node.x -= dx * 0.0015;
        node.y -= dy * 0.0015;
      }
    }
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > 150) continue;
      ctx.strokeStyle = `rgba(23, 32, 27, ${0.14 * (1 - distance / 150)})`;
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
