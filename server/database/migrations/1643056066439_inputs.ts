import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Inputs extends BaseSchema {
  protected tableName = 'inputs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('project_id').unsigned().notNullable()
        table.foreign('project_id').references('projects.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('input_number').unsigned().notNullable().defaultTo(1)
      table.primary(['project_id', 'input_number'])
      table.json('content')
      table.integer('type').unsigned().notNullable().defaultTo(1)
        /**
         * 1-registro fotográfico, 2-ocorrencia, 3-notificação, 4-ensaios, 5-requerimento
         * 6-registro meteorologia, 7-trabalhadores em obra, 8-maquinário em obra
         *  */  
      table.date('date')
      table.integer('status').unsigned().notNullable().defaultTo(1)
        // 1-pendente, 2-aprovado, 3-reprovado
        // rever números

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
