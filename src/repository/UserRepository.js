const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async paginateAll(filtro) {
        const skip = filtro.itensPerPage * (filtro.page - 1);
        const limit = filtro.page;
      
        let query = {};
        if (filtro.email) query.email = { $regex: filtro.email, $options: 'i' };

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

    async find(filtro) {
        let query = {};
        if (filtro.email) query.email = { $regex: filtro.email, $options: 'i' };
        return await this.model.find(query);
    }
};

module.exports = UserRepository;