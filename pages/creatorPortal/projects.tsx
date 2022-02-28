import React, { useState } from "react";
import styles from "../../styles/ProjectDashboard.module.scss";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import client from "../../graphql/client";
import { UPLOAD_PROJECT } from "../../graphql/mutations/project";
import TabMenu from "../../components/tabMenu";
import ProjectDashboard from "../../components/projectDashboard";

const Projects = () => {
  return (
    <div className={styles.CreatorPortalPage}>
      <TabMenu>
        <ProjectDashboard />
      </TabMenu>
    </div>
  );
};

export default Projects;
