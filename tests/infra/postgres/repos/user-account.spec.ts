import { LoadUserAccountRepository } from '@/data/contracts/repos'

import { DataType, IMemoryDb, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, DataSource } from 'typeorm'
import { v4 } from 'uuid'

let db: IMemoryDb
let dataSource: DataSource

const makeDatasource = async (): Promise<void> => {
  db = newDb({ autoCreateForeignKeyIndices: true })

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

  dataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [PgUser]
  })

  await dataSource.initialize()
  await dataSource.synchronize()
}

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = dataSource.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } })
    if (pgUser !== null && pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarions' })
class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}

describe('PgUserAccountRepository', () => {
  beforeAll(async () => {
    await makeDatasource()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      const pgUserRepo = dataSource.getRepository(PgUser)
      await pgUserRepo.save({ email: 'existing_email' })
      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })
  })
})
