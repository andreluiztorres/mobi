const BaseRepository = require('./BaseRepository');
const Assinatura = require('./../models/Assinatura');

class AssinaturaRepository extends BaseRepository {
    constructor() {
        super(Assinatura);
    }

    async paginateAll(filtro) {
        const skip = filtro.limite * (filtro.pagina - 1);
        const limit = filtro.pagina;
      
        let query = {};

        if (filtro.descricao) query.descricao = { $regex: filtro.descricao, $options: 'i' };
        if (filtro.usuario) query.usuario = filtro.usuario;
        if (filtro.ativo) query.ativo = filtro.ativo;

        const count = await this.model.countDocuments(query);
        const results = await this.model
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      
        return {
          results,
          currentPage: filtro.pagina,
          totalPages: Math.ceil(count / filtro.limite),
          totalResults: count,
        };
    }

    async buscarPorUsuario(usuario) {

      let query = {};
      if (!usuario) throw new Error("Usuario inválido");
      query.usuario = usuario;
      query.ativo   = true;
      console.log('consulta', query)
      const result = await this.model.findOne(query);
      return result;
    }
};

module.exports = AssinaturaRepository;