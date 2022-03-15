import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stages extends BaseSchema {
  protected tableName = 'stages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('project_id').unsigned().notNullable()
        table.foreign('project_id').references('projects.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('stage_number').unsigned().notNullable().defaultTo(1)
      table.primary(['project_id', 'stage_number'])
      table.integer('status').unsigned().notNullable().defaultTo(1)
        // 1-ativa, 2-fechada, 3-paga, 4-aguardando financeiro...
        // definir números
      table.json('content')
      table.json('schedule')
        // schedule conterá oque já foi medido, saldo e a pretenção do que será medido
      table.boolean('schedule_approved').notNullable().defaultTo(false)
      table.json('quantities')
        // quantidades informadas pela empreiteira

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
