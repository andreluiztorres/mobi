const BaseRepository = require('./BaseRepository');
const AssinaturaDependente = require('./../models/AssinaturaDependente');

class AssinaturaDependenteRepository extends BaseRepository {
    constructor() {
      super(AssinaturaDependente);
    }
};

module.exports = AssinaturaDependenteRepository;