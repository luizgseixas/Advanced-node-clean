import { mock } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor (private readonly validators: Validator[]) {}

  validate (): undefined {
    return undefined
  }
}

describe('ValidationComposite', () => {
  it('should return undefined if all validators return undefined', () => {
    const validators1 = mock<Validator>()
    validators1.validate.mockReturnValue(undefined)
    const validators2 = mock<Validator>()
    validators2.validate.mockReturnValue(undefined)
    const validators = [validators1, validators2]

    const sut = new ValidationComposite(validators)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
