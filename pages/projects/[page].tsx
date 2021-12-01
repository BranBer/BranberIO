import type { NextPage, NextPageContext } from "next";
import styles from "../../styles/Projects.module.scss";
import Lavalamp from "../../components/lavalamp";
import getProjects from "../../graphql/queries/project";
import client from "../../graphql/client";
import Project from "../../types/project";

const Projects = ({ projects }: any) => {
  const RenderProjects = () => {
    return (
      <div className={styles.projectsContainer}>
        {projects.map((project: Project, pIndex: number) => {
          let background = project.images
            ? `url(${process.env.api_url + project.images[0]})`
            : "black";
          return (
            <div
              key={`Project${pIndex}`}
              className={styles.projectContainer}
              style={{ background: background }}
            >
              <div className={styles.projectOverlay}>
                <h3>{project.name}</h3>
                <div className={styles.projectTags}>
                  {/* {project.tags.map((tag: string, tIndex: number) => {
                    return (
                      <div
                        key={`project${pIndex}tag${tIndex}`}
                        className={styles.projectTag}
                      >
                        {tag}
                      </div>
                    );
                  })} */}
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

Projects.getInitialProps = async ({ query }: NextPageContext) => {
  let params: { page: number; size: number } = {
    page: +(query.page as string),
    size: +process.env.projects_per_page!,
  };
  let { loading, error, data } = await client.query({
    query: getProjects,
    variables: params,
  });

  return { projects: data.projects };
};

export default Projects;
