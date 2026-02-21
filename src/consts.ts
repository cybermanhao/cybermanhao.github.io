export const SITE_TITLE = "限制解除！";
export const SITE_DESCRIPTION = "Leo Ji's dev blog — cyberpunk-flavored fullstack engineering";

export const SITE_NAV = [
  { label: "首页", href: "/", i18nKey: "nav.home" },
  { label: "博客", href: "/blog", i18nKey: "nav.blog" },
  { label: "项目", href: "/projects", i18nKey: "nav.projects" },
  { label: "关于", href: "/about", i18nKey: "nav.about" },
] as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/cybermanhao",
  linkedin: "https://linkedin.com/in/leo-ji-966923393",
  email: "mailto:cybermanhao@gmail.com",
  bilibili: "https://space.bilibili.com/2633796",
} as const;
