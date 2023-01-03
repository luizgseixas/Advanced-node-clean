import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'
import { DataSource } from 'typeorm'

type LoadParam = LoadUserAccountRepository.Params
type LoadResult = Promise<LoadUserAccountRepository.Result>
type SaveParam = SaveFacebookAccountRepository.Params

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo = this.datasource.getRepository(PgUser)

  constructor (private readonly datasource: DataSource) {}
  async load (params: LoadParam): LoadResult {
    const pgUser = await this.pgUserRepo.findOne({ where: { email: params.email } })
    if (pgUser !== null && pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveParam): Promise<void> {
    if (params.id === undefined) {
      await this.pgUserRepo.save({
        name: params.name,
        email: params.email,
        facebookId: params.facebookId
      })
    } else {
      await this.pgUserRepo.update({
        id: Number(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
  }
}
