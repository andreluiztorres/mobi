const PlanoService = require('../../src/service/PlanoService');
const Plano = require('../../models/Plano');
const mocks = require('../mocks/mocks');
const {MongoClient} = require('mongodb');

const plano = new Plano({
    descricao: 'Plano Mock',
    preco: 100.00,
    preco_idoso: 100.00,
    preco_adulto: 100.00,
    preco_crianca: 100.00
});

describe('unit plano', () => {

    /*
    jest.setTimeout(15000);


    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(`mongodb+srv://andretorresti:n6t9FLUfudz6Vxlq@cluster0.ztzcveh.mongodb.net/?retryWrites=true&w=majority`
        , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db('test');
    });
    
    afterAll(async () => {
    await connection.close();
    });
    */

    /*
    afterAll(async () => {
        // Aqui você remove todos os planos criados durante o teste
        await Plano.deleteMany({});
    });

    afterEach(async () => {
        server.close();
    });

    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/planos', { useNewUrlParser: true, useUnifiedTopology: true });
        const service = new PlanoService();
    });
    */
    const service = new PlanoService();

    describe ('criar-plano', () => {

        //let service;
        let dbConnection;
        /*
        beforeAll(async () => {
            // Inicializa a conexão com o banco de dados
            dbConnection = await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
            // Cria uma instância do serviço de plano
            service = new PlanoService();
        });
        */

        it('Criar plano s/ preco_adulto', async () => {   

            var planoMock = JSON.parse(JSON.stringify(plano));
            delete planoMock.preco_adulto;

            try {
              await service.create(planoMock);
            } catch (error) {
              expect(error.message).toBe('O campo preco_adulto é obrigatório');
            }
        });

        it('Criar plano s/ preco_idoso', async () => {   

            var planoMock = JSON.parse(JSON.stringify(plano));
            delete planoMock.preco_idoso;

            try {
              await service.create(planoMock);
            } catch (error) {
              expect(error.message).toBe('O campo preco_idoso é obrigatório');
            }
        });

        it('Criar plano s/ preco_crianca', async () => {   

            var planoMock = JSON.parse(JSON.stringify(plano));
            delete planoMock.preco_crianca;

            try {
              await service.create(planoMock);
            } catch (error) {
              expect(error.message).toBe('O campo preco_crianca é obrigatório');
            }
        });

        it('Criar plano s/ preco', async () => {   

            var planoMock = JSON.parse(JSON.stringify(plano));
            delete planoMock.preco;

            try {
              await service.create(planoMock);
            } catch (error) {
              expect(error.message).toBe('O campo preco é obrigatório');
            }
        });

        it('Criar plano s/ descricao', async () => {   

            var planoMock = JSON.parse(JSON.stringify(plano));
            delete planoMock.descricao;

            try {
              await service.create(planoMock);
            } catch (error) {
              expect(error.message).toBe('O campo descricao é obrigatório');
            }
        });

        /*
        it('Deve criar um plano', async () => {   
            jest.setTimeout(150000);
            const resultado = await service.create(plano);
            expect(resultado.descricao).toBe('Plano Mock');
            expect(resultado.preco).toBe(100.00);
            expect(resultado.preco_idoso).toBe(100.00);
            expect(resultado.preco_adulto).toBe(100.00);
            expect(resultado.preco_crianca).toBe(100.00);
        });
        */
    });

    /*
    describe ('editar-plano', () => {
        it('Deve editar um plano', async () => {   
            const resultado = await service.update(plano);
            expect(resultado.descricao).toBe('Plano Mock');
            expect(resultado.preco).toBe(100.00);
            expect(resultado.preco_idoso).toBe(100.00);
            expect(resultado.preco_adulto).toBe(100.00);
            expect(resultado.preco_crianca).toBe(100.00);
        });
    });
    */


        /*
        it('Criar plano s/ nome', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            delete(plano.nome);

            var resultado = service.criarPlano(plano);

            expect(resultado.nome).toBe('Plano 1');
            expect(resultado.valor).toBe(100.00);
            expect(resultado.descricao).toBe('Plano 1');
        });
    });

    describe ('get-plano', () => {

        it('get plano', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            const planoSalvo = service.create(plano);
            const resultadoFind = service.findById(planoSalvo.id);

            expect(resultadoFind.id).toBe(planoSalvo.id);
        });
    });

    describe ('editar-plano', () => {

        it('Deve criar um plano', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            var resultado = service.criarPlano(plano);

            expect(resultado.nome).toBe('Plano 1');
            expect(resultado.valor).toBe(100.00);
            expect(resultado.descricao).toBe('Plano 1');
        });

        it('Criar plano s/ nome', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            var resultado = service.criarPlano(plano);

            expect(resultado.nome).toBe('Plano 1');
            expect(resultado.valor).toBe(100.00);
            expect(resultado.descricao).toBe('Plano 1');
        });

        it('Criar plano s/ valor', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            var resultado = service.criarPlano(plano);

            expect(resultado.nome).toBe('Plano 1');
            expect(resultado.valor).toBe(100.00);
            expect(resultado.descricao).toBe('Plano 1');
        });
    });

    describe ('remover-plano', () => {

        it('Deve criar um plano', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            var resultado = service.criarPlano(plano);

            expect(resultado.nome).toBe('Plano 1');
            expect(resultado.valor).toBe(100.00);
            expect(resultado.descricao).toBe('Plano 1');
        });

        it('Criar plano s/ nome', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            var resultado = service.criarPlano(plano);

            expect(resultado.nome).toBe('Plano 1');
            expect(resultado.valor).toBe(100.00);
            expect(resultado.descricao).toBe('Plano 1');
        });

        it('Criar plano s/ valor', () => {   

            const plano = new Plano({
                nome: 'Plano 1',
                valor: 100.00,
                descricao: 'Plano 1'
            });

            var resultado = service.criarPlano(plano);

            expect(resultado.nome).toBe('Plano 1');
            expect(resultado.valor).toBe(100.00);
            expect(resultado.descricao).toBe('Plano 1');
        });
            */


    /*

    */
});