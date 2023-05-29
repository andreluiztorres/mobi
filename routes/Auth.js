const express = require('express');
const cors = require('cors');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use(cors());

router.use(express.json());

const User = require('../src/models/User');

router.post('/login', async (req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header');
    
    const {email, password} = req.body;
    console.log(req.body);

    if (!email) return res.status(422).json({msg: "O campo e-mail é obrigatório"});
    if (!password) return res.status(422).json({msg: "O campo senha é obrigatório"});
    
    const user = await User.findOne({email: email});
    if (!user) return res.status(404).json({msg: "Usuário não encontrado"});
    
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) return res.status(422).json({msg: "Senha inválida"});

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id, }, secret,);
        res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
    } catch (error) {
        console.log(error);
        res.status(500),json({
            msg: "Ocorreu um erro no servidor, tente mais tarde"
        });
    }

});

//module.exports = router;