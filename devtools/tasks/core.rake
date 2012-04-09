# coding: utf-8

namespace :core do
  include TREDevelopment::Core
  
  # Tasks for JavaScript(Closure Library)
  namespace :js do
    desc 'Execute closurebuilder.py'
    task :compile, [:bopt_verbose, :bopt_output_mode, :preview] do |t, args|
      # Initialize arguments
      warning_level = ENV['bopt_verbose'] || 'VERBOSE'
      output_mode   = ENV['bopt_output_mode'] || 'compiled'
      
      # File for output STDERR
      output_stderr = File.join(ROOT, 'application-compiled.log')
      
      run_command :output => output_stderr do
        add "python #{closure_builder_py}"
        add "--root=#{closure_library_for}"
        add "--root=#{closure_templates_for}"
        add "--root=#{path_from_root('thin')}"
        add "-n thin.setup"
        add "-o #{output_mode}"
        add "-c #{closure_compiler_jar}"
        add "-f \"--compilation_level=ADVANCED_OPTIMIZATIONS\""
        add "-f \"--warning_level=#{warning_level}\""
        add "--output_file=#{path_from_root('application.js')}"
      end
    end
    
    desc 'Compile template'
    task :template, [:f, :preview] do |t, args|
      run_command do
        add "java -jar #{template_compiler_jar}"
        add "--outputPathFormat {INPUT_DIRECTORY}/{INPUT_FILE_NAME}.js"
        add "--shouldGenerateJsdoc"
        add "--shouldProvideRequireSoyNamespaces"
        add "#{File.expand_path(thin_for(ENV['f']))}"
      end
    end
    
    desc 'Execute depswriter.py'
    task :deps, [:preview] do
      run_command do
        add "python #{closure_depswriter_py}"
        add "--root_with_prefix=\"#{closure_templates_for} ../../../closure-templates\""
        add "--root_with_prefix=\"#{thin_for(:escape => true)} ../../../thin\""
        add "--output_file=#{thin_for('deps.js')}"
      end
    end
  end
  
  # Tasks for CSS
  namespace :css do
    desc 'Compress and merge CSS files'
    task :compile, [:preview] do
      run_command do
        "yuicompress css #{css_config_yml}"
      end
    end
  end
end

# Aliases

desc 'Alias for core:js:compile'
task :jc => [:'core:js:compile']

desc 'Alias for core:js:deps'
task :jd => [:'core:js:deps']

desc 'Alias for core:js:template'
task :jt => [:'core:js:template']
