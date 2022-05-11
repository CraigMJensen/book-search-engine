const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
// const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '../client/public')));
}

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  server.applyMiddleware({ app });

  // app.use(routes);

  db.once('open', () => {
    app.listen(
      PORT,
      () => console.log(`🌍 Api server running on port:${PORT}`),
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  });
};

startApolloServer(typeDefs, resolvers);
