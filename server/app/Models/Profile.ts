import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Institution from 'App/Models/Institution'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Institution)
  public institutions: HasMany<typeof Institution>
}
