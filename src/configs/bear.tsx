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
        excerpt: "Hey there! I'm the one who is building his own universe..."
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "markdown/github-stats.md",
        icon: "i-fa6-brands:github",
        excerpt: "Here are some status about my github account..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-ph:browser",
        excerpt: "Something about this personal portfolio site..."
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
        title: "PaytmWeb",
        file: "markdown/project-coming-soon.md",
        icon: "i-ph:credit-card",
        excerpt: "Coming soon"
      },
      {
        id: "portfolio-macos",
        title: "Portfolio macOS",
        file: "markdown/project-coming-soon.md",
        icon: "i-ph:desktop",
        excerpt: "Coming soon"
      },
      {
        id: "medium-2.0",
        title: "Medium 2.0",
        file: "markdown/project-coming-soon.md",
        icon: "i-ph:globe",
        excerpt: "Coming soon"
      },
      {
        id: "attendance-web",
        title: "Mbm Attendance Web",
        file: "markdown/project-coming-soon.md",
        icon: "i-ph:clipboard-text",
        excerpt: "Coming soon"
      },
      {
        id: "aero-pay",
        title: "AeroPay",
        file: "markdown/project-coming-soon.md",
        icon: "i-ph:money",
        excerpt: "Coming soon"
      },
      {
        id: "bss",
        title: "BSS",
        file: "markdown/bss-coming-soon.md",
        icon: "i-ph:rocket-launch",
        excerpt: "Coming soon"
      },
      {
        id: "rasl",
        title: "rasl",
        file: "markdown/project-coming-soon.md",
        icon: "i-ph:headphones",
        excerpt: "Coming soon"
      }
    ]
  }
];

export default bear;
