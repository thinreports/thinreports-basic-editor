const where = require('./helper').where
const execSync = require('child_process').execSync

const command =
  `java -jar ${ where.soy_to_js_compiler_jar }` +
  ' --outputPathFormat {INPUT_DIRECTORY}/{INPUT_FILE_NAME}.js' +
  ' --shouldGenerateJsdoc' +
  ' --shouldProvideRequireSoyNamespaces' +
  ` ${ require('path').join(where.editor, 'layout', 'document', 'templates', 'html.soy') }`

console.log('\x1b[34mCompiling templates...\n\x1b[0m')
execSync(command)
