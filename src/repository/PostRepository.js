const BaseRepository = require('./BaseRepository');
const Post = require('../models/Post');

class PostRepository extends BaseRepository {
    constructor() {
      super(Post);
    }

    async paginateAll(filtro) {
        const skip = filtro.itensPerPage * (filtro.page - 1);
        const limit = filtro.page;
      
        let query = {};

        if (filtro.descricao) query.descricao = { $regex: filtro.descricao, $options: 'i' };

        const count = await this.model.countDocuments(query);
        const results = await this.model
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      
        return {
          results,
          currentPage: filtro.page,
          totalPages: Math.ceil(count / filtro.itensPerPage),
          totalResults: count,
        };
    }
};

module.exports = PostRepository;