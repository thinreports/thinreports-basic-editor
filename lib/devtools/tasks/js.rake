namespace :js do

  include ThinReportsEditor

  desc 'JS checks and optimizations'
  task :compile, [:warning_level, :output_mode, :output_file, :log_file] do |t, args|
    # Initialize arguments
    warning_level = ENV['warning_level'] || 'VERBOSE'
    output_mode = ENV['output_mode'] || 'compiled'
    output_file = ENV['output_file'] || 'base.js'
    log_file = ENV['log_file'] || 'base-compile.log'

    log_file_path = File.join(CommandBuilder::ROOT, log_file)

    run_command output: log_file_path do
      add "python #{closure_builder_py}"
      add "--root=#{closure_library_for}"
      add "--root=#{closure_templates_for}"
      add "--root=#{path_from_core}"
      add "-c #{closure_compiler_jar}"
      add "-n thin.boot"
      add "-o #{output_mode}"
      add "-f \"--compilation_level=ADVANCED_OPTIMIZATIONS\""
      add "-f \"--warning_level=#{warning_level}\""
      add "--output_file=#{path_from_root(output_file)}"
    end
  end

  desc 'JS dependency calculation'
  task :deps do
    require 'erb'

    output_file_path = File.join(CommandBuilder::ROOT, 'js_list.txt')
    run_command do
      add "python #{closure_calcdeps_py}"
      add "--input=#{path_from_core('boot.js')}"
      add "--path=#{closure_library_for}"
      add "--path=#{closure_templates_for}"
      add "--path=#{path_from_core}"
      add "-o list"
      add "> #{output_file_path}"
    end

    @dependencies_js = []
    if FileTest.exists?(output_file_path)
      File.open(output_file_path) do |output_file|
        @dependencies_js = output_file.readlines.compact.map do |js|
          "<script src=\"#{js.chomp.sub(/\A\.\.\\\.\.\\/, '')}\"></script>"
        end
      end
      FileUtils.rm(output_file_path)
    end

    editor_html_path = File.join(CommandBuilder::ROOT, 'editor.html')
    File.open(editor_html_path, 'w+') do |editor_html|
      editor_html_content = ERB.new(File.read(File.join(
        CommandBuilder::ROOT, 'editor.html.erb')), nil, '-').result
      editor_html.write(editor_html_content)
    end
  end

end

# Aliases

desc 'Alias for js:compile'
task :jc => [:'js:compile']

desc 'Alias for js:deps'
task :jd => [:'js:deps']
