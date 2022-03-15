import Project from 'App/Models/Project'

export default class GetProject {
  public async handle(ctx, next: () => Promise<void>) {
    try {
      // code for middleware goes here. ABOVE THE NEXT CALL
      ctx.project = await Project.findOrFail(ctx.request.header('project_id'))
      next()
    } catch (error) {
      console.error('middleware getProject', error);
      return ctx.response.status(400).send({msg: 'erro ao localizar o projeto'})
    }
  }
}
