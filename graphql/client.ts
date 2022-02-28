import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const getClient = (uri: string) => {
  return new ApolloClient({
    uri: uri + "/graphql",
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: uri + "/graphql",
      credentials: "include",
    }),
  });
};

const client = getClient(process.env.api_url!);

export default client;
