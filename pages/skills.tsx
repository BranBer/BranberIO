import React from "react";
import styles from "../styles/skills.module.scss";
import PageHeader from "../components/pageHeader";
import skills from "../data/skills";
import Skill from "../components/skill";
import Page from "../components/page";
import { motion } from "framer-motion";
import variants from "../animations/animations";

const Skills = () => {
  const skillCategories = Object.entries(skills).sort(
    ([_, skills1], [__, skills2]) => {
      return skills2.length - skills1.length;
    }
  );
  return (
    <Page>
      <PageHeader text={"Skills"} />

      <div className={styles.skillCategories}>
        {skillCategories.map(([category, skills], categoryIndex) => {
          return (
            <div
              key={`skillCategory${categoryIndex}`}
              className={styles.skillCategory}
            >
              <h3>{category}</h3>
              <div className={styles.skillsContainer}>
                {skills.map(({ skill, icon }, skillIndex) => (
                  <motion.div
                    key={`skill${skillIndex}${categoryIndex}`}
                    variants={variants}
                    initial="fadeInit"
                    animate="fadeAnimate"
                    transition={{
                      duration: 1,
                      delay: skillIndex / (skills.length * 2),
                    }}
                  >
                    <Skill Icon={icon} iconText={skill} />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

export default Skills;
