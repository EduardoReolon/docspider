import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'

export default class Stage extends BaseModel {
  @column({ isPrimary: true })
  public project_id: number

  @column()
  public stage_number: number

  @column()
  public status: number

  @column()
  public content: string

  @column()
  public schedule: string

  @column()
  public schedule_approved: boolean

  @column()
  public quantities: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>
}
