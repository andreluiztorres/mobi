class BaseRepository {
    constructor(model) {
      this.model = model;
    }
  
    async findById(id) {
      try {
        const result = await this.model.findById(id);
        return result || null;
      } catch (error) {
        /*
        console.log("NAME:", error.name)
        if (error instanceof mongoose.CastError || error.name === 'NotFoundError') {
          return null;
        }

        */

        throw new Error(error.message);
      }
    }
  
    async findAll() {
      try {
        const result = await this.model.find();
        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    async create(data) {
      try {
        const result = await this.model.create(data);
        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    async update(id, data) {
      try {
        const result = await this.model.findByIdAndUpdate(id, data, { new: true });
        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    async delete(id) {
      try {
        const result = await this.model.findByIdAndDelete(id);
        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    }

    async remove(id) {
      try {
        const result = await this.model.findByIdAndUpdate(id, { data_remocao: new Date() }, { new: true });
        return result;
      } catch (error) {
        console.log(error.message)
        throw new Error(error.message);
      }
    }
}
  
module.exports = BaseRepository;