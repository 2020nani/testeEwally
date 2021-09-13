import * as Yup from 'yup';
import User from '../models/User';
import alert from 'alert'


class UserController {

  /**
   * Cadastra usuario no banco de dados

   */
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validacao Falhou' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists !== null) {
      alert(`Email ja esta cadastrado`)
      return res.status(400).json({ error: 'Este email ja esta cadastrado' });
    }
    const { id, email } = await User.create(req.body);

    return res.json({
      id,
      email
    });
  }

  /**
   * Atualiza email e senha de um usuario unico conforme o id passado na requisicao
   * @param {* id do usuario} req
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validacao falhou' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findOne({
      where: { id: req.params.user_id }
    })

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Usuario ja existe.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha difere da atual' });
    }

    await user.update(req.body);

    return res.json({ email});
  }


  /**
   * Deleta usuario unico conforme o id passado na requisicao
   * @param {* id do usuario} req
   */
  async delete(req, res) {
    let message = {
      mensagem: "Deletado com sucesso"
    }
    const user = await User.findOne({
      where: { id: req.params.user_id }
    })

  await user.destroy(req.body);
    res.json({ message })
  }

}

export default new UserController();