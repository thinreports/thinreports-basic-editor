const path = require('path')
const where = {}

where.root = path.join(__dirname, '..')
where.vendor = path.join(where.root, 'vendor')
where.app = path.join(where.root, 'app')
where.editor = path.join(where.app, 'editor')
where.closure_library = path.join(where.vendor, 'closure-library')
where.closure_templates = path.join(where.vendor, 'closure-templates')
where.closure_builder_py = path.join(where.closure_library, 'closure/bin/build/closurebuilder.py')
where.closure_compiler_jar = path.join(where.vendor, 'closure-compiler/compiler.jar')
where.closure_stylesheets_jar = path.join(where.vendor, 'closure-stylesheets/stylesheets.jar')
where.soy_to_js_compiler_jar = path.join(where.closure_templates, 'SoyToJsSrcCompiler.jar')

module.exports.where = where
