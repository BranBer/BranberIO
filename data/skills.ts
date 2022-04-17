import {
  DiAws,
  DiBitbucket,
  DiCss3,
  DiDjango,
  DiDocker,
  DiHtml5,
  DiJira,
  DiJsBadge,
  DiLinux,
  DiNginx,
  DiPython,
  DiReact,
  DiSass,
} from "react-icons/di";
import { VscAzure } from "react-icons/vsc";
import {
  SiAntdesign,
  SiApollographql,
  SiCsharp,
  SiDebian,
  SiFramer,
  SiGraphql,
  SiKubernetes,
  SiMaterialui,
  SiMongodb,
  SiPandas,
  SiPostgresql,
  SiRabbitmq,
  SiRaspberrypi,
  SiTypescript,
  SiUbuntu,
  SiWindows,
} from "react-icons/si";
import { AiFillGithub, AiFillPieChart } from "react-icons/ai";
import { BiGitBranch } from "react-icons/bi";

const skills = {
  Libraries: [
    {
      skill: "Material UI",
      icon: SiMaterialui,
    },
    {
      skill: "Ant Design",
      icon: SiAntdesign,
    },
    {
      skill: "Framer Motion",
      icon: SiFramer,
    },
    {
      skill: "Nivo",
      icon: AiFillPieChart,
    },
    {
      skill: "Pandas",
      icon: SiPandas,
    },
  ],
  Languages: [
    {
      skill: "Javascript",
      icon: DiJsBadge,
    },
    {
      skill: "Typescript",
      icon: SiTypescript,
    },

    {
      skill: "Html5",
      icon: SiPostgresql,
    },
    {
      skill: "CSS3",
      icon: DiCss3,
    },
    {
      skill: "SASS",
      icon: DiSass,
    },
    {
      skill: "Graphql",
      icon: SiGraphql,
    },
    {
      skill: "Python",
      icon: DiPython,
    },
    {
      skill: "C#",
      icon: SiCsharp,
    },
  ],
  Databases: [
    {
      skill: "MongoDB",
      icon: SiMongodb,
    },
    {
      skill: "Postgres SQL",
      icon: DiHtml5,
    },
  ],
  Hardware: [
    {
      skill: "Raspberry Pi",
      icon: SiRaspberrypi,
    },
  ],
  Frameworks: [
    {
      skill: "Apollo Server",
      icon: SiApollographql,
    },
    {
      skill: "React.js",
      icon: DiReact,
    },
    {
      skill: "Django",
      icon: DiDjango,
    },
  ],
  "Operating Systems": [
    {
      skill: "Ubuntu",
      icon: SiUbuntu,
    },
    {
      skill: "Debian",
      icon: SiDebian,
    },
    {
      skill: "Windows",
      icon: SiWindows,
    },
  ],
  "Project Management": [
    {
      skill: "Github",
      icon: AiFillGithub,
      category: "project",
    },
    {
      skill: "Bitbucket",
      icon: DiBitbucket,
      category: "project",
    },
    {
      skill: "Jira",
      icon: DiJira,
      category: "project",
    },
    {
      skill: "Git",
      icon: BiGitBranch,
      category: "project",
    },
  ],
  Infrastructure: [
    {
      skill: "AWS",
      icon: DiAws,
    },

    {
      skill: "Docker",
      icon: DiDocker,
    },
    {
      skill: "Nginx",
      icon: DiNginx,
    },

    {
      skill: "Azure",
      icon: VscAzure,
    },
    {
      skill: "Kubernetes",
      icon: SiKubernetes,
    },
    {
      skill: "RabbitMQ",
      icon: SiRabbitmq,
    },
  ],
};

export default skills;
