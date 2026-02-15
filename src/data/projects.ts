export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "MCP AI 客服系统",
    description: "基于 Model Context Protocol 的 AI 客服系统，Node.js + Python 混合后端，WebSocket 实时通信，RAG 向量检索。",
    tags: ["Node.js", "Python", "RAG", "WebSocket"],
    github: "https://github.com/cybermanhao",
  },
  {
    title: "通用 MCP Client",
    description: "类似 Cherry Studio 的通用 MCP 客户端，支持多模型接入、对话管理、工具调用，用于 AI 交互与实验。",
    tags: ["React", "TypeScript", "MCP", "AI"],
    github: "https://github.com/cybermanhao",
  },
  {
    title: "Leo's Astro Blog",
    description: "赛博朋克风格个人博客，基于 Astro 5 + React 19 + Tailwind v4，集成 ReactBits 高级动画、MDX、Pagefind 搜索。",
    tags: ["Astro", "React", "MDX", "Tailwind"],
    github: "https://github.com/cybermanhao/leo-astro-blog",
    demo: "https://cybermanhao.github.io/leo-blog/",
  },
  {
    title: "数据可视化仪表板",
    description: "为政府招标公告数据构建的可视化分析平台，Dashboard 风格界面，Pandas 数据处理 + 前端图表展示。",
    tags: ["React", "Pandas", "Data Viz", "Gatsby"],
  },
  {
    title: "电商数据分析工具",
    description: "大规模 React + TypeScript 电商 BI 应用，包含动态仪表板、Pixi.js 高性能图表、Web Worker 大表导出。",
    tags: ["React", "TypeScript", "Pixi.js", "Web Workers"],
  },
];
