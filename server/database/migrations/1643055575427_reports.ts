import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Reports extends BaseSchema {
  protected tableName = 'reports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('project_id').unsigned().notNullable()
        table.foreign('project_id').references('projects.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('report_number').unsigned().notNullable().defaultTo(1)
      table.primary(['project_id', 'report_number'])
      table.date('date').notNullable()
      table.integer('status').unsigned().notNullable().defaultTo(1)
        // 1-incompleto, 2-pendente, 3-aprovado, 4-reprovado
        // rever números
      table.json('content')

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
