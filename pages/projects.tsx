import type { NextPage } from "next";
import styles from "../styles/Projects.module.scss";
import Lavalamp from "../components/lavalamp";

const projects = [
  {
    Name: "Test Project 1",
    Tags: ["React", "Next.js", "Django", "Graphql", "Express"],
    Image: "/static/images/board1.jpg",
  },
  {
    Name: "Test Project 2",
    Tags: ["React", "Next.js", "Django", "Graphql", "Express"],
    Image: "/static/images/board2.jpg",
  },
  {
    Name: "Test Project 3",
    Tags: ["React", "Next.js", "Django", "Graphql", "Express"],
    Image: "/static/images/board3.jpg",
  },
  {
    Name: "Test Project 4",
    Tags: ["React", "Next.js", "Django", "Graphql", "Express"],
    Image: "/static/images/hubbleNebulaMandala.png",
  },
  {
    Name: "Test Project 5",
    Tags: ["React", "Next.js", "Django", "Graphql", "Express"],
    Image: "/static/images/board1.jpg",
  },
  {
    Name: "Test Project 6",
    Tags: ["React", "Next.js", "Django", "Graphql", "Express"],
    Image: "/static/images/board2.jpg",
  },
];

const Projects: NextPage = () => {
  const RenderProjects = () => {
    return (
      <div className={styles.projectsContainer}>
        {projects.map((project, pIndex) => {
          return (
            <div
              key={`Project${pIndex}`}
              className={styles.projectContainer}
              style={{ background: `url(${project.Image})` }}
            >
              <div className={styles.projectOverlay}>
                <h3>{project.Name}</h3>
                <div className={styles.projectTags}>
                  {project.Tags.map((tag, tIndex) => {
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
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Lavalamp />
      <div className={styles.pageContainer}>
        <div className={styles.page}>
          <h2>Projects</h2>
          {RenderProjects()}
        </div>
      </div>
    </>
  );
};

export default Projects;
