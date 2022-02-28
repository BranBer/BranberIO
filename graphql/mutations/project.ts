import { gql } from "@apollo/client";

const UPLOAD_PROJECT = gql`
  mutation (
    $name: String!
    $description: String
    $dateCreated: Date
    $repoLink: String
    $projectLink: String
    $images: [Upload]
    $tags: [String]
  ) {
    createProject(
      name: $name
      description: $description
      dateCreated: $dateCreated
      repoLink: $repoLink
      projectLink: $projectLink
      images: $images
      tags: $tags
    ) {
      message
    }
  }
`;

export { UPLOAD_PROJECT };
