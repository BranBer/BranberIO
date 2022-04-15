import projectsData from "../../data/projects";
import project from "../../types/project";
import styles from "../../styles/Projects.module.scss";
import Carousel from "../../components/carousel";
import dynamic from "next/dynamic";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGlobe } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import PageHeader from "../../components/pageHeader";

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
          <PageHeader text={project.name} />
          <hr />
          <Carousel images={project.images} />
          <div className={styles.projectLinks}>
            {project.repo && project.repo.link && (
              <a href={project.repo.link} target="_blank" rel="noreferrer">
                <div className={styles.projectLink}>
                  <FontAwesomeIcon icon={faGithub} />
                  <span>Visit Repo</span>
                </div>
              </a>
            )}

            {project.projectLink && (
              <a href={project.repo.link} target="_blank" rel="noreferrer">
                <div className={styles.projectLink}>
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>Visit Site</span>
                </div>
              </a>
            )}
          </div>
          <hr />
          <div className={styles.projectDescriptionContainer}>
            <div className={styles.projectDescription}>
              <p>{project.description}</p>
            </div>
          </div>

          <hr />
          <h3>Project Languages</h3>
          <LanguagesPieChart
            owner={project.repo.owner}
            repo={project.repo.repo}
          />
          <hr />
          <Link passHref href="/projects">
            <button className={styles.generalButton}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back to projects..
            </button>
          </Link>
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
