import React from "react";
import styles from "../styles/education.module.scss";
import { CgWebsite } from "react-icons/cg";

interface educationProps {
  imageSrc: string;
  school: string;
  gpa: number;
  degree: string;
  major: string;
  yearGraduated: number;
  location: string;
  url: string;
}

const Education: React.FC<educationProps> = ({
  imageSrc,
  school,
  gpa,
  degree,
  major,
  yearGraduated,
  location,
  url,
}) => {
  return (
    <div className={styles.educationContainer}>
      <div
        className={styles.educationContent}
        style={{
          background: `rgba(0,0,0,.8) url(${imageSrc})`,
          backgroundBlendMode: "darken",
          backgroundSize: "120%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.educationHeading}>
          <div className={styles.educationHeader}>
            <h3>{school}</h3>
            <sub>{location}</sub>
          </div>
          <div className={styles.educationSite}>
            <a href={url} target="_blank" rel="noreferrer">
              <CgWebsite />
            </a>
          </div>
        </div>

        <div className={styles.educationDetails}>
          <div className={styles.educationRow}>
            <label>GPA</label> <span>{gpa}</span>
          </div>
          <div className={styles.educationRow}>
            <label>Degree</label> <span>{degree}</span>
          </div>
          <div className={styles.educationRow}>
            <label>Major</label> <span>{major}</span>
          </div>
          <div className={styles.educationRow}>
            <label>Graduated</label> <span>{yearGraduated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
