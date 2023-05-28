const express = require('express');
const cors = require('cors');
const PlanoService = require('./../service/PlanoService');
const Plano = require('./../models/Plano');
const router = express.Router();
const { json, append } = require('express/lib/response')
const { param } = require('express/lib/request');
const { geral, admin } = require('./Token.js');

const corsOptions = {
    origin: 'http://localhost:3001/plano',
    optionsSuccessStatus : 200
}

router.use(cors())
router.use(express.json())
// Registrar usuário

router.post('/save', admin, async (req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    const { descricao, preco, preco_idoso, preco_crianca, preco_adulto } = req.body;

    try {

        const plano_novo = new Plano({
            descricao,
            preco,        
            preco_idoso,
            preco_crianca,
            preco_adulto,
            data_criacao: new Date(),
        });

        console.log("Criando plano");
        

        const planoService = new PlanoService();
        const plano_salvo = await planoService.create(plano_novo);
        
        res.status(201).json({msg: "Usuário criado com sucesso", data: plano_salvo});

    } catch (error) {
        res.status(500).json({msg : error});
    }
})

router.get("/:id", geral, async(req,res) => {
    const id = req.params.id;
    console.log("ID: " + id);
    const planoService = new PlanoService();
    const plano_salvo = await planoService.findById(id);
    if (!plano_salvo) return res.status(404).json({ msg: "Plano não encontrado" });
    res.status(200).json({plano_salvo});
});

router.put("/update", admin, async(req,res) => {

    const { id } = req.body;

    try {
        if (!id) return res.status(422).json({msg: "O campo id é obrigatório"});
        const planoService = new PlanoService();
        const plano_salvo = await planoService.update(req.body);

        if (!plano_salvo) return res.status(404).json({ msg: "Plano não encontrado" });

        res.status(201).json({plano_salvo});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.post("/remove", admin, async(req,res) => {
    try {
        console.log("Removendo plano")
        console.log(req.body)
        const id = req.body.id;
        console.log("ID: " + id)
        const planoService = new PlanoService();
        const plano_salvo = await planoService.remove(id);
        res.status(201).json({});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.post("/paginate", geral, async(req,res) => {
    try
    {
        const planoService = new PlanoService();
        const paginador = await planoService.paginate(req.body);
        res.status(200).json({ data: paginador.results, currentPage: paginador.currentPage, totalPages: paginador.totalPages, totalResults: paginador.totalResults });
    }
    catch(error)
    {
        res.status(500).json({msg : error.message});
    }
});

module.exports = router;