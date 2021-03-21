const where = require('./helper').where

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const command =
  `java -jar ${ where.closure_stylesheets_jar }` +
  ` ${ styleFiles().join(' ') }` +
  ` --output-file ${ require('path').join(where.app, 'assets/style.css') }` +
  ' --allowed-non-standard-function color-stop'

console.log('\x1b[34mCompiling CSS...\n\x1b[0m')

execSync(command)

function styleFiles () {
  const data = fs.readFileSync(path.join(where.app, 'assets/css-files.yml'), 'utf8')
  const files = yaml.safeLoad(data)

  return files.map(filename => path.join(where.app, 'assets', filename))
}
