import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'

export default class Institution extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public name: string

  @column()
  public profile_id: number

  @column()
  public config: string

  @column()
  public active: Boolean

  @column()
  public credentials: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>
}
