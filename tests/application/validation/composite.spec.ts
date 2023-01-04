import { mock, MockProxy } from 'jest-mock-extended'

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
  let sut: ValidationComposite
  let validators1: MockProxy<Validator>
  let validators2: MockProxy<Validator>
  let validators: Validator[]

  beforeAll(() => {
    validators1 = mock()
    validators1.validate.mockReturnValue(undefined)
    validators2 = mock()
    validators2.validate.mockReturnValue(undefined)
    validators = [validators1, validators2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })
  it('should return undefined if all validators return undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
