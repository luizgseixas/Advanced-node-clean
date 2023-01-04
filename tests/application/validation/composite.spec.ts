import { mock, MockProxy } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  validate (): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        return error
      }
    }
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

  it('should return the first error', () => {
    validators1.validate.mockReturnValue(new Error('error_1'))
    validators2.validate.mockReturnValue(new Error('error_2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('error_1'))
  })
})
