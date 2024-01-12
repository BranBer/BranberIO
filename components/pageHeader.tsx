import React from "react";
import NavBar from "./navBar";

interface pageHeaderProps {
  text: string;
}

const PageHeader: React.FC<pageHeaderProps> = ({ text }) => {
  return (
    <>
      <h2>{text}</h2>
      <NavBar />
    </>
  );
};

export default PageHeader;
