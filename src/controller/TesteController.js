const express = require('express');
const cors = require('cors');
const router = express.Router();

const { json, append } = require('express/lib/response')
const { param } = require('express/lib/request');
const corsOptions = {
    origin: 'http://localhost:3001/teste',
    optionsSuccessStatus : 200
}

const { EnviarEmail } = require('../helper/SESClient.js');

router.use(cors())
router.use(express.json())

router.get("/teste123", async(req,res) => {
    await EnviarEmail("wpdcastro@gmail.com", "Titulo", "Resumo", "Conteudo");
    res.status(200).json({msg: "Teste ok", data: "response"});
});

module.exports = router;