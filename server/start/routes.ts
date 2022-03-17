/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application';
const appRoot = Application.appRoot.endsWith('build')
  ? Application.appRoot.replace(/build([^build]*)$/, '$1')
  : `${Application.appRoot}/`;

Route.get('storage/:folder1/:file', async ({ params: { folder1, file }, response }) => {
  const path = `${appRoot}storage/${folder1}`;
  response.download(`${path}/${file}`);
})
Route.get('storage/:file', async ({ params: { file }, response }) => {
  const path = `${appRoot}storage`;
  response.download(`${path}/${file}`);
})

// auth
Route.group(() => {
  Route.post('register', 'AuthController.register')
    .middleware(['auth'])

  Route.post('login', 'AuthController.login')
  Route.get('refresh', 'AuthController.refresh')

  Route.get('me', 'AuthController.me')
    .middleware(['auth'])

  Route.post('update', 'AuthController.update')
    .middleware(['auth', 'newLog'])

  Route.get('logout', 'AuthController.logout')
    .middleware(['auth'])
})
  .prefix('api/v1/auth')

// files
Route.group(() => {
  Route.get('', 'FilesController.index')
  Route.post(':id', 'FilesController.update')
    // .middleware(['newLog'])
})
  .prefix('api/v1/files')
  // .middleware(['auth'])

Route.get('*', async ({ params, response }) => {
  if (params['*']) {
    const index = params['*'].findIndex((p) => ['icons', 'css', 'js'].includes(p));
    if (index > -1) {
      params['*'].splice(0, index);
      return response.download(`${appRoot}public/${params['*'].join('/')}`)
    }
  }
  return response.download(`${appRoot}public/index.html`)
})
