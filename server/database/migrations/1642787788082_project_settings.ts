import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProjectSettings extends BaseSchema {
  protected tableName = 'project_settings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().notNullable().primary()
        table.foreign('id').references('projects.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.json('config') // para as configurações específicas do projeto
      table.json('sponsor_data')
      table.json('contract_data')
      table.json('summary_data')
      table.json('items_data')
      table.json('items_extra')
      table.json('tests_summary_data')
      table.json('schedule')

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
