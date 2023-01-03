import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { PgUser } from '@/infra/postgres/entities'

import { DataType, IBackup, IMemoryDb, newDb } from 'pg-mem'
import { DataSource, Repository } from 'typeorm'
import { v4 } from 'uuid'

const makeFakeDb = async (entities?: any[]): Promise<{ dataSource: DataSource, db: IMemoryDb }> => {
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

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup
  let dataSource: DataSource

  beforeAll(async () => {
    const database = await makeFakeDb([PgUser])
    dataSource = database.dataSource
    backup = database.db.backup()
    pgUserRepo = dataSource.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository(dataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBe(undefined)
    })
  })
})
