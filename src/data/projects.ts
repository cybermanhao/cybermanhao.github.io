import type { Locale } from '../lib/i18n';

export interface Project {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  tags: string[];
  github?: string;
  demo?: string;
  media?: string; // path to image or video in public/
}

export const projects: Project[] = [
  {
    id: 'leochat',
    title: {
      zh: '通用 MCP Client',
      en: 'Universal MCP Client',
      ja: '汎用 MCP クライアント',
      es: 'Cliente MCP Universal',
    },
    description: {
      zh: '类似 Cherry Studio 的通用 MCP 客户端，支持多模型接入、对话管理、工具调用，用于 AI 交互与实验。',
      en: 'A universal MCP client similar to Cherry Studio, supporting multi-model access, conversation management, and tool invocation for AI interaction.',
      ja: 'Cherry Studio に似た汎用 MCP クライアント。マルチモデル接続、会話管理、ツール呼び出しに対応。',
      es: 'Un cliente MCP universal similar a Cherry Studio, con acceso multimodelo, gestión de conversaciones e invocación de herramientas.',
    },
    tags: ['React', 'TypeScript', 'MCP', 'AI'],
    github: 'https://github.com/cybermanhao/LeoChat',
    demo: '/projects/coming-soon',
    media: '/images/projects/theme-change.mp4',
  },
  {
    id: 'mcp-cs',
    title: {
      zh: 'MCP AI 客服系统',
      en: 'MCP AI Customer Service',
      ja: 'MCP AI カスタマーサービス',
      es: 'Servicio al Cliente MCP AI',
    },
    description: {
      zh: '基于 Model Context Protocol 的 AI 客服系统，Node.js + Python 混合后端，WebSocket 实时通信，RAG 向量检索。',
      en: 'An AI customer service system based on Model Context Protocol, with Node.js + Python hybrid backend, WebSocket real-time communication, and RAG vector retrieval.',
      ja: 'Model Context Protocol ベースの AI カスタマーサービス。Node.js + Python ハイブリッドバックエンド、WebSocket リアルタイム通信、RAG ベクトル検索。',
      es: 'Sistema de atención al cliente AI basado en Model Context Protocol, con backend híbrido Node.js + Python, comunicación WebSocket en tiempo real y búsqueda vectorial RAG.',
    },
    tags: ['Node.js', 'Python', 'RAG', 'WebSocket'],
    github: 'https://github.com/cybermanhao',
  },
  {
    id: 'astro-blog',
    title: {
      zh: "Leo's Astro Blog",
      en: "Leo's Astro Blog",
      ja: "Leo's Astro Blog",
      es: "Leo's Astro Blog",
    },
    description: {
      zh: '赛博朋克风格个人博客，基于 Astro 5 + React 19 + Tailwind v4，集成 ReactBits 高级动画、MDX、Pagefind 搜索。',
      en: 'A cyberpunk-themed personal blog built with Astro 5 + React 19 + Tailwind v4, featuring ReactBits animations, MDX, and Pagefind search.',
      ja: 'サイバーパンク風個人ブログ。Astro 5 + React 19 + Tailwind v4 で構築、ReactBits アニメーション、MDX、Pagefind 検索を搭載。',
      es: 'Blog personal estilo cyberpunk construido con Astro 5 + React 19 + Tailwind v4, con animaciones ReactBits, MDX y búsqueda Pagefind.',
    },
    tags: ['Astro', 'React', 'MDX', 'Tailwind'],
    github: 'https://github.com/cybermanhao/leo-astro-blog',
    demo: 'https://cybermanhao.github.io/leo-blog/',
  },
  {
    id: 'data-viz',
    title: {
      zh: '数据可视化仪表板',
      en: 'Data Visualization Dashboard',
      ja: 'データ可視化ダッシュボード',
      es: 'Panel de Visualización de Datos',
    },
    description: {
      zh: '为政府招标公告数据构建的可视化分析平台，Dashboard 风格界面，Pandas 数据处理 + 前端图表展示。',
      en: 'A visual analytics platform for government tender data, featuring a dashboard-style interface with Pandas data processing and frontend charting.',
      ja: '政府入札データ向けの可視化分析プラットフォーム。ダッシュボード風インターフェース、Pandas データ処理 + フロントエンドチャート。',
      es: 'Plataforma de análisis visual para datos de licitaciones gubernamentales, con interfaz tipo dashboard, procesamiento Pandas y gráficos frontend.',
    },
    tags: ['React', 'Pandas', 'Data Viz', 'Gatsby'],
  },
  {
    id: 'ecommerce-bi',
    title: {
      zh: '电商数据分析工具',
      en: 'E-commerce BI Tool',
      ja: 'EC データ分析ツール',
      es: 'Herramienta BI de E-commerce',
    },
    description: {
      zh: '大规模 React + TypeScript 电商 BI 应用，包含动态仪表板、Pixi.js 高性能图表、Web Worker 大表导出。',
      en: 'A large-scale React + TypeScript e-commerce BI app with dynamic dashboards, Pixi.js high-performance charts, and Web Worker bulk export.',
      ja: '大規模 React + TypeScript EC BI アプリ。動的ダッシュボード、Pixi.js 高性能チャート、Web Worker 大量エクスポート。',
      es: 'Aplicación BI de e-commerce a gran escala con React + TypeScript, dashboards dinámicos, gráficos Pixi.js y exportación masiva con Web Workers.',
    },
    tags: ['React', 'TypeScript', 'Pixi.js', 'Web Workers'],
  },
];
