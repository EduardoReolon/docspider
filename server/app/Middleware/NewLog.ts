import Database from "@ioc:Adonis/Lucid/Database";
import Log from "App/Models/Log";

export default class NewLog {
  public async handle(ctx, next: () => Promise<void>) {
    const trx = await Database.transaction();
    try {
      const log = new Log();
      log.project_id = ctx.project ? ctx.project.id : undefined;
      log.user_id = ctx.getUser ? ctx.getUser().id : undefined;
      log.route = ctx.routeKey;
      log.content = JSON.stringify(ctx.request.all());

      log.useTransaction(trx);
      await log.save();
      ctx.trx = trx;
    } catch (error) {
      console.error('NewLog', error);
      await trx.rollback();
      return ctx.response.status(400).send({msg: 'Erro ao gravar log'});
    }

    await next();
    if (!trx.isCompleted) await trx.commit();
  }
}
