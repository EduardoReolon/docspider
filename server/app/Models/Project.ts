import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Institution from './Institution'
import ProjectSetting from './ProjectSetting'
import Stage from './Stage'
import Report from './Report'
import Input from './Input'
import Log from './Log'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sponsor_id: number

  @column()
  public owner_id: number

  @column()
  public builder_id: number

  @column()
  public settings_date: DateTime

  @column()
  public status: number

  @column()
  public credentials: string

  @column()
  public v: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Institution, {
    foreignKey: 'id',
    localKey: 'sponsor_id',
  })
  public sponsor: HasOne<typeof Institution>

  @hasOne(() => Institution, {
    foreignKey: 'id',
    localKey: 'owner_id',
  })
  public owner: HasOne<typeof Institution>

  @hasOne(() => Institution, {
    foreignKey: 'id',
    localKey: 'builder_id',
  })
  public builder: HasOne<typeof Institution>

  @hasOne(() => ProjectSetting, {
    foreignKey: 'id',
    localKey: 'id',
  })
  public projectSetting: HasOne<typeof ProjectSetting>

  @hasMany(() => Stage)
  public stages: HasMany<typeof Stage>

  @hasMany(() => Report)
  public reports: HasMany<typeof Report>

  @hasMany(() => Input)
  public inputs: HasMany<typeof Input>

  @hasMany(() => Log)
  public Logs: HasMany<typeof Log>
}
