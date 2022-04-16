import React from "react";
import styles from "../styles/skills.module.scss";
import PageHeader from "../components/pageHeader";
import skills from "../data/skills";
import Skill from "../components/skill";
import Page from "../components/page";
import { motion } from "framer-motion";
import variants from "../animations/animations";

const Skills = () => {
  return (
    <Page>
      <PageHeader text={"Skills"} />
      <div className={styles.skillsContainer}>
        {skills.map(({ skill, icon }, index) => (
          <motion.div
            key={`skill${index}`}
            variants={variants}
            initial="fadeInit"
            animate="fadeAnimate"
            transition={{
              duration: 1,
              delay: index / (skills.length * 2),
            }}
          >
            <Skill Icon={icon} iconText={skill} />
          </motion.div>
        ))}
      </div>
    </Page>
  );
};

export default Skills;
