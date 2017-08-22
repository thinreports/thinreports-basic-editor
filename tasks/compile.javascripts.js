const where = require('./helper').where
const execSync = require('child_process').execSync

const compilationLevel = process.env.NODE_ENV == 'production' ? 'ADVANCED_OPTIMIZATIONS' : 'SIMPLE_OPTIMIZATIONS'

const command =
  `python ${ where.closure_builder_py }` +
  ` --root=${ where.closure_library }` +
  ` --root=${ where.closure_templates }` +
  ` --root=${ where.editor }` +
  ' -n thin.boot' +
  ' -o compiled' +
  ` -c ${ where.closure_compiler_jar }` +
  ` --output_file=${ require('path').join(where.app, 'editor.js') }` +
  ` -f "--compilation_level=${ compilationLevel }"` +
  ' -f "--warning_level=DEFAULT"'

console.log(`\x1b[34mCompiling javascripts with ${ compilationLevel }...\n\x1b[0m`)
execSync(command)
