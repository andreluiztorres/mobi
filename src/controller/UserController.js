const express = require('express');
const cors = require('cors');
const UserService = require('./../service/UserService');
const router = express.Router();
const { token } = require('./Token.js');

const { json, append } = require('express/lib/response')
const { param } = require('express/lib/request');
const corsOptions = {
    origin: 'http://localhost:3001/user',
    optionsSuccessStatus : 200
}


router.use(cors())
router.use(express.json())
// Registrar usuário

router.post('/save', async(req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    try {

        const service = new UserService();
        const salvo = await service.create(req.body);
    
        res.status(201).json({msg: "Usuário criado com sucesso", data: salvo});

    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

module.exports = router;