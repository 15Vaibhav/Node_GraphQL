const express = require('express');
const expressGraphQL =require('express-graphql');
const {buildSchema} = require('graphql')
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
const PORT = 4000;
const events=[];
app.use('/graphql', expressGraphQL({
    schema:buildSchema(`
    type Event{
        title: String!
        description: String!
        price: Float!
    }

    input inputEvent{
        title: String!
        description: String!
        price: Float!
    }

    type RootQuery {
        events:[Event!]!
    }
    type RootMutation{
        createEvents(eventInput:inputEvent): Event
    } 
    schema {
        query:RootQuery
        mutation:RootMutation
    }
    `),
    rootValue:{
        events:()=>{
            return events;
        },
        createEvents:(args)=>{
            console.log(args.eventInput.title)
            const event ={
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:args.eventInput.price
            };
            events.push(event)
            return event
        }//resolver fun match to schema
    },
    graphiql:true  
}))

app.listen(PORT,()=>{
    console.log("server is listening on port",PORT);
})