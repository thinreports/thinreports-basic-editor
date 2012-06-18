# coding: utf-8

namespace :core do
  include TREDevelopment::Core
  
  namespace :deploy do
    desc 'Deploy core files'
    task :update do
      require 'fileutils'
      
      targetdir = File.join(TREDevelopment::APPLICATION_ROOT, 'resources')
      sourcedir = File.join(ROOT)
      
      # Clear current files
      # WARNING: Do not delete the fonts directory
      FileUtils.rm_rf(Dir.glob("#{targetdir}/core/*") +
                      Dir.glob("#{targetdir}/{GPLv3,LICENSE,*.txt}"))
      
      # Copy latest files to targetdir
      coredir = File.join(targetdir, 'core')
      
      # Create assets dir
      FileUtils.mkdir_p(File.join(coredir, 'assets'))
      
      # Copy application core files (app.html, app.js, base.js)
      FileUtils.cp([File.join(sourcedir, 'app.html'),
                    File.join(sourcedir, 'app.js'),
                    File.join(sourcedir, 'base.js')],
                   coredir)
      # Copy locales directory
      FileUtils.cp_r(File.join(sourcedir, 'locales'),
                     coredir)
      # Copy application assets files (app.css, icons/*)
      FileUtils.cp_r([File.join(sourcedir, 'assets', 'app.css'),
                      File.join(sourcedir, 'assets', 'icons')],
                     File.join(coredir, 'assets'))
      # Copy docs
      FileUtils.cp(Dir.glob(File.join(TREDevelopment::PROJECT_ROOT,
                                      '{GPLv3,README.txt,LICENSE}')),
                   targetdir)
    end
    
    desc 'Run all deployment process'
    task :all => [:'core:js:deps', :'core:js:compile',
                  :'core:css:compile', :'core:deploy:update']
  end
  
  # Tasks for JavaScript(Closure Library)
  namespace :js do
    desc 'Execute closurebuilder.py'
    task :compile, [:verbose, :output_mode, :preview] do |t, args|
      # Initialize arguments
      warning_level = ENV['verbose'] || 'VERBOSE'
      output_mode   = ENV['output_mode'] || 'compiled'
      debug_mode    = ENV['debug']

      # File for output STDERR
      output_stderr = File.join(ROOT, 'base-compile.log')
      
      run_command :output => output_stderr do
        add "python #{closure_builder_py}"
        add "--root=#{closure_library_for}"
        add "--root=#{closure_templates_for}"
        add "--root=#{path_from_root('thin')}"
        add "-n thin.boot"
        add "-o #{output_mode}"
        add "-c #{closure_compiler_jar}"
        add "-f \"--compilation_level=ADVANCED_OPTIMIZATIONS\""
        add "-f \"--warning_level=#{warning_level}\""
        add "-f \"--debug=true\"" if debug_mode
        add "--output_file=#{path_from_root('base.js')}"
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
      require 'yaml'

      builder = CoreCommandBuilder.new
      css_files = YAML.load_file(builder.css_config_yml)
      css_files.map! do |f|
        File.join(builder.css_file_path(f))
      end
      run_command do
        add "java -jar #{closure_stylesheets_jar} "
        add "#{css_files.join(' ')} "
        add "--output-file #{path_from_root('assets', 'app.css')}"
        add "--allowed-non-standard-function color-stop"
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

desc 'Alias for core:deploy:update'
task :update => [:'core:deploy:update']

desc 'Alias for core:deploy:all'
task :deploy => [:'core:deploy:all']
