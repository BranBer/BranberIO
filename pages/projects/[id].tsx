import NavBar from "../../components/navBar";
import projectsData from "../../data/projects";
import project from "../../types/project";
import styles from "../../styles/Projects.module.scss";
import Carousel from "../../components/carousel";
import dynamic from "next/dynamic";

interface projectRouteQuery {
  id: string;
}

const LanguagesPieChart = dynamic(
  () => import("../../components/languagesPieChart"),
  {
    ssr: false,
  }
);

const Project = ({ project }: { project: project }) => {
  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.page}>
          <h2>{project.name}</h2>
          <NavBar />
          <Carousel images={project.images} />
          <hr />
          <div className={styles.projectDescription}>
            <p>{project.description}</p>
          </div>

          <hr />
          <LanguagesPieChart
            owner={project.repo.owner}
            repo={project.repo.repo}
          />
        </div>
      </div>
    </>
  );
};

Project.getInitialProps = async ({ query }: { query: projectRouteQuery }) => {
  const { id } = query;
  let project = projectsData.find((project) => project.id === id);

  return { project: project };
};

export default Project;
