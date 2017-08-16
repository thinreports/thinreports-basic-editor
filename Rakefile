namespace :compile do
  desc 'Run all compilation'
  task all: %i( css template js )

  desc 'Compile style'
  task :css do
    require 'yaml'

    css_files = YAML.load_file src.join('assets', 'css-files.yml')
    css_files.map! {|filename| src.join 'assets', filename }

    system "java -jar #{ closure_stylesheets_jar }" +
           " #{ css_files.join ' ' }" +
           " --output-file #{ src.join 'assets', 'style.css' }" +
           " --allowed-non-standard-function color-stop"
  end

  desc 'Compile javascripts'
  task :js do
    warning_level = false ? 'VERBOSE' : 'DEFAULT'

    system "python #{ closure_builder_py }" +
       " --root=#{ closure_library }" +
       " --root=#{ closure_templates }" +
       " --root=#{ app }" +
       " -n thin.boot" +
       " -o compiled" +
       " -c #{ closure_compiler_jar }" +
       " --output_file=#{ src.join 'editor.js' }" +
       %| -f "--compilation_level=SIMPLE_OPTIMIZATIONS"| +
       %| -f "--warning_level=#{ warning_level }"|
  end

  desc 'Compile templates'
  task :template do
    system "java -jar #{ soy_to_js_compiler_jar }" +
           " --outputPathFormat {INPUT_DIRECTORY}/{INPUT_FILE_NAME}.js" +
           " --shouldGenerateJsdoc" +
           " --shouldProvideRequireSoyNamespaces" +
           " #{ app.join 'layout', 'document', 'templates', 'html.soy' }"
  end
end

# Helpers
require 'pathname'

def root
  @root ||= Pathname.pwd
end

def dev
  root.join 'dev'
end

def closure_library
  root.join 'src', 'lib', 'closure-library'
end

def closure_templates
  root.join 'src', 'lib', 'closure-templates'
end

def closure_calcdeps_py
  closure_library.join 'closure', 'bin', 'calcdeps.py'
end

def closure_builder_py
  closure_library.join 'closure', 'bin', 'build', 'closurebuilder.py'
end

def closure_compiler_jar
  dev.join 'bin', 'closure-compiler', 'compiler.jar'
end

def closure_stylesheets_jar
  dev.join 'bin', 'closure-stylesheets', 'stylesheets.jar'
end

def soy_to_js_compiler_jar
  src.join 'lib', 'closure-templates', 'SoyToJsSrcCompiler.jar'
end

def app
  root.join 'src', 'app'
end

def src
  @src ||= root.join 'src'
end
