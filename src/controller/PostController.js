const express = require('express');
const cors = require('cors');
const PostService = require('../service/PostService');
const Post = require('./../models/Post');
const router = express.Router();
const { geral, admin } = require('./Token.js');
const { json, append } = require('express/lib/response')
const { param } = require('express/lib/request');
const corsOptions = {
    origin: 'http://localhost:3001/post',
    optionsSuccessStatus : 200
}

router.use(cors())
router.use(express.json())
// Registrar usuário

router.post('/save', geral, async(req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    try {
        const service = new PostService();
        const salvo = await service.create(req.body);
        res.status(201).json({msg: "Post criado com sucesso", data: salvo});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
})

router.get("/:id", geral, async(req,res) => {
    const id = req.params.id;
    console.log("ID: " + id);
    const service = new PostService();
    const salvo = await service.findById(id);
    if (!salvo) return res.status(404).json({ msg: "Post não encontrado" });
    res.status(200).json({salvo});
});

router.put("/update", geral, async(req,res) => {

    const { id } = req.body;

    try {
        if (!id) return res.status(422).json({msg: "O campo id é obrigatório"});
        const service = new PostService();
        const salvo = await service.update(req.body);
        if (!salvo) return res.status(404).json({ msg: "post não encontrado" });
        res.status(201).json({salvo});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.post("/remove", geral, async(req,res) => {
    try {
        const id = req.body.id;
        const service = new PostService();
        await service.remove(id);
        res.status(201).json({msg: "Post removido com sucesso"});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.post("/paginate", async(req,res) => {
    try
    {
        const service = new PostService();
        const paginador = await service.paginate(req.body);
        res.status(200).json({ data: paginador.results, currentPage: paginador.currentPage, totalPages: paginador.totalPages, totalResults: paginador.totalResults });
    }
    catch(error)
    {
        res.status(500).json({msg : error.message});
    }
});

router.post("/paginateDash", admin, async(req,res) => {
    try
    {
        const service = new PostService();
        const paginador = await service.paginate(req.body);
        res.status(200).json({ data: paginador.results, currentPage: paginador.currentPage, totalPages: paginador.totalPages, totalResults: paginador.totalResults });
    }
    catch(error)
    {
        res.status(500).json({msg : error.message});
    }
});

module.exports = router;