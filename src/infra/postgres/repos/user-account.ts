import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'
import { DataSource } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor (private readonly datasource: DataSource) {}
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = this.datasource.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } })
    if (pgUser !== null && pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}
