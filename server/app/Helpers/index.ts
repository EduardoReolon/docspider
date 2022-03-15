'use stric'

import Application from '@ioc:Adonis/Core/Application'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class Helpers {
  /**
   * Generate random string
   *
   * @param { int } length - O  tamanho da string que você quer gerar
   * @return { string } uma string randomica do tamaho de length
   */
  async str_random(length = 40) {
    let newString = ''
    let len = newString.length
    if (len < length) {
      let size = length - len
      let bytes = await string.generateRandom(size)
      let buffer = Buffer.from(bytes)
      newString += buffer
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .substr(0, size)
    }
    return newString
  }
  
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  nullToUndefined(object) {
    Object.keys(object).forEach((key) => {
      if (object[key] === null) object[key] = undefined
    });
  }
  
  /**
   * Move um único arquivo para o caminho especificado, se nenhum for especificado
   * então 'public/uploads' será utilizado.
   * @param { FileJar } file o arquivo a ser gerenciado
   * @param { string } path o caminho para onde o arquivo deve ser movido
   * @return { Object<FileJar> }
   */
  async manage_single_upload(file, path = '') {
    path = path
      ? `${Application.appRoot}/${path}`
      : `${Application.appRoot}/storage/uploads`;
    // gera um nome aleatório
    const random_name = await new Helpers().str_random(3)
    let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`
  
    // renomeia o arquivo e move ele para o path
    await file.move(path, {
      name: filename
    })
  
    return file
  }
  
  /**
   * Move um múltiplos arquivos para o caminho especificado, se nenhum for especificado
   * então 'public/uploads' será utilizado.
   * @param { FileJar } fileJar
   * @param { string } path
   * @return { Object }
   */
  async manage_multiple_uploads(files, path = '') {
    path = path
      ? `${Application.appRoot}/${path}`
      : `${Application.appRoot}/storage/uploads`;
    const successes = []
    const errors = []
  
    await Promise.all(
      files.map(async file => {
        let random_name = await new Helpers().str_random(3)
        let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`
        // move o arquivo
        await file.move(path, {
          name: filename
        })
  
        // verificamos se moveu mesmo
        if (file.moved()) {
          successes.push(file as never)
        } else {
          errors.push(file.error() as never)
        }
      })
    )
  
    return { successes, errors }
  }
}
