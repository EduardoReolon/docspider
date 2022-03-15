import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Institutions extends BaseSchema {
  protected tableName = 'institutions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.integer('profile_id').unsigned()
        table.foreign('profile_id').references('profiles.id').onUpdate('CASCADE').onDelete('RESTRICT')
      table.json('config')
      table.boolean('active').notNullable().defaultTo(true)
      table.json('credentials')

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
