import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-ph:paw-print",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-ph:shield-star",
        excerpt: "A little about what I build, what I'm learning, and how to get in touch."
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "markdown/github-stats.md",
        icon: "i-fa6-brands:github",
        excerpt: "Explore my public GitHub activity and repositories."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-ph:browser",
        excerpt: "The tools and ideas behind this macOS-inspired portfolio."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-ph:git-branch",
    md: [
      {
        id: "paytm-web",
        title: "Paytm Web",
        file: "markdown/paytm-web.md",
        icon: "i-ph:credit-card",
        excerpt: "Explore the Paytm Web project.",
        link: "https://paytm-web.vercel.app/"
      },
      {
        id: "skill-exchange",
        title: "SkillExchange",
        file: "markdown/skill-exchange.md",
        icon: "i-ph:users-three",
        excerpt: "A project about sharing skills.",
        link: "https://skill-exchange-fe.vercel.app/"
      },
      {
        id: "share-code",
        title: "ShareCode",
        file: "markdown/share-code.md",
        icon: "i-ph:code",
        excerpt: "A project for sharing code.",
        link: "https://share-your-codes.vercel.app/"
      },
      {
        id: "attendance-web",
        title: "MBM Attendance",
        file: "markdown/attendance-web.md",
        icon: "i-ph:clipboard-text",
        excerpt: "An attendance-focused project.",
        link: "https://mbm-attendance-web.vercel.app/"
      },
      {
        id: "portfolio-macos",
        title: "macOS Portfolio",
        file: "markdown/portfolio-macos.md",
        icon: "i-ph:desktop",
        excerpt: "This portfolio, built as an interactive macOS-inspired desktop.",
        link: "https://github.com/s4yush/macOS-Portfolio"
      }
    ]
  }
];

export default bear;
