import { DataType, IMemoryDb, newDb } from 'pg-mem'
import { DataSource } from 'typeorm'
import { v4 } from 'uuid'

export const makeFakeDb = async (entities?: any[]): Promise<{ dataSource: DataSource, db: IMemoryDb }> => {
  const db: IMemoryDb = newDb({ autoCreateForeignKeyIndices: true })

  db.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`
  })

  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`
  })

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true
    })
  })

  const dataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })

  await dataSource.initialize()
  await dataSource.synchronize()

  return { dataSource, db }
}
