const PlanoRepository = require('../repository/PlanoRepository');

class PlanoService {
  constructor() {
    this.planoRepository = new PlanoRepository();
  }

  async paginate(filtro) {
      try {
          const planos = await this.planoRepository.paginateAll(filtro);
          return planos;
      } catch (error) {
        throw new Error(error.message);
      }
  };

  async findById(id) {
    try {
      const plano = await this.planoRepository.findById(id);
      return plano;

    } catch (error) {
      throw new Error(error.message);
    }
  };

  async create(plano) {
      try {
        if (!plano.descricao)     throw new Error("O campo descricao é obrigatório");
        if (!plano.preco)         throw new Error("O campo preco é obrigatório");
        if (!plano.preco_idoso)   throw new Error("O campo preco_idoso é obrigatório");
        if (!plano.preco_crianca) throw new Error("O campo preco_crianca é obrigatório");
        if (!plano.preco_adulto)  throw new Error("O campo preco_adulto é obrigatório");

        const plano_salvo = await this.planoRepository.create(plano);
        return plano_salvo;
      } catch (error) {
        throw new Error(error.message);
      }
  };

  async update(plano) {
    try {
      const plano_salvo = await this.planoRepository.update(plano.id, plano);
      return plano_salvo;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async remove(plano_id) {
    try {
      console.log("Removendo plano service")
       
      await this.planoRepository.remove(plano_id);
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = PlanoService;