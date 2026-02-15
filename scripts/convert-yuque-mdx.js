import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 语雀文章标题到文件名的映射及发布时间
const articleMapping = [
  {
    filename: 'typescript配置最佳实践.md',
    title: 'TypeScript项目配置最佳实践：tsconfig.json中的include/exclude使用指南',
    description: '详细介绍TypeScript项目中tsconfig.json配置文件的include/exclude属性使用方法和最佳实践',
    pubDate: '2021-03-15',
    tags: ['typescript', 'configuration', 'frontend'],
    newFilename: 'typescript-config-best-practices.mdx'
  },
  {
    filename: 'nvm工作原理详解.md',
    title: 'Node.js版本管理工具nvm的底层实现原理详解',
    description: '深入探讨nvm在Windows系统上的实现原理，特别是符号链接（symlink）的应用',
    pubDate: '2021-06-20',
    tags: ['nodejs', 'nvm', 'windows', 'system'],
    newFilename: 'nvm-working-principle.mdx'
  },
  {
    filename: 'esp32固件刷写指南.md',
    title: 'ESP32固件刷写完整指南：从工具选择到故障排除',
    description: '详细介绍ESP32固件刷写的方法和常见问题解决方案，帮助开发者顺利完成项目开发',
    pubDate: '2022-01-10',
    tags: ['esp32', 'iot', 'firmware', 'embedded'],
    newFilename: 'esp32-firmware-flashing-guide.mdx'
  },
  {
    filename: 'eslint-prettier配置最佳实践.md',
    title: '多人协作项目中ESLint与Prettier配置最佳实践：解决跨平台换行符问题',
    description: '详细介绍如何配置ESLint和Prettier，解决跨平台协作中的格式化冲突',
    pubDate: '2022-05-12',
    tags: ['eslint', 'prettier', 'frontend', 'tooling'],
    newFilename: 'eslint-prettier-configuration-best-practices.mdx'
  },
  {
    filename: 'mqtt网关设计与实现.md',
    title: 'MQTT网关设计与实现：构建高效的物联网消息传输系统',
    description: '详细介绍MQTT网关的设计原理与实现方法，帮助开发者构建高效的物联网消息传输系统',
    pubDate: '2023-08-22',
    tags: ['mqtt', 'iot', 'gateway', 'protocol'],
    newFilename: 'mqtt-gateway-design-implementation.mdx'
  },
  {
    filename: 'django-orm工作流优化.md',
    title: 'Django ORM数据表创建工作流优化：从繁琐操作到自动化流程',
    description: '介绍如何优化Django ORM数据表创建工作流，提高开发效率',
    pubDate: '2024-11-05',
    tags: ['django', 'orm', 'python', 'workflow'],
    newFilename: 'django-orm-workflow-optimization.mdx'
  },
  {
    filename: 'chilean-sii-system-analysis.md',
    title: 'Analysis of Chilean SII System Form 33 and PDF479: Technical Insights for Electronic Invoice Processing',
    description: '提供智利税务系统SII的技术分析，特别是Form 33和PDF479格式的技术见解',
    pubDate: '2026-01-15',
    tags: ['chile', 'sii', 'tax', 'electronic-invoice', 'compliance'],
    newFilename: 'chilean-sii-system-analysis.mdx'
  }
];

/**
 * 转换语雀Markdown到Astro MDX格式
 */
async function convertYuqueToMdx() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  const inputDir = join(__dirname, '../src/content/yuque-output');
  const outputDir = join(__dirname, '../src/content/blog');
  
  // 确保输出目录存在
  await mkdir(outputDir, { recursive: true });
  
  for (const article of articleMapping) {
    try {
      const inputFile = join(inputDir, article.filename);
      const outputFile = join(outputDir, article.newFilename);
      
      // 读取原始Markdown内容，确保使用正确的编码
      const content = await readFile(inputFile, 'utf8');
      
      // 转换内容
      const convertedContent = convertContent(content, article);
      
      // 写入新的MDX文件
      await writeFile(outputFile, convertedContent);
      
      console.log(`✅ Successfully converted: ${article.filename} -> ${article.newFilename}`);
    } catch (error) {
      console.error(`❌ Error converting ${article.filename}:`, error.message);
    }
  }
}

/**
 * 转换文章内容
 */
function convertContent(content, metadata) {
  // 生成frontmatter
  const frontmatter = `---
title: '${metadata.title}'
description: '${metadata.description}'
pubDate: ${metadata.pubDate}
updatedDate: ${metadata.pubDate}
tags: [${metadata.tags.map(tag => `'${tag}'`).join(', ')}]
---
`;

  // 转换内容：
  // 1. 将语雀的标题层级规范化
  // 从检查结果看，语雀导出的格式是：
  // - ### 作为文章主标题
  // - #### 作为文章内二级标题
  // 我们需要将其转换为Astro博客格式，确保层级不超过三级：
  // - ## 作为文章主标题（配合frontmatter中的title）
  // - ### 作为文章内二级标题
  // - #### 作为文章内三级标题
  let converted = content
    // 将语雀的主标题（###）转换为MDX内容主标题（##）
    .replace(/^###\s+/gm, '## ')
    // 将语雀的二级标题（####）转换为MDX内容二级标题（###）
    .replace(/^####\s+/gm, '### ')
    // 如果还有更深层级的标题（#####、######等）转换为####（三级标题）
    .replace(/^#####\s+/gm, '#### ')
    .replace(/^######\s+/gm, '#### ')
    // 修复可能的多余空行
    .replace(/\n{3,}/g, '\n\n');

  // 组合frontmatter和内容
  return frontmatter + converted;
}

// 执行转换
convertYuqueToMdx()
  .then(() => {
    console.log('\n🎉 All articles have been converted successfully!');
  })
  .catch((error) => {
    console.error('\n💥 Error during conversion:', error);
    process.exit(1);
  });