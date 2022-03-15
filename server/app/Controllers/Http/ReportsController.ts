import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReportsController {
  public async index({}: HttpContextContract) {}

  public async store({request, project, credential}) {
    try {
      console.log('request', request.all())
      console.log('project', await project.related('sponsor').query().first())
      console.log('credential', credential)
    } catch (error) {
      console.error('reports store', error);
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
