import request from 'supertest';
import app from '../../src/app'

const MOCK_CADASTRO_ADMIN = {
  name: 'jose',
  email: 'dados@hotmail.com',
  password: '123456'
}

const MOCK_LOGIN = {
  email: "dados@hotmail.com",
  password: "123456"
}
const MOCK_CADASTRO_PESSOA = {
  firstname: 'jose',
  lastname: 'ali',
  participation: 55
}
const MOCK_CADASTRO_FAIL = {
  firstname: 'jose',
  lastname: 'ali',
  participation: 101
}
const MOCK_UPDATE_PESSOA = {
  firstname: 'jose',
  lastname: 'ali',
  participation: 49
}
const MOCK_UPDATE_FAIL = {
  firstname: 'jose',
  lastname: 'ali',
  participation: '45'
}
let token = ""
let idAdmin = ''
let MOCK_ID = ''

describe.only('Dados', () => {
  it('deve ser cadastrado admin', async () => {
    const response = await request(app)
      .post('/admins')
      .send(MOCK_CADASTRO_ADMIN);
    // pega id do usuario cadastrado e seta variavel id 
    idAdmin = response.body.id;
    expect(response.statusCode).toEqual(200)
  });

  it('deve logar se email existir', async () => {
    const response = await request(app)
      .post('/login')
      .send(MOCK_LOGIN);
    token = response.body.token
    console.log(token)
    expect(response.statusCode).toEqual(200)
  });
  it('deve ser cadastrado dadosPessoa', async () => {

    const response = await request(app)
      .post('/dados')
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_CADASTRO_PESSOA);
    MOCK_ID = response.body
    //se cadastrou espera que retorne statuscode 200
    expect(response.statusCode).toEqual(200)
  });
  it('nao deve ser cadastrado dadosPessoa(participation acima de 100%', async () => {

    const response = await request(app)
      .post('/dados')
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_CADASTRO_PESSOA);

    expect(response.body).toEqual('Porcentagem nao pode ultrapassar 100 porcento.')
  });

  it('deve listar itens', async () => {
    const response = await request(app)
      .get('/dados')
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  });
  
  it('nao deve ser cadastrado se campo participation maior de 100%', async () => {

    const response = await request(app)
      .post('/dados')
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_CADASTRO_FAIL);
    
    expect(response.body.error).toEqual("Validacao Falhou")
  });
  

  it('deve atualizar item cadastrado', async () => {
    const response = await request(app)
      .put(`/dados/${MOCK_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_UPDATE_PESSOA);
    console.log("up", response.body)
    expect(response.body).toEqual(MOCK_UPDATE_PESSOA)
  });

  it('nao deve atualizar item cadastrado se participation for string', async () => {

    const response = await request(app)
      .put(`/dados/${MOCK_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_UPDATE_FAIL);

    console.log("erro = ", response.body)

  });

  it('deve deletar item cadastrado', async () => {
    const response = await request(app)
      .delete(`/dados/${MOCK_ID}`)
      .set("Authorization", `Bearer ${token}`)

    //se deletou retorna objeto vazio
    expect(response.status).toBe(200)
  });

  it('deve deletar administrador', async () => {
    const response = await request(app)
      .delete(`/admins/${idAdmin}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  });

}); 