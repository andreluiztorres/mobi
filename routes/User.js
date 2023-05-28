const express = require('express')
const cors = require('cors')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { json, append } = require('express/lib/response')
const { param } = require('express/lib/request')

const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus : 200
}

router.use(cors())

router.use(express.json())

// Modelos
const User = require('../models/User')

// Registrar usuário
router.post('/save', async(req,res) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');
    const { nome, telefone, email, senha, confirma_senha } = req.body;
    
    if (!nome) return res.status(422).json({msg: "O campo nome é obrigatório"});
    if (!telefone) return res.status(422).json({msg: "O campo telefone é obrigatório"});
    if (!email) return res.status(422).json({msg: "O campo email é obrigatório"});
    if (!senha) return res.status(422).json({msg: "O campo senha é obrigatório"});
    if (!confirma_senha) return res.status(422).json({msg: "O campo confirma_senha é obrigatório"});
    if (senha !== confirma_senha) return res.status(422).json({msg: "As senhas não conferem"});

    const userExists = await User.findOne({email: email});

    if (userExists) return res.status(422).json({msg: "E-mail cadastrado, utilize outro e-mail"});

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(senha, salt)

    const user = new User({
        nome,
        telefone,        
        email,
        tipo: "cliente",
        senha: passwordHash,
    })

    try {
        await user.save()
        res.status(201).json({msg: "Usuário criado com sucesso"})
    } catch (error) {
        res.status(500).json({msg : error})
    }
})

// Buscar usuário por ID com validação de Token
router.get("/user/:id", checkToken, async(req,res) => {
    const id = req.params.id

    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({msg: "Usuário não encontrado"})
    }

    res.status(200).json({user})
})

function checkToken(req, res, next) {
    const authHeader = req.header('authorization')
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg: "Acesso negado"})
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()

    } catch (error) {
        res.status(400).json({msg: "Token inválido"})
    }
}

module.exports = router;