import request from 'supertest';
import app from '../../src/app'
const MOCK_CADASTRO_ADMIN = {
  name: 'jose',
  email: 'admin@hotmail.com',
  password: '123456'
}

const MOCK_LOGIN = {
  email: "admin@hotmail.com",
  password: "123456"
}
const MOCK_UPDATE_NOTPASSWORD = {
  name: 'joaquim',
  email: 'her@hotmail.com',
  
}
const MOCK_CADASTRO_FAIL_CAMPO = {
  email: '',
  password: ''
}
const MOCK_UPDATE = {
  name: "jose",
  email: "nani3@hotmail.com",
  oldPassword:"123456",
  password: "1234567",
	confirmPassword: "1234567"

}
const MOCK_UPDATE_FAIL = {
  name: "jose",
  email: "nani3@hotmail.com",
  oldPassword:"12345689098",
  password: "1234567",
	confirmPassword: "1234567"

}
let token = ''
let id = ''


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

  it('nao deve cadastrar se faltar algum campo', async () => {
    const response = await request(app)
      .post('/admins')
      .send(MOCK_CADASTRO_FAIL_CAMPO);


    expect(response.body.error).toEqual("Validacao Falhou")
  });

  it('nao deve cadastrar se schema invalido', async () => {
    const response = await request(app)
      .post('/admins')
      .send();


    expect(response.body.error).toEqual("Validacao Falhou")
  });

  it('deve atualizar administrador', async () => {
    const response = await request(app)
      .put(`/admins/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_UPDATE,);

    expect(response.body).toEqual(
      {"email":MOCK_UPDATE.email
       , "name": MOCK_UPDATE.name}
      )
  });
  it('atualizar administrador apenas nome e email se nao for alterar password', async () => {
    const response = await request(app)
      .put(`/admins/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_UPDATE_NOTPASSWORD,);

    expect(response.body).toEqual(
      {"email":MOCK_UPDATE_NOTPASSWORD.email
       , "name": MOCK_UPDATE_NOTPASSWORD.name}
      )
  });

  it('nao deve atualizar administrador oldpassword incorreta ou sem informar', async () => {
    const response = await request(app)
      .put(`/admins/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(MOCK_UPDATE_FAIL,);

    expect(response.body.error).toEqual( 'Senha difere da atual' );
  });

  it('deve deletar administrador', async () => {
    const response = await request(app)
      .delete(`/admins/${id}`)
      .set("Authorization", `Bearer ${token}`)
      

    expect(response.body).toEqual({})
  });


});