namespace :js do

  include ThinReportsEditor

  desc 'JS checks and optimizations'
  task :compile, [:warning_level, :output_mode, :output_file, :log_file] do |t, args|
    # Initialize arguments
    warning_level = ENV['warning_level'] || 'VERBOSE'
    output_mode = ENV['output_mode'] || 'compiled'
    output_file = ENV['output_file'] || 'base.js'
    log_file = ENV['log_file'] || 'base-compile.log'
    debug_mode = ENV['debug']

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
    output_file = 'js.manifest'
    output_file_path = File.join(CommandBuilder::ROOT, output_file)
    editor_html_path = File.join(CommandBuilder::ROOT, 'editor.html')

    ENV['output_mode'] = 'list'
    ENV['output_file'] = output_file
    ENV['log_file'] = 'deps.log'

    Rake::Task['js:compile'].invoke

    if FileTest.exists?(output_file_path)
      script_tags = []
      first_core_script_index = nil
      base_js_script_tag = nil

      File.open(output_file_path) do |js_manifest|
        js_manifest.readlines.each_with_index do |js_path, index|
          js_path.match(/\.\.\\\.\.\\(.+)/) do |matched|
            src = matched[1]
            script_tag = "<script src='#{src}'></script>"

            if !first_core_script_index && src =~ /^core\\/
              first_core_script_index = index
            end

            if src =~ /^core\\base\.js/
              base_js_script_tag = script_tag
            else
              script_tags << script_tag
            end
          end
        end
      end

      script_tags.insert(first_core_script_index, base_js_script_tag)

      editor_html_content = ''
      indent = "\n    "
      script = indent + script_tags.join(indent) + "\n"

      File.open(editor_html_path) do |editor_html|
        editor_html_content = editor_html.read
        editor_html_content.match(/<!-- DEPENDENCY SCRIPT START -->(.+)<!-- DEPENDENCY SCRIPT END -->/m) do |matched|
          editor_html_content.gsub!(matched[1], script)
        end
      end

      File.open(editor_html_path, 'w+') do |editor_html|
        editor_html.write(editor_html_content)
      end
    end

    FileUtils.rm(output_file_path) if FileTest.exists?(output_file_path)
  end

end

# Aliases

desc 'Alias for js:compile'
task :jc => [:'js:compile']

desc 'Alias for js:deps'
task :jd => [:'js:deps']
