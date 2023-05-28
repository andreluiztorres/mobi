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

  async logar(email, senha)
  {
    try {
      if (!email) throw Error("O campo e-mail/cpf é obrigatório");
      if (!senha) throw Error("O campo senha é obrigatório");

      let filter = {};

      if (email.includes("@")) {
        filter.email = email;
      } else {
        filter.cpf = email.replace(/\D/g, '');
      }

      const user = await this.repository.find(filter);

      if (user.length == 0) throw Error("Usuário não encontrado");
      const checkPass = await bcrypt.compare(senha, user[0].senha);
      if (!checkPass) throw Error("Senha inválida");

      const secret = process.env.SECRET;

      console.log(user);
      
      const token = jwt.sign({ id: user[0]._id, role: user[0].tipo }, secret,);

      if (!token) throw Error("Não foi possível gerar o token de autenticação");

      let retorno = {
        token : token,
        user_data: {
          id: user[0].id,
          role: user[0].tipo,
          nome: user[0].primeiro_nome + " " + user[0].sobrenome
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
        const userExists = await this.paginate({email: user.email});
        console.log("USER EXISTS", userExists.totalResults);
        if (userExists.totalResults > 0) throw new Error("E-mail cadastrado, utilize outro e-mail"); // 422 - Unprocessable Entity

        if (!user.name) throw new Error("O campo nome é obrigatório");
        if (user.confirm_password != user.password) throw new Error("A senha e a confirmação de senha devem ser iguais");
        if (!user.password.match(/[A-Z]/)) throw new Error("A senha deve conter no mínimo uma letra maiúscula");
        if (!user.password.match(/[\W_]/)) throw new Error("A senha deve conter no mínimo um caracter especial");
        if (user.confirm_password !== user.password) throw new Error("A senha e a confirmação de senha devem ser iguais");

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(user.senha, salt)
        
        const userNew = new User({
          name: user.name,     
          email: user.email,
          password: passwordHash,
          telephones: user.telephones
        });

        const salvo = await this.repository.create(userNew);
        return salvo;

      } catch (error) {
        throw new Error(error.message);
      }
  };

}

module.exports = UserService;