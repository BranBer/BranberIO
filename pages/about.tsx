import React, { useState } from "react";
import PageHeader from "../components/pageHeader";
import styles from "../styles/about.module.scss";
import Page from "../components/page";
import Education from "../components/education";
import educationalExperiences from "../data/education";
import { AiFillFilePdf } from "react-icons/ai";
import Modal from "../components/modal";

const About = () => {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  return (
    <>
      <Page>
        <PageHeader text="About Me" />
        <div className={styles.aboutContainer}>
          <div className={styles.aboutImage} />
          <div className={styles.aboutContent}>
            <p>
              <span className={styles.tab} />I am a versatile developer with a
              wide skillset. I have an affinity for learning new things, and my
              specialty lies in frontend development; Particularly with the
              React.js framework. That's not to say I'm not skilled in other
              areas of development.
            </p>
            <p>
              <span className={styles.tab} />I can build anything from visually
              interactive and responsive frontends, to Graphql backends/apis
              with the tools at my disposal on the skills page and more.
            </p>
            <p>
              <span className={styles.tab} /> If you would like to make an
              inquiry, please reach out to me at{" "}
              <span className={styles.email}>brandonberke@gmail.com</span>
            </p>
            <p className={styles.resumeParagraph}>
              <span className={styles.tab} /> If you would like to see a more
              detailed view of my experience, please see my resume at{" "}
              <button
                className={styles.generalButton}
                onClick={() => setPdfModalOpen(true)}
              >
                View Resume... <AiFillFilePdf />{" "}
              </button>
            </p>
          </div>
        </div>
        <h3 className={styles.generalHeader}>Education</h3>
        {educationalExperiences.map(
          (
            {
              school,
              imageSrc,
              degree,
              major,
              gpa,
              yearGraduated,
              location,
              url,
            },
            index
          ) => {
            return (
              <Education
                key={`education${index}`}
                location={location}
                url={url}
                school={school}
                imageSrc={imageSrc}
                degree={degree}
                major={major}
                gpa={gpa}
                yearGraduated={yearGraduated}
              />
            );
          }
        )}
      </Page>
      <Modal visible={pdfModalOpen} onClose={() => setPdfModalOpen(false)}>
        <embed
          className={styles.resumePdf}
          type="application/pdf"
          src={
            "https://branberio.s3.us-east-2.amazonaws.com/resume/LatestResume.pdf"
          }
        />
      </Modal>
    </>
  );
};

export default About;
