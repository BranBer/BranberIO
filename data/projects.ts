import project from "../types/project";

const projectsData: project[] = [
  {
    id: "airpnp",
    name: "Air PnP",
    description: `It can be difficult and frustrating to have the urgent need to use the bathroom in a big city. And even more frustrating when you can't find one. With this web service, users are able to look up and reserve bathrooms at certain time slots that are listed near their current location. I single-handedly created the backend for this project in Django. Here I served REST API
        s using Django's REST Framework, and handled scheduling using crontabs and Django's ORM. Furthermore, I implemented models that allows Users to host bathrooms, reserve bathrooms, and modify their bathroom's available hours. All of this secured using Django Rest Framework Token Authentication.`,
    repo: {
      link: "https://github.com/BranBer/AirPnP",
      repo: "airpnp",
      owner: "branber",
    },
    projectLink: "",
    images: [
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_home.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_bathroom_registration.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_login.PNG",
      "https://branberio.s3.us-east-2.amazonaws.com/seniorProject/airpnp_user_info.PNG",
    ],
    tags: ["backend", "django", "python"],
  },
  {
    id: "pronto-portal",
    name: "Pronto Portal",
    description:
      "*WIP* This platform was created for small business owners who manage a network of translators. It allows them to assign work to their translators, and reminds both the translator and the receiving party of the translator of their upcoming appointment. The application leverages AWS for hosting, Twilio for text reminders, and Stripe for subscriptions.",
    repo: {
      link: "https://github.com/pronto-portal/pronto-infrastructure",
      repo: "pronto-portal",
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
    tags: [
      "aws",
      "lambda",
      "ecs",
      "terraform",
      "docker",
      "typescript",
      "react",
      "next.js",
    ],
  },
];

export default projectsData;
