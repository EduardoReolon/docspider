import Helpers from 'App/Helpers/index';
import File from 'App/Models/File';

export default class FilesController {
  public async index({ request, response }) {
    try {
      let {page, per_page} = request.all();
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 20;
      const files = await File.query().paginate(page, per_page);
      return response.status(201).send(files);
    } catch (error) {
      console.error('files index', error);
      return response.status(400).send({
        message: 'Error registering'
      })
    }
  }

  public async update({ params: {id}, request, response }) {
    try {
      const {title, description, clientName} = request.all();
      const path = 'storage';
      const helpers = new Helpers();

      const idInt = parseInt(id);
      let file;
      if (idInt < 0) {
        file = new File();
      } else {
        file = await File.findOrFail(id);
      }
      file.title = title || file.title;
      file.description = description || file.description;
      file.clientName = clientName || file.clientName;

      const filesPerTitle = await File.query()
        .where('title', file.title)
      if (filesPerTitle.length > 1 || (filesPerTitle.length && filesPerTitle[0].id !== idInt)) {
        return response.status(400).send({msg: 'Arquivos com o mesmo título'});
      }

      const fileJar = request.files('files', {
        extnames: ['png', 'jpeg', 'jpg', 'pdf'],
        size: '20mb'
      })
      let filesSaved: {successes: {type: Number, clientName: String, fileName: String, size: Number}[], errors: {}[]} = {successes: [], errors: []};
      if (fileJar && fileJar.length)  {
        filesSaved = await helpers
          .manage_multiple_uploads(fileJar, path);
      }

      if (filesSaved.errors.length) {
        return response.status(400).send({msg: 'Erro no arquivo'});
      } else if (filesSaved.successes.length) {
        file.fileName = filesSaved.successes[0].fileName;
        file.size = filesSaved.successes[0].size;
      }

      await file.save();
      
      return response.status(200)
    } catch (error) {
      console.error('files update', error);
      return response.status(400).send({
        message: 'Error registering'
      })
    }
  }
}
