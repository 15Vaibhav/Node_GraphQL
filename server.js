const express = require('express');
const expressGraphQL =require('express-graphql');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolver = require('./graphql/resolvers/index')
app.use(bodyParser.json())
const PORT = 4000;
const url = 'mongodb://localhost/graphTest';
mongoose.connect(url,{ useUnifiedTopology: true ,useNewUrlParser: true} ,(err,db)=>{
    if(err){
        console.log(err)
    }
})


app.use('/graphql', expressGraphQL({
    schema:graphQlSchema,
    rootValue:graphQlResolver,
    graphiql:true  
}))

app.listen(PORT,()=>{
    console.log("server is listening on port",PORT);
})