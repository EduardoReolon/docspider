export default class GetCredential {
  public async handle(ctx, next: () => Promise<void>) {
    try {
      if (!ctx.project) return ctx.response.status(400).send({msg: 'Sem projeto'});
      if (ctx.project.credentials) {
        const credentials = JSON.parse(ctx.project.credentials);
        const possibilities = [
          {array: 'sponsors', credential: 'sponsor'},
          {array: 'owners', credential: 'owner'},
          {array: 'builders', credential: 'builder'},
          {array: 'planners', credential: 'planner'}
        ];
        possibilities.forEach((p) => {
          if ((credentials[p.array] || []).includes(ctx.user.id)) {
            ctx.credential = p.credential;
            ctx.indexCredential = credentials[p.array].indexOf(ctx.user.id);
          }
        });
      }
      if (!ctx.credential) {
        ctx.sponsor = await ctx.project.related('sponsor').query().first()
        if (ctx.sponsor && ctx.sponsor.credentials) {
          const credentialsSponsor = JSON.parse(ctx.sponsor.credentials)
          if ((credentialsSponsor.admin || []).includes(ctx.user.id)) {
            ctx.credential = 'sponsor_admin';
          }
        }
        if (!ctx.credential) ctx.credential = 'guest';
      }
      next()
    } catch (error) {
      console.error('middleware getCredential', error);
      return ctx.response.status(400).send({msg: 'erro ao localizar a credencial'})
    }
  }
}
