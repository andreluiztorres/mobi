const PostRepository = require('../repository/PostRepository');

class PostService {
  constructor() {
    this.repository = new PostRepository();
  }

  async paginate(filtro) {
      try {
          const planos = await this.repository.paginateAll(filtro);
          return planos;
      } catch (error) {
        throw new Error(error.message);
      }
  };

  async findById(id) {
    try {
      const post = await this.repository.findById(id);
      return post;

    } catch (error) {
      throw new Error(error.message);
    }
  };

  async create(plano) {
      try {
        console.log("SALVANDO post")
        if (!plano.titulo) throw new Error("O campo titulo é obrigatório");
        if (!plano.conteudo) throw new Error("O campo conteudo é obrigatório");
        if (!plano.midia) throw new Error("O campo midia é obrigatório");

        const planoSalvo = await this.repository.create(plano);
        console.log("Post salvo ------------------------------");
        console.log(planoSalvo);
        return planoSalvo;
      } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
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
      await this.repository.remove(plano_id);
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = PostService;