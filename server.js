const express = require('express');
const expressGraphQL =require('express-graphql');
const {buildSchema} = require('graphql')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Event = require('./models/events');
const app = express();

app.use(bodyParser.json())
const PORT = 4000;
const url = 'mongodb://localhost/graphTest';
mongoose.connect(url,{ useUnifiedTopology: true ,useNewUrlParser: true} ,(err,db)=>{
    if(err){
        console.log(err)
    }
})
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
            return Event.find().then(events=>{
                return events.map(event=>{
                    return {...event._doc}
                })
            }).catch(err=>{
                throw err;
            })
        },
        createEvents:(args)=>{
            console.log(args.eventInput.title)
            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:args.eventInput.price
            })
            return event.save()
            .then(result=>{
                return {...result._doc}
            })
            .catch(err=>{
                console.log(err)
                throw err
            })
        }//resolver fun match to schema
    },
    graphiql:true  
}))

app.listen(PORT,()=>{
    console.log("server is listening on port",PORT);
})