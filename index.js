const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const { DBconnect } = require('./config/db')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});




//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers['authorization'] || ''
   
      if (token) {
        try {
          const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET)
          return user
        } catch (error) {
          console.error(error)
        }
      }
    },
  })

//Arrancar el servidor
const startServer = async () => {
    const { url } = await server.listen({ port: process.env.PORT || 4000 })
    console.log(`Server running on ${url}`)
  }
   
//Conectar a la Base de datos
DBconnect();
startServer()