import project from "../types/project";

const projectsData: project[] = [
  {
    id: "airpnp",
    name: "Air PnP",
    tagline: "Senior capstone project — a location-aware bathroom-reservation API",
    description:
      "Air PnP is a senior capstone project: a full-stack web application that lets users find, list, and reserve bathrooms near their location. As sole backend engineer I designed and built the REST API, authentication layer, scheduling system, and data models entirely on my own.",
    context: "Senior / capstone project at university — not a commercial product.",
    role: "Sole backend engineer",
    problem:
      "Finding a public restroom in a city is often urgent and stressful. There was no structured way for building owners to share access to their facilities or for people to discover and reserve a time slot in advance.",
    solution:
      "Built a Django REST API with token-based authentication that lets hosts register bathrooms with operating hours, lets users search by location and reserve time slots, and uses crontab + Django ORM scheduling to manage slot availability.",
    stack: [
      "Python",
      "Django",
      "Django REST Framework",
      "Token Authentication",
      "crontab",
      "PostgreSQL",
    ],
    // No live demo was deployed; no metrics to report honestly.
    impact: [],
    status: "shipped",
    repo: {
      link: "https://github.com/BranBer/AirPnP",
      repo: "AirPnP",
      owner: "BranBer",
    },
    // No live deployment exists; keeping empty to avoid a broken link.
    projectLink: "",
    images: [
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_home.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_bathroom_registration.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_login.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_user_info.PNG",
    ],
    imageCaptions: {
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_home.PNG":
        "Home page — location-aware bathroom search",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_bathroom_registration.PNG":
        "Host registration form for a new bathroom listing",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_login.PNG":
        "Token-authenticated login screen",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_user_info.PNG":
        "User profile and reservation management",
    },
    tags: ["backend", "django", "python", "rest-api", "capstone"],
  },
  {
    id: "pronto-portal",
    name: "Pronto Portal",
    tagline:
      "Self-driven full-stack build demonstrating infrastructure depth — an ambitious solo attempt at a translation-services platform",
    description:
      "Pronto Portal is a self-driven project I built from scratch to explore production-grade infrastructure: a multi-service platform on AWS (Lambda + ECS), provisioned with Terraform, containerised with Docker, and fronted by a Next.js/React application with Stripe subscriptions and Twilio SMS reminders. This was an ambitious personal build — it was never a funded startup and did not serve paying users.",
    context:
      "Personal / side project — an attempt to build a complete SaaS product solo. The project was paused before reaching real users; it is preserved as a portfolio signal for infrastructure and full-stack skills.",
    role: "Full-stack engineer and infrastructure owner (sole contributor)",
    problem:
      "Small business owners who coordinate networks of freelance translators had no purpose-built tool to assign work, track appointments, and send automated reminders to all parties involved.",
    solution:
      "Designed and deployed a multi-environment AWS architecture (Lambda for serverless event handlers, ECS for long-running services) provisioned with Terraform, containerised workloads with Docker, built a React/Next.js front end, integrated Stripe for subscription billing, and used Twilio for SMS appointment reminders. Architecture diagrams are included in the screenshots below.",
    stack: [
      "AWS Lambda",
      "AWS ECS",
      "Terraform",
      "Docker",
      "TypeScript",
      "React",
      "Next.js",
      "Twilio",
      "Stripe",
    ],
    // Honest framing: no user counts, no uptime SLAs, no revenue figures.
    impact: [
      "End-to-end infrastructure provisioned with Terraform across dev and staging environments",
      "Demonstrates full ownership of architecture, backend services, and front-end application in a single project",
    ],
    // Paused before reaching real users — "archived" is the honest status.
    status: "archived",
    repo: {
      link: "https://github.com/pronto-portal/pronto-infrastructure",
      repo: "pronto-infrastructure",
      owner: "pronto-portal",
    },
    projectLink: "https://prontotranslationservices.com/",
    images: [
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/login.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/assignments.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/analytics.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/translators.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/pronto-aws-networking.drawio.png",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/pronto-application.drawio.png",
    ],
    imageCaptions: {
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/login.PNG":
        "Authentication screen",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/assignments.PNG":
        "Assignment management dashboard",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/analytics.PNG":
        "Analytics view",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/translators.PNG":
        "Translator roster",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/pronto-aws-networking.drawio.png":
        "AWS networking architecture — VPC, subnets, security groups (draw.io export)",
      "https://branberio.s3.us-east-2.amazonaws.com/pronto-portal/pronto-application.drawio.png":
        "Application service architecture — Lambda, ECS, RDS, Twilio, Stripe (draw.io export)",
    },
    tags: [
      "aws",
      "lambda",
      "ecs",
      "terraform",
      "docker",
      "typescript",
      "react",
      "next.js",
      "twilio",
      "stripe",
      "infrastructure",
    ],
  },
];

export default projectsData;
