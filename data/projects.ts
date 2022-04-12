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
];

export default projectsData;
