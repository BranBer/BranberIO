import NavBar from "../../components/navBar";
import projectsData from "../../data/projects";
import project from "../../types/project";
import styles from "../../styles/Projects.module.scss";
import Carousel from "../../components/carousel";

interface projectRouteQuery {
  id: string;
}

const Project = ({ project }: { project: project }) => {
  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.page}>
          <h2>{project.name}</h2>
          <NavBar />
          <Carousel images={project.images} />
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
