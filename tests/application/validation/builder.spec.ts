import { RequiredStringValidator, Validator } from '@/application/validation'

class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fielName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of (params: { value: string, fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fielName))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', async () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})