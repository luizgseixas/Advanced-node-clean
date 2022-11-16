import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  it('should create with a value', async () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })

  it('should expire in 1800000 ms', async () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
