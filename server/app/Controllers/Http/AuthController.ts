import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
const ad = require("../../../config/activedirectory");
import Helpers from 'App/Helpers/index'

export default class AuthController {
  public async register({ request, response, getUser }) {
    try {
      const user = await getUser(true);
      if (!user.security_data || !JSON.parse(user.security_data).isAdmin) {
        return response.status(401).send({
          message: 'User unauthorized'
        })
      }

      const { email } = request.all()
      const userNew = await User.query().where({ email }).first()

      if (userNew) return response.status(400).send({
        message: 'User already registered'
      })

      await User.create({ email, password: '123456' });

      return response.status(200)
    } catch (error) {
      console.error(error);
      return response.status(400).send({
        message: 'Error registering'
      })
    }
  }

  public async login({request, auth, response}) {
    let {email, password} = request.all()
    try {
      // const expiresIn = '720h';
      const expiresIn = undefined;
      email = (email || '').toLowerCase();
      const domain = email.split('@')[1];
      let token;
      if (domain.includes('paranacidade')) {
        const logged = await new Promise(resolve => {
          ad.authenticate( email, password,
            function(_err, auth) {
              if (auth) resolve(true);
              else resolve(false);
            });
        });
        if (logged) {
          let user = await User.query().where({email}).first();
          if (!user) {
            user = await User.create({
              email,
              password: await new Helpers().str_random(),
            })
          }
          token = await auth.use('jwt')
            .generate(user, { expiresIn });
        } else return response.status(400).send({msg: 'User not found'});
      } else {
        token = await auth.use('jwt')
          .attempt(email, password)
      }
      return response.status(201).send(token);
    } catch (error) {
      console.log('login:', error);
      return response.status(400).send({msg: 'User not found'});
    }
  }

  public async update({request, trx, getUser, response}) {
    const {name, surname, password, sensitive_data} = request.all();

    try {
      const user = await getUser(true);
      const user_data = user.user_data ? JSON.parse(user.user_data) : {};
      if (name || name === null) user_data.name = name;
      if (surname || surname === null) user_data.surname = surname;
      const helper = new Helpers()
      helper.nullToUndefined(user_data)
      user.user_data = JSON.stringify(user_data);
      if (password) user.password = password;
      if (sensitive_data) {
        helper.nullToUndefined(sensitive_data)
        user.sensitive_data = JSON.stringify({
          ...JSON.parse(user.sensitive_data),
          ...sensitive_data,
        })
      }
      user.useTransaction(trx);
      await user.save();

      await trx.commit();
      return response.status(201).send({msg: 'Successful'})
    } catch (error) {
      console.error('auth/update', error);
      await trx.rollback();
      return response.status(400).send({msg: 'Error'});
    }
  }

  public async refresh({ request, response, auth }) {
    refresh_token = request.header('refresh_token')
    
    if (!refresh_token) {
      var refresh_token = request.input('refresh_token')
    }

    const jwt = await auth.use("jwt").loginViaRefreshToken(refresh_token);
    return response.send(jwt)
  }

  public async me({ response, getUser }) {
    try {
      const user = await getUser(true);
      return response.status(201).send({
        id: user.id,
        email: user.email,
        ...JSON.parse(user.user_data),
      })
    } catch (error) {
      console.error('me', error);
      return response.status(400).send({msg: 'Error'});
    }
  }

  async logout({ request, response, auth }) {
    var refreshToken = request.input('refresh_token')

    if (!refreshToken) {
      refreshToken = request.header('refresh_token')
    }
    await auth.use('jwt').revoke({refreshToken})
    return response.status(200).send({})
  }

  public async destroy({}: HttpContextContract) {}
}
