const UserService = require('../../src/service/UserService');
const User = require('../../src/model/User');
const service = new UserService();

describe('unit user', () => {
    /*
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/planos', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    describe ('get-user', () => {
        before(async () => {
            const user = new User({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            service.create(user);
        });

        it('find by email', () => {   
            const result = service.find({ email: "teste@teste.com"});
            expect(result).not.toBeNull();
            expect(result.email).toBe("teste@teste.com");
        });

        it('paginate', () => {   
            const result = service.paginate({});
            expect(result).not.toBeNull();
            expect(result.paginador.results.length).toBe(1);
        });
    });

    describe ('create-user', () => {
        it('create', () => {   
            service.create = jest.fn().mockReturnValue({ email: "teste@teste.com"});
            const result = service.create({ email: "teste@teste.com"});
            expect(result).not.toBeNull();
            expect(result.email).toBe("teste@teste.com");
        });
    });

    describe ('update-user', () => {
        it('find by email', () => {   
            const result = service.find({ email: "teste@teste.com"});
            expect(result).not.toBeNull();
            expect(result.email).toBe("teste@teste.com");
        });
    });
    */
});