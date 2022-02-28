import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../styles/tabMenu.module.scss";
import ProjectDashboard from "./projectDashboard";

interface tabMenuProps {
  children?: React.ReactNode;
}

const TabMenu: React.FC<tabMenuProps> = ({ children }) => {
  const tabs = ["Projects", "Comments", "Users", "Banned Words"];
  const { pathname } = useRouter();
  const currentSubPath = pathname.split("/").pop();

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => {
          return (
            <div
              className={
                currentSubPath === tab.toLowerCase()
                  ? `${styles.tab} ${styles.tabSelected}`
                  : styles.tab
              }
              key={`${tab}${index}`}
            >
              <Link
                key={`${tab}Link`}
                passHref
                href={`/creatorPortal/${tab.toLowerCase()}`}
              >
                <span>{tab}</span>
              </Link>
            </div>
          );
        })}
      </div>
      <div className={styles.tabDashboard}>{children}</div>
    </div>
  );
};

export default TabMenu;
