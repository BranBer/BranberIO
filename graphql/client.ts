import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const getClient = (uri: string) => {
  return new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
  });
};

export default getClient;
