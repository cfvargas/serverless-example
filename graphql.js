import { graphqlLambda } from 'apollo-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';

// GraphQL schema
const schema = `
  type Query {
    getUser(username: String, password: String): User!
  }

  type User {
    username: String!
    password: String!
  }

  schema {
    query: Query
  }
`;

const resolver = {
  Query: {
    getUser: (_, args) => ({ username: args.username, password: args.password })
  },
}

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
});

export function main(event, context, callback) {

  function callbackFilter(error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  }

  const handler = graphqlLambda({ schema: myGraphQLSchema, tracing: true });
  return handler(event, context, callbackFilter);
};

