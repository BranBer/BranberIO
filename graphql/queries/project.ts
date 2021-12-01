import { gql } from "@apollo/client";

const projectQueries = gql`
    type Query($page: Int!, $size: Int!) {
        projects(page: $page, size: $size){
            name
            description
            dateCreated
            repoLink
            projectLink
            images
        }
    }
  `;

export default projectQueries;
