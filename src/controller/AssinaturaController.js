const express = require('express')
const cors = require('cors')
const router = express.Router()
const AssinaturaService = require('../service/AssinaturaService');
const { geral, admin } = require('./Token.js');

const corsOptions = {
    origin: 'http://localhost:3001/assinatura',
    optionsSuccessStatus : 200
}

router.use(cors());
router.use(express.json());


router.post('/save', admin, async(req,res) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    try {
        const service = new AssinaturaService();
        var result = await service.create(req.body);
        res.status(201).json({msg: "Assinatura realizada com sucesso."});

    } catch (error) {
        res.status(500).json({msg : error.message})
    }
});

router.post("/paginate", geral, async(req,res) => {
    try {
        const { pagina, limite, usuario } = req.body;
        
        const filter = {
            pagina: pagina,
            limite: limite,
            usuario: usuario
        };
        
        const service = new AssinaturaService();
        const result = await service.paginate(filter);

        res.status(200).json(result);
    } catch (error) { 
        res.status(500).json({msg : error.message });
    }
});

router.delete("/cancelar", admin, async(req,res) => {
    try {
        const { usuario } = req.body; 
        const service = new AssinaturaService();
        await service.cancelarAssinatura(usuario);
        console.log("deu boa");
        res.status(201).json({msg: "Assinatura cancelada com sucesso."});
    } catch (error) { 
        console.log(error.message)
        res.status(500).json({msg: error.message});
    }
});

module.exports = router