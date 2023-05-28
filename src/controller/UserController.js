const express = require('express');
const cors = require('cors');
const UserService = require('./../service/UserService');
const User = require('./../models/User');
const router = express.Router();
const { geral, admin } = require('./Token.js');

const { json, append } = require('express/lib/response')
const { param } = require('express/lib/request');
const corsOptions = {
    origin: 'http://localhost:3001/user',
    optionsSuccessStatus : 200
}

const { UploadS3File } = require('../helper/S3Client.js');
const { EnviarEmail } = require('../helper/SESClient.js');

router.use(cors())
router.use(express.json())
// Registrar usuário

router.post('/save', async(req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    try {

        const service = new UserService();
        const salvo = await service.create(req.body);
        
        console.log("user criado");
        console.log(salvo);

        res.status(201).json({msg: "Usuário criado com sucesso", data: salvo});

    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.put('/update', geral, async(req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    const { nome, telefone, email, senha, confirma_senha } = req.body;

    try {

        const user = new User({
            nome,
            telefone,        
            email,
            tipo: "cliente",
            senha: senha,
            confirma_senha: confirma_senha
        })

        const service = new UserService();
        const salvo = await service.update(user);
        
        console.log("user criado");
        console.log(salvo);

        res.status(201).json({msg: "Usuário atualizado com sucesso", data: salvo});

    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.get("/:id", geral, async(req,res) => {
    const id = req.params.id;
    const service = new UserService();
    const salvo = await service.findById(id);
    if (!salvo) return res.status(404).json({ msg: "Usuário não encontrado" });
    res.status(200).json({ salvo });
});

router.post("/remove", geral, async(req,res) => {
    try {
        const id = req.body.id;
        console.log("ID: " + id)
        const service = new UserService();
        const salvo  = await service.remove(id);
        res.status(201).json({});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.post("/paginate", geral, async(req,res) => {
    try
    {
        const service = new UserService();
        const paginador = await service.paginate(req.body);
        res.status(200).json({ data: paginador.results, currentPage: paginador.currentPage, totalPages: paginador.totalPages, totalResults: paginador.totalResults });
    }
    catch(error)
    {
        res.status(500).json({msg : error.message});
    }
});

router.post("/esqueci", async(req,res) => {
    try
    {
        const service = new UserService();
        await service.recureparSenha(req.body);
        res.status(200).json({ data: "E-mail enviado com sucesso!" });
    }
    catch(error)
    {
        res.status(500).json({msg : error.message});
    }
});


//const ses = require('../microservices/AWS/SES');

router.post('/s3', async(req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    console.log("Firefly");

    try {
        var response = await UploadS3File(req.body.file, "documentos/2de82f6d-1c54-4197-8950-9e11bf07bbc2/rg_frente");
        console.log(response);
        res.status(200).json({msg: "File salvo com sucesso", data: response});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.post('/ses', async(req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    try {
        /*
        var response = await ses.enviarEmail("wpdcastro@gmail.com", "Titulo", "Resumo", "Conteudo");
        console.log(response);
        */
        res.status(200).json({msg: "Email salvo com sucesso", data: "response"});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.get("/teste123", async(req,res) => {
    await EnviarEmail("wpdcastro@gmail.com", "Titulo", "Resumo", "Conteudo");
    res.status(200).json({msg: "Teste ok", data: "response"});
});


module.exports = router;