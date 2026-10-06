import type { LaunchpadData } from "~/types";

const launchpadApps: LaunchpadData[] = [
  {
    id: "skill-exchange",
    title: "SkillExchange",
    img: "img/icons/launchpad/skill-exchange.png", // background should be black
    link: "https://skill-exchange-fe.vercel.app/"
  },
  {
    id: "share-code",
    title: "ShareCode",
    img: "img/icons/launchpad/share-code-app.png",
    link: "https://share-your-codes.vercel.app/"
  },
  {
    id: "paytm-web",
    title: "Paytm",
    img: "img/icons/launchpad/paytm-app.png",
    link: "https://paytm-web.vercel.app/"
  },
  {
    id: "attendance-web",
    title: "MBM Attendance",
    img: "img/icons/launchpad/attendance-web.png",
    link: "https://mbm-attendance-web.vercel.app/"
  }
];

export default launchpadApps;
