import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import User from '../models/User';
import alert from 'alert'


class SessionController {
  async store(req, res) {
     /*valida dados recebidos*/
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validacao Falhou' });
    }

    const { email, password } = req.body;
     /*verifica se ha usuario com o email digitado pelo usuario*/
    const user = await User.findOne({
      where: { email },
    });
     /*retorna erro se nao achar email cadastrado*/
    if (!user) {
      alert('user nao encontrado')
      return res.status(401).json({ error: 'user nao encontrado' });
    }
     /*retorna erro se password for invalido*/
    if (!(await user.checkPassword(password))) {
      alert('Senha nao encontrada')
      return res.status(401).json({ error: 'Password nao encontrado' });
    }

    const { id } = user;

    return res.json({
      user: {
        id,
        email
      },
       /*user fazendo login define token que permite acesso as rotas privadas do frontend*/
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();