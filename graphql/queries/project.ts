import { gql } from "@apollo/client";

const getProjects = gql`
  query ($page: Int!, $size: Int!) {
    projects(page: $page, size: $size) {
      name
      description
      dateCreated
      repoLink
      projectLink
      images
    }
  }
`;

export default getProjects;
