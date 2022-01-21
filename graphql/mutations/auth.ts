import { gql } from "@apollo/client";

const LOGIN_GOOGLE = gql`
  mutation (
    $email: String!
    $aud: String!
    $idToken: String!
    $displayName: String!
    $picture: String!
  ) {
    loginGoogle(
      email: $email
      aud: $aud
      idToken: $idToken
      displayName: $displayName
      picture: $picture
    ) {
      message
    }
  }
`;

export default LOGIN_GOOGLE;
