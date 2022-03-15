import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import User from './User'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public project_id: number

  @column()
  public user_id: number

  @column()
  public route: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @hasOne(() => Project)
  public project: HasOne<typeof Project>

  @hasOne(() => User)
  public user: HasOne<typeof User>
}
