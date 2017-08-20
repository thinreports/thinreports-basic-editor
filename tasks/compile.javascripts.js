const where = require('./helper').where
const execSync = require('child_process').execSync

const command =
  `python ${ where.closure_builder_py }` +
  ` --root=${ where.closure_library }` +
  ` --root=${ where.closure_templates }` +
  ` --root=${ where.editor }` +
  ' -n thin.boot' +
  ' -o compiled' +
  ` -c ${ where.closure_compiler_jar }` +
  ` --output_file=${ require('path').join(where.app, 'editor.js') }` +
  ' -f "--compilation_level=SIMPLE_OPTIMIZATIONS"' +
  ' -f "--warning_level=DEFAULT"'

console.log('\x1b[34mCompiling javascripts...\n\x1b[0m')
execSync(command)
