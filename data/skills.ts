/**
 * Skills taxonomy - public-safe, no employer names or dates.
 * Categories sorted descending by skill count in pages/skills.tsx.
 * The two largest (AWS, Frameworks + Libraries) render as feature-span panels.
 * react-icons used throughout; generic icons used where no brand icon exists.
 */
import { IconType } from "react-icons";
import {
  SiTypescript,
  SiHtml5,
  SiTailwindcss,
  SiNextdotjs,
  SiRedux,
  SiExpress,
  SiDotnet,
  SiApollographql,
  SiFramer,
  SiMui,
  SiDjango,
  SiFlask,
  SiPandas,
  SiNginx,
  SiAmazonaws,
  SiAwslambda,
  SiAmazons3,
  SiAmazonec2,
  SiAmazonecs,
  SiAmazoneks,
  SiAmazonrds,
  SiAmazonsqs,
  SiAmazonapigateway,
  SiAmazonredshift,
  SiAmazonroute53,
  SiAmazoncloudwatch,
  SiAmazondynamodb,
  SiApacheflink,
  SiSnowflake,
  SiKubernetes,
  SiDocker,
  SiHelm,
  SiTerraform,
  SiJenkins,
  SiGithubactions,
  SiJfrog,
  SiPrometheus,
  SiGrafana,
  SiJest,
  SiGit,
  SiGithub,
  SiBitbucket,
  SiJira,
  SiTrello,
  SiFigma,
  SiPostgresql,
  SiMicrosoftsqlserver,
  SiMongodb,
  SiSqlite,
  SiMariadb,
  SiCsharp,
  SiPython,
  SiApachekafka,
} from "react-icons/si";
import { DiJsBadge, DiCss3, DiReact, DiAws } from "react-icons/di";
import { AiFillPieChart } from "react-icons/ai";
import { FaDatabase, FaRobot } from "react-icons/fa";
import { MdCloudQueue } from "react-icons/md";

export interface SkillEntry {
  skill: string;
  icon: IconType;
}

export type SkillsMap = Record<string, SkillEntry[]>;

const skills: SkillsMap = {
  AWS: [
    { skill: "Lambda", icon: SiAwslambda },
    { skill: "Lambda@Edge", icon: SiAwslambda },
    { skill: "CloudFront", icon: DiAws },
    { skill: "API Gateway", icon: SiAmazonapigateway },
    { skill: "AppSync", icon: SiAmazonaws },
    { skill: "EKS", icon: SiAmazoneks },
    { skill: "ECS Fargate", icon: SiAmazonecs },
    { skill: "Step Functions", icon: MdCloudQueue },
    { skill: "EventBridge", icon: MdCloudQueue },
    { skill: "SQS", icon: SiAmazonsqs },
    { skill: "Glue", icon: SiAmazonaws },
    { skill: "Athena", icon: SiAmazonaws },
    { skill: "Redshift", icon: SiAmazonredshift },
    { skill: "RDS / Aurora", icon: SiAmazonrds },
    { skill: "S3", icon: SiAmazons3 },
    { skill: "EC2", icon: SiAmazonec2 },
    { skill: "Route 53", icon: SiAmazonroute53 },
    { skill: "CloudWatch", icon: SiAmazoncloudwatch },
  ],
  "Frameworks & Libraries": [
    { skill: "React", icon: DiReact },
    { skill: "Next.js", icon: SiNextdotjs },
    { skill: "Redux / RTK", icon: SiRedux },
    { skill: "Zustand", icon: FaDatabase },
    { skill: "Apollo / GraphQL", icon: SiApollographql },
    { skill: "Express", icon: SiExpress },
    { skill: ".NET / Core", icon: SiDotnet },
    { skill: "D3 / Nivo", icon: AiFillPieChart },
    { skill: "visx", icon: AiFillPieChart },
    { skill: "Framer Motion", icon: SiFramer },
    { skill: "Tailwind CSS", icon: SiTailwindcss },
    { skill: "Material-UI", icon: SiMui },
    { skill: "Django", icon: SiDjango },
    { skill: "Flask", icon: SiFlask },
    { skill: "Pandas", icon: SiPandas },
    { skill: "Nginx", icon: SiNginx },
  ],
  Languages: [
    { skill: "TypeScript", icon: SiTypescript },
    { skill: "JavaScript", icon: DiJsBadge },
    { skill: "Python", icon: SiPython },
    { skill: "C#", icon: SiCsharp },
    { skill: "SQL", icon: FaDatabase },
    { skill: "HTML5", icon: SiHtml5 },
    { skill: "CSS3 / SCSS", icon: DiCss3 },
    { skill: "Terraform (HCL)", icon: SiTerraform },
  ],
  "Containers & IaC": [
    { skill: "Docker", icon: SiDocker },
    { skill: "Kubernetes", icon: SiKubernetes },
    { skill: "Helm", icon: SiHelm },
    { skill: "Terraform", icon: SiTerraform },
    { skill: "Nirmata", icon: SiKubernetes },
  ],
  Databases: [
    { skill: "PostgreSQL", icon: SiPostgresql },
    { skill: "MS SQL Server", icon: SiMicrosoftsqlserver },
    { skill: "MongoDB", icon: SiMongodb },
    { skill: "DynamoDB", icon: SiAmazondynamodb },
    { skill: "MariaDB", icon: SiMariadb },
    { skill: "SQLite", icon: SiSqlite },
    { skill: "Redshift", icon: SiAmazonredshift },
  ],
  "Data & Streaming": [
    { skill: "Confluent Kafka", icon: SiApachekafka },
    { skill: "MSK", icon: SiApachekafka },
    { skill: "Apache Flink", icon: SiApacheflink },
    { skill: "Apache Hudi", icon: FaDatabase },
    { skill: "Snowflake", icon: SiSnowflake },
    { skill: "Collibra", icon: FaDatabase },
    { skill: "Medallion Arch.", icon: MdCloudQueue },
  ],
  "CI/CD & Security": [
    { skill: "GitHub Actions", icon: SiGithubactions },
    { skill: "Jenkins", icon: SiJenkins },
    { skill: "Harness", icon: MdCloudQueue },
    { skill: "JFrog", icon: SiJfrog },
    { skill: "Fortify", icon: MdCloudQueue },
    { skill: "Wiz", icon: MdCloudQueue },
    { skill: "Venafi SSL", icon: MdCloudQueue },
    { skill: "SSM Patch Mgr", icon: SiAmazonaws },
  ],
  "AI & Agents": [
    { skill: "Claude Code", icon: FaRobot },
    { skill: "Multi-agent", icon: FaRobot },
    { skill: "MCP Tooling", icon: FaRobot },
    { skill: "AI Code Review", icon: FaRobot },
  ],
  Monitoring: [
    { skill: "Prometheus", icon: SiPrometheus },
    { skill: "Grafana", icon: SiGrafana },
    { skill: "CloudWatch", icon: SiAmazoncloudwatch },
  ],
  Testing: [
    { skill: "Jest", icon: SiJest },
    { skill: "Enzyme", icon: DiReact },
  ],
  "Tools & PM": [
    { skill: "Git", icon: SiGit },
    { skill: "GitHub", icon: SiGithub },
    { skill: "Bitbucket", icon: SiBitbucket },
    { skill: "Jira", icon: SiJira },
    { skill: "Trello", icon: SiTrello },
    { skill: "Figma", icon: SiFigma },
  ],
};

export default skills;
