const UserRepository = require('../repository/UserRepository');
const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async logar(email, password)
  {
    try {
      if (!email) throw Error("O campo e-mail/cpf é obrigatório");
      if (!password) throw Error("O campo senha é obrigatório");

      let filter = {};

      if (email.includes("@")) {
        filter.email = email;
      }

      const user = await this.repository.find(filter);

      if (user.length == 0) throw Error("Usuário não encontrado");
      const checkPass = await bcrypt.compare(password, user[0].password);
      if (!checkPass) throw Error("Senha inválida");

      const secret = process.env.SECRET;

      console.log(user);
      
      const token = jwt.sign({ 
        id: user[0]._id,
        email: user[0].email,
        telephones: user[0].telephones,
        created_at: user[0].created_at,
        modified_at: user[0].modified_at,
      }, secret,);

      if (!token) throw Error("Não foi possível gerar o token de autenticação");

      let retorno = {
        token : token,
        user_data: {
          id: user[0].id,
          email: user[0].email          
        }
      };

      console.log(retorno);
      return retorno;

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(user) {
      try {
        if (!user.name) throw new Error("O campo nome é obrigatório");
        if (user.confirmPassword != user.password) throw new Error("A senha e a confirmação de senha devem ser iguais");
        if (!user.password.match(/[A-Z]/)) throw new Error("A senha deve conter no mínimo uma letra maiúscula");
        if (!user.password.match(/[\W_]/)) throw new Error("A senha deve conter no mínimo um caracter especial");
        if (user.confirmPassword !== user.password) throw new Error("A senha e a confirmação de senha devem ser iguais");

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(user.password, salt)
        
        const userNew = new User({
          name: user.name,     
          email: user.email,
          password: passwordHash,
          telephones: user.telephones,
          created_at: new Date(),
          modified_at: new Date(),
        });

        const salvo = await this.repository.create(userNew);
        return salvo;

      } catch (error) {
        throw new Error(error.message);
      }
  };

}

module.exports = UserService;