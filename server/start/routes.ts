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

//back door
Route.group(() => {
  Route.post('', 'BackDoorsController.')
})
  .prefix('api/v1/backdoor')
  .middleware(['backDoor'])

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

// reports
Route.group(() => {
  Route.post('new', 'ReportsController.store')
    .middleware(['getProject', 'getCredential', 'newLog'])
})
  .prefix('api/v1/report')
  .middleware(['auth'])

Route.get('/', async () => {
  return { hello: 'world' }
})
