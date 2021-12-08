import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

const getClient = (uri: string) => {
  return new ApolloClient({
    uri: uri + "/graphql",
    cache: new InMemoryCache(),
  });
};

const client = getClient(process.env.api_url!);

export default client;
