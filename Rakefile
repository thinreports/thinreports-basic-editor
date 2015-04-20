namespace :dev do
  desc 'Calculates core JavaScript dependencies'
  task :calcdeps do
    depslist = dev.join 'tmp', 'depslist'

    system "python #{ closure_calcdeps_py }" +
           " --input=#{ app.join 'boot.js' }" +
           " --path=#{ closure_library }" +
           " --path=#{ closure_templates }" +
           " --path=#{ app }" +
           " -o list > #{ depslist }"

    raise 'Failed to execute calcdeps.py' unless depslist.exist?

    indent = ' ' * 4

    script_tags = depslist.each_line.map do |deps|
      path = Pathname.new(deps).relative_path_from(src).to_path.chomp
      %(#{ indent }<script src="#{ path }"></script>)
    end

    html = src.join 'app.html'
    html.write html.read.sub(/<!\-\-SCRIPTS begin\-\->.*<!\-\-SCRIPTS end\-\->/m,
                             "<!--SCRIPTS begin-->\n#{ script_tags.join "\n" }\n<!--SCRIPTS end-->")
  end

  desc 'Check structure and syntax of scripts by testing compilation'
  task :check do
    out, warnings, status = compile_scripts
    puts warnings
  end

  desc 'Compile template of the specification sheet to JavaScript'
  task :build_template do
    compile_document_html
  end
end
task default: 'dev:calcdeps'

namespace :package do
  desc 'Clean up package'
  task :cleanup do
    package = root.join 'package'
    package.rmtree if package.exist?
    package.mkdir
  end

  desc 'Build a release package'
  task build: :cleanup do
    require 'yaml'

    # Initializing package directory
    package = root.join 'package'

    # Coping raw files
    %w( app.html app.js background.js manifest.json ).each do |file|
      FileUtils.cp src.join(file), package
    end

    # Building package/locales directory
    FileUtils.cp_r src.join('locales'), package

    # Building package/assets directory
    assets = package.join 'assets'
    assets.mkdir

    FileUtils.cp_r src.join('assets', 'fonts'), assets
    FileUtils.cp_r src.join('assets', 'icons'), assets
    FileUtils.cp_r src.join('assets', 'images'), assets

    css_files = YAML.load_file src.join('assets', 'css-files.yml')
    css_files.map! {|filename| src.join 'assets', filename }

    system "java -jar #{ closure_stylesheets_jar }" +
           " #{ css_files.join ' ' }" +
           " --output-file #{ assets.join 'style.css' }" +
           " --allowed-non-standard-function color-stop"

    # Compiling template for app/layout/document/templates/html.soy
    compile_document_html

    # Building package/app.js file
    compiled_js, warnings, status = compile_scripts

    warning_log = dev.join 'tmp', 'javascript-compile.log'
    warning_log.write warnings

    # append compiled javascript code to package/app.js
    package.join('app.js').open('a+') do |file|
      file.puts "\n// Compiled core scripts"
      file.puts compiled_js
    end

    # Building package/app.html
    html = package.join('app.html').read

    # remove dependent script tags for development
    html.sub! /<!\-\-SCRIPTS begin\-\->.*<!\-\-SCRIPTS end\-\->(\n|\r\n)/m, ''

    # replace dependent style tags to tag for including compiled style.css
    indent = ' ' * 4
    html.sub! /<!\-\-STYLES begin\-\->.*<!\-\-STYLES end\-\->/m,
              %|#{ indent }<link rel="stylesheet" href="assets/style.css">|

    package.join('app.html').write html
  end
end

def compile_document_html
  system "java -jar #{ soy_to_js_compiler_jar }" +
         " --outputPathFormat {INPUT_DIRECTORY}/{INPUT_FILE_NAME}.js" +
         " --shouldGenerateJsdoc" +
         " --shouldProvideRequireSoyNamespaces" +
         " #{ app.join 'layout', 'document', 'templates', 'html.soy' }"
end

def compile_scripts(verbose: false)
  require 'open3'
  warning_level = verbose ? 'VERBOSE' : 'DEFAULT'

  Open3.capture3 "python #{ closure_builder_py }" +
                 " --root=#{ closure_library }" +
                 " --root=#{ closure_templates }" +
                 " --root=#{ app }" +
                 " -n thin.boot" +
                 " -o compiled" +
                 " -c #{ closure_compiler_jar }" +
                 %| -f "--compilation_level=ADVANCED_OPTIMIZATIONS"| +
                 %| -f "--warning_level=#{ warning_level }"| +
                 %| -f "--define='COMPILED=true'"|
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
