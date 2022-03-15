import Database from "@ioc:Adonis/Lucid/Database";
import Log from "App/Models/Log";
import Env from "@ioc:Adonis/Core/Env";

export default class BackDoor {
  public async handle(ctx, next: () => Promise<void>) {
    try {
      if (ctx.request.header('key_backDoor') !== Env.get('key_backDoor', 'gwetrgsdfwergwetr')) {
        return ctx.response.status(400).send({msg: 'Chave de segurança não verificada'});
      }

      ctx.trx = await Database.transaction();
      const log = new Log();
      log.project_id = ctx.request.header('project_id');
      log.route = ctx.routeKey;
      log.content = JSON.stringify({ keys: Object.keys(ctx.request.all()) });

      log.useTransaction(ctx.trx);
      await log.save();
    } catch (error) {
      console.error('backDoor', error);
      if (ctx.trx) await ctx.trx.rollback();
      return ctx.response.status(400).send({msg: 'Erro ao gravar log'});
    }

    await next();
    if (!ctx.trx.isCompleted) await ctx.trx.commit();
  }
}
