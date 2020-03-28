const consola = require('consola')
const colors = require('colors')

module.exports = (validator) => {
  let Validator = validator.split('.')
  let ValidatorFileName = Validator[0]
  let ValidatorMethodName = Validator[1]
  let ValidatorFile = null

  // Check validator file is exists
  ValidatorFile = require(`@pxlayer/Validators/${ValidatorFileName}`)
  if (!ValidatorFile) {
    consola.error(
      `Cannot find validator file 'app/Validators/` +
        `${ValidatorFileName}`.red +
        `'`
    )
  }

  // If validator file is exists
  if (ValidatorFile) {
    Validator = ValidatorFile[ValidatorMethodName]

    // Check validator method is passed
    if (!Validator)
      consola.error(
        `Cannot find validator method '${ValidatorFileName + '.'}` +
          `${ValidatorMethodName}`.red +
          `'`
      )
    else return Validator
  }
}
