import request from 'supertest';
import app from '../../src/app'
const MOCK_CADASTRO_ADMIN = {
  name: 'jose',
  email: 'session@hotmail.com',
  password: '123456'
}

const MOCK_LOGIN = {
  email: "session@hotmail.com",
  password: "123456"
}
const MOCK_CADASTRO_FAIL = {
  name: '',
  email: 'session@hotmail.com',
  password: '12345678'
}

const MOCK_CADASTRO_FAIL_EMAIL = {
  name: 'joao',
  email: 'ali@hotmail.com',
  password: '1234567'
}
const MOCK_CADASTRO_FAIL_PASSWORD = {
  name: '',
  email: 'session@hotmail.com',
  password: ''
}
let token = ''
let id = ""


describe('Cadastrando administradores', () => {
  it('deve ser cadastrado admin', async () => {
    const response = await request(app)
      .post('/admins')
      .send(MOCK_CADASTRO_ADMIN);
     
    id = response.body.id;
    expect(response.statusCode).toEqual(200)
  });
  it('deve logar se email existir', async () => {
    const response = await request(app)
      .post('/login')
      .send(MOCK_LOGIN);
    token = response.body.token
    
    expect(response.statusCode).toEqual(200)
  });

  it('nao deve logar se email nao existir', async () => {
    const response = await request(app)
      .post('/login')
      .send(MOCK_CADASTRO_FAIL_EMAIL);

    expect(response.body.error).toEqual("admin nao encontrado")
  });

  it('nao deve logar se campo password vazio', async () => {
    const response = await request(app)
      .post('/login')
      .send(MOCK_CADASTRO_FAIL_PASSWORD);

    expect(response.body.error).toEqual("Validacao Falhou")
  });

  it('nao deve logar se password errado', async () => {
    const response = await request(app)
      .post('/login')
      .send(MOCK_CADASTRO_FAIL);

    expect(response.body.error).toEqual("Password nao encontrado")
  });


  it('nao deve logar se schema invalido', async () => {
    const response = await request(app)
      .post('/login')
      .send();


    expect(response.body.error).toEqual("Validacao Falhou")
  });


  it('deletar administrador', async () => {
    const response = await request(app)
      .delete(`/admins/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(response.body).toEqual({})
  });


});