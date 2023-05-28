const express = require('express');
const cors = require('cors');
const BannerService = require('../service/BannerService');
const Banner = require('./../models/Banner');
const router = express.Router();
const bcrypt = require('bcrypt');
const { geral, admin } = require('./Token.js');

const { json, append } = require('express/lib/response')
const { param } = require('express/lib/request');
const corsOptions = {
    origin: 'http://localhost:3001/banner',
    optionsSuccessStatus : 200
}

router.use(cors())
router.use(express.json())
// Registrar usuário

router.post('/save', geral, async(req,res) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    try {
        const service = new BannerService();
        const salvo = await service.create(req.body); 
        res.status(201).json({msg: "Banner criado com sucesso", data: salvo});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
})

router.get("/:id", geral, async(req,res) => {
    try {
    const id = req.params.id;
    const bannerService = new BannerService();
    const banner = await bannerService.findById(id);
    if (!banner) return res.status(404).json({ msg: "banner não encontrado" });
    res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.put("/update", geral, async(req,res) => {
    try {
        const service = new BannerService();
        const banner_salvo = await service.update(req.body);
        if (!banner_salvo) return res.status(404).json({ msg: "banner não encontrado" });
        res.status(201).json({banner_salvo});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.delete("/remove/:id", geral, async(req,res) => {
    try {
        const id = req.params.id;
        const bannerService = new BannerService();
        await bannerService.delete(id);
        res.status(201).json({});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
});

router.post("/paginate", async(req,res) => {
    try
    {
        const bannerService = new BannerService();
        const paginador = await bannerService.paginate(req.body);
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
        const bannerService = new BannerService();
        const paginador = await bannerService.paginateDash(req.body);
        res.status(200).json({ data: paginador.results, currentPage: paginador.currentPage, totalPages: paginador.totalPages, totalResults: paginador.totalResults });
    }
    catch(error)
    {
        res.status(500).json({msg : error.message});
    }
});

module.exports = router;