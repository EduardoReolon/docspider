import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().notNullable().primary()
      table.integer('sponsor_id').notNullable().unsigned()
        table.foreign('sponsor_id').references('institutions.id').onUpdate('CASCADE').onDelete('RESTRICT')
      table.integer('owner_id').notNullable().unsigned()
        table.foreign('owner_id').references('institutions.id').onUpdate('CASCADE').onDelete('RESTRICT')
      table.integer('builder_id').notNullable().unsigned()
        table.foreign('builder_id').references('institutions.id').onUpdate('CASCADE').onDelete('RESTRICT')
      table.dateTime('settings_date', { useTz: true }) // data de atualização das settings
      table.integer('status').notNullable().defaultTo(1)
      table.json('credentials')
        // 1-ativo, 2-pausado, 3-concluído, 4-aguardando licitação
      table.integer('v').defaultTo(1) // versão do sistema
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
