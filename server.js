const express = require('express');
const expressGraphQL =require('express-graphql');
const {buildSchema} = require('graphql')
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
const PORT = 4000;

app.use('/graphql', expressGraphQL({
    schema:buildSchema(`
    type RootQuery {
        events:[String!]!
    }
    type RootMutation{
        createEvents(name:String): String
    } 
    schema {
        query:RootQuery
        mutation:RootMutation
    }
    `),
    rootValue:{
        events:()=>{
            return ['ABC','DEF','GHI'];
        },
        createEvents:(args)=>{
            const eventName = args.name
            return eventName
        }//resolver fun match to schema
    },
    graphiql:true  
}))

app.listen(PORT,()=>{
    console.log("server is listening on port",PORT);
})