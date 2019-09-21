const express = require('express');
const expressGraphQL =require('express-graphql');
const {buildSchema} = require('graphql')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Event = require('./models/events');
const User = require('./models/users')
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.json())
const PORT = 4000;
const url = 'mongodb://localhost/graphTest';
mongoose.connect(url,{ useUnifiedTopology: true ,useNewUrlParser: true} ,(err,db)=>{
    if(err){
        console.log(err)
    }
})

const events =eventIds=>{
    return Event.find({_id:{$in:eventIds}})
    .then(events=>{
      return  events.map(event=>{
          return {
              ..._event._doc,
              creator:user.bind(this,event.creator)
                }
      })
    })
    .catch(err=>{
        throw new err
    })
}
const user = userId=>{
    return User.findById(userId)
    .then(user=>{
        return {...user._doc,createdEvent:events.bind(this,user._doc.createEvents)}
    })
    .catch(err=>
        {
            throw err
        })
}
app.use('/graphql', expressGraphQL({
    schema:buildSchema(`
    type Event{
        title: String!
        description: String!
        price: Float!
        creator:User!
    }

    type User {
        _id: ID!
        email:String!
        password:String
        createdEvent:[Event!]
    }

    input inputEvent{
        title: String!
        description: String!
        price: Float!
    }

    input UserInput{
        email:String!
        password:String
    }

    type RootQuery {
        events:[Event!]!
        users:[User!]!
    }
    type RootMutation{
        createEvents(eventInput:inputEvent): Event
        createUser(userInput:UserInput): User

    } 
    schema {
        query:RootQuery
        mutation:RootMutation
    }
    `),
    rootValue:{
        events:()=>{
            return Event.find()
            .then(events=>{
                return events.map(event=>{
                    return {...event._doc,
                        creator:user.bind(this,event._doc.creator)
                    }
                })
            }).catch(err=>{
                throw err;
            })
        },
        
        createEvents:(args)=>{
            let createdEvents ;
            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:args.eventInput.price,
                creator:"5d85cec31f826d3b1029457b"
            })
            return event.save()
            .then(result=>{
                createdEvents = {...result._doc,_id:result._doc._id.toString(),creator:user.bind(result._doc.creator)}
                return User.findById("5d85cec31f826d3b1029457b")
            })
            .then(user=>{
                if(!user){
                    throw new Error('user dosent exist');
                }
                user.createdEvent.push(event)
                return user.save()
            })
            .then(result=>{
                return createdEvents
            })
            .catch(err=>{
                console.log(err)
                throw err
            })
        },//resolver fun match to schema

        createUser :args=>{
            return User.findOne({'email':args.userInput.email})
            .then(user=>{
                if(user){
                    throw new Error('User already exists');
                }
                return bcrypt.hash(args.userInput.password,12)

            })
            .then(hashedpassword=>{
                    const user = new User({
                        email:args.userInput.email,
                        password:hashedpassword
                    })
                    return user.save()
                    })
            .then(result=>{
                return {...result._doc,password:null,_id:result.id}
            })
            .catch(err=>{
                throw err
            })

        }
    },
    graphiql:true  
}))

app.listen(PORT,()=>{
    console.log("server is listening on port",PORT);
})