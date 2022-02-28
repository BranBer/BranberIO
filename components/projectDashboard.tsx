import React, { useState } from "react";
import styles from "../styles/ProjectDashboard.module.scss";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BranBerEditor from "./editor";
import client from "../graphql/client";
import { UPLOAD_PROJECT } from "../graphql/mutations/project";
import { useMutation } from "@apollo/client";

const ProjectDashboard = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [name, setName] = useState<string>("");
  const [repoLink, setRepoLink] = useState<string>("");
  const [projectLink, setProjectLink] = useState<string>("");
  const [editorValue, setEditorValue] = useState("");
  const [createProject, { data, error, loading }] = useMutation(UPLOAD_PROJECT);

  const uploadProject = async () => {
    let data = createProject({
      variables: {
        name: name,
        images: images,
        description: editorValue,
        repoLink: repoLink,
        projectLink: projectLink,
      },
    });
  };

  return (
    <div className={styles.projectDashboardContainer}>
      <form className={styles.projectInputContainer}>
        <div className={styles.projectInput}>
          <label
            htmlFor="projectImagesUpload"
            className={styles.projectImagesUploadLabel}
          >
            <UploadFileIcon />
            <span>Upload Project Images...</span>
            <input
              type="file"
              id="projectImagesUpload"
              multiple
              onChange={(event) => {
                setImages(event.target.files);
              }}
            />
            <div className={styles.projectUploadedImages}>
              {images
                ? Array.from(images).map((image, index) => {
                    return (
                      <span
                        key={`Project${image.name}${index}`}
                        className={styles.projectImage}
                      >
                        {image.name}
                      </span>
                    );
                  })
                : null}
            </div>
          </label>
        </div>
        <div className={styles.projectInput}>
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            multiple
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>
        <div className={styles.projectInput}>
          <label htmlFor="projectRepo">Repository URL</label>
          <input
            type="text"
            id="projectRepo"
            multiple
            onChange={(event) => {
              setRepoLink(event.target.value);
            }}
          />
        </div>
        <div className={styles.projectInput}>
          <label htmlFor="projectLink">Project URL</label>
          <input
            type="text"
            id="projectLink"
            multiple
            onChange={(event) => {
              setProjectLink(event.target.value);
            }}
          />
        </div>
        <div className={styles.editorContainer}>
          <BranBerEditor value={editorValue} onChange={setEditorValue} />
        </div>
        <button onClick={uploadProject}>Submit</button>
      </form>
    </div>
  );
};

export default ProjectDashboard;
