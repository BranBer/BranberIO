import styles from "../styles/Projects.module.scss";
import Project from "../types/project";
import projectsData from "../data/projects";
import Link from "next/link";
import PageHeader from "../components/pageHeader";

const Projects = ({ projects }: any) => {
  const RenderProjects = () => {
    return (
      <div className={styles.projectsContainer}>
        {projects.map((project: Project, pIndex: number) => {
          let background = project.images
            ? `url(${project.images[0]})`
            : "black";
          return (
            <div
              key={`Project${pIndex}`}
              className={styles.projectContainer}
              style={{ background: background, backgroundSize: "cover" }}
            >
              <div className={styles.projectOverlay}>
                <h3>{project.name}</h3>
                <div className={styles.projectTags}>
                  {project.tags.map((tag: string, tIndex: number) => {
                    return (
                      <div
                        key={`project${pIndex}tag${tIndex}`}
                        className={styles.projectTag}
                      >
                        {tag}
                      </div>
                    );
                  })}
                </div>
                <Link href={`/projects/${project.id}`} passHref>
                  <button className={styles.generalButton}>Read More</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.page}>
          {/* <h2>Projects</h2>
          <NavBar /> */}
          <PageHeader text="Projects" />
          {RenderProjects()}
        </div>
      </div>
    </>
  );
};

Projects.getInitialProps = async () => {
  return { projects: projectsData };
};

export default Projects;
