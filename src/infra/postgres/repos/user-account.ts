import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
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

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
    const pgUserRepo = this.datasource.getRepository(PgUser)
    if (params.id === undefined) {
      await pgUserRepo.save({
        name: params.name,
        email: params.email,
        facebookId: params.facebookId
      })
    } else {
      await pgUserRepo.update({
        id: Number(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
  }
}
