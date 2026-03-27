export type HomeModeId = "work" | "about" | "archive";

export type HomeMode = {
  id: HomeModeId;
  index: string;
  label: string;
  title: string;
  description: string;
  href?: string;
  status: "active" | "locked" | "external";
};

export const HOME_MODES: HomeMode[] = [
  {
    id: "work",
    index: "NODE 01",
    label: "WORK",
    title: "WORK / ACTIVE",
    description: "Selected case studies + interactive systems. Enter to load project index.",
    href: "/projects/heinz",
    status: "active",
  },
  {
    id: "about",
    index: "NODE 02",
    label: "ABOUT",
    title: "ABOUT / LOCKED",
    description: "Profile, tools, operating principles. (Module not mounted yet.)",
    status: "locked",
  },
  {
    id: "archive",
    index: "NODE 03",
    label: "ARCHIVE",
    title: "ARCHIVE / EXTERNAL",
    description: "Older work + experiments hosted externally.",
    href: "https://major-prism-932348.framer.app/",
    status: "external",
  },
];

