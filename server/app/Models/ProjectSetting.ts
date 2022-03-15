import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'

export default class ProjectSetting extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public config: string

  @column()
  public sponsor_data: string

  @column()
  public contract_data: string

  @column()
  public summary_data: string

  @column()
  public items_data: string

  @column()
  public items_extra: string

  @column()
  public tests_summary_data: string

  @column()
  public schedule: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Project, {
    foreignKey: 'id',
    localKey: 'id',
  })
  public project: BelongsTo<typeof Project>
}
