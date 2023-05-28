const BannerRepository = require('../repository/BannerRepository');
const GerarHashS3 = require('../helper/GerarHashS3');
const { UploadS3File, GetUrl, RemoverS3 } = require('../helper/S3Client');
const Banner = require('../models/Banner');

class BannerService {
  constructor() {
    this.repository = new BannerRepository();
  }

  async paginate(filtro) {
      try {
          const planos = await this.repository.paginateAll(filtro);
          return planos;
      } catch (error) {
        throw new Error(error.message);
      }
  };

  async paginateDash(filtro) {
    try {
        var planos = await this.repository.paginateAll(filtro);
        
        let conteudo = [];

        if (planos.results.length > 0) {
          planos.results.forEach(plano => {
            conteudo.push(plano.imagem);
          });
        }

        planos.results = conteudo;
        return planos;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async findById(id) {
    try {
      let banner = await this.repository.findById(id);

      console.log("Banner encontrado:: ")
      console.log(banner)
      banner.image = await GetUrl(banner.imagem);
      console.log("Banner encontrado image : ", banner.image)
      return {
        id: banner.id,
        descricao: banner.descricao,
        image: banner.image,
        dataDe: banner.dataDe,
        dataAte: banner.dataAte,
        ativo: banner.ativo
      };

    } catch (error) {
      throw new Error(error.message);
    }
  };

  async create(banner) {
    try {
      if (!banner.descricao) throw new Exception("O campo descricao é obrigatório");
      if (!banner.imagem) throw new Exception("O campo imagem é obrigatório");

      console.log("Gerando Banner")

      const s3path = await this.UploadImage(banner.imagem);

      const bannerNovo = new Banner({
        descricao : banner.descricao,
        imagem: s3path,        
        dataDe: banner.dataDe,
        dataAte: banner.dataAte,
        ativo: banner.ativo,
        data_criacao: new Date()
      });

      return await this.repository.create(bannerNovo);

    } catch (error) {
      throw new Error(error.message);
    }
  };

  async update(banner) {
    try {
      if (!banner.id) throw new Exception("O campo id é obrigatório");
      if (!banner.descricao) throw new Exception("O campo descricao é obrigatório");
      if (!banner.imagem) throw new Exception("O campo imagem é obrigatório");

      const bannerAntigo = await this.repository.findById(banner.id);
      if (!bannerAntigo) throw new Exception("Banner não encontrado");

      if (banner.image.find("base64")) {
        const s3path = UploadImage(base64, bannerAntigo.imagem);
        banner.image = s3path;
      }

      return await this.repository.update(banner.id, banner);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async remove(id) {
    try {
      await this.repository.remove(id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async delete(id) {
    try {

      if (id == null) throw new Error("O campo id é obrigatório");

      let salvo = await this.repository.findById(id);

      console.log("Remover Banner");
      console.log(salvo)

      await RemoverS3(salvo.imagem);

      await this.repository.delete(id);

    } catch (error) {
      throw new Error(error.message);
    }
  };


  async UploadImage(base64, s3path = "") {
    try {
      console.log("UploadImage")
      if (s3path == "") s3path = "banners/" + GerarHashS3();
      const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const type = base64.split(';')[0].split('/')[1];
      s3path = s3path + "." + type;
      await UploadS3File(base64Data, type, s3path);
      return s3path;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = BannerService;