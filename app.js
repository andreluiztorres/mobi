require('dotenv').config()
//const swaggerUi = require('swagger-ui-express');
//const swaggerJsdoc = require('swagger-jsdoc');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json({limit: '150mb'}));
app.use(express.urlencoded({limit: '250mb'}));

/*
const server = app.listen(80);
server.keepAliveTimeout = 65000;
*/

// Routes
const Auth = require('./src/controller/AuthController');
const User = require('./src/controller/UserController');

app.use('/auth', Auth);
app.use('/user', User);

app.use(express.json())

// Public route
app.get('/', (req,res) => {
    res.status(200).json({msg: "Bem vindo a API desafio NodeJS"})
})

const dbUser = process.env.DATABASE_USER
const dbPassword = process.env.DATABASE_PASSWORD

mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.yjlkqux.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(3001)
        console.log("Conectou ao banco de dados")
    })
    .catch((err) => console.log({err}))

