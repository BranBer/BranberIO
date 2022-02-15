import { gql } from "@apollo/client";

const LOGIN_GOOGLE = gql`
  mutation (
    $email: String!
    $idToken: String!
    $displayName: String!
    $picture: String!
  ) {
    loginGoogle(
      email: $email
      idToken: $idToken
      displayName: $displayName
      picture: $picture
    ) {
      message
    }
  }
`;

const LOGIN_FACEBOOK = gql`
  mutation (
    $email: String!
    $inputToken: String!
    $displayName: String!
    $picture: String
  ) {
    loginFacebook(
      email: $email
      inputToken: $inputToken
      displayName: $displayName
      picture: $picture
    ) {
      message
    }
  }
`;

export { LOGIN_GOOGLE, LOGIN_FACEBOOK };
