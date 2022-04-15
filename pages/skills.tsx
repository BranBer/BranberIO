import React from "react";
import styles from "../styles/skills.module.scss";
import PageHeader from "../components/pageHeader";
import skills from "../data/skills";
import Skill from "../components/skill";

const Skills = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.page}>
        <PageHeader text={"Skills"} />
        <div className={styles.skillsContainer}>
          {skills.map(({ skill, icon, proficiency, description }, index) => (
            <Skill
              key={`skill${index}`}
              Icon={icon}
              iconText={skill}
              proficiency={proficiency}
              description={description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
