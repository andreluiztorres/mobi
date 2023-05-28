const AssinaturaRepository = require('../repository/AssinaturaRepository');
const AssinaturaDependenteRepository = require('../repository/AssinaturaDependenteRepository');
const PlanoRepository = require('../repository/PlanoRepository');
const UserRepository = require('../repository/UserRepository');
const UserService = require('../service/UserService');
const mongoose = require('mongoose');
const AssinaturaDependente = require('../models/AssinaturaDependente');
const Assinatura = require('../models/Assinatura');

class AssinaturaService {
  constructor() {
    this.repository      = new AssinaturaRepository();
    this.dependenteRepository = new AssinaturaDependenteRepository();
    this.planoRepository = new PlanoRepository();
    this.userRepository  = new UserRepository();
    this.userService     = new UserService();
  }

  async paginate(filtro) {
    try {
      if (!filtro.pagina) throw Error("O campo pagina é obrigatório");
      if (!filtro.limite) throw Error("O campo limite é obrigatório");

      const assinaturas = await this.repository.paginateAll(filtro);
      return assinaturas;
      
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async findById(id) {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async create(assinatura) {

    const session = await mongoose.startSession();

    try {
      if (!assinatura.plano) throw Error("O campo plano é obrigatório");
      if(!assinatura.usuario) throw Error("usuario é obrigatório");

      const usuario = await this.userService.findById(assinatura.usuario);
      if(!usuario) throw Error("usuario não encontrado");

      if (!usuario.nome)       throw Error("O campo nome é obrigatório");
      //if (!usuario.telefone)   throw Error("O campo telefone é obrigatório");
      if (!usuario.email)      throw Error("O campo email é obrigatório");
      if (!usuario.doc_frente) throw Error("O campo doc_frente é obrigatório");
      if (!usuario.doc_fundo)  throw Error("O campo doc_fundo é obrigatório");

      await session.withTransaction(async () => {
        
        await this.checarPlano(assinatura.plano);
        await this.cancelarAssinaturaInterno(usuario.id);

        const s3path = "assinatura/" + GerarHashS3();
        const rgFrete = await this.UploadImage(assinatura.doc_frente, s3path + "/rg_frete" + GerarHashS3());
        const rgFundo = await this.UploadImage(assinatura.doc_fundo, s3path + "/rg_fundo" + GerarHashS3());

        assinatura.ativo = true;
        
        var userSalvo = await this.userRepository.findById(assinatura.usuario);
        userSalvo.doc_frente = rgFrete;
        userSalvo.doc_fundo = rgFundo;
        userSalvo = await this.userRepository.update(userSalvo.id, userSalvo);

        const assinaturaSalvar = new Assinatura ({
          "plano": assinatura.plano,
          "usuario": userSalvo.id,
          "data_criacao": new Date(),
          "ativo": true,
          "preco_final": assinatura.preco_final
        });

        const salvo = await this.repository.create(assinaturaSalvar);

        console.log(salvo);

        const dependentesSalvos = [];

        if (assinatura.dependentes != null) {
          await assinatura.dependentes.forEach(async dependente => {
            try {
              if (!dependente.primeiro_nome) throw Error("O campo primeiro_nome é obrigatório");
              if (!dependente.sobrenome) throw Error("O campo sobrenome é obrigatório");
              if (!dependente.telefone) throw Error("O campo telefone é obrigatório");
              if (!dependente.email) throw Error("O campo email é obrigatório");
              if (!dependente.doc_frente) throw Error("O campo doc_frente é obrigatório");
              if (!dependente.doc_fundo) throw Error("O campo doc_fundo é obrigatório");
              
              console.log("CRIANDO UM NOVO USUARIO")
              const s3pathRgFrete = await this.UploadImage(dependente.doc_frente, s3path + "/rg_frete" + GerarHashS3());
              const s3pathRgFundo = await this.UploadImage(dependente.doc_fundo, s3path + "/rg_fundo" + GerarHashS3());
              
              const novoUsuario = {
                "primeiro_nome": dependente.primeiro_nome,
                "sobrenome": dependente.sobrenome,
                "telefone": dependente.telefone,
                "ddd": dependente.ddd,
                "email": dependente.email,
                "doc_frente": s3pathRgFrete,
                "doc_fundo": s3pathRgFundo,
                "tipo": "dependente",
                "data_criacao": new Date()
              };

              console.log(novoUsuario)

              const userSalvo = await this.userRepository.create(novoUsuario);
              dependentesSalvos.push(userSalvo._id);

            } catch (error) {
              throw Error(error.message);
            }
          });

          const dependenteSalvar = {
            data_criacao: new Date(),
            assinatura: salvo._id,
            dependentes: dependentesSalvos
          };

          await this.dependenteRepository.create(dependenteSalvar);
        }

        salvo.dependentes = dependentesSalvos;
        return salvo;
      });

    } catch (error) {
      console.log("ERROR: ", error.message)
      throw Error(error.message);
    } finally {
      await session.endSession();
    }
  };

  async update(plano) {
    try {
      const plano_salvo = await this.repository.update(plano.id, plano);
      return plano_salvo;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async remove(plano_id) {
    try {
      await this.planoRepository.remove(plano_id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async cancelarAssinaturaInterno(usuarioId) {
    try 
    {
      const assinatura = await this.repository.buscarPorUsuario(usuarioId);
      if (!Object.is(assinatura, null)) {
        assinatura.ativo = false;
        await this.repository.update(assinatura.id, assinatura);
      }
    }
    catch (error) {
      throw Error(error.message);
    }
  }

  async cancelarAssinatura(usuarioId) {
    try 
    {
      const assinatura = await this.repository.buscarPorUsuario(usuarioId);
      if (Object.is(assinatura, null)) throw new Error("Assinatura não encontrada.");
      assinatura.ativo = false;
      await this.repository.update(assinatura.id, assinatura);
    }
    catch (error) {
      throw Error(error.message);
    }
  }

  async checarPlano(plano) {

    try 
    {
      const planoSalvo = await this.planoRepository.findById(plano);
      if (!planoSalvo) throw Error("Plano não encontrado.");
      return planoSalvo;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removerDependentes(dependentes, assinatura) {
    try 
    {
      if (Object.is(dependentes, null)) throw new Error("Dependentes inválidos.");

      dependentes.forEach(async dependente => {
        const dependenteSalvo = await this.dependenteRepository.findById({ "dependente": dependente, "assinatura": assinatura });
        if (Object.is(dependenteSalvo, null)) throw new Error("Dependente não encontrado.");
        dependenteSalvo.ativo = false;
        await this.userRepository.update(dependenteSalvo._id, dependenteSalvo);
      });

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async adicionarDependentes(dependentes, assinatura) {
    try 
    {
      if (Object.is(dependentes, null)) throw new Error("Dependentes inválidos.");
      
      const dependentesSalvos = [];

      dependentes.forEach(async dependente => {
        if (!dependente.primeiro_nome) throw Error("O campo primeiro_nome é obrigatório");
        if (!dependente.sobrenome) throw Error("O campo sobrenome é obrigatório");
        if (!dependente.telefone) throw Error("O campo telefone é obrigatório");
        if (!dependente.email) throw Error("O campo email é obrigatório");
        if (!dependente.doc_frente) throw Error("O campo doc_frente é obrigatório");
        if (!dependente.doc_fundo) throw Error("O campo doc_fundo é obrigatório");

        const novoUsuario = {
          "primeiro_nome": dependente.primeiro_nome,
          "sobrenome": dependente.sobrenome,
          "telefone": dependente.telefone,
          "ddd": dependente.ddd,
          "email": dependente.email,
          "doc_frente": dependente.doc_frente,
          "doc_fundo": dependente.doc_fundo,
          "tipo": "dependente",
          "data_criacao": new Date()
        };

        const userSalvo = await this.userRepository.create(novoUsuario);
        dependentesSalvos.push(userSalvo._id);
      });

      if (dependentesSalvos.length > 0) {
        const assinaturaSalva = await this.repository.findById(assinatura);
        assinaturaSalva.dependentes = dependentes.pushAll(dependentesSalvos);
        await this.repository.update(assinaturaSalva._id, assinaturaSalva);
      }

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async UploadImage(base64, s3path) {
    try {
      const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const type = base64.split(';')[0].split('/')[1];
      s3path = s3path + "." + type;
      await UploadS3File(base64Data, type, s3path);
      return s3path;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = AssinaturaService;