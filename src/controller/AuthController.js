const express = require('express');
const cors = require('cors');
const UserService = require('../service/UserService');
const router = express.Router();
router.use(cors())
router.use(express.json())


router.post('/login', async (req, res, next) => {

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');

    try
    {
        const {email, senha} = req.body;
        const service = new UserService();
        const token = await service.logar(email, senha);
        res.status(200).json(token);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

function checkToken(req, res, next) {
    const authHeader = req.header('authorization')
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) return res.status(401).json({msg: "Acesso negado"})

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        res.status(400).json({msg: "Token inválido"})
    }
}

module.exports = router;