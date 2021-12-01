import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const getClient = (uri: string) => {
  return new ApolloClient({
    uri: uri + "/graphql",
    cache: new InMemoryCache(),
  });
};

console.log(process.env.api_url);
const client = getClient(process.env.api_url!);

export default client;
