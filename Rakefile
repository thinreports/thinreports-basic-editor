desc 'Calculates core JavaScript dependencies'
task :calcdeps do
  depslist = dev.join 'tmp', 'depslist'

  system "python #{ closure_calcdeps }" +
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
task default: :calcdeps


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

def closure_calcdeps
  closure_library.join 'closure', 'bin', 'calcdeps.py'
end

def app
  root.join 'src', 'app'
end

def src
  @src ||= root.join 'src'
end
